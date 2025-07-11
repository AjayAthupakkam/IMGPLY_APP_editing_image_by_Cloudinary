"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Renamed from InsufficientCreditsModal to ContinueUsingAppModal
// but kept the export name the same for compatibility
export const InsufficientCreditsModal = () => {
  const router = useRouter();

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex-between">
            <p className="p-16-semibold text-dark-400">Continue Using App</p>
            <AlertDialogCancel
              className="border-0 p-0 hover:bg-transparent"
              onClick={() => router.push("/profile")}
            >
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </AlertDialogCancel>
          </div>

          <Image
            src="/assets/icons/photo.svg"
            alt="transformation"
            width={40}
            height={40}
            className="mx-auto my-6"
          />

          <AlertDialogTitle className="p-24-bold text-dark-600">
            Would you like to continue using the app?
          </AlertDialogTitle>

          <AlertDialogDescription className="p-16-regular py-3">
            Click continue to keep transforming your images with our AI-powered tools.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="button w-full bg-dark-400 text-white hover:bg-gray-500"
            onClick={() => router.push("/profile")}
          >
            Back to profile
          </AlertDialogCancel>
          <AlertDialogAction
            className="button w-full bg-purple-gradient hover:bg-purple-gradient"
            onClick={() => router.push("/transformations/add/restore")}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};