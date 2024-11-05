'use client';

import { ApiBarber } from "@/common/constant/api-url.constant";
import BarberItem from "@/components/barber/BarberItem";
import FilterBarberItem from "@/components/barber/FilterBarberItem";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from "@/components/Pagination";
import { toQueryString } from "@/common/utils/utils";
import NoResult from "@/components/NoResult";
import AlertError from "@/components/alert/AlertError";
import React from "react";

export default function BarberPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    name: searchParams.get('name'),
    ageMin: searchParams.get('ageMin'),
    ageMax: searchParams.get('ageMax'),
    gender: searchParams.get('gender'),
    page: searchParams.get('page') || 1,
    items: 9,
  });

  const nameInputRef: any = useRef();
  const ageMinInputRef: any = useRef();
  const ageMaxInputRef: any = useRef();
  const genderMaleInputRef: any = useRef();
  const gendeFemaleInputRef: any = useRef();

  useEffect(() => {
    const url = `${ApiBarber.GET_ALL}?${toQueryString(filterValue)}`;
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
    const name = nameInputRef.current.value;
    const ageMin = ageMinInputRef.current.value;
    const ageMax = ageMaxInputRef.current.value;
    const gender = genderMaleInputRef.current.checked ? 'MALE' : gendeFemaleInputRef.current.checked ? 'FEMALE' : null;

    console.log(name, ageMin, ageMax, gender);
    const newFilterValue = {
      ...filterValue,
      name,
      ageMin,
      ageMax,
      gender,
      page: 1,
    }
    router.push(`?${toQueryString(newFilterValue)}`);
    setFilterValue(newFilterValue);
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
      <FilterBarberItem
        handleFilter={handleFilter}
        nameInputRef={nameInputRef}
        ageMinInputRef={ageMinInputRef}
        ageMaxInputRef={ageMaxInputRef}
        genderMaleInputRef={genderMaleInputRef}
        gendeFemaleInputRef={gendeFemaleInputRef}
      />
      <h2 className="mb-4 text-3xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Barber List</h2>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex justify-end mb-6">
          <button className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800" type="button" data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example">
            <i className="fa-solid fa-filter"></i>
          </button>
        </div>
        {
          isValidErrorRef.current ? <AlertError errors={errors} /> :
          <>
            <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
              {(response as any)?.data?.map((barber: any) => <BarberItem key={barber.id} id={barber.id} img={barber.img} name={barber.name} />)}
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
