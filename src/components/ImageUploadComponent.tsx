"use client";
// components/ImageUploadComponent.tsx
import React, { useState, useCallback, memo } from "react";
import { Card } from "./ui/card";
import { useDropzone } from "react-dropzone";
import { Import, Upload, XCircle } from "lucide-react";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB

interface ImageUploadComponentProps {
  onImageUpload: (base64: string, mimeType: string) => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = memo(
  function ImageUploadComponent({ onImageUpload }) {
    const [image, setImage] = useState<string | null>(null);

    const removeImage = useCallback(() => {
      setImage(null);
      onImageUpload("", "");
    }, [onImageUpload]);

    const resizeImage = useCallback(
      (file: File): void => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const scalingFactor = Math.sqrt(MAX_IMAGE_SIZE / file.size);
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scalingFactor;
          canvas.height = img.height * scalingFactor;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const resizedDataURL = canvas.toDataURL(file.type);
          setImage(resizedDataURL);
          onImageUpload(resizedDataURL, file.type);

          URL.revokeObjectURL(img.src);
          img.onload = null;
        };
      },
      [onImageUpload]
    );

    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file.size > MAX_IMAGE_SIZE) {
          resizeImage(file);
        } else {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result as string;
            setImage(result);
            onImageUpload(result, file.type);
          };
          reader.readAsDataURL(file);
        }
      },
      [onImageUpload, resizeImage]
    );

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
      onDrop,
      noClick: true,
      multiple: false,
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
    });

    return (
      <Card
        {...getRootProps()}
        className="relative overflow-auto flex justify-center items-center h-[30vh]"
        style={{ maxHeight: "48vh" }}
      >
        <input {...getInputProps()} className="hidden" />
        {isDragActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-100/90 z-10">
            <Import />
            <p className="font-semibold text-2xl">Drop Image Here</p>
          </div>
        )}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="Uploaded"
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "calc(48vh - 2rem)" }}
          />
        ) : (
          <button
            type="button"
            onClick={open}
            className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-100/90"
          >
            <Upload />
            <p className="font-semibold text-2xl">Drop Image Here</p>
          </button>
        )}
        {image && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-6 right-6 text-slate-500 hover:text-slate-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
      </Card>
    );
  }
);

export default ImageUploadComponent;
