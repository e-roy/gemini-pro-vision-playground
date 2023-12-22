"use client";
// components/ImageUploadComponent.tsx
import React, { useState, useCallback, memo } from "react";
import { Card } from "./ui/card";
import { useDropzone } from "react-dropzone";
import { Import, Upload, XCircle } from "lucide-react";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB

interface ImageUploadComponentProps {
  onFileUpload: (data: string, mimeType: string) => void;
  onRemove: () => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = memo(
  function ImageUploadComponent({ onFileUpload, onRemove }) {
    const [media, setMedia] = useState<{
      type: "image" | "video";
      src: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const removeMedia = useCallback(() => {
      setMedia(null);
      onRemove();
    }, [onRemove]);

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
          setMedia({ type: "image", src: resizedDataURL });
          onFileUpload(resizedDataURL, file.type);

          URL.revokeObjectURL(img.src);
          img.onload = null;
        };
      },
      [onFileUpload]
    );

    const readFileAsBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    };

    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) {
          setError("File type not supported.  Please try .jpg or .png file");
          return;
        }
        setError(null);

        if (file.type.startsWith("image/")) {
          if (file.size > MAX_IMAGE_SIZE) {
            resizeImage(file);
          } else {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              const result = event.target?.result as string;
              setMedia({ type: "image", src: result });
              onFileUpload(result, file.type);
            };
            reader.readAsDataURL(file);
          }
        } else if (file.type.startsWith("video/")) {
          // Handle video files
          readFileAsBase64(file).then(
            (base64String) => {
              setMedia({ type: "video", src: base64String });
              onFileUpload(base64String, file.type);
            },
            (error) => {
              console.error("Error reading video file", error);
            }
          );
        }
      },
      [onFileUpload, resizeImage]
    );

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
      onDrop,
      noClick: true,
      multiple: false,
      accept: {
        "image/jpeg": [],
        "image/png": [],
        // "video/mp4": [],
        // "video/webm": [],
        // "video/ogg": [],
      },
    });

    return (
      <Card
        {...getRootProps()}
        className="relative overflow-auto flex justify-center items-center min-h-32 min-w-32"
      >
        <input {...getInputProps()} className="hidden" />
        {isDragActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/90 bg-slate-primary-10 z-10">
            <Import />
            <p className="font-semibold text-2xl text-center">
              Drop Image Here
            </p>
          </div>
        )}

        {media ? (
          media.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.src}
              alt="Uploaded"
              className="max-w-full max-h-full object-contain min-h-32 min-w-32"
            />
          ) : (
            <video
              src={media.src}
              controls
              className="max-w-full max-h-full object-contain h-32 w-32"
            />
          )
        ) : (
          <>
            {!isDragActive && (
              <button
                type="button"
                onClick={open}
                className="absolute inset-0 flex flex-col items-center justify-center text-primary/50 hover:text-primary/90 bg-primary/10"
              >
                {<Upload />}
                <p className="font-semibold text-2xl">Drop Image Here</p>
                <p className={`text-sm text-red-500`}>{error}</p>
              </button>
            )}
          </>
        )}
        {media && (
          <button
            type="button"
            onClick={removeMedia}
            className="absolute top-1 right-1 text-primary/70 hover:text-primary/90"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </Card>
    );
  }
);

export default ImageUploadComponent;
