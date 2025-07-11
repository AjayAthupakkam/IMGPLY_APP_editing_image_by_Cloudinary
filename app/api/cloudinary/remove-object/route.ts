import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { generativeRemove } from '@cloudinary/url-gen/actions/effect';
import { Cloudinary } from '@cloudinary/url-gen';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    // Note: Object removal requires a prompt specifying the object(s)
    const { publicId, prompt } = await request.json();
    
    console.log('Object removal request received:', { publicId, prompt });

    if (!publicId) {
      return NextResponse.json(
        { message: 'Image public ID is required' },
        { status: 400 }
      );
    }
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { message: 'Prompt is required for object removal' },
        { status: 400 }
      );
    }

    // Create a new Cloudinary instance with cloud_name
    const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }
    });

    // Apply the generative object removal transformation using URL-gen SDK
    const cldImage = cld.image(publicId);
    
    try {
      // Apply generative remove effect with proper prompt
      cldImage.effect(generativeRemove().prompt(prompt.trim()));
      
      // Get the transformation URL
      const transformationUrl = cldImage.toURL();
      console.log('Generated object removal URL:', transformationUrl);
      
      return NextResponse.json({ transformedUrl: transformationUrl });
    } catch (innerError) {
      console.error('Error generating transformation URL:', innerError);
      
      // Fall back to using the raw transformation string if the SDK fails
      cldImage.addTransformation(`e_generative_remove:prompt_${encodeURIComponent(prompt.trim())}`);
      const fallbackUrl = cldImage.toURL();
      console.log('Using fallback transformation URL:', fallbackUrl);
      
      return NextResponse.json({ transformedUrl: fallbackUrl });
    }

  } catch (error: any) {
    console.error('Error in Cloudinary Object Removal API:', error);
    return NextResponse.json(
      { message: 'Failed to remove object', error: error.message },
      { status: 500 }
    );
  }
} 