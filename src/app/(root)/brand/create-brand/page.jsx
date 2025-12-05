'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, collection, doc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '../../../../../firebase';
import { Building2, Globe, Mail, Phone, MapPin, FileText, User, Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateBrand() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState({ file: null, preview: null });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) setLogo({ file, preview: URL.createObjectURL(file) });
    };

    const uploadLogo = async (file, brandName) => {
        if (!file) return null;
        const logoRef = ref(storage, `brands/${brandName}-${Date.now()}`);
        await uploadBytes(logoRef, file);
        return await getDownloadURL(logoRef);
    };

    const checkEmailExists = async (email) => {
        const q = query(collection(db, "brand"), where("email", "==", email));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Check if email already exists
            const emailExists = await checkEmailExists(data.email);
            if (emailExists) {
                toast.error("Brand with this email already exists!");
                setLoading(false);
                return;
            }

            const brandName = data.brandName.trim();
            const logoURL = await uploadLogo(logo.file, brandName);

            const brandRef = doc(collection(db, "brand"));

            await setDoc(brandRef, {
                brandId: brandRef.id,
                brandName,
                logoURL: logoURL || null,
                industryType: data.industryType,
                websiteURL: data.websiteURL || null,
                email: data.email,
                phoneNumber: data.phoneNumber,
                businessAddress: data.businessAddress,
                gstNumber: data.gstNumber || null,
                pointOfContact: [
                    {
                        name: data.pocName,
                        number: data.pocNumber,
                        email: data.pocEmail
                    }
                ],
                createdAt: serverTimestamp(),
                status: "active"
            });

            toast.success("Brand Created Successfully! 🎉");
            reset();
            setLogo({ file: null, preview: null });
            router.push("/brand");

        } catch (error) {
            console.error("Error:", error);
            toast.error(`Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const Input = ({ label, icon: Icon, error, className = "", ...props }) => (
        <div className={className}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                <input
                    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${Icon ? 'pl-10' : ''}`}
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );

    const Section = ({ title, icon: Icon, children }) => (
        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
        </section>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-white py-8 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Brand</h1>
                <p className="text-gray-600 mb-8">Fill in the details to register a new brand</p>

                <div className="space-y-8">
                    <Section title="Basic Information" icon={Building2}>
                        <Input
                            label="Brand Name *"
                            placeholder="Enter brand name"
                            {...register('brandName', { required: 'Brand name is required' })}
                            error={errors.brandName}
                            className="md:col-span-2"
                        />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Logo</label>
                            <div className="flex items-center gap-4">
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm text-gray-600" />
                                {logo.preview && <img src={logo.preview} alt="Logo" className="w-16 h-16 rounded-lg object-cover border" />}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry Type *</label>
                            <select
                                {...register('industryType', { required: 'Industry type is required' })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select industry</option>
                                {['Technology', 'Healthcare', 'Finance', 'Retail', 'Education', 'Other'].map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                            {errors.industryType && <p className="text-red-500 text-xs mt-1">{errors.industryType.message}</p>}
                        </div>

                        <Input
                            label="Website URL"
                            icon={Globe}
                            placeholder="https://example.com"
                            {...register('websiteURL', { pattern: { value: /^https?:\/\/.+/, message: 'Enter valid URL' } })}
                            error={errors.websiteURL}
                        />

                        <Input
                            label="Email *"
                            icon={Mail}
                            placeholder="email@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                            })}
                            error={errors.email}
                        />

                        <Input
                            label="Password *"
                            type="password"
                            placeholder="Enter password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Min 6 characters' }
                            })}
                            error={errors.password}
                        />

                        <Input
                            label="Phone Number *"
                            icon={Phone}
                            placeholder="9876543210"
                            {...register('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: { value: /^[0-9]{10}$/, message: 'Enter 10-digit number' }
                            })}
                            error={errors.phoneNumber}
                            className="md:col-span-2"
                        />
                    </Section>

                    <Section title="Operational Details" icon={MapPin}>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address *</label>
                            <textarea
                                {...register('businessAddress', { required: 'Address is required' })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows="3"
                                placeholder="Enter complete business address"
                            />
                            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress.message}</p>}
                        </div>

                        <Input
                            label="GST Number"
                            icon={FileText}
                            placeholder="22AAAAA0000A1Z5"
                            {...register('gstNumber', {
                                pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Invalid GST format' }
                            })}
                            error={errors.gstNumber}
                        />
                    </Section>

                    <Section title="Point of Contact" icon={User}>
                        <Input
                            label="Name *"
                            placeholder="Contact person name"
                            {...register('pocName', { required: 'POC name is required' })}
                            error={errors.pocName}
                        />

                        <Input
                            label="Phone Number *"
                            icon={Phone}
                            placeholder="9876543210"
                            {...register('pocNumber', {
                                required: 'POC number is required',
                                pattern: { value: /^[0-9]{10}$/, message: 'Enter 10-digit number' }
                            })}
                            error={errors.pocNumber}
                        />

                        <Input
                            label="Email *"
                            icon={Mail}
                            placeholder="contact@example.com"
                            {...register('pocEmail', {
                                required: 'POC email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                            })}
                            error={errors.pocEmail}
                            className="md:col-span-2"
                        />
                    </Section>

                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => { reset(); setLogo({ file: null, preview: null }); }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                            className="flex-1 bg-linear-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Brand...
                                </>
                            ) : (
                                'Create Brand'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}