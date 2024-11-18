'use client';

import { ApiPayment } from "@/common/constant/api-url.constant";
import { DateFormatType } from "@/common/constant/date-format.constant";
import { TimeZone } from "@/common/constant/timezone.constant";
import { camelToSentenceCase, exportExcel, setCookie } from "@/common/utils/utils";
import FilterByDateDropdown from "@/components/FilterByDateDropdown";
import dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

dayjs.extend(customParseFormat as any);
dayjs.extend(utc as any);
dayjs.extend(timezone as any);

export default function StatisticTopItem() {
  const now = dayjs.tz(new Date(), DateFormatType.YYYY_MM_DD, TimeZone.ASIA_HCM).format(DateFormatType.YYYY_MM_DD);
  const year1 = now.split('-')[0];
  const month = now.split('-')[1];

  const idToggle = 'stats-dropdown';

  const [data, setData] = useState<any>(null);

  const fetchData = (item: string, filter: string, value: string) => {
    fetch(`${ApiPayment.ADMIN_STATISTIC_TOP_ITEM}?item=${item}&filter=${filter}&value=${value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
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
          setData(json.data);
        } else if (json.status === 401) {
          setCookie('prePath', window.location.pathname);
          window.location.href = '/authen/login';
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.errors.map((error: any) => error.message).join(', '),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const initQueryParams = () => {
    const item = [...(document.querySelectorAll('input[name="item"]') as any)].find((item: any) => item.checked).value;
    const filter = [...(document.querySelectorAll(`input[name="filter-${idToggle}"]`) as any)].find((item: any) => item.checked).value;
    let value = `${year1}-${month}`;

    if (filter === 'month') {
      const year = (document.querySelector(`#year1-${idToggle}`) as any).value;
      const month = (document.querySelector(`#month-${idToggle}`) as any).value;
      value = `${year}-${month}`;
    } else if (filter === 'year') {
      const year = (document.querySelector(`#year2-${idToggle}`) as any).value;
      value = `${year}`;
    } else if (filter === 'range') {
      const startDate = (document.querySelector(`#start-date-${idToggle}`) as any).value;
      const endDate = (document.querySelector(`#end-date-${idToggle}`) as any).value;
      value = `${startDate},${endDate}`;
    }

    return {
      item,
      filter,
      value,
    }
  }

  const handleView = () => {
    const queryParams = initQueryParams();
    fetchData(queryParams.item, queryParams.filter, queryParams.value);
  }

  const handleExportExcel = async() => {
    let dataTransform = null;
    
    if (data?.hairStyles) {
      dataTransform = data.hairStyles.map((item: any) => ({
        ...item,
        img: {
          isImage: true,
          url: item.img,
        },
      }));
    } else if (data?.users) {
      dataTransform = data.users.map((item: any) => ({
        ...item,
        avatar: {
          isImage: true,
          url: item.avatar ? item.avatar : `${window.location.origin}/img/fb-no-img.png`,
        },
      }));
    }

    const columns = Object.entries(dataTransform[0]).map(([key, value]) => ({
      header: camelToSentenceCase(key),
      key,
      width: (value as any).isImage ? 40 : 10,
      height: (value as any).isImage ? 40 : 10,
    }));

    await exportExcel(dataTransform, columns);
  }

  useEffect(() => {
    fetchData('hair_style', 'month', `${year1}-${month}`);
  }, []);

  return (
    <div className="rounded-lg border-gray-300 dark:border-gray-600 mb-4">
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Statistics top 10 items
        </h3>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select tab
          </label>
          <select
            id="tabs"
            className="bg-gray-50 border-0 border-b border-gray-200 text-gray-900 text-sm rounded-t-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option>Statistics</option>
            <option>Services</option>
            <option>FAQ</option>
          </select>
        </div>
        <ul
          className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400"
          id="fullWidthTab"
          data-tabs-toggle="#fullWidthTabContent"
          role="tablist"
        >
          <li className="w-full">
            <button
              id="faq-tab"
              data-tabs-target="#faq"
              type="button"
              role="tab"
              aria-controls="faq"
              aria-selected="true"
              className="inline-block w-full p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500"
              defaultChecked
              onClick={() => {
                (document.querySelector('#hair-style-tab') as any).click();
                handleView();
              }}
            >
              Top hair styles
            </button>
            <input
              defaultChecked
              className="hidden" id="hair-style-tab" type="radio" name="item" value="hair_style"
            />
          </li>
          <li className="w-full">
            <button
              id="about-tab"
              data-tabs-target="#about"
              type="button"
              role="tab"
              aria-controls="about"
              aria-selected="false"
              className="inline-block w-full p-4 rounded-tr-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"
              onClick={() => {
                (document.querySelector('#user-tab') as any).click();
                handleView();
              }}
            >
              Top users
            </button>
            <input
              className="hidden" id="user-tab" type="radio" name="item" value="user"
            />
          </li>
        </ul>
        <div
          id="fullWidthTabContent"
          className="border-t border-gray-200 dark:border-gray-600"
        >
        {
          <div className="pt-4" id="faq" role="tabpanel" aria-labelledby="faq-tab">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {
                data?.hairStyles?.map((item: any, idx: number) => (
                  <li key={idx} className="py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <img
                          className="flex-shrink-0 w-10 h-10"
                          src={item.img}
                          alt="imac image"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 truncate dark:text-white">
                            {item.name}
                          </p>
                        </div>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {Number(item.totalAmount).toLocaleString('vi')} đ
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        }
        {
          <div
            className="pt-4 hidden"
            id="about"
            role="tabpanel"
            aria-labelledby="about-tab"
          >
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              {
                data?.users?.map((item: any, idx: number) => (
                  <li key={idx} className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={item.avatar || '/img/fb-no-img.png'}
                          alt="Neil image"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate dark:text-white">
                          {item.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {item.email}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {Number(item.totalAmount).toLocaleString('vi')} đ
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        }
        </div>
        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 mt-5 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
          <div>
            <button
              className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              type="button"
              data-dropdown-toggle="stats-dropdown"
            >
              Filter
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            <FilterByDateDropdown
              idToggle={idToggle}
              year={year1}
              month={month}
              handleView={handleView}
            />
          </div>
          <div className="flex-shrink-0"
            onClick={handleExportExcel}
          >
            <span
              className="cursor-pointer inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
            >
              EXPORT EXCEL
            </span>
          </div>
        </div>
      </div>
      <script src="/js/hair-style.js"></script>
    </div>
  );
}
