"use client";

import { Cloud, FileIcon, Loader2, Upload, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useState, useCallback } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import Image from 'next/image';

import { trpc } from "@/app/_trpc/client";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUploadThing } from "@/lib/uploadthing";

type UploadDropzoneProps = {
  isSubscribed: boolean;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  uploadProgress: number;
  setUploadProgress: Dispatch<SetStateAction<number>>;
};

const UploadDropzone = ({
  isSubscribed,
  isUploading,
  setIsUploading,
  uploadProgress,
  setUploadProgress,
}: UploadDropzoneProps) => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader",
    {
      onUploadError: (err) => {
        setIsUploading(false);
        switch (err.code) {
          case "BAD_REQUEST":
            setError("Kun PDF-filer er tilladt.");
            break;
          case "TOO_LARGE":
            setError("En eller flere filer er for store.");
            break;
          case "TOO_MANY_FILES":
            setError("Der er for mange filer.");
            break;
          case "FILE_LIMIT_EXCEEDED":
            setError("Filgrænsen er overskredet.");
            break;
          default:
            setError("Der opstod en fejl under upload.");
        }
      },
    },
  );

  const startSimulatedProgress = () => {
    setError("");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevUploadProgress) => {
        if (prevUploadProgress >= 95) {
          clearInterval(interval);
          return prevUploadProgress;
        }
        return prevUploadProgress + 5;
      });
    }, 500);

    return interval;
  };

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <Dropzone
      multiple={true}
      onDropRejected={() => setError("En eller flere filer blev afvist.")}
      onDrop={async (acceptedFiles) => {
        setSelectedFiles(acceptedFiles);
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        const res = await startUpload(acceptedFiles);

        if (!res) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return toast.error("Noget gik galt!", {
            description: "Prøv igen senere.",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Start polling for each uploaded file
        res.forEach((fileResponse) => {
          const key = fileResponse?.key;
          if (key) {
            startPolling({ key });
          }
        });
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Klik for at uploade</span> eller træk
                  og slip.
                </p>

                <p className="text-xs text-zinc-500">
                  PDF (op til {isSubscribed ? "16" : "4"}MB per fil)
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="max-w-xl bg-white flex flex-col items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-y divide-zinc-200">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="px-3 py-2 w-full flex items-center">
                      <FileIcon className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Behandler filer...
                    </div>
                  ) : null}
                </div>
              ) : null}

              {error && error.length !== 0 ? (
                <p className="mt-4 mx-auto text-sm text-rose-500">{error}</p>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader"
  )

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`)
    },
    retry: true,
    retryDelay: 500,
  })

  const startSimulatedProgress = () => {
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval)
          return prevProgress
        }
        return prevProgress + 5
      })
    }, 500)

    return interval
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      const progressInterval = startSimulatedProgress()

      const res = await startUpload(acceptedFiles)

      if (!res) {
        setIsUploading(false)
        clearInterval(progressInterval)
        return toast.error("Noget gik galt!", {
          description: "Prøv igen senere.",
        })
      }

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Poll for hver uploaded fil
      res.forEach((fileResponse) => {
        const key = fileResponse?.key
        if (key) {
          startPolling({ key })
        }
      })
    },
    [startUpload, startPolling]
  )

  return (
    <Dropzone
      multiple={true}
      onDrop={onDrop}
      onDropRejected={() => toast.error("En eller flere filer blev afvist.", { description: "Kun PDF-filer op til en vis størrelse er tilladt." })}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()} className="relative w-full h-full">
          <input {...getInputProps()} />
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <Image
              src="https://plus.unsplash.com/premium_photo-1669751999571-57ed95f1d9ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY1fHxibHVlJTIwdGludHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Background"
              fill
              style={{ objectFit: 'cover' }}
              quality={100}
            />
          </div>
          <Dialog
            open={isOpen}
            onOpenChange={(v) => {
              if (!v) setIsOpen(v)
            }}
          >
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
              <button
                className={`relative w-full h-full flex flex-col items-center justify-center space-y-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl rounded-3xl transition-all duration-300 hover:bg-opacity-15 hover:backdrop-blur-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDragActive ? "bg-[#519DE9] bg-opacity-30 scale-105" : ""
                }`}
                disabled={isUploading}
                aria-disabled={isUploading}
              >
                <div className={`bg-white bg-opacity-20 rounded-full p-2 transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className={`text-xl font-extrabold text-white transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
                  {isDragActive ? "Slip filerne" : "Upload her"}
                </span>
                <span className="bg-white bg-opacity-20 text-white text-xs font-medium py-1 px-3 rounded-full transition-all duration-200 shadow-inner shadow-white/10 hover:shadow-white/20">
                  {isDragActive
                    ? "Slip for at uploade"
                    : "Klik eller træk og slip"}
                </span>
              </button>
            </DialogTrigger>

            <DialogContent>
              <UploadDropzone
                isSubscribed={isSubscribed}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                uploadProgress={uploadProgress}
                setUploadProgress={setUploadProgress}
              />
            </DialogContent>
          </Dialog>
          {isUploading && (
            <div className="absolute inset-0 bg-slate-950 bg-opacity-80 flex flex-col items-center justify-center rounded-3xl">
              <Progress
                value={uploadProgress}
                className="w-1/2 h-2 bg-slate-700"
                indicatorColor={uploadProgress === 100 ? "bg-green-500" : "bg-[#519DE9]"}
              />
              <p className="mt-2 text-sm text-gray-300">
                {uploadProgress === 100 ? "Behandler filer..." : "Uploader..."}
              </p>
            </div>
          )}
          {isDragActive && !isUploading && (
            <div className="absolute inset-0 bg-[#519DE9] rounded-3xl flex items-center justify-center">
              <div className="border-4 border-white border-dashed p-8 rounded-lg">
                <Cloud className="h-12 w-12 text-white mx-auto mb-4 animate-bounce" />
                <p className="text-lg font-extrabold text-white">
                  Slip filerne for at uploade
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  )
}
