"use client";

import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useState } from "react";

// Define props type with all required properties
interface CustomTransformedImageProps {
  image: any;
  type: string;
  title: string;
  isTransforming?: boolean;
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
  hasDownload?: boolean;
  transformedImageUrl: string | null;
  transformationConfig?: Transformations | null;
}

const TransformedImage = ({
  image,
  type,
  title,
  // transformationConfig, // Can now be safely omitted when calling
  isTransforming,
  setIsTransforming,
  hasDownload = false,
  transformedImageUrl, // Add the new prop
}: CustomTransformedImageProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Use the transformedImageUrl for download if available
    const urlToDownload =
      transformedImageUrl ||
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
      });

    download(urlToDownload, title);
  };

  // Determine the source URL for the image
  const imageUrl = transformedImageUrl || image?.publicId;
  // Check if we are actually showing a transformed image
  const isTransformed = !!transformedImageUrl;

  const handleLoadComplete = () => {
    setIsImageLoading(false);
    setIsTransforming && setIsTransforming(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsImageLoading(false);
    setIsTransforming && setIsTransforming(false);
    console.error("Error loading the transformed image");
  };

  // Reset error state if transformedImageUrl changes
  React.useEffect(() => {
    if (transformedImageUrl) {
      setIsError(false);
      setIsImageLoading(true);
    }
  }, [transformedImageUrl]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="h3-bold text-dark-600">Transformed</h3>
          {isTransforming && (
            <div className="px-2 py-1 rounded-full bg-purple-100 text-xs text-purple-600 animate-pulse">
              Processing...
            </div>
          )}
        </div>

        {hasDownload && imageUrl && !isImageLoading && !isError && (
          <button className="download-btn" onClick={downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[2px]"
            />
            <span>Download</span>
          </button>
        )}
      </div>

      {/* Image Container */}
      <div className="w-full" style={{ maxWidth: "600px" }}>
        {imageUrl ? (
          <div
            className="transformed-image-container bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl overflow-hidden"
            style={{
              width: "100%",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="image-wrapper p-4 flex items-center justify-center w-full h-full"
              style={{ maxHeight: "75vh" }}
            >
              {transformedImageUrl ? (
                // For direct transformation URLs from our API, use a regular img element
                <img
                  src={transformedImageUrl}
                  alt={image?.title || "transformed image"}
                  className="rounded-lg shadow-sm max-h-[75vh] object-contain"
                  onLoad={handleLoadComplete}
                  onError={handleError}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              ) : (
                // For regular Cloudinary publicIds, use the CldImage component
                <CldImage
                  width={image?.width || 1080}
                  height={image?.height || 1080}
                  src={imageUrl}
                  alt={image?.title || "transformed image"}
                  sizes="(max-width: 768px) 100vw, 600px"
                  placeholder={dataUrl as PlaceholderValue}
                  className="rounded-lg shadow-sm max-h-[75vh] object-contain"
                  onLoad={handleLoadComplete}
                  onError={handleError}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              )}
            </div>

            {/* Loading spinner overlay */}
            {(isTransforming || isImageLoading) && (
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                <Image
                  src="/assets/icons/spinner.svg"
                  width={50}
                  height={50}
                  alt="spinner"
                  className="animate-spin"
                />
                <p className="text-white font-medium mt-2">
                  Transforming your image...
                </p>
              </div>
            )}

            {/* Error message overlay */}
            {isError && !isTransforming && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="error-container p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 shadow-sm max-w-[80%]">
                  <p className="font-medium">
                    Failed to load the transformed image.
                  </p>
                  <p className="text-sm mt-2">
                    Please try again with a more specific prompt.
                  </p>
                  {type === "remove" && (
                    <p className="mt-2 text-sm">
                      For object removal, use specific terms like
                      &quot;person&quot;, &quot;car&quot;, or &quot;tree&quot;.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="placeholder-container bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl flex items-center justify-center"
            style={{
              width: "100%",
              minHeight: "400px",
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
              <p className="text-gray-500 mb-1">
                {isTransformed ? "Image loading..." : "Transformed Image"}
              </p>
              <p className="text-gray-400 text-sm">
                Your image transformation will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransformedImage;
