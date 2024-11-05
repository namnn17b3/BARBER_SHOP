'use client';

import { ApiHairColor } from "@/common/constant/api-url.constant";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from "@/components/Pagination";
import { toQueryString } from "@/common/utils/utils";
import NoResult from "@/components/NoResult";
import AlertError from "@/components/alert/AlertError";
import FilterHairColorItem from "@/components/hair-color/FilterHairColorItem";
import HairColorItem from "@/components/hair-color/HairColorItem";
import React from "react";

export default function HairColorPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);
  const [colors, setColors] = useState([]);

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    color: searchParams.get('color') || 'RED',
    page: searchParams.get('page') || 1,
    items: 9,
  });
  
  const colorRef: any = useRef();

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
    router.push(`?${toQueryString(newFilterValue)}`);
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
      <FilterHairColorItem
        handleFilter={handleFilter}
        colorRef={colorRef}
        colors={colors}
      />
      <h2 className="mb-4 text-3xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Hair Color List</h2>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex justify-end mb-6">
          <button className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type="button" data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example">
            <i className="fa-solid fa-filter"></i>
          </button>
        </div>
        {
          isValidErrorRef.current ? <AlertError errors={errors} /> :
          <>
            <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-3">
              {(response as any)?.data?.map((hairColor: any) => <HairColorItem key={hairColor.id} url={hairColor.url} />)}
            </div>
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
      </div>
    </>
  );
}
