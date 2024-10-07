'use client';

import { ApiHairStyle } from "@/common/constant/api-url.constant";
import { toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import Gallery from "@/components/gallery/Gallery";
import NoResult from "@/components/NoResult";
import Pagination from "@/components/Pagination";
import React from "react";
import { useEffect, useRef, useState } from "react";

export default function ListHairStyleImageShow(props: any) {
  const setHairStyleImage = props.setHairStyleImage;

  const nameInputRef: any = useRef<any>();
  const isValidErrorRef: any = useRef<any>();
  const [filterValue, setFilterValue] = useState<any>({
    page: 1,
    items: 9,
  });
  const [response, setReponse] = useState<any>({});
  const [errors, setErrors] = useState<any>([]);

  const handleFilter = () => {
    const name = nameInputRef.current.value;
    console.log(name);
    const newFilterValue = {
      ...filterValue,
      page: 1,
      name,
    }
    setFilterValue(newFilterValue as any);
  }

  const handlePageChange = (page: number) => {
    setFilterValue({
      ...filterValue,
      page,
    });
  }

  useEffect(() => {
    const url = `${ApiHairStyle.GET_IMAGE_URLS}?${toQueryString(filterValue)}`;
    fetch(url)
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          setReponse(json);
          isValidErrorRef.current = false;
        }
        else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }, [filterValue]);

  return (
    <>
      <div className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search hair style name..."
            ref={nameInputRef}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleFilter}
          >
            Search
          </button>
        </div>
      </div>
      {
        isValidErrorRef.current ? <AlertError errors={errors} /> :
          <>
            <Gallery>
              {(response as any)?.data?.map((hairStyleImage: any) =>
                <div key={hairStyleImage.id}>
                  <button
                    className="w-full focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:outline-none hover:border-sky-500 hover:ring-1 hover:ring-sky-500 hover:cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => { setHairStyleImage(hairStyleImage); }}
                  >
                    <div className="h-56 w-full">
                      <div style={{ width: '100%', height: '100%' }}>
                        <img
                          className="m-auto h-full dark:hidden"
                          src={hairStyleImage?.imgs?.[0]?.url}
                          alt=""
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </button>
                  <div className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">{hairStyleImage.name}</div>
                </div>
              )}
            </Gallery>
            {!!(response as any)?.data?.length && <Pagination
              page={+filterValue.page}
              items={9}
              nodes={5}
              totalRecords={(response as any).meta.totalRecords}
              handlePageChange={handlePageChange}
              qsObject={filterValue}
            />}
            {
              (response as any)?.data?.length == 0 ? <NoResult /> : ''
            }
          </>
      }
    </>
  );
}
