import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";

// Define types for better TypeScript support
type SearchParamProps = {
  searchParams: {
    page?: string;
  };
};

type ImageData = {
  data: any[];
  totalPages: number;
};


const Profile = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  
  // Get authenticated user information from Clerk
  const { userId: clerkUserId } = await auth();
  const user = await currentUser();
  
  if (!clerkUserId || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">You need to be logged in to view this page</h1>
        <Button asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
      </div>
    );
  }
  
  // Get user data from our database
  const dbUser = await getUserById(clerkUserId);
  
  // For getUserImages, we need to make sure we pass a proper MongoDB ObjectId
  // If dbUser doesn't exist yet in our database, use a fallback approach
  const defaultImagesData: ImageData = { data: [], totalPages: 1 };
  let images: ImageData = defaultImagesData;
  
  if (dbUser && dbUser._id) {
    try {
      const fetchedImages = await getUserImages({ page, userId: dbUser._id });
      images = fetchedImages || defaultImagesData;
    } catch (error) {
      console.error('Error fetching images:', error);
      // Continue with default empty images data
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <Header title={`Hello, ${user.firstName || 'User'}`} subtitle="Welcome to your profile" />
        
        <Button asChild className="bg-red-500 hover:bg-red-600">
          <Link href="/sign-out">Logout</Link>
        </Button>
      </div>

      <section className="profile">
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-purple-500">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={`${user.firstName}'s profile picture`}
                  width={128}
                  height={128}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <span className="text-3xl font-bold text-gray-500">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-muted-foreground">{user.emailAddresses[0]?.emailAddress || 'No email available'}</p>
          </div>

          {/* Credits section removed as requested */}
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data?.length || 0}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data || []}
          totalPages={images?.totalPages || 1}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;