import React from 'react';
import { Compare } from './compare';

interface CompareImageProps {
  firstImage: string;
  secondImage: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
}

export const CompareImage: React.FC<CompareImageProps> = ({
  firstImage,
  secondImage,
  alt,
  width,
  height,
  quality = 100
}) => {
  return (
    <div className="relative w-full h-full flex items-center">
      <div className="relative rounded sm:rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl overflow-hidden shadow-sm w-full">
        <Compare
          firstImage={firstImage}
          secondImage={secondImage}
          className="w-full h-auto aspect-[3840/1907]"
          firstImageClassName="w-full h-auto object-cover object-left-top"
          secondImageClassname="w-full h-auto object-cover object-left-top"
          width={width}
          height={height}
          slideMode="hover"
          autoplay={true}
          autoplayDuration={7000}
          quality={quality}
        />
      </div>
    </div>
  );
};
