"use client";

import { format } from "date-fns";
import { Ghost, MessageSquare, Plus, Trash, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { getUserSubscriptionPlan } from "@/lib/stripe";

import { DeleteFileModal } from "./delete-file-modal";
import { UploadButton } from "./upload-button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card, CardContent } from "@/components/ui/card";

type DashboardProps = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
};

export const Dashboard = ({ subscriptionPlan }: DashboardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const totalMessages = files?.reduce((sum, file) => sum + file._count.messages, 0) || 0;

  return (
    <AuroraBackground>
      <div className="min-h-screen p-4">
        <main className="mx-auto max-w-7xl md:p-10">
          <Card className="bg-white/80 backdrop-blur-lg shadow-md rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6 min-h-[400px] lg:min-w-[1000px]">
              <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-4xl text-slate-950">Mine dokumenter</h1>
                <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
              </div>

              {/* Updated Counter */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <span className="text-lg font-semibold text-slate-700">Total Dokumenter</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoading ? <Skeleton width={40} /> : files?.length || 0}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-semibold text-slate-700">Total Beskeder</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {isLoading ? <Skeleton width={40} /> : totalMessages}
                  </div>
                </div>
              </div>

              {files && files?.length !== 0 ? (
                <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {files
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                    .map((file) => (
                      <li
                        key={file.id}
                        className="col-span-1 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden"
                      >
                        <Link
                          href={`/dashboard/${file.id}`}
                          className="flex flex-col gap-2"
                        >
                          <div className="p-6 flex items-center space-x-4">
                            <div
                              aria-hidden
                              className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            />
                            <div className="flex-1 truncate">
                              <h3 className="truncate text-lg font-medium text-slate-900">
                                {file.name}
                              </h3>
                            </div>
                          </div>
                        </Link>

                        <div className="px-6 py-4 bg-slate-50 text-sm text-slate-500 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Plus className="h-4 w-4" />
                              {format(new Date(file.createdAt), "MMM yyyy")}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {file._count.messages}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isOpen}
                            aria-disabled={isOpen}
                            onClick={() => {
                              setIsOpen(true);
                              setCurrentlyDeletingFile({
                                id: file.id,
                                name: file.name,
                              });
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : isLoading ? (
                <div className="mt-16 w-full flex items-center justify-center">
                  <Skeleton height={100} className="w-full max-w-md" />
                </div>
              ) : (
                <div className="mt-16 flex flex-col items-center justify-center gap-2 text-center">
                  <Ghost className="h-8 w-8 text-slate-800" />
                  <h3 className="font-semibold text-xl text-slate-900">Der er tomt herinde.</h3>
                  <p className="text-slate-600 mb-4">Lad os uploade din første PDF!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <DeleteFileModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentlyDeletingFile={currentlyDeletingFile}
          setCurrentlyDeletingFile={setCurrentlyDeletingFile}
        />
      </div>
    </AuroraBackground>
  );
};