import { capitalize } from "@/common/utils/utils";
import React from "react";

export default function FilterHairColorItem(props: any) {
  const {
    handleFilter,
    colorRef,
    colors,
  } = props;

  return (
    <>
      <div
        id="drawer-example"
        className="fixed top-0 left-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 -translate-x-full"
        tabIndex={-1}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Apply filters
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-example"
          aria-controls="drawer-example"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-6">
            {/* Color */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Color
              </h6>
              {colors.map((c: any, idx: number) => (
                <div key={idx} className="flex items-center">
                  <input
                    id={`${c.color}-color-input`}
                    type="radio"
                    name="color"
                    className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    defaultChecked={idx === 0}
                    onClick={() => { colorRef.current = c.color; }}
                    defaultValue={c.color}
                  />
                  <label htmlFor={`${c.color}-color-input`} className="flex items-center ml-2" style={{ color: c.colorCode }}>{capitalize(c.color)}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom-0 left-0 flex justify-center w-full pb-4 mt-6 space-x-4 md:px-4 md:absolute">
            <button
              type="button"
              className="w-full px-5 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
              onClick={() => handleFilter()}
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
