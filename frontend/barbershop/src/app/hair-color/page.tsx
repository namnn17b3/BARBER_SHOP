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
import { Color } from "@/common/enums/color.enum";

export default function HairColorPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    color: searchParams.get('color') || Color.RED,
    page: searchParams.get('page') || 1,
    items: 9,
  });
  
  const redColorInputRef: any = useRef();
  const blueColorInputRef: any = useRef();
  const yellowColorInputRef: any = useRef();
  const greenColorInputRef: any = useRef();
  const purpleColorInputRef: any = useRef();

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

  const handleFilter = () => {
    let color = null;
    [redColorInputRef, blueColorInputRef, greenColorInputRef, yellowColorInputRef, purpleColorInputRef].forEach((input) => {
      console.log(input.current);
      if (input.current.checked) {
        color = input.current.value;
        return;
      }
    });

    console.log(color);
    const newFilterValue = {
      ...filterValue,
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
        redColorInputRef={redColorInputRef}
        blueColorInputRef={blueColorInputRef}
        yellowColorInputRef={yellowColorInputRef}
        greenColorInputRef={greenColorInputRef}
        purpleColorInputRef={purpleColorInputRef}
      />
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Hair Color List</h1>
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
              {(response as any)?.data?.map((barber: any) => <HairColorItem key={barber.id} url={barber.url} />)}
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
