"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes, apiEndpoints } from "@/constants"
import { CustomField } from "./CustomField"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
 
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
  fromObject: z.string().optional(),
  toObject: z.string().optional(),
  itemsToExtract: z.string().optional(),
  extractMode: z.string().optional(),
})

import type { TransformationFormProps } from "@/types";

import type { Transformations } from "@/types";

const TransformationForm = ({ action, data = null, userId, type, config = null }: TransformationFormProps) => {
  const validType = type as keyof typeof transformationTypes;
  const transformationType = transformationTypes[validType];
  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  const router = useRouter()

  const initialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,

    toObject: data?.toObject,
    itemsToExtract: data?.itemsToExtract,
    extractMode: data?.extractMode,
  } : {
    ...defaultValues,
  }

   // 1. Define your form with proper typing
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues as z.infer<typeof formSchema>,
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if(data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      });

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
        fromObject: values.fromObject,
        toObject: values.toObject,
        itemsToExtract: values.itemsToExtract,
        extractMode: values.extractMode,
      }

      if(action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.log(error);
        }
      }

      if(action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}`
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    setIsSubmitting(false)
  }

  const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
    debounce(() => {
      setNewTransformation((prevState: any) => {
        let fieldValue: string | string[] = value;
        let fieldKey = fieldName;
        
        // Map field names to the expected keys in the config
        if (fieldName === 'prompt') fieldKey = 'prompt';
        else if (fieldName === 'color') fieldKey = 'to';
        else if (fieldName === 'fromObject') fieldKey = 'from';
        else if (fieldName === 'toObject') fieldKey = 'to';
        else if (fieldName === 'itemsToExtract') {
          fieldKey = 'items';
          // Split comma-separated string into an array for Cloudinary
          fieldValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        } else if (fieldName === 'extractMode') {
          fieldKey = 'mode';
        }
        
        return {
          ...prevState,
          [type]: {
            ...prevState?.[type],
            [fieldKey]: fieldValue
          }
        };
      });
    }, 1000)();
      
    return onChangeField(value);
  }

  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformedImageUrl(null);

    // Check if user is authenticated
    if (!userId) {
      console.error('User is not authenticated');
      setIsTransforming(false);
      // Redirect to login page
      router.push('/sign-in');
      return;
    }

    // Use apiEndpoints from constants instead of inline definition
    const endpoint = apiEndpoints[validType as keyof typeof apiEndpoints];

    if (!endpoint) {
      console.error('Invalid transformation type for API call:', type);
      setIsTransforming(false);
      return;
    }

    // Prepare request data
    const values = form.getValues();
    const requestBody: any = {
      publicId: image?.publicId,
    };

    if (validType === 'remove' || validType === 'recolor') {
      if (!values.prompt) {
        console.error('Prompt is required for this transformation.');
        // Optionally show user feedback here (e.g., using react-toastify)
        setIsTransforming(false);
        return; 
      }
      requestBody.prompt = values.prompt;
    }

    if (validType === 'recolor') {
       if (!values.color) {
        console.error('Color is required for recolor.');
        // Optionally show user feedback here
        setIsTransforming(false);
        return;
      }
      requestBody.toColor = values.color;
    }

    if (validType === 'replace') {
      if (!values.fromObject || !values.toObject) {
        console.error('Both "from" and "to" fields are required for replace.');
        setIsTransforming(false);
        return;
      }
      requestBody.fromObject = values.fromObject;
      requestBody.toObject = values.toObject;
    }

    if (validType === 'extract') {
      if (!values.itemsToExtract) {
        console.error('Items to extract are required for this transformation.');
        setIsTransforming(false);
        return; 
      }
      const extractItems = values.itemsToExtract.split(',').map(item => item.trim()).filter(item => item.length > 0);
      console.log('Extract items parsed:', extractItems);
      
      if (extractItems.length === 0) {
        console.error('No valid items to extract after parsing');
        setIsTransforming(false);
        return;
      }
      
      requestBody.extractItems = extractItems;
      requestBody.extractMode = values.extractMode || 'content'; // Default to 'content' if not specified
      
      console.log('Final extract request body:', requestBody);
    }

    try {
      console.log(`Making ${validType} transformation request with:`, requestBody);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transformation API request failed');
      }

      const result = await response.json();
      console.log(`${validType} transformation result:`, result);

      // Handle different response formats from different transformation types
      if (result.transformationUrl) {
        console.log('Using transformationUrl:', result.transformationUrl);
        setTransformedImageUrl(result.transformationUrl);
      } else if (result.transformedUrl) {
        console.log('Using transformedUrl:', result.transformedUrl);
        setTransformedImageUrl(result.transformedUrl);
      } else if (result.alternativeUrl) {
        // For restore type, we might get multiple URL options
        const urlsToTry = [
          result.transformedUrl,
          result.alternativeUrl,
          result.directUrl
        ].filter(Boolean);
        
        console.log(`Trying multiple URLs for transformation:`, urlsToTry);
        
        // Use the first URL for now
        setTransformedImageUrl(urlsToTry[0]);
      } else {
        console.error('No valid URL found in response:', result);
        throw new Error('No valid transformed URL found in API response');
      }

    } catch (error: any) {
      console.error(`Error during ${validType} transformation:`, error);
      setTransformedImageUrl(null); // Ensure we reset the URL
      
      if (validType === 'remove') {
        console.log("Object removal issue: Please ensure your prompt is specific (e.g., 'person', 'car', 'tree')");
      }
      // Add user feedback (e.g., toast notification)
    } finally {
      setIsTransforming(false);
      setNewTransformation(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField 
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {(validType === 'remove' || validType === 'recolor') && (
          <div className="prompt-field">
            <CustomField 
              control={form.control}
              name="prompt"
              formLabel={
                validType === 'remove' ? 'Object to remove' :
                validType === 'recolor' ? 'Object to recolor' :
                'Prompt'
              }
              className="w-full"
              render={({ field }) => (
                <Input 
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    validType,
                    field.onChange
                  )}
                />
              )}
            />

            {validType === 'recolor' && (
              <CustomField 
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input 
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}
          </div>
        )}

        {validType === 'replace' && (
          <div className="prompt-field">
            <CustomField 
              control={form.control}
              name="fromObject"
              formLabel="Item to Replace"
              className="w-full"
              render={({ field }) => (
                <Input 
                  placeholder="e.g., sweater, shirt, hat"
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'fromObject',
                    e.target.value,
                    'replace',
                    field.onChange
                  )}
                />
              )}
            />

            <CustomField 
              control={form.control}
              name="toObject"
              formLabel="Replace With"
              className="w-full"
              render={({ field }) => (
                <Input 
                  placeholder="e.g., leather jacket with pockets, blue dress"
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'toObject',
                    e.target.value,
                    'replace',
                    field.onChange
                  )}
                />
              )}
            />
          </div>
        )}

        {validType === 'extract' && (
          <div className="prompt-field flex-col space-y-4">
            <CustomField
              control={form.control}
              name="itemsToExtract"
              formLabel="Items to Extract (comma-separated)"
              className="w-full"
              render={({ field }) => (
                <Input 
                  value={field.value || ''}
                  className="input-field"
                  placeholder="e.g., camera, glasses, plant"
                  onChange={(e) => onInputChangeHandler(
                    'itemsToExtract',
                    e.target.value,
                    validType,
                    field.onChange
                  )}
                />
              )}
            />
            <CustomField
              control={form.control}
              name="extractMode"
              formLabel="Extraction Mode"
              className="w-full"
              render={({ field }) => (
                <Select onValueChange={(value) => onInputChangeHandler('extractMode', value, validType, field.onChange)} defaultValue={field.value || 'content'}>
                  <SelectTrigger className="select-field">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content" className="select-item">Content</SelectItem>
                    <SelectItem value="mask" className="select-item">Mask</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        <div className="images-container flex flex-col lg:flex-row gap-2 justify-center">
          <div className="media-uploader-field w-full lg:w-[600px]">
            <MediaUploader
              onValueChange={(publicId) => form.setValue("publicId", publicId)}
              image={image}
              setImage={setImage}
              publicId={image?.publicId || ""}
              type={validType}
              transformedImageUrl={transformedImageUrl}
            />
          </div>

          <div className="transformed-image-container w-full lg:w-[600px]">
            {image?.publicId ? (
              <TransformedImage 
                image={image}
                type={validType}
                title={form.getValues().title || 'Transformed'}
                isTransforming={isTransforming}
                transformedImageUrl={transformedImageUrl}
                hasDownload
              />
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="h3-bold text-dark-600">
                  Transformed
                </h3>
                <div 
                  className="placeholder-container bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl flex items-center justify-center" 
                  style={{ 
                    width: '100%',
                    minHeight: '400px'
                  }}
                >
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white rounded-full p-6 shadow-sm mb-4">
                      <Image 
                        src="/assets/icons/image.svg"
                        alt="Image icon"
                        width={32}
                        height={32}
                        className="opacity-70"
                      />
                    </div>
                    <p className="text-gray-500 mb-1">Transformed Image</p>
                    <p className="text-gray-400 text-sm">Upload an image and apply transformation to see the result</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .media-uploader-field, .transformed-image-container {
            width: 100%;
            max-width: 600px;
          }
          @media (min-width: 1024px) {
            .media-uploader-field, .transformed-image-container {
              width: 600px;
              max-width: 600px;
              flex-grow: 0;
            }
          }
        `}</style>

        <div className="flex w-full gap-4">
          <Button 
            type="button" 
            className="transform-btn rounded-md bg-blue-600 text-white flex-1 hover:bg-blue-700"
            onClick={onTransformHandler}
            disabled={isTransforming}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transform'}
          </Button>
          
          <Button 
            type="submit" 
            className="save-btn rounded-md bg-blue-600 text-white flex-1 hover:bg-blue-700"
            disabled={isSubmitting || !transformedImageUrl}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm