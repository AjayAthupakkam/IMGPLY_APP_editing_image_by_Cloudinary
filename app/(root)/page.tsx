"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const HomePage = () => {
  const { isLoaded, userId } = useAuth();
  const isAuthenticated = isLoaded && !!userId;

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] gap-6 text-center p-4">
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
        Welcome to IMGPLY
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl">
        Your AI-powered image generation and editing assistant.
      </p>
      
      {isAuthenticated ? (
        <Button asChild size="lg" className="mt-4">
          <Link href="/transformations/add/restore">Get Started</Link>
        </Button>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <Button asChild size="lg" className="bg-purple-gradient hover:bg-purple-gradient">
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-purple-500 hover:bg-purple-50">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      )}
    </section>
  );
};

export default HomePage;