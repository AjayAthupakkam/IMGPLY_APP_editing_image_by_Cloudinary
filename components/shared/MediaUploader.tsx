"use client";

import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage } from "next-cloudinary"
import { CldUploadButton } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Button } from "../ui/button";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
  transformedImageUrl?: string | null;
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
  transformedImageUrl = null
}: MediaUploaderProps) => {
  const { toast } = useToast()

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)

    toast({
      title: 'Image uploaded successfully',
      duration: 5000,
      className: 'success-toast' 
    })
  }

  const onUploadErrorHandler = () => {
    toast({
      title: 'Something went wrong while uploading',
      description: 'Please try again',
      duration: 5000,
      className: 'error-toast' 
    })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="h3-bold text-dark-600">
          Original
        </h3>
        {publicId && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setImage((prevState: any) => ({
                ...prevState,
                publicId: "",
                width: 0,
                height: 0,
                secureURL: ""
              }));
              onValueChange("");
            }}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
          >
            Change Image
          </Button>
        )}
      </div>

      {/* Image Container */}
      <div className="w-full" style={{ maxWidth: '600px' }}>
        {publicId ? (
          <div 
            className="original-image-container bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl overflow-hidden" 
            style={{ 
              width: '100%',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="image-wrapper p-4 flex items-center justify-center w-full h-full"
              style={{ maxHeight: '75vh' }}
            >
              <CldImage 
                width={image?.width || 1080}
                height={image?.height || 1080}
                src={publicId}
                alt="Original image"
                sizes="(max-width: 768px) 100vw, 600px"
                placeholder={dataUrl as PlaceholderValue}
                className="rounded-lg shadow-sm max-h-[75vh] object-contain"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          </div>
        ) : (
          <CldUploadButton 
            uploadPreset="jsm_imaginify"
            options={{
              multiple: false,
              resourceType: "image"
            }}
            onSuccess={onUploadSuccessHandler}
            onError={onUploadErrorHandler}
            className="w-full"
          >
            <div 
              className="upload-container flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-white border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" 
              style={{ 
                width: '100%',
                minHeight: '400px'
              }}
            >
              <div className="upload-icon bg-white rounded-full p-6 shadow-md mb-4 transition-transform duration-300 hover:scale-110">
                <Image 
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={32}
                  height={32}
                  className="opacity-70"
                />
              </div>
              <p className="p-16-medium text-dark-600 mb-2">Click or drag image to upload</p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </CldUploadButton>
        )}
      </div>
    </div>
  )
}

export default MediaUploader