'use client';

import * as dotenv from 'dotenv';
dotenv.config();

import { ApiUser } from "@/common/constant/api-url.constant";
import { NAV_ACTIVE_CLASS, NAV_INACTIVE_CLASS } from "@/common/constant/nav.constant";
import { AvatarShortOption } from "@/components/AvatarShortOption";
import { useAuthen } from "@/hooks/user.authen";
import { usePathname } from 'next/navigation'
import React from "react";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState(0);

  const { authenDispatch } = useAuthen();
  const pathForUserLogin = (process.env.NEXT_PUBLIC_URL_FOR_USER_LOGIN as any).split(',');

  const savePrePath = () => {
    window.sessionStorage.setItem('prePath', window.location.pathname);
  }

  useEffect(() => {
    fetch(`${ApiUser.ME}?token=${encodeURIComponent(window.localStorage.getItem('token') as any)}`)
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.status === 401) {
          setUser(1);
          if (![
              '/authen/login',
              '/authen/register',
              '/authen/forgot-password'
            ].includes(pathname) &&
            pathForUserLogin.includes(pathname)) {
            window.location.href = `/authen/login`;
          }
          return;
        }
        authenDispatch({ type: 'LOGIN',  payload: json.data});
        setUser(json.data);
      })
      .catch((error) => {
        setUser(1);
        console.log(error);
      });
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600" style={{ backgroundColor: '#b97a57' }}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/img/gen_logo.png"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-white text-2xl font-semibold whitespace-nowrap dark:text-white">
            Barber Shop
          </span>
        </a>
        <div className="flex text-white md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse" style={{ backgroundColor: '#b97a57' }}>
          <AvatarShortOption user={user as any} />
          <a href="/authen/login" onClick={savePrePath} style={{ display: user !== 1 ? 'none' : 'block'}}>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
          </a>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700" style={{ backgroundColor: '#b97a57' }}>
            <li>
              <a
                href="/"
                className={pathname === '/' ? NAV_ACTIVE_CLASS : NAV_INACTIVE_CLASS}
                aria-current="page"
                onClick={savePrePath}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/hair-style"
                className={pathname.startsWith('/hair-style') ? NAV_ACTIVE_CLASS : NAV_INACTIVE_CLASS}
                onClick={savePrePath}
              >
                Hair Style
              </a>
            </li>
            <li>
              <a
                href="/hair-color"
                className={pathname.startsWith('/hair-color') ? NAV_ACTIVE_CLASS : NAV_INACTIVE_CLASS}
                onClick={savePrePath}
              >
                Hair Color
              </a>
            </li>
            <li>
              <a
                href="/barber"
                className={pathname.startsWith('/barber') ? NAV_ACTIVE_CLASS : NAV_INACTIVE_CLASS}
                onClick={savePrePath}
              >
                Barber
              </a>
            </li>
          </ul>
        </div>
      </div>
      <script src="/js/pre-path.js" defer></script>
    </nav>
  );
}
