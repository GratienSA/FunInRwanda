'use client';

import { useCallback, useState } from 'react';
import { useForm } from "react-hook-form";
import Heading from "../Heading";
import { BookingFormData } from '@/src/types'; 
import Image from 'next/image';

interface StepImagesProps {
  imageSrc: string | string[]; 
  setCustomValue: (id: keyof BookingFormData, value: any) => void;
}

const StepImages: React.FC<StepImagesProps> = ({ imageSrc, setCustomValue }) => {
  const { register, handleSubmit } = useForm<{ profile: FileList }>();
  const [isUploading, setIsUploading] = useState(false);

  // Ensure imageSrc is always an array
  const imageSrcArray = Array.isArray(imageSrc) ? imageSrc : (imageSrc ? [imageSrc] : []);

  // Function to ensure URL is valid for Next.js Image component
  const getValidImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a relative URL, ensure it starts with a slash
    return url.startsWith('/') ? url : `/${url}`;
  };

  const onSubmit = useCallback(async (data: { profile: FileList }) => {
    if (data.profile.length === 0) {
      console.error("No file selected");
      return;
    }

    setIsUploading(true);

    const image = data.profile[0];
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    try {
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(`HTTP error! status: ${uploadResponse.status}`);
      }

      const uploadedImageData = await uploadResponse.json();
      const imageUrl = uploadedImageData.secure_url;
      
      setCustomValue('imageSrc', [...imageSrcArray, imageUrl]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  }, [imageSrcArray, setCustomValue]);

  const removeImage = useCallback((indexToRemove: number) => {
    setCustomValue('imageSrc', imageSrcArray.filter((_, index) => index !== indexToRemove));
  }, [imageSrcArray, setCustomValue]);

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Add some photos of your activity"
        subtitle="Show participants what your activity looks like!"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("profile", { required: "Please select a file" })}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          accept="image/*"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
          SVG, PNG, JPG or GIF (MAX. 800x400px).
        </p>
        <button
          type="submit"
          disabled={isUploading}
          className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 my-4 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload to Cloud'}
        </button>
      </form>
      {imageSrcArray.length === 0 && (
        <p className="text-red-500">Please upload at least one image.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageSrcArray.map((src, index) => (
          <div key={index} className="relative">
            <Image 
              src={getValidImageUrl(src)} 
              alt={`Uploaded image ${index + 1}`} 
              width={300} 
              height={200} 
              className="rounded-lg" 
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepImages;