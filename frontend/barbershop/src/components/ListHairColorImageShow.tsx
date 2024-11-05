'use client';

import { ApiHairColor } from "@/common/constant/api-url.constant";
import { toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import Gallery from "@/components/gallery/Gallery";
import NoResult from "@/components/NoResult";
import Pagination from "@/components/Pagination";
import React, { useEffect, useRef, useState } from "react";

export default function ListHairColorImageShow(props: any) {
  const choosedHairColorImageUrlRef = props.choosedHairColorImageUrlRef;
  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);
  const [colors, setColors] = useState([]);

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    color: 'RED',
    page: 1,
    items: 9,
  });

  const colorRef: any = useRef<any>();

  useEffect(() => {
    const url = `${ApiHairColor.GET_ALL}?${toQueryString(filterValue)}`;
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

  useEffect(() => {
    const url = `${ApiHairColor.GET_COLOR}`;
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
          setColors(json.data || []);
          isValidErrorRef.current = false;
        }
        else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleFilter = () => {
    const color = colorRef.current;
    console.log(color);
    const newFilterValue = {
      ...filterValue,
      page: 1,
      color,
    }
    setFilterValue(newFilterValue as any);
  }

  const handlePageChange = (page: number) => {
    console.log(page);
    setFilterValue({
      ...filterValue,
      page,
    });
  }

  return (
    <>
      <button
        id="dropdownHelperRadioButton"
        data-dropdown-toggle="dropdownHelperRadio"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Select color
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {/* Dropdown menu */}
      <div
        id="dropdownHelperRadio"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600"
        data-popper-reference-hidden=""
        data-popper-escaped=""
        data-popper-placement="top"
        style={{
          position: "absolute",
          inset: "auto auto 0px 0px",
          margin: 0,
          transform: "translate3d(522.5px, 6119.5px, 0px)"
        }}
      >
        <ul
          className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownHelperRadioButton"
        >
          {colors.map((c: any, idx: number) => (
            <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
              <div className="flex items-center ps-3">
                  <input
                    id={`${c.color}-color-input`}
                    type="radio"
                    name="color"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    defaultChecked={idx === 0}
                    onClick={() => { colorRef.current = c.color; }}
                    defaultValue={c.color}
                  />
                  <label
                    htmlFor={`${c.color}-color-input`}
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    style={{ color: c.colorCode }}
                  >
                    {c.color}
                  </label>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex w-full">
          <button
            type="button"
            className="mx-auto my-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={handleFilter}
          >
              Apply filter
          </button>
        </div>
      </div>

      {
        isValidErrorRef.current ? <AlertError errors={errors} /> :
          <>
            <Gallery>
              {(response as any)?.data?.map((hairColorImage: any) =>
                <div key={hairColorImage.id}>
                  <button
                    className="w-full focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:outline-none hover:border-sky-500 hover:ring-1 hover:ring-sky-500 hover:cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => { choosedHairColorImageUrlRef.current = { ...hairColorImage, color: colorRef.current || 'RED' }; }}
                  >
                    <div className="h-56 w-full">
                      <div style={{ width: '100%', height: '100%' }}>
                        <img
                          className="m-auto h-full dark:hidden"
                          src={hairColorImage?.url}
                          alt=""
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </button>
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
