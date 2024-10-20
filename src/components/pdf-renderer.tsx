"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { PdfFullscreen } from "./pdf-fullscreen";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PDFRendererProps = {
  url: string;
};

export const PDFRenderer = ({ url }: PDFRendererProps) => {
  const { width, ref } = useResizeDetector();

  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  return (
    <div className="w-full bg-[#fafafa] rounded-xl shadow-lg border border-gray-200 flex flex-col items-center overflow-hidden">
      {/* topbar */}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-end px-2">
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Zoom"
                title="Zoom"
                variant="ghost"
                className="gap-1.5"
              >
                <Search className="h-4 w-4" />
                {scale * 100}%
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setScale(0.5)}>
                50%
              </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(0.6)}>
                60%
              </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(0.7)}>
                70%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(0.8)}>
                80%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            onClick={() => setRotation((prev) => prev + 90)}
            aria-label="Rotate 90 degrees"
            title="Rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PdfFullscreen fileUrl={url} />
        </div>
      </div>

      {/* show pdf content */}
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() =>
                toast.error("Fejl ved load af PDF.", {
                  description: "Prøv venligst igen.",
                })
              }
              file={url}
              className="max-h-full"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
