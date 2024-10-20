"use client"

import { Ghost, MessageSquare, Trash, FileText} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { motion, AnimatePresence } from "framer-motion"

import { trpc } from "@/app/_trpc/client"
import { Button } from "@/components/ui/button"
import { getUserSubscriptionPlan } from "@/lib/stripe"

import { DeleteFileModal } from "./delete-file-modal"
import { UploadButton } from "./upload-button"
import { Card, CardContent } from "@/components/ui/card"
import { DocumentsChart, MessagesChart, NotesChart } from "@/components/ui/radial_chart"
import { GlobalChatWrapper } from "@/components/chat/GlobalChatWrapper"

type DashboardProps = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

export default function Component({ subscriptionPlan }: DashboardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<{
    id: string
    name: string
  } | null>(null)

  const { data: files, isLoading } = trpc.getUserFiles.useQuery()

  const totalMessages = files?.reduce((sum, file) => sum + file._count.messages, 0) || 0
  const totalNotes = files?.reduce((sum, file) => sum + file._count.notes, 0) || 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white p-4 pb-24"
      >
        <main className="mx-auto max-w-7xl md:p-10 pb-32">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <Card className="md:col-span-2 shadow-md rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <CardContent className="p-6 bg-[rgb(245,245,247)] h-[250px] flex flex-col justify-center">
                <div className="flex items-center justify-center h-[180px]">
                  {isLoading ? (
                    <div className="flex justify-center w-full">
                      <div className="w-1/3 mx-2">
                        <Skeleton circle={true} height={120} width={120} />
                      </div>
                      <div className="w-1/3 mx-2">
                        <Skeleton circle={true} height={120} width={120} />
                      </div>
                      <div className="w-1/3 mx-2">
                        <Skeleton circle={true} height={120} width={120} />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center w-full"
                    >
                      <div className="w-1/3 mx-2">
                        <DocumentsChart count={files?.length || 0} />
                      </div>
                      <div className="w-1/3 mx-2">
                        <MessagesChart count={totalMessages} />
                      </div>
                      <div className="w-1/3 mx-2">
                        <NotesChart count={totalNotes} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full"
              >
                <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
              </motion.div>
            </Card>
          </motion.div>

          <Card className="shadow-md rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6 bg-[rgb(245,245,247)]">
              {files && files?.length !== 0 ? (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {files
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((file) => (
                        <motion.li
                          key={file.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[rgb(250,250,252)] rounded-3xl shadow-md transition-all duration-300 hover:shadow-md overflow-hidden relative"
                        >
                          <Link
                            href={`/dashboard/${file.id}`}
                            className="block p-4 h-[200px]"
                          >
                            <div className="flex flex-col h-full">
                              <div className="mb-4">
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="bg-white shadow-sm rounded-full p-2 inline-block">
                                    <FileText className="h-5 w-5 text-slate-600" />
                                  </div>
                                </motion.div>
                              </div>
                              <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
                                  {file.name}
                                </h3>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="inline-flex items-center backdrop-blur-sm bg-white text-slate-800 text-xs font-medium px-3 py-1 rounded-full h-8 shadow-sm">
                                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                  <span className="mr-1">{file._count.messages}</span>
                                  <span className="mx-1 opacity-50">•</span>
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  <span>{file._count.notes}</span>
                                </div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full shadow-sm"
                                    disabled={isOpen}
                                    aria-label={`Delete ${file.name}`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setIsOpen(true)
                                      setCurrentlyDeletingFile({
                                        id: file.id,
                                        name: file.name,
                                      })
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                  </AnimatePresence>
                </motion.ul>
              ) : isLoading ? (
                <div className="w-full flex items-center justify-center">
                  <Skeleton height={100} className="w-full max-w-md" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="max-w-sm p-5 bg-[rgb(248,248,250)] rounded-2xl border border-slate-100 shadow-md">
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <Ghost className="h-8 w-8 text-slate-400" />
                      <h3 className="font-semibold text-lg text-slate-700">Der er tomt herinde.</h3>
                      <p className="text-slate-500 text-sm">Lad os uploade din første PDF!</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
          <GlobalChatWrapper />
        </main>

        <DeleteFileModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentlyDeletingFile={currentlyDeletingFile}
          setCurrentlyDeletingFile={setCurrentlyDeletingFile}
        />
      </motion.div>
    </>
  )
}
