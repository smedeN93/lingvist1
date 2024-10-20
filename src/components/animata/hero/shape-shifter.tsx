import Marquee from "@/components/animata/container/marquee";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FaPause } from 'react-icons/fa';

const images: { src: string; alt: string; width: number; height: number; className?: string }[] = [
  {
    src: "/lingvist_chat_preview15.webp",
    alt: "Image 1",
    width: 3840,
    height: 1907,
  },
  {
    src: "/lingvist-fullscreen-preview.webp",
    alt: "Image 3",
    width: 800,
    height: 400,
  },
  {
    src: "/lingvist-dashboard-preview.webp",
    alt: "Image 2",
    width: 1860,
    height: 1287,
  },
  {
    src: "/lingvist-subscription-preview.webp",
    alt: "Image 4",
    width: 400,
    height: 400,
  },
];

const RollingImages = () => (
  <Marquee className="absolute inset-0 [--gap:2px]" applyMask={false} pauseOnHover>
    {images.map((image, index) => (
      <div key={`image_${index}`} className="h-full flex items-center justify-center">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={cn("object-contain max-h-full w-auto rounded-lg", image.className)}
        />
      </div>
    ))}
  </Marquee>
);

export default function ShapeShifter({
  className,
  containerClassName,
  children,
}: {
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-96 w-full min-w-fit items-center justify-center relative",
        containerClassName
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-black p-0 transition-all ease-in-out",
          className
        )}
      >
        {children ?? <RollingImages />}
      </div>
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full p-2.5 text-white text-opacity-80 border border-white border-opacity-20 shadow-lg">
        <FaPause size={14} />
      </div>
    </div>
  );
}
