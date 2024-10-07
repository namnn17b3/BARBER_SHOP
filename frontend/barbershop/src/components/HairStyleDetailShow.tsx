'use client';

import React from "react";
import { useRef } from "react";

export default function HairStyleImageDetailShow(props: any) {
  const hairStyleImage = props.hairStyleImage;
  const choosedHairStyleImageUrlRef = props.choosedHairStyleImageUrlRef;
  const imgMain: any = useRef();

  const changeImage = (target: any, src: string) => {
    choosedHairStyleImageUrlRef.current = src;
    target.src = src;
  }

  return (
    <>
      {/* Product Images */}
      <div className="w-full md:w-full px-4 mb-8">
        <div className="flex justify-center">
          <img
            src={hairStyleImage?.imgs?.[0]?.url}
            alt="Product"
            className="w-fit h-auto rounded-lg shadow-md mb-4"
            id="mainImage"
            ref={imgMain}
          />
        </div>
        <div className="flex gap-4 py-4 justify-center overflow-x-auto">
          {
            hairStyleImage?.imgs?.map((img: any) => (
              <img
                key={img.id}
                src={img.url}
                alt="Thumbnail 1"
                className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                onClick={(e) => changeImage(imgMain.current, img.url)}
              />
            ))
          }
        </div>
      </div>
    </>
  );
}
