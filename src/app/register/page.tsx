"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-slate-800 rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-purple-900/90 z-10" />
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Desert landscape"
            fill
            className="object-cover"
          />
          <div className="relative z-20 p-8 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <div className="text-white text-2xl font-semibold">4 Husada</div>
              <Link
                href="#"
                className="text-white/90 hover:text-white text-sm bg-white/10 px-4 py-2 rounded-full transition"
              >
                Back to website
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-white text-4xl md:text-5xl font-medium text-center max-w-md">
                Lorem ipsum dolor sit amet.
                <br />
                Lorem ipsum dolor sit amet.
              </h2>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-white text-4xl font-medium mb-4">
              Create an account
            </h1>
            <p className="text-slate-400 mb-8">
              Already have an account?{" "}
              <Link href="#" className="text-purple-400 hover:text-purple-300">
                Log in
              </Link>
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Fletcher"
                  className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-400 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-slate-400 text-sm">
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-400 text-white rounded-lg px-4 py-3 transition"
              >
                Create account
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-800 px-4 text-sm text-slate-400">
                    Or register with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg px-4 py-3 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg px-4 py-3 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Facebook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
