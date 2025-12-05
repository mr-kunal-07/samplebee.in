'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { Plus, Trash2, Loader2, Image, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Reusable Components
const FormSection = ({ title, children }) => (
    <section className="p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 underline">{title}</h2>
        {children}
    </section>
);

const InputField = ({ label, error, required, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <input
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);

const SelectField = ({ label, error, required, options, ...props }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {required && '*'}
        </label>
        <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...props}
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);

const FileUpload = ({ label, icon: Icon, accept, multiple, onChange, selectedInfo }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Upload {label}</span>
                <input type="file" accept={accept} multiple={multiple} onChange={onChange} className="hidden" />
            </label>
            {selectedInfo && <span className="text-sm text-gray-600">{selectedInfo}</span>}
        </div>
    </div>
);

// Constants
const AGE_GROUPS = [
    { value: '18-24', label: '18-24' },
    { value: '25-34', label: '25-34' },
    { value: '35-44', label: '35-44' },
    { value: '45-54', label: '45-54' },
    { value: '55+', label: '55+' }
];

const GENDERS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'All', label: 'All' }
];

const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata',
    'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali'
].map(city => ({ value: city, label: city }));

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Cloudinary configuration - Replace with your actual values
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';

export default function CreateCampaign() {
    const router = useRouter();
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            quizQuestions: [{ question: '', options: ['', ''], correctAnswer: '0' }],
            leadQuestions: [{ question: '' }]
        }
    });

    const { fields: quizFields, append: appendQuiz, remove: removeQuiz, update: updateQuiz } = useFieldArray({
        control,
        name: 'quizQuestions'
    });

    const { fields: leadFields, append: appendLead, remove: removeLead } = useFieldArray({
        control,
        name: 'leadQuestions'
    });

    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [mediaFiles, setMediaFiles] = useState({ images: [], video: null });
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percentage: 0 });

    const startDate = watch('startDate');
    const endDate = watch('endDate');

    useEffect(() => {
        getDocs(collection(db, 'brand')).then(snapshot =>
            setBrands(snapshot.docs.map(doc => ({ value: doc.id, label: doc.data().brandName })))
        ).catch(error => {
            toast.error('Failed to load brands');
            console.error(error);
        });
    }, []);

    const validateFileSize = (files) => {
        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File ${file.name} exceeds 50MB limit`);
                return false;
            }
        }
        return true;
    };

    const handleMediaChange = (e, type) => {
        const files = Array.from(e.target.files);

        if (!validateFileSize(files)) {
            e.target.value = '';
            return;
        }

        setMediaFiles(prev => ({
            ...prev,
            [type]: type === 'images' ? files : files[0]
        }));
    };

    // Upload to Cloudinary
    const uploadToCloudinary = async (file, resourceType = 'image') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'campaigns'); // Optional: organize in folders

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                publicId: data.public_id,
                format: data.format,
                resourceType: data.resource_type
            };
        } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            throw error;
        }
    };

    // Upload multiple files with progress tracking
    const uploadFiles = async (files, resourceType = 'image') => {
        if (!files || files.length === 0) return [];

        const totalFiles = files.length;
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            setUploadProgress({
                current: i + 1,
                total: totalFiles,
                percentage: Math.round(((i + 1) / totalFiles) * 100)
            });

            try {
                const result = await uploadToCloudinary(file, resourceType);
                uploadedUrls.push(result);
                console.log(`Uploaded ${file.name} successfully`);
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                throw new Error(`Failed to upload ${file.name}: ${error.message}`);
            }
        }

        return uploadedUrls;
    };

    const onSubmit = async (data) => {
        // Validate dates
        if (new Date(data.endDate) < new Date(data.startDate)) {
            toast.error('End date must be after start date');
            return;
        }

        // Check Cloudinary configuration
        if (CLOUDINARY_CLOUD_NAME === 'your_cloud_name' || CLOUDINARY_UPLOAD_PRESET === 'your_upload_preset') {
            toast.error('Please configure Cloudinary credentials in your .env file');
            return;
        }

        try {
            setLoading(true);
            setUploadProgress({ current: 0, total: 0, percentage: 0 });
            const campaignName = data.campaignName.trim().replace(/\s+/g, '-');

            console.log('Starting file uploads to Cloudinary...');

            // Upload media files
            let imageResults = [];
            let videoResult = null;

            try {
                if (mediaFiles.images.length > 0) {
                    console.log(`Uploading ${mediaFiles.images.length} images...`);
                    toast.info(`Uploading ${mediaFiles.images.length} images...`);
                    imageResults = await uploadFiles(mediaFiles.images, 'image');
                    console.log('Images uploaded successfully:', imageResults);
                }

                if (mediaFiles.video) {
                    console.log('Uploading video...');
                    toast.info('Uploading video...');
                    const videoResults = await uploadFiles([mediaFiles.video], 'video');
                    videoResult = videoResults[0];
                    console.log('Video uploaded successfully:', videoResult);
                }

                toast.success('All files uploaded successfully!');
            } catch (uploadError) {
                console.error('Upload error:', uploadError);
                toast.error(`Upload failed: ${uploadError.message}`, { autoClose: 5000 });
                setLoading(false);
                setUploadProgress({ current: 0, total: 0, percentage: 0 });
                return;
            }

            console.log('Creating campaign document...');

            // Create campaign document with Cloudinary URLs
            const campaignRef = await addDoc(collection(db, 'campaign'), {
                campaignName: data.campaignName,
                brandId: data.brandId,
                targetAgeGroup: data.targetAgeGroup,
                gender: data.gender,
                targetLocation: data.targetLocation,
                startDate: data.startDate,
                endDate: data.endDate,
                redirectLink: data.redirectLink || null,
                creativeImages: imageResults.map(img => ({
                    url: img.url,
                    publicId: img.publicId,
                    format: img.format
                })),
                advertisingVideo: videoResult ? {
                    url: videoResult.url,
                    publicId: videoResult.publicId,
                    format: videoResult.format
                } : null,
                interactiveQuiz: data.quizQuestions
                    .filter(q => q.question && q.options.some(o => o))
                    .map(q => ({
                        question: q.question,
                        options: q.options.filter(o => o),
                        correctAnswer: parseInt(q.correctAnswer)
                    })),
                leadGenerationQuestions: data.leadQuestions
                    .filter(q => q.question)
                    .map(q => q.question),
                createdAt: serverTimestamp(),
                status: 'active'
            });

            console.log('Campaign created:', campaignRef.id);

            // Update brand document with campaign ID
            if (data.brandId) {
                try {
                    const brandRef = doc(db, 'brand', data.brandId);
                    await updateDoc(brandRef, {
                        lastCampaignId: campaignRef.id,
                        updatedAt: serverTimestamp()
                    });
                } catch (error) {
                    console.error('Failed to update brand:', error);
                }
            }

            toast.success('Campaign Created Successfully! 🎉');
            setTimeout(() => {
                router.push('/campagin');
            }, 1000);
        } catch (error) {
            console.error('Campaign creation error:', error);

            if (error.code === 'permission-denied') {
                toast.error('Permission denied. Please check Firebase security rules.');
            } else {
                toast.error(`Failed to create campaign: ${error.message}`);
            }
        } finally {
            setLoading(false);
            setUploadProgress({ current: 0, total: 0, percentage: 0 });
        }
    };

    const addQuizOption = (quizIndex) => {
        const currentQuestion = quizFields[quizIndex];
        const updatedQuestion = {
            ...currentQuestion,
            options: [...(currentQuestion.options || []), '']
        };
        updateQuiz(quizIndex, updatedQuestion);
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Campaign</h1>
                <p className="text-gray-600 mb-8">Set up your marketing campaign</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info */}
                    <FormSection title="Basic Information">
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField
                                label="Campaign Name"
                                required
                                {...register('campaignName', {
                                    required: 'Campaign name is required',
                                    minLength: { value: 3, message: 'Minimum 3 characters required' }
                                })}
                                placeholder="Enter campaign name"
                                error={errors.campaignName}
                            />
                            <SelectField
                                label="Brand"
                                required
                                {...register('brandId', { required: 'Brand is required' })}
                                options={brands}
                                error={errors.brandId}
                            />
                        </div>
                    </FormSection>

                    {/* Target Audience */}
                    <FormSection title="Target Audience">
                        <div className="grid md:grid-cols-3 gap-6">
                            <SelectField
                                label="Age Group"
                                required
                                {...register('targetAgeGroup', { required: 'Age group is required' })}
                                options={AGE_GROUPS}
                                error={errors.targetAgeGroup}
                            />
                            <SelectField
                                label="Gender"
                                required
                                {...register('gender', { required: 'Gender is required' })}
                                options={GENDERS}
                                error={errors.gender}
                            />
                            <SelectField
                                label="Target Location"
                                required
                                {...register('targetLocation', { required: 'Location is required' })}
                                options={INDIAN_CITIES}
                                error={errors.targetLocation}
                            />
                        </div>
                    </FormSection>

                    {/* Campaign Duration */}
                    <FormSection title="Campaign Duration">
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField
                                type="date"
                                label="Start Date"
                                required
                                {...register('startDate', {
                                    required: 'Start date is required',
                                    validate: value => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return new Date(value) >= today || 'Start date cannot be in the past';
                                    }
                                })}
                                error={errors.startDate}
                            />
                            <InputField
                                type="date"
                                label="End Date"
                                required
                                {...register('endDate', {
                                    required: 'End date is required',
                                    validate: value => {
                                        if (!startDate) return true;
                                        return new Date(value) > new Date(startDate) || 'End date must be after start date';
                                    }
                                })}
                                error={errors.endDate}
                            />
                        </div>
                    </FormSection>

                    {/* Media Assets */}
                    <FormSection title="Media Assets">
                        <div className="space-y-4">
                            <FileUpload
                                label="Creative Images"
                                icon={Image}
                                accept="image/*"
                                multiple
                                onChange={(e) => handleMediaChange(e, 'images')}
                                selectedInfo={mediaFiles.images.length > 0 && `${mediaFiles.images.length} images selected`}
                            />
                            <FileUpload
                                label="Advertising Video"
                                icon={Video}
                                accept="video/*"
                                onChange={(e) => handleMediaChange(e, 'video')}
                                selectedInfo={mediaFiles.video?.name}
                            />
                            <InputField
                                label="Redirect Link"
                                {...register('redirectLink', {
                                    pattern: {
                                        value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                                        message: 'Enter valid URL (e.g., https://example.com)'
                                    }
                                })}
                                placeholder="https://example.com"
                                error={errors.redirectLink}
                            />
                        </div>
                    </FormSection>

                    {/* Interactive Quiz */}
                    <FormSection title="Interactive Quiz">
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => appendQuiz({ question: '', options: ['', ''], correctAnswer: '0' })}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add Question
                            </button>
                        </div>
                        <div className="space-y-6">
                            {quizFields.map((field, qIndex) => (
                                <div key={field.id} className="border border-gray-200 p-4 rounded-lg">
                                    <div className="flex gap-4 mb-3">
                                        <input
                                            {...register(`quizQuestions.${qIndex}.question`)}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter question"
                                        />
                                        {quizFields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuiz(qIndex)}
                                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2 ml-4">
                                        {(field.options || []).map((_, oIndex) => (
                                            <div key={oIndex} className="flex gap-2 items-center">
                                                <input
                                                    type="radio"
                                                    {...register(`quizQuestions.${qIndex}.correctAnswer`)}
                                                    value={oIndex.toString()}
                                                    className="w-4 h-4"
                                                />
                                                <input
                                                    {...register(`quizQuestions.${qIndex}.options.${oIndex}`)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addQuizOption(qIndex)}
                                            className="text-sm text-blue-600 hover:text-blue-700 ml-6"
                                        >
                                            + Add Option
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    {/* Lead Generation Questions */}
                    <FormSection title="Lead Generation Questions">
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => appendLead({ question: '' })}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add Question
                            </button>
                        </div>
                        <div className="space-y-4">
                            {leadFields.map((field, index) => (
                                <div key={field.id} className="flex gap-4">
                                    <input
                                        {...register(`leadQuestions.${index}.question`)}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter question"
                                    />
                                    {leadFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLead(index)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </FormSection>

                    {/* Submit */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {uploadProgress.percentage > 0
                                        ? `Uploading ${uploadProgress.current}/${uploadProgress.total} (${uploadProgress.percentage}%)`
                                        : 'Creating Campaign...'}
                                </>
                            ) : (
                                'Create Campaign'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}