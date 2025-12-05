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
            // build the query using email + password stored in Firestore
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

            // success -> set cookie and redirect
            Cookies.set("authToken", "admin_logged_in", { expires: 7 });
            router.push("/dashboard");
        } catch (error) {
            // show human-friendly message and log the error for debugging
            console.error("Login error:", error);
            setErrorMsg("Something went wrong — please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg text-white"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

                {errorMsg && <p className="text-red-400 text-sm mb-3">{errorMsg}</p>}

                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        className="w-full p-2 rounded bg-gray-700"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                        <span className="text-red-400 text-sm">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full p-2 rounded bg-gray-700"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && (
                        <span className="text-red-400 text-sm">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded transition ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
