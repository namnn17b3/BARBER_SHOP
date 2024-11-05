'use client';

import { ApiHairColor, ApiHairStyle, ApiOrder } from "@/common/constant/api-url.constant";
import { toQueryString } from "@/common/utils/utils";
import OrderModalGroup from "@/components/OrderModalGroup";
import { useAuthen } from "@/hooks/user.authen";
import { useEffect, useRef, useState } from "react";
import React from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { DateFormatType } from "@/common/constant/date-format.constant";
import { ColorMaper } from "@/common/constant/color.constant";

export default function HairStyleDetail(props: any) {
  const { hairStyleId } = props;
  const [hairStyle, setHairStyle] = useState<any>(null);
  const imgMain: any = useRef();
  const isValidErrorRef: any = useRef();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`${ApiHairStyle.GET_DETAIL}/${hairStyleId}`)
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        setHairStyle(json.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const changeImage = (target: any, src: string) => {
    target.src = src;
  }

  const { authenState } = useAuthen();

  const [hairColorInputs, setHairColorInputs] = useState<any>([]);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const hairColorIdRef = useRef<any>();
  const timeInputRef = useRef<any>();
  const paymentTypeInputRef = useRef<any>();
  const hairStyleIdRef = useRef<any>();
  const dateInputRef = useRef<any>();

  const handleBooking = () => {
    if (!authenState) {
      window.location.href = '/authen/login';
      return;
    }
    hairStyleIdRef.current = hairStyleId;
    (document.querySelector('#toggle-datetime-modal') as any)?.click();
  }

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

  const hanlePaymentClick = () => {
    paymentTypeInputRef.current = (document.querySelector('#payment-type') as any).innerText;
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
          console.log(json);
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

  useEffect(() => {
    // Default time
    (document.querySelector('.label-time-input') as any).click();
    // Default date (today)
    (document.querySelector('.datepicker-controls.flex.space-x-2.mt-2 button') as any).click();

    fetch(ApiHairColor.GET_COLOR)
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
            id: null,
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


  return (
    <>
      <OrderModalGroup
        hairColorIdRef={hairColorIdRef}
        hairColorInputs={hairColorInputs}
        timeInputRef={timeInputRef}
        orderInfo={orderInfo}
        paymentTypeInputRef={paymentTypeInputRef}
        hanldeClickNextStep={hanldeClickNextStep}
        hanlePaymentClick={hanlePaymentClick}
      />

      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            {/* Product Images */}
            <div className="w-full md:w-full px-4 mb-8">
              <img
                src={hairStyle?.imgs?.[0]?.url}
                alt="Product"
                className="w-full h-auto rounded-lg shadow-md mb-4"
                id="mainImage"
                ref={imgMain}
              />
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                {
                  hairStyle?.imgs?.map((img: any) => (
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

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {hairStyle?.name}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  {hairStyle?.price ? Number(hairStyle?.price).toLocaleString('vi') : ''} đ
                </p>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                  { `(${hairStyle?.rating || '0'})` }
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  </div> | 
                  <span
                    className="text-sm font-medium leading-none text-gray-900 hover:no-underline dark:text-white"
                  >
                    { `(${hairStyle?.booking || '0'}) booking` }
                  </span>
                </div>
              </div>
              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <button
                  title=""
                  className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                  role="button"
                  onClick={handleBooking}
                >
                  <svg
                    className="w-5 h-5 -ms-2 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                    />
                  </svg>
                  Booking
                </button>

                <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  {
                    hairStyle?.discount
                      ? 'Discount ' + (hairStyle?.discount.unit === '%' ? `${hairStyle?.discount.value}%` : `${Number(hairStyle?.discount.value).toLocaleString('vi')} đ`)
                      : 'No discount'
                  }
                </span>
                {
                    hairStyle?.discount
                    ? <span className="me-2 rounded bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-gray-800 dark:text-yellow-300">
                      From {hairStyle?.discount?.effectDate} to {hairStyle?.discount?.expireDate}
                    </span>
                    : ''
                }
                {
                  hairStyle?.active
                    ? <span className="me-2 rounded bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-gray-800 dark:text-green-400">Active</span>
                    : <span className="me-2 rounded bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-gray-800 dark:text-red-400">Inactive</span>
                }
              </div>
              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                {hairStyle?.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
