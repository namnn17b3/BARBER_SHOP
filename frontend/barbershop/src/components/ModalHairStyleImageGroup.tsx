import HairStyleImageDetailShow from "@/components/HairStyleDetailShow";
import ListHairStyleImageShow from "@/components/ListHairStyleImageShow";
import { Modal } from "@/components/modal/Modal";
import React from "react";

export default function ModalHairStyleImageGroup(props: any) {
  const choosedHairStyleImageUrlRef = props.choosedHairStyleImageUrlRef;
  const hairStyleImageElementRef = props.hairStyleImageElementRef;
  const hairStyleNameElementRef = props.hairStyleNameElementRef;
  const hairStyleNametRef = props.hairStyleNametRef;
  const hairStyleImage = props.hairStyleImage;
  const setHairStyleImage = props.setHairStyleImage;

  return (
    <>
      <Modal title="Hair style" id="hair-style-modal">
        <ListHairStyleImageShow
          setHairStyleImage={setHairStyleImage}
        />
        <button
          data-modal-target="hair-style-detail-modal"
          data-modal-toggle="hair-style-detail-modal"
          data-modal-hide="hair-style-modal"
          type="button"
          className="mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            choosedHairStyleImageUrlRef.current = hairStyleImage?.imgs?.[0]?.url;
            hairStyleNametRef.current = hairStyleImage?.name;
          }}
        >
          Continue
        </button>
      </Modal>

      <Modal title="Hair style" id="hair-style-detail-modal">
        <HairStyleImageDetailShow
          choosedHairStyleImageUrlRef={choosedHairStyleImageUrlRef}
          hairStyleImage={hairStyleImage}
        />
        <button
          type="button"
          className="mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          data-modal-hide="hair-style-detail-modal"
          onClick={() => {
            hairStyleImageElementRef.current.src = choosedHairStyleImageUrlRef.current;
            hairStyleNameElementRef.current.innerText = hairStyleNametRef.current;
          }}
        >
          OK
        </button>
      </Modal>
    </>
  );
}
