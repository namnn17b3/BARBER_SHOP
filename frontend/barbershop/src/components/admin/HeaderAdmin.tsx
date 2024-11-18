'use client';

import { ApiUser } from "@/common/constant/api-url.constant";
import { Role } from "@/common/enums/role.enum";
import { deleteCookie } from "@/common/utils/utils";
import { useAuthen } from "@/hooks/user.authen";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderAdmin(props: any) {
  const { authenDispatch, authenState } = useAuthen();

  const pathname = usePathname();
  const pathForUserLogin = (process.env.NEXT_PUBLIC_URL_FOR_USER_LOGIN as any).split(',');
  const [user, setUser] = useState<any>(0);

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
            '/authen/forgot-password',
            '/authen/reset-password',
            ].includes(pathname) &&
            pathForUserLogin.includes(pathname)) {
            window.location.href = `/authen/login`;
          }
          return;
        }
        authenDispatch({ type: 'ME',  payload: json.data});
        setUser(json.data);
      })
      .catch((error) => {
        setUser(1);
        console.log(error);
      });
  }, []);

  const handleSignOut = () => {
    fetch(`${ApiUser.LOGOUT}?token=${encodeURIComponent(window.localStorage.getItem('token') as any)}`)
      .then(response => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();;
      })
      .then(json => {
        authenDispatch({ type: 'LOGOUT', payload: null })
        deleteCookie('token');
        window.localStorage.removeItem('token');
        window.location.href = '/';
      })
      .catch(error => console.log(error));
  }

  return (

    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0" style={{ backgroundColor: '#b97a57', zIndex: 100 }}>
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            data-drawer-target="drawer-navigation"
            data-drawer-toggle="drawer-navigation"
            aria-controls="drawer-navigation"
            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              aria-hidden="true"
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>
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
        </div>
        <div className="flex items-center lg:order-2">
          <button
            type="button"
            className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="dropdown"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={user?.avatar || '/img/fb-no-img.png'}
              alt="user photo"
            />
          </button>
          {/* Dropdown menu */}
          <div
            className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
            id="dropdown"
          >
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div id="username-dropdown-avatar-option">{user?.username}</div>
              <div className="font-medium truncate">{user?.email}</div>
            </div>
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="avatarButton"
            >
              {authenState?.role === Role.ADMIN &&
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
              }
              <li>
                <a
                  href="/user-profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="/history-order"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  History order
                </a>
              </li>
            </ul>
            <div className="py-1">
              <div
                onClick={handleSignOut}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
