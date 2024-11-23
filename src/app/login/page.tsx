"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "The curation is highly focused on design and the scene is a clever marketplace that allows users to replicate the design at home.",
    author: "Kaiya Carder",
    role: "Freelancer",
    image: "/images/apotek.jpg",
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
              Welcome back! Please enter your details.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input id="name" placeholder="Name" />
            </div>
            <div className="space-y-2">
              <Input id="email" placeholder="Email address" type="email" />
            </div>
            <div className="space-y-2">
              <Input id="password" placeholder="Password" type="password" />
            </div>
            <Button className="w-full bg-[#2A2B27] hover:bg-[#3F403B]">
              Continue
            </Button>
          </div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <img
          src={testimonials[currentTestimonial].image}
          alt="Design inspiration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          <blockquote className="space-y-2">
            <p className="text-3xl font-medium leading-tight">
              {testimonials[currentTestimonial].quote}
            </p>
            <footer className="text-sm">
              {testimonials[currentTestimonial].author} •{" "}
              {testimonials[currentTestimonial].role}
            </footer>
          </blockquote>
          <div className="mt-8 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
