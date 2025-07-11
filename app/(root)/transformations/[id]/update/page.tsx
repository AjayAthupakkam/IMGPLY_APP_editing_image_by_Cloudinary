import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { getImageById } from "@/lib/actions/image.actions";
import { SearchParamProps } from "@/types";

const Page = async ({ params: { id } }: SearchParamProps) => {
  const image = await getImageById(id);
  
  // Use default values if author is undefined
  const authorId = image.author?._id || "default_user_id";

  return (
    <>
      <Header title="Edit" />

      <section className="mt-10">
        <TransformationForm 
          action="Update"
          userId={authorId}
          type={image.transformationType}
          creditBalance={image.creditFee || 0}
          config={image.config}
          data={image}
        />
      </section>
    </>
  )
};

export default Page;