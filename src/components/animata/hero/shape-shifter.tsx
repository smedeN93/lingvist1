import Marquee from "@/components/animata/container/marquee";
import { cn } from "@/lib/utils";
import Image from "next/image";

const images: { src: string; alt: string; width: number; height: number; className?: string }[] = [
  {
    src: "/lingvist_chat_preview15.webp",
    alt: "Image 1",
    width: 3840,
    height: 1907,
  },
  {
    src: "https://images.unsplash.com/photo-1495985812444-236d6a87bdd9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    alt: "Image 3",
    width: 600,
    height: 400,
  },
  {
    src: "https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Image 2",
    width: 800,
    height: 400,
  },
  {
    src: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Image 4",
    width: 400,
    height: 400,
  },
  {
    src: "https://images.unsplash.com/photo-1611816055460-618287c870bd?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
    alt: "Image 5",
    width: 600,
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
          className={cn("object-contain max-h-full w-auto", image.className)}
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
        "flex min-h-96 w-full min-w-fit items-center justify-center",
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
    </div>
  );
}
