import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

import { ChatWrapper } from "@/components/chat/chat-wrapper";
import { PDFRenderer } from "@/components/pdf-renderer";
import { db } from "@/db";

const FileIdPage = async ({ params }: { params: { fileId: string } }) => {
  // retrieve file id
  const { fileId } = params;

  // authenticate user
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  // get file details
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 bg-white justify-between flex flex-col h-[calc(100vh-3.5rem)] mt-12">
      <div className="mx-auto w-full grow lg:flex">
        {/* left side */}
        <div className="lg:flex-1 lg:w-1/2 xl:w-[55%] px-4 py-6 lg:px-8">
          <PDFRenderer url={file.url} />
        </div>

        {/* right side */}
        <div className="lg:flex-1 lg:w-1/2 xl:w-[45%] border-t border-gray-200 lg:border-t-0 px-4 py-6 lg:px-8">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
};

export default FileIdPage;
