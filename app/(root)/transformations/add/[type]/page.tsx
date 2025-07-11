import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  // Check if transformation type exists, redirect to home if not
  if (!transformationTypes[type]) {
    console.error(`Transformation type "${type}" not found`);
    redirect('/');
  }

  const transformation = transformationTypes[type];

  const placeholderUserId = "anonymous_user";

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={placeholderUserId}
          type={transformation.type as TransformationTypeKey}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage