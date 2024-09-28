'use client';

import { ApiHairStyle } from "@/common/constant/api-url.constant";
import { toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import FilterHairStyleItem from "@/components/hair-style/FilterHairStyleItem";
import HairStyleItem from "@/components/hair-style/HairStyleItem";
import NoResult from "@/components/NoResult";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HairStylePage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    name: searchParams.get('name'),
    priceMin: searchParams.get('ageMin'),
    priceMax: searchParams.get('ageMax'),
    sorting: searchParams.get('sorting'),
    page: searchParams.get('page') || 1,
    items: 9,
  });

  const nameInputRef: any = useRef();
  const priceMinInputRef: any = useRef();
  const priceMaxInputRef: any = useRef();
  const descendingRatingInputRef: any = useRef();
  const ascendingRatingInputRef: any = useRef();
  const noneRatingInputRef: any = useRef();
  const ascendingBookingInputRef: any = useRef();
  const descendingBookingInputRef: any = useRef();
  const noneBookingInputRef: any = useRef();
  const ratingPriorityInputRef: any = useRef();
  const bookingPriorityInputRef: any = useRef();
  const nonePriorityInputRef: any = useRef();

  useEffect(() => {
    const url = `${ApiHairStyle.GET_ALL}?${toQueryString(filterValue)}`;
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
    const minPrice = priceMinInputRef.current.value;
    const maxPrice = priceMaxInputRef.current.value;
    let sorting = '';
    sorting = sorting + (ascendingRatingInputRef.current.checked ? 'rating:asc,' : descendingRatingInputRef.current.checked ? 'rating:desc,' : 'rating:none,');
    sorting = sorting + (ascendingBookingInputRef.current.checked ? 'booking:asc,' : descendingBookingInputRef.current.checked ? 'booking:desc,' : 'booking:none,');
    sorting = sorting + (ratingPriorityInputRef.current.checked ? 'priority:rating' : bookingPriorityInputRef.current.checked ? 'priority:booking' : 'priority:none');

    console.log(name, minPrice, maxPrice, sorting);
    const newFilterValue = {
      ...filterValue,
      name,
      minPrice,
      maxPrice,
      sorting,
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
      <FilterHairStyleItem
        nameInputRef={nameInputRef}
        priceMinInputRef={priceMinInputRef}
        priceMaxInputRef={priceMaxInputRef}
        descendingRatingInputRef={descendingRatingInputRef}
        ascendingRatingInputRef={ascendingRatingInputRef}
        noneRatingInputRef={noneRatingInputRef}
        ascendingBookingInputRef={ascendingBookingInputRef}
        descendingBookingInputRef={descendingBookingInputRef}
        noneBookingInputRef={noneBookingInputRef}
        ratingPriorityInputRef={ratingPriorityInputRef}
        bookingPriorityInputRef={bookingPriorityInputRef}
        nonePriorityInputRef={nonePriorityInputRef}
        handleFilter={handleFilter}
      />
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Hair Style List</h1>
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
              {(response as any)?.data?.map((hairStyle: any) => 
                <HairStyleItem
                  key={hairStyle.id}
                  id={hairStyle.id}
                  img={hairStyle.img}
                  name={hairStyle.name}
                  price={hairStyle.price}
                  discount={hairStyle.discount}
                  booking={hairStyle.booking}
                  rating={hairStyle.rating}
                />
              )}
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
