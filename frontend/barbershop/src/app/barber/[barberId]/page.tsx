'use client';

import { ApiBarber } from "@/common/constant/api-url.constant";
import { capitalize } from "@/common/utils/utils";
import { useEffect, useState } from "react";

export default function BarberDetailPage(props: any) {
  const [barber, setBarber] = useState({});
  useEffect(() => {
    fetch(`${ApiBarber.GET_DETAIL}/${props.params.barberId}`)
      .then((res) => res.json())
      .then((json) => setBarber(json.data));
  }, []);

  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16 p-10 rounded border-4 border-red-400">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <img
              className="w-full dark:hidden"
              src={(barber as any).img}
              alt=""
            />
            <img
              className="w-full hidden dark:block"
              src={(barber as any).img}
              alt=""
            />
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {(barber as any).name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <div className="flex items-center gap-2 mt-2 sm:mt-0">                 
                <p className="text-xl font-medium leading-none text-gray-500 dark:text-gray-400">
                  <i className="fa-solid fa-user"></i> Age: {(barber as any).age}
                </p>
              </div>
              |
              <div className="flex items-center gap-2 mt-2 sm:mt-0">                 
                <p className="text-xl font-medium leading-none text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-venus-mars"></i> Gender: {capitalize((barber as any).gender || '')}
                </p>
              </div>
            </div>
            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {(barber as any).description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
