'use client';

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { toast } from "react-hot-toast";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string[]) => void; 
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback((result: any) => {
    setIsUploading(true);
    const newImageUrl = result.info.secure_url;
    console.log("Uploaded Image URL:", newImageUrl);
    if (newImageUrl) {
      if (value.length < 5) {
        onChange([...value, newImageUrl]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("You can only upload up to 5 images.");
      }
    } else {
      console.error("Uploaded image URL is missing");
      toast.error("Failed to upload image");
    }
    setIsUploading(false);
  }, [onChange, value]);

  const handleRemoveImage = (index: number) => {
    const updatedImages = value.filter((_, i) => i !== index);
    onChange(updatedImages);
    toast.success("Image removed");
  };

  return (
    <div className="flex flex-col gap-4">
      <CldUploadWidget
        onUpload={handleUpload}
        uploadPreset="kulbo2cu"
        options={{
          maxFiles: 5,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "png", "gif", "jpeg"],
        }}
      >
        {({ open }) => (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-bold text-lg">
              {isUploading ? "Uploading..." : "Click to upload"}
            </div>
          </div>
        )}
      </CldUploadWidget>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {value.map((src, index) => (
          <div key={index} className="relative w-full h-32">
            {src ? (
              <div className="relative w-full h-full">
                <Image
                  alt={`Upload ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  src={src}
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-sm"
                >
                  X
                </button>
              </div>
            ) : (
              <div className="bg-gray-200 h-full flex items-center justify-center">
                No Image
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;