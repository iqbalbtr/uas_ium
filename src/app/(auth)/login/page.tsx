"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoginForm from "@components/fragments/auth/LoginForm";

const testimonials = [
  {
    quote:
      "The curation is highly focused on design and the scene is a clever marketplace that allows users to replicate the design at home.",
    author: "Iflakul Husada",
    role: "Apoteker",
    image: "",
  },
  {
    quote:
      "This platform has revolutionized how I approach interior design. It's an invaluable resource for both professionals and enthusiasts.",
    author: "Alex Johnson",
    role: "Interior Designer",
    image: "/images/apotek_2.jpg",
  },
];

export default function LoginPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };
  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md space-y-6 p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to continue
            </h1>
            <p className="text-muted-foreground">
              Welcome, Please enter your details.
            </p>
          </div>
          <LoginForm />
          <div className="text-center text-sm text-muted-foreground">
            By signing in or creating an account, you agree with our{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Statement
            </Link>
          </div>
        </Card>
      </div>
      <div className="hidden lg:block relative">
        <div className="h-full w-full p-2">
          <img
            src={"/images/apotek.jpg"}
            alt="Design inspiration"
            className="h-full w-full object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
