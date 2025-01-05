'use client';

import { ApiHairColor, ApiHairStyle, ApiOrder } from "@/common/constant/api-url.constant";
import { ColorMaper } from "@/common/constant/color.constant";
import { toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import FilterHairStyleItem from "@/components/hair-style/FilterHairStyleItem";
import HairStyleItem from "@/components/hair-style/HairStyleItem";
import NoResult from "@/components/NoResult";
import OrderModalGroup from "@/components/OrderModalGroup";
import Pagination from "@/components/Pagination";
import { useAuthen } from "@/hooks/user.authen";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { DateFormatType } from "@/common/constant/date-format.constant";
import Swal from "sweetalert2";

export default function HairStylePage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setResponse] = useState({});
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
          setResponse(json);
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

  const { authenState } = useAuthen();

  const hairStyleIdRef = useRef<any>();
  const hairColorIdRef = useRef<any>();
  const timeInputRef = useRef<any>();
  const dateInputRef = useRef<any>();
  const paymentTypeInputRef = useRef<any>();

  const [hairColorInputs, setHairColorInputs] = useState<any>([]);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const hanldeClickNextStep = () => {
    dateInputRef.current = dayjs(new Date(+(document.querySelector('.focused') as any).getAttribute('data-date'))).format(DateFormatType.YYYY_MM_DD);
    console.log(`order info: ${dateInputRef.current} ${timeInputRef.current} ${hairColorIdRef.current} ${hairStyleIdRef.current} ${paymentTypeInputRef.current}`);
    const toggleOrderInfoModalBtn = (document.querySelector('#toggle-order-info-modal') as any);
    paymentTypeInputRef
    fetch(`${ApiOrder.FIND_ORDER_INFO}?${toQueryString({
      date: dateInputRef.current,
      time: timeInputRef.current,
      hairColorId: hairColorIdRef.current,
      hairStyleId: hairStyleIdRef.current
    })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          setOrderInfo(json.data);
          toggleOrderInfoModalBtn?.click();
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json?.errors[0]?.message,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    // Default time
    (document.querySelector('.label-time-input') as any).click();
    // Default date (today)
    (document.querySelector('.datepicker-controls.flex.space-x-2.mt-2 button') as any).click();

    fetch(ApiHairColor.GET_ALL_COLOR)
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          setHairColorInputs([...json.data, {
            id: 0,
            color: 'NORMAL',
            colorCode: ColorMaper['NORMAL'],
          }]);
          isValidErrorRef.current = false;
        }
        else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const hanlePaymentClick = () => {
    paymentTypeInputRef.current = (document.querySelector('#payment-type') as any).innerText;
    hairColorIdRef.current = 0;
    document.querySelectorAll('input[name="hair-color-input"]').forEach((item: any) => {
      if (item.checked) {
        hairColorIdRef.current = +item.value;
      }
    });
    console.log(`payment: ${dateInputRef.current} ${timeInputRef.current} ${hairColorIdRef.current} ${hairStyleIdRef.current} ${paymentTypeInputRef.current}`);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${window.localStorage.getItem('token')}`);

    fetch(ApiOrder.PAYMENT, {
      method: 'POST',
      body: JSON.stringify({
        date: dateInputRef.current,
        time: timeInputRef.current,
        hairColorId: hairColorIdRef.current,
        hairStyleId: hairStyleIdRef.current,
        paymentType: paymentTypeInputRef.current
      }),
      headers: myHeaders,
    })
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          window.location.href = json.data.paymentUrl;
        } else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', `${window.location.pathname}${window.location.search.toString()}`);
          window.location.href = `/authen/login`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json?.errors[0]?.message,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <OrderModalGroup
        hairColorIdRef={hairColorIdRef}
        hairColorInputs={hairColorInputs}
        timeInputRef={timeInputRef}
        hanldeClickNextStep={hanldeClickNextStep}
        orderInfo={orderInfo}
        paymentTypeInputRef={paymentTypeInputRef}
        hanlePaymentClick={hanlePaymentClick}
      />
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
      <h2 className="mb-4 text-3xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">Hair Style List</h2>
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
                    authenState={authenState}
                    hairStyleIdRef={hairStyleIdRef}
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
