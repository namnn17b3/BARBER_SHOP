'use client';

import { ApiFeedback, ApiOrder } from "@/common/constant/api-url.constant";
import { ColorMaper } from "@/common/constant/color.constant";
import { capitalize, toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import NoResult from "@/components/NoResult";
import OrderDetailAndFeedbackModalGroup from "@/components/OrderDetailAndFeedbackModalGroup";
import Pagination from "@/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import React from "react";
import Swal from "sweetalert2";
import { sleep } from "@/common/utils/utils";

export default function HistoryOrderPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    sortBy: searchParams.get('sortBy') || 'desc',
    page: searchParams.get('page') || 1,
    items: 9,
  });

  useEffect(() => {
    const url = `${ApiOrder.GET_ORDER_BY_USER}?${toQueryString(filterValue)}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      }
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
          setReponse(json);
          isValidErrorRef.current = false;
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }, [filterValue]);

  const handleFilter = () => {
    const codeOrHairStyle = (document.querySelector('#code-or-hair-style') as any).value;
    let sortBy = 'desc';
    (document.querySelectorAll('input[name="sort-by"]') as any).forEach((item: any) => {
      if (item.checked) {
        sortBy = item.value;
      }
    });

    const newFilterValue = {
      ...filterValue,
      page: 1,
      codeOrHairStyle: codeOrHairStyle?.trim() || null,
      sortBy,
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

  const [order, setOrder] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const orderIdRef = useRef<any>();
  
  const hanldClickViewOrderDetail = (orderId: number) => {
    fetch(`${ApiOrder.GET_ORDER_DETAIL}/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
      }
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
          setOrder(json.data);
        } else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.message,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  const hanldeClickReview = (orderId: number) => {
    fetch(`${ApiFeedback.GET_FEEDBACK_BY_ORDER}/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
      }
    })
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        if (response.status === 401) {
          window.location.href = `/authen/login`;
          window.sessionStorage.setItem('prePath', window.location.pathname);
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data || json.data === null) {
          setFeedback(json.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.message,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  const handleClickStarVote = () => {
    const active = 'w-8 h-8 ms-3 text-yellow-300';
    const inactive = 'w-8 h-8 ms-3 text-gray-300 dark:text-gray-500';

    const inputStars: any = document.querySelectorAll('input[name="star"]');
    inputStars.forEach((item: any, idx: number) => {
      if (item.checked) {
        for (let i = 0; i <= idx; i++) {
          inputStars[i].nextElementSibling.firstChild.setAttribute('class', active);
        }
        for (let i = idx + 1; i < inputStars.length; i++) {
          inputStars[i].nextElementSibling.firstChild.setAttribute('class', inactive);
        }
      }
    });
  }

  const setStarRating = (star: number) => {
    const active = 'w-8 h-8 ms-3 text-yellow-300';
    const inactive = 'w-8 h-8 ms-3 text-gray-300 dark:text-gray-500';

    const inputStars: any = document.querySelectorAll('input[name="star"]');
    inputStars.forEach((item: any, idx: number) => {
      if (idx + 1 === star) {
        item.checked = true;
      }
    });

    handleClickStarVote();
  }

  useEffect(() => {
    const sortByElement: any = document.querySelector('#dropdownRadioButton span');
    (document.querySelectorAll('input[name="sort-by"]') as any).forEach((item: any) => {
      item.addEventListener('click', () => {
        if (item.checked) {
          sortByElement.innerText = item.nextSibling.innerText;
        }
      });
    });

    handleClickStarVote();
  }, []);

  const hanleClickConfirmDelete = (id: number) => {
    fetch(`${ApiFeedback.DELETE_FEEDBACK}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
      }
    })
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        if (response.status === 401) {
          window.location.href = `/authen/login`;
          window.sessionStorage.setItem('prePath', window.location.pathname);
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: json.data,
          });
          setFeedback(null);
          (document.querySelector('#comment') as any).value = '';
          setStarRating(1);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.errors.map((error: any) => error.message).join(', '),
          });
        }
      })
      .catch((error) => console.log(error));
  }

  const hanleClickDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        hanleClickConfirmDelete(id);
      }
    });
  }

  const handleClickSubmit = (isUpdate: boolean) => {
    const url = isUpdate ? `${ApiFeedback.UPDATE_FEEDBACK}/${feedback?.id}` : ApiFeedback.CREATE_NEW_FEEDBACK;
    const method = isUpdate ? 'PUT' : 'POST';

    fetch(url, {
      method,
      body: JSON.stringify({
        comment: (document.querySelector('#comment') as any).value,
        star: +[...document.querySelectorAll('input[name="star"]') as any].find((item: any) => item.checked)?.value,
        orderId: method === 'POST' ? order?.id : undefined,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
      }
    })
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        if (response.status === 401) {
          window.location.href = `/authen/login`;
          window.sessionStorage.setItem('prePath', window.location.pathname);
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: json.data.message,
          });
          setFeedback(json.data.feedback);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.errors.map((error: any) => error.message).join(', '),
          });
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <OrderDetailAndFeedbackModalGroup
        orderIdRef={orderIdRef}
        order={order}
        feedback={feedback}
        handleClickStarVote={handleClickStarVote}
        hanldeClickReview={hanldeClickReview}
        handleClickSubmit={handleClickSubmit}
        hanleClickDelete={hanleClickDelete}
      />

      <h2 className="mb-4 text-3xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">History order</h2>
      {
        isValidErrorRef.current ? <AlertError errors={errors} /> :
          <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-8 mt-4 mb-8">
              <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between py-4">
                <div>
                  <button
                    id="dropdownRadioButton"
                    data-dropdown-toggle="dropdownRadio"
                    className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    type="button"
                  >
                    <svg
                      className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                      <span>Most recent</span>
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
                    id="dropdownRadio"
                    className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                    data-popper-reference-hidden=""
                    data-popper-escaped=""
                    data-popper-placement="top"
                    style={{
                      position: "absolute",
                      inset: "auto auto 0px 0px",
                      margin: 0,
                      transform: "translate3d(522.5px, 3847.5px, 0px)"
                    }}
                  >
                    <ul
                      className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownRadioButton"
                    >
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id="filter-radio-example-1"
                            type="radio"
                            name="sort-by"
                            value="desc"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            defaultChecked
                          />
                          <label
                            htmlFor="filter-radio-example-1"
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            Most recent
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id="filter-radio-example-2"
                            type="radio"
                            name="sort-by"
                            value="asc"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="filter-radio-example-2"
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            Longest
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="flex relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="code-or-hair-style"
                      className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter order code or hair style"
                    />
                  </div>
                  <button
                    type="button"
                    className="ml-3 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={handleFilter}
                  >
                    Search
                  </button>
                </div>
              </div>

              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Hair Style
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Color
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Order time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Payment type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (response as any)?.data?.map((order: any, idx: number) => (
                      <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4">{ (+filterValue?.page - 1) * (+filterValue?.items) + idx + 1 }</td>
                        <td className="px-6 py-4">{`BBSOD${order?.id}`}</td>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {order?.hairStyle}
                        </th>
                        <td className="px-6 py-4" style={{ color: order?.hairColor?.colorCode || ColorMaper['NORMAL'] }}>{order?.hairColor?.color ? capitalize(order?.hairColor?.color) : 'Normal'}</td>
                        <td className="px-6 py-4">{order?.orderTime}</td>
                        <td className="px-6 py-4">{order?.paymentType}</td>
                        <td className="px-6 py-4">{`${Number(order?.amount)} đ`}</td>
                        <td className="px-6 py-4">
                          <span
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                            onClick={async() => {
                              hanldClickViewOrderDetail(order?.id);
                              await sleep(500);
                              (document.querySelector('#toggle-order-detail-modal') as any)?.click();
                            }}
                          >
                            View
                          </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
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
    </>
  );
}
