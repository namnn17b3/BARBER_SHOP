'use client';

import { ApiUser } from "@/common/constant/api-url.constant";
import { setCookie } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import { useAuthen } from "@/hooks/user.authen";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2"

export default function RegisterPage() {

  const { authenState, authenDispatch } = useAuthen();
  const isValidErrorRef: any = useRef<any>();
  const isCLickRemoveAvatarRef: any = useRef<any>();

  const [errors, setErrors] = useState<any>([]);

  useEffect(() => {
    if (authenState) {
      window.location.href = window.sessionStorage.getItem('prePath') || '/';
    }
  }, [authenState]);

  const hanldeRegister = () => {
    const username = (document.querySelector('#username') as HTMLInputElement).value;
    const email = (document.querySelector('#email') as HTMLInputElement).value;
    const password = (document.querySelector('#password') as HTMLInputElement).value;
    const phone = (document.querySelector('#phone') as HTMLInputElement).value;
    const address = (document.querySelector('#address') as HTMLInputElement).value;
    const gender = [...(document.querySelectorAll('input[name="gender"]') as any)].filter((item: any) => item.checked)?.[0].value || 'MALE';
    const avatar = (document.querySelector('#file-upload') as any);

    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("username", username);
    formdata.append("password", password);
    formdata.append("phone", phone);
    formdata.append("address", address);
    formdata.append("gender", gender);

    if (avatar.value) {
      formdata.append("avatar", avatar.files[0]);
      isCLickRemoveAvatarRef.current = false;
    } else if (isCLickRemoveAvatarRef.current) {
      formdata.append("avatar", new File([], ""));
    }

    fetch(ApiUser.REGISTER, {
      method: 'POST',
      body: formdata,
    })
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        if (json.user) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Register successfully',
          }).then((result) => {
            window.localStorage.setItem('token', json.token);
            authenDispatch({ type: 'REGISTER', payload: json.user });
            setCookie('token', json.token);
          });
          isValidErrorRef.current = false;
        } else if (json.status === 401) {
          setErrors([{
            field: 'email',
            message: json.message,
            resource: 'RegisterRequest'
          }]);
          isValidErrorRef.current = true;
        } else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <section className="pb-40 bg-gray-50 dark:bg-gray-900" style={{ backgroundImage: 'url("/img/bg-login.jpg")', backgroundSize: 'cover' }}>
      <div className="flex flex-col px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mx-auto mt-32 p-8 md:p-8 bg-white rounded-lg shadow dark:bg-gray-700 w-1/2 md:inset-0 max-h-full">
          <h1 className="mb-6 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Register your account
          </h1>
          {
            isValidErrorRef.current && <AlertError errors={errors} />
          }
          <div className="mt-6 grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="john.doe@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-45-678"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Adress"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            />
          </div>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <div
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="male"
                  type="radio"
                  value="MALE"
                  name="gender"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked
                />
                <label htmlFor="male" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
              </div>
              <div className="flex items-center">
                <input
                  id="female"
                  type="radio"
                  value="FEMALE"
                  name="gender"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="female" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mb-6">
            <div className="w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6" id="dropzone">
              <div className="text-center">
                <img className="mx-auto h-12 w-12" src="https://www.svgrepo.com/show/357902/image-upload.svg" alt="" />

                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <label htmlFor="file-upload" className="relative">
                    <span>Drag and drop </span>
                    <span className="text-indigo-600 hover:underline cursor-pointer">or browse</span>
                    <span> to upload avatar</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <div
                    style={{ color: '#dc3545' }}
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      (document.querySelector('#file-upload') as any).value = '';
                      (document.querySelector('#preview') as any).src = '';
                      isCLickRemoveAvatarRef.current = true;
                    }}
                  >
                    Remove avatar
                  </div>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>

              <img
                src={authenState?.avatar || ''}
                className={`mt-4 mx-auto max-h-40 ${authenState?.avatar ? '' : 'hidden'}`}
                id="preview"
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={hanldeRegister}
          >
            Submit
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-6">
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
    </section>
  );
}
