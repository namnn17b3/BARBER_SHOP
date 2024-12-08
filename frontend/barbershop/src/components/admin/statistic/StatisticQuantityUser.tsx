'use client';

import { ApiUser } from "@/common/constant/api-url.constant";
import { setCookie } from "@/common/utils/utils";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { DateFormatType } from "@/common/constant/date-format.constant";
import { TimeZone } from "@/common/constant/timezone.constant";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat as any);
dayjs.extend(utc as any);
dayjs.extend(timezone as any);

export default function StatisticQuantityUser() {
  const [quantity, setQuantity] = useState<any>(null);

  useEffect(() => {
    const now = dayjs.tz(new Date(), DateFormatType.YYYY_MM_DD, TimeZone.ASIA_HCM).format(DateFormatType.YYYY_MM_DD);
    const year = now.split('-')[0];
    const month = now.split('-')[1];

    fetch(`${ApiUser.ADMIN_STATISTIC_QUANTITY}?year=${year}&month=${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`,
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
          setQuantity(json.data);
        } else if (json.status === 401) {
          setCookie('prePath', window.location.pathname);
          window.location.href = '/authen/login';
          console.log(json);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: json.errors.map((item: any) => `${item.field}: ${item.message}`).join(', '),
          })
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="rounded-lg dark:border-gray-600 h-32 md:h-32">
      <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="w-ful">
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Users</h3>
          <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{quantity ? Number(quantity?.quantityCurrent).toLocaleString('vi') : 0}</span>
          <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
            {
              quantity && quantity.quantityCurrent - quantity.quantityPrevious >= 0 ?
              <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"></path>
                </svg>
                {quantity ? Number(Math.abs(quantity.quantityCurrent - quantity.quantityPrevious).toLocaleString('vi')) : 0}
              </span> :
              quantity && quantity.quantityCurrent - quantity.quantityPrevious < 0 ?
              <span className="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"></path>
                </svg>
                {quantity ? Number(Math.abs(quantity.quantityCurrent - quantity.quantityPrevious).toLocaleString('vi')) : 0}
              </span>
              : ''
            }
            Since last month
          </p>
        </div>
      </div>
    </div>
  );
}
