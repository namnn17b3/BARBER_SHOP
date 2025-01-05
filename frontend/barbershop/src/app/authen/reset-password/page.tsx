'use client';

import { ApiUser } from "@/common/constant/api-url.constant";
import AlertError from "@/components/alert/AlertError";
import { useAuthen } from "@/hooks/user.authen";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ForgotPasswordPage() {
  const { authenState, authenDispatch } = useAuthen();

  const isValidErrorRef: any = useRef<any>();
  const [errors, setErrors] = useState<any>([]);

  useEffect(() => {
    if (authenState) {
      window.location.href = window.sessionStorage.getItem('prePath') || '/';
    }
  }, [authenState]);

  useEffect(() => {
    fetch(`${ApiUser.VERIFY_RESET_PASSWORD_TOKEN}?token=${encodeURIComponent(new URLSearchParams(window.location.search).get('token') as any)}`)
      .then(response => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then(json => {
        if (json.data) {
          if (json.data.code !== 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: json.data.message,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = '/authen/login';
              }
            });
          }
          isValidErrorRef.current = false;
        } else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch(error => {
        console.log(error);
      })
  });

  const handleResetPassword = () => {
    const token = decodeURIComponent(new URLSearchParams(window.location.search).get('token') as any);
    const newPassword = (document.querySelector('#new-password') as HTMLInputElement).value;
    const confirmPassword = (document.querySelector('#confirm-password') as HTMLInputElement).value;

    fetch(ApiUser.RESET_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword,
      }),
      headers: {
        "Content-Type": "application/json",
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
        const data = json.data;
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Reset your password successfully',
          }).then((result) => {
            window.location.href = '/authen/login';
          });
          isValidErrorRef.current = false;
        } else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900" style={{ backgroundImage: 'url("/img/bg-login.jpg")', minHeight: '80vh' }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot your account
            </h1>
            {
              isValidErrorRef.current && <AlertError errors={errors} />
            }
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="new-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New password
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="•••••••••"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="•••••••••"
                  required
                />
              </div>
              <button
                type="button"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleResetPassword}
              >
                Submit
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Do you already have an account?{" "}
                <a
                  href="/authen/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
