"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";

import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";

import { db } from "../../../../firebase";

export default function LoginPage() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setErrorMsg("");
        setLoading(true);

        try {
            const q = query(
                collection(db, "admin"),
                where("email", "==", data.email),
                where("password", "==", data.password)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setErrorMsg("Invalid email or password");
                setLoading(false);
                return;
            }

            Cookies.set("authToken", "admin_logged_in", { expires: 7 });
            router.push("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            setErrorMsg("Something went wrong — please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
                    <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
                        </div>
                    )}

                    <div onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 
                                               border-2 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-black focus:ring-gray-100'} 
                                               focus:ring-4 outline-none transition-all duration-200`}
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 
                                               border-2 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-black focus:ring-gray-100'} 
                                               focus:ring-4 outline-none transition-all duration-200`}
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={handleSubmit(onSubmit)}
                            className={`w-full py-3.5 rounded-xl text-white font-semibold 
                                       bg-black hover:bg-gray-800 
                                       focus:ring-4 focus:ring-gray-300 
                                       transition-all duration-200 transform active:scale-[0.98]
                                       ${loading ? 'opacity-60 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Secured by end-to-end encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}