'use client';

import { ApiPayment } from "@/common/constant/api-url.constant";
import { DateFormatType } from "@/common/constant/date-format.constant";
import { TimeZone } from "@/common/constant/timezone.constant";
import { setCookie } from "@/common/utils/utils";
import FilterByDateDropdown from "@/components/FilterByDateDropdown";
import dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { useEffect } from "react";
import Swal from "sweetalert2";

dayjs.extend(customParseFormat as any);
dayjs.extend(utc as any);
dayjs.extend(timezone as any);


export function StatisticRevenue(props: any) {
  const now = dayjs.tz(new Date(), DateFormatType.YYYY_MM_DD, TimeZone.ASIA_HCM).format(DateFormatType.YYYY_MM_DD);
  const year1 = now.split('-')[0];
  const month = now.split('-')[1];

  const idToggle = 'stats-dropdown-chart';

  const fetchData = (filter: string, value: string) => {
    fetch(`${ApiPayment.ADMIN_STATISTIC_REVENUES}?filter=${filter}&value=${value}`, {
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
      .then(async (json) => {
        if (json.data) {
          if (filter === 'month') {
            const dayStart = +json?.data?.revenues?.[json?.data?.revenues?.length - 1].date.split('-')?.[2] + 1;
            if (dayStart) {
              for (let i = dayStart; i <= 31; i++) {
                if (new Date(`${year1}-${month}-${i > 9 ? i : `0${i}`}`).toString() !== 'Invalid Date') {
                  json.data.revenues.push({
                    date: `${year1}-${month}-${i > 9 ? i : `0${i}`}`,
                    totalAmount: 0,
                  });
                }
              }
            }
          }
          (document.querySelector('#api-data-chart') as any).innerText = JSON.stringify(json.data.revenues);
          (document.querySelector('#revenue-chart-title') as any).innerText = 'Revenue chart ' +
            (filter === 'month' || filter == 'year' ?
              `in ${value}` :
              `from ${value.split(',')[0].trim()} to ${value.split(',')[1].trim()}`);
          const totalRevenue = json.data.revenues.reduce((total: number, item: any) => total + item.totalAmount, 0);
          (document.querySelector('#total-revenue') as any).innerText = `${Number(totalRevenue).toLocaleString('vi')} đ`;
          const successEvent = new CustomEvent('apiStatisticRevenueStatus', {
            detail: { status: 'success' },
          });
          document.dispatchEvent(successEvent);
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
      filter,
      value,
    }
  }

  const handleView = () => {
    const queryParams = initQueryParams();
    fetchData(queryParams.filter, queryParams.value);
  }

  useEffect(() => {
    fetchData('month', `${year1}-${month}`);
  }, []);

  return (
    <div className="h-auto mb-4 w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="hidden" id="api-data-chart"></div>
      <div className="flex justify-between mb-5">
        <div className="grid gap-4 grid-cols-2">
          <div>
            <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
              Total revenue
            </h5>
            <p id="total-revenue" className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
              0 đ
            </p>
          </div>
        </div>
        <div>
          <button
            data-dropdown-toggle="stats-dropdown-chart"
            id="stats-dropdown-chart-btn"
            data-popper-placement="bottom"
            type="button"
            className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Filter{" "}
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

          <FilterByDateDropdown
            idToggle={idToggle}
            year={year1}
            month={month}
            handleView={handleView}
            isShowChartOption={true}
          />
        </div>
      </div>
      <h3 id="revenue-chart-title" className="text-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Revenue chart in {year1}-{month}
      </h3>
      <div id="inline-chart" />
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-2.5" />
    </div>
  );
}
