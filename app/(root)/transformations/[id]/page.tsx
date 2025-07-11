import Image from "next/image";
import Link from "next/link";

import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/actions/image.actions";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

const ImageDetails = async ({ params: { id } }: SearchParamProps) => {
  const image = await getImageById(id);

  return (
    <>
      <Header title={image.title} />

      <section className="mt-5 flex flex-wrap gap-4 bg-white/50 p-5 rounded-xl shadow-sm border border-purple-100">
        <div className="p-14-medium md:p-16-medium flex gap-2 items-center">
          <p className="text-dark-600 font-medium">Transformation:</p>
          <p className="capitalize text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
            {image.transformationType}
          </p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden text-purple-300 md:block">|</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 items-center">
              <p className="text-dark-600 font-medium">Prompt:</p>
              <p className="text-gray-700 italic">"{image.prompt}"</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden text-purple-300 md:block">|</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 items-center">
              <p className="text-dark-600 font-medium">Color:</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full border border-gray-200" 
                  style={{ backgroundColor: image.color }}
                ></div>
                <p className="capitalize text-gray-700">{image.color}</p>
              </div>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden text-purple-300 md:block">|</p>
            <div className="p-14-medium md:p-16-medium flex gap-2 items-center">
              <p className="text-dark-600 font-medium">Aspect Ratio:</p>
              <p className="capitalize text-gray-700">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10">
        <div className="transformation-grid">
          {/* ORIGINAL IMAGE */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h3 className="h3-bold text-dark-600">Original</h3>
              <div className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                {Math.round(image.width || 0)} × {Math.round(image.height || 0)}
              </div>
            </div>

            <div className="relative group">
              <Image
                width={getImageSize(image.transformationType, image, "width")}
                height={getImageSize(image.transformationType, image, "height")}
                src={image.secureURL}
                alt={image.title || "Original image"}
                className="transformation-original_image object-contain w-full rounded-lg"
                style={{
                  maxHeight: '75vh'
                }}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>

          {/* TRANSFORMED IMAGE */}
          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            isTransforming={false}
            transformationConfig={image.config}
            hasDownload={true}
            transformedImageUrl={image.secureURL}
          />
        </div>

        <div className="mt-8 space-y-4 flex flex-col sm:flex-row gap-4">
          <Button asChild type="button" className="submit-button capitalize flex-1">
            <Link href={`/transformations/${image._id}/update`} className="flex items-center justify-center gap-2">
              <Image 
                src="/assets/icons/edit.svg"
                width={20}
                height={20}
                alt="Edit"
                className="filter brightness-0 invert"
              />
              Update Image
            </Link>
          </Button>

          <DeleteConfirmation imageId={image._id} />
        </div>
      </section>
    </>
  );
};

export default ImageDetails;