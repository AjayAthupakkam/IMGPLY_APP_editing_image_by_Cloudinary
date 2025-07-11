import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { backgroundRemoval } from '@cloudinary/url-gen/actions/effect';
import { Cloudinary } from '@cloudinary/url-gen';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { message: 'Image public ID is required' },
        { status: 400 }
      );
    }

    // Create a new Cloudinary instance with cloud_name
    const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }
    });

    // Apply the background removal transformation using URL-gen SDK
    const cldImage = cld.image(publicId)
      .effect(backgroundRemoval());
    
    // Get the transformation URL
    const transformationUrl = cldImage.toURL();

    return NextResponse.json({ transformedUrl: transformationUrl });

  } catch (error: any) {
    console.error('Error in Cloudinary Background Removal API:', error);
    return NextResponse.json(
      { message: 'Failed to remove background', error: error.message },
      { status: 500 }
    );
  }
} 