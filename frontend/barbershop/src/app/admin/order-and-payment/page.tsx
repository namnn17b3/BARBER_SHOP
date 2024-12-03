'use client';

import { ApiFeedback, ApiOrder } from "@/common/constant/api-url.constant";
import { ColorMaper } from "@/common/constant/color.constant";
import { DateFormatType } from "@/common/constant/date-format.constant";
import { TimeZone } from "@/common/constant/timezone.constant";
import { capitalize, sleep, toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import NoResult from "@/components/NoResult";
import OrderDetailAndFeedbackModalGroup from "@/components/OrderDetailAndFeedbackModalGroup";
import Pagination from "@/components/Pagination";
import dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

dayjs.extend(customParseFormat as any);
dayjs.extend(utc as any);
dayjs.extend(timezone as any);


export default function OrderAndPaymentPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);

  const isValidErrorRef: any = useRef();

  const defaultRange = () => {
    return dayjs(new Date()).tz(TimeZone.ASIA_HCM).format(DateFormatType.YYYY_MM_DD);
  }

  const [filterValue, setFilterValue] = useState({
    sortBy: searchParams.get('sortBy') || 'desc',
    page: searchParams.get('page') || 1,
    keyword: searchParams.get('keyword') || undefined,
    range: searchParams.get('range') || `${defaultRange()},${defaultRange()}`,
    items: 9,
  });

  const bindingSortbyAndKeyword = () => {
    const sortByElement: any = document.querySelector('#dropdownRadioButton span');
    const sortByInputs: any = document.querySelectorAll('input[name="sort-by"]');
    const startDateInput: any = document.querySelector('#start-date');
    const endDateInput: any = document.querySelector('#end-date');

    sortByInputs.forEach((item: any) => {
      if (item.value === filterValue.sortBy) {
        item.checked = true;
        const startDateString = filterValue.range.split(',')[0];
        const endDateString = filterValue.range.split(',')[1];
        if (new Date(startDateString).toString() === 'Invalid Date' || new Date(endDateString).toString() === 'Invalid Date') {
          return;
        }
        startDateInput.value = startDateString;
        endDateInput.value = endDateString;
        sortByElement.innerText = startDateString !== endDateString
          ? `from ${startDateString} to ${endDateString}: ${item.nextSibling.innerText}`
          : `${startDateString}: ${item.nextSibling.innerText}`;
      }
    });
    (document.querySelector('#keyword') as any).value = filterValue.keyword || '';
  }

  useEffect(() => {
    const url = `${ApiOrder.GET_ORDER_AND_PAYMENT_FOR_ADMIN}?${toQueryString(filterValue)}`;
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
    const sortByElement: any = document.querySelector('#dropdownRadioButton span');
    const sortByInputs: any = document.querySelectorAll('input[name="sort-by"]');
    const startDateInput: any = document.querySelector('#start-date');
    const endDateInput: any = document.querySelector('#end-date');

    const keyword = (document.querySelector('#keyword') as any).value;
    let sortBy = 'desc';
    sortByInputs.forEach((item: any) => {
      if (item.checked) {
        sortBy = item.value;
        if (startDateInput.value && endDateInput.value) {
          sortByElement.innerText = startDateInput.value !== endDateInput.value
            ? `from ${startDateInput.value} to ${endDateInput.value}: ${item.nextSibling.innerText}`
            : `${startDateInput.value}: ${item.nextSibling.innerText}`;
        }
      }
    });

    const newFilterValue = {
      ...filterValue,
      page: 1,
      keyword: keyword?.trim() || null,
      sortBy,
      range: `${startDateInput.value},${endDateInput.value}`,
    }
    router.push(`?${toQueryString(newFilterValue)}`);
    setFilterValue(newFilterValue as any);
  }

  const handlePageChange = (page: number) => {
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
          (document.querySelector('#comment') as any).value = json.data.comment;
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
    const inputStars: any = document.querySelectorAll('input[name="star"]');
    inputStars.forEach((item: any, idx: number) => {
      if (idx + 1 === star) {
        item.checked = true;
      }
    });

    handleClickStarVote();
  }

  const listTableRowDropdown = useRef<any>([]);
  useEffect(() => {
    while (listTableRowDropdown.current.length) {
      listTableRowDropdown.current.pop();
    }
    for (let i = 0; i < filterValue.items; i++) {
      const dropdown = document.querySelector(`#wapper-table-row-dropdown-${i + 1}`);
      document.querySelector(`#mark-cutted-${i + 1}`)?.classList.add('hidden');
      listTableRowDropdown.current.push(dropdown);
    }
    bindingSortbyAndKeyword();
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

  const handleClickPreview = async (i: number) => {
    const orderId = +(document.getElementById(`action-${i}`)?.getAttribute('data-order-id') as any);
    hanldClickViewOrderDetail(orderId);
    await sleep(500);
    (document.querySelector('#toggle-order-detail-modal') as any)?.click();
    (document.body.lastElementChild as any).setAttribute('style', 'z-index:400');
  }

  const makeCutted = (i: number) => {
    const order = (response as any)?.data?.[i];
    const markCuttedElement = document.querySelector(`#mark-cutted-${i + 1}`);

    fetch(`${ApiOrder.MARK_CUTTED}/${order?.id}`, {
      method: 'PUT',
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
          Swal.fire({
            title: "Success",
            text: json.data.message,
            icon: "success"
          });
          markCuttedElement?.classList.add('hidden');
        } else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.errors.map((item: any) => item.message).join(', '),
          });
        }
      })
      .catch((error) => console.log(error));
  }

  const handleMarkCutted = (i: number) => {
    Swal.fire({
      title: "Are you sure mark cutted?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK"
    }).then((result) => {
      if (result.isConfirmed) {
        makeCutted(i);
      }
    });
  }

  useEffect(() => {
    if (!(response as any)?.data?.length) return;
    for (let i = 0; i < filterValue.items; i++) {
      const fc = listTableRowDropdown.current[i];
      const dropdownParent: any = document.getElementById(`action-${i}`);
      if (dropdownParent) {
        const order = (response as any)?.data?.[i];
        const markCuttedElement = document.querySelector(`#mark-cutted-${i + 1}`);
        if (order?.cutted) {
          markCuttedElement?.classList.add('hidden');
        } else {
          markCuttedElement?.classList.remove('hidden');
        }
        dropdownParent.appendChild(fc);
      }
    }
  }, [response]);

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
        isAdmin={true}
      />

      <div className="table-row-dropdown hidden">
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx: number) => (
            <div id={`wapper-table-row-dropdown-${idx}`} key={idx}>
              <button
                id={`table-row-dropdown-button-${idx}`}
                data-dropdown-toggle={`table-row-dropdown-${idx}`}
                className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
              <div
                id={`table-row-dropdown-${idx}`}
                className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 hidden"
                data-popper-placement="bottom"
              >
                <ul
                  className="py-1 text-sm"
                  aria-labelledby={`table-row-dropdown-button-${idx}`}
                >
                  <li onClick={() => handleClickPreview(idx - 1)}>
                    <button
                      type="button"
                      className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Preview
                    </button>
                  </li>
                  <li id={`mark-cutted-${idx}`} onClick={() => handleMarkCutted(idx - 1)}>
                    <button
                      type="button"
                      className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        />
                      </svg>
                      Mark cutted
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))
        }
      </div>

      <div className="mb-4 col-span-full xl:mb-2">
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
            <li className="inline-flex items-center">
              <a href="/admin" className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                Dashboard
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500" aria-current="page">Order and payment</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Manage order and payment</h1>
      </div>
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
          >
            <ul
              className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownRadioButton"
            >
              <span className="text-gray-900 rounded dark:text-gray-300">Range:</span>
              <li>
                <div className="my-3 flex justify-center items-center">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>

                    <input
                      id="start-date"
                      datepicker-format="yyyy-mm-dd"
                      // datepicker
                      type="date"
                      className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Start date"
                      defaultValue={defaultRange()}
                    />
                  </div>
                </div>
                <div className="my-3 flex justify-center items-center">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>

                    <input
                      id="end-date"
                      datepicker-format="yyyy-mm-dd"
                      // datepicker
                      type="date"
                      className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="End date"
                      defaultValue={defaultRange()}
                    />
                  </div>
                </div>
              </li>
              <span className="text-gray-900 rounded dark:text-gray-300">Sort by:</span>
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
              id="keyword"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter keyword (order code, hair style, username, email)"
              title="Enter keyword (order code, hair style, username, email)"
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

      {
        isValidErrorRef.current ? <AlertError errors={errors} /> :
          <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4 mb-8">
              {
                (response as any)?.data?.length ? (
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
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Username
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
                            <td className="px-6 py-4">{(+filterValue?.page - 1) * (+filterValue?.items) + idx + 1}</td>
                            <td className="px-6 py-4">{`BBSOD${order?.id}`}</td>
                            <td className="px-6 py-4">{order?.user.email}</td>
                            <td className="px-6 py-4">{order?.user.username}</td>
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
                            <td className="px-6 py-4" id={`action-${idx}`} data-order-id={order?.id}></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : ''
              }

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

