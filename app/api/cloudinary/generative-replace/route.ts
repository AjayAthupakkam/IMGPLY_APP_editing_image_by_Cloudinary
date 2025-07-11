import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { generativeReplace } from '@cloudinary/url-gen/actions/effect';
import { Cloudinary } from '@cloudinary/url-gen';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  const { publicId, fromObject, toObject, transformationId } = await request.json();
  
  try {
    if (!publicId || !fromObject || !toObject) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields: publicId, fromObject or toObject",
        }),
        { status: 400 }
      );
    }

    // Create a new Cloudinary instance with cloud_name
    const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      },
    });

    // Create a new CloudinaryImage instance
    const image = cld.image(publicId);

    // Apply generative replace effect
    image.effect(generativeReplace().from(fromObject).to(toObject));

    // Get the URL with the transformation
    const url = image.toURL();

    // Create the result URL using the Cloudinary URL API
    const result = {
      transformationUrl: url,
      transformationType: "replace",
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in Cloudinary Generative Replace API:', error);
    return new Response(
      JSON.stringify({ message: "An error occurred during the transformation" }),
      { status: 500 }
    );
  }
} 