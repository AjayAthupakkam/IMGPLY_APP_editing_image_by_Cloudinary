"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Automatically sign out the user
    const handleSignOut = async () => {
      await signOut();
      router.push("/");
    };
    
    handleSignOut();
  }, [signOut, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Image 
        src="/assets/images/logo-text.svg"
        alt="logo"
        width={180}
        height={28}
        className="mb-10"
      />
      <h1 className="text-2xl font-bold">Signing you out...</h1>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
      <p className="text-muted-foreground">Redirecting to home page</p>
    </div>
  );
}
