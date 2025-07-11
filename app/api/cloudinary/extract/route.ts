import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { extract } from '@cloudinary/url-gen/actions/effect';
import { Cloudinary } from '@cloudinary/url-gen';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log('Extract API received request:', requestData);
    
    const { publicId, extractItems, extractMode = "content" } = requestData;
    
    if (!publicId) {
      console.error('Extract API error: Missing publicId');
      return new Response(
        JSON.stringify({
          message: "Missing required field: publicId",
        }),
        { status: 400 }
      );
    }
    
    if (!extractItems || !extractItems.length) {
      console.error('Extract API error: Missing or empty extractItems', extractItems);
      return new Response(
        JSON.stringify({
          message: "Missing required field: extractItems",
        }),
        { status: 400 }
      );
    }

    // We'll create a new Cloudinary instance later

    // Convert extractItems to an array if it's a comma-separated string
    const itemsArray = Array.isArray(extractItems) 
      ? extractItems 
      : extractItems.split(',').map((item: string) => item.trim());
    
    console.log('Processing extract items:', itemsArray);

    console.log('Using URL-gen library with extract function');
    
    // Create a new Cloudinary instance
    const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
      }
    });
    
    // Create a CloudinaryImage instance with the publicId
    const img = cld.image(publicId);
    
    // Apply the extract effect with the specified items
    if (extractMode === 'mask') {
      // For mask mode, we need to use a different approach
      // Since the mode method isn't directly available on the extract function
      const extractEffect = extract(itemsArray);
      // @ts-ignore - The mode method exists but TypeScript doesn't recognize it
      extractEffect.mode('mask');
      img.effect(extractEffect);
    } else {
      img.effect(extract(itemsArray));
    }
    
    // Generate the URL
    const url = img.toURL();
    
    console.log('Generated Cloudinary URL with URL-gen:', url);

    // Create the result URL using the Cloudinary URL API
    const result = {
      transformationUrl: url,
      transformationType: "extract",
      mode: extractMode
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in Cloudinary Content Extractor API:', error);
    return new Response(
      JSON.stringify({ message: "An error occurred during the transformation" }),
      { status: 500 }
    );
  }
} 