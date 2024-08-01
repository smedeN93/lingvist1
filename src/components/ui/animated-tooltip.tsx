"use client";
import Image from "next/image";
import React from "react";

const people = [
    {
      id: 1,
      image: "/lingvist_user1.webp",
    },
    {
      id: 2,
      image: "/lingvist_user6.webp",
    },
    {
      id: 3,
      image: "/lingvist_user.webp",
    },
    {
      id: 4,
      image: "/lingvist_user4.webp",
    },
    {
      id: 5,
      image: "/lingvist_user7.webp",
    },
    {
      id: 6,
      image: "/lingvist_user8.webp",
    },
  ];
   
export function LingvistUsers() {
  return (
    <div className="flex flex-row items-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    image: string;
  }[];
}) => {
  return (
    <>
      {items.map((item) => (
        <div
          className="-mr-4 relative"
          key={item.id}
        >
          <Image
            height={100}
            width={100}
            src={item.image}
            alt={`Avatar ${item.id}`}
            className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 border-white transition duration-300 ease-in-out hover:scale-110 hover:z-10 hover:shadow-lg"
          />
        </div>
      ))}
    </>
  );
};