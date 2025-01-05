'use client';

import { ApiUser } from "@/common/constant/api-url.constant";
import AlertError from "@/components/alert/AlertError";
import { useAuthen } from "@/hooks/user.authen";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function UserProfilePage() {
  const { authenState, authenDispatch } = useAuthen();

  const isValidErrorUserProfileRef: any = useRef<any>();
  const isValidErrorChangePasswordRef: any = useRef<any>();
  const isCLickRemoveAvatarRef: any = useRef<any>();

  const [errors, setErrors] = useState([]);

  const handleUpdateProfile = () => {
    const username = (document.querySelector('#username') as HTMLInputElement).value;
    const phone = (document.querySelector('#phone') as HTMLInputElement).value;
    const address = (document.querySelector('#address') as HTMLInputElement).value;
    const gender = [...(document.querySelectorAll('input[name="gender"]') as any)].filter((item: any) => item.checked)?.[0].value || 'MALE';
    const avatar = (document.querySelector('#file-upload') as any);

    const formdata = new FormData();
    formdata.append("username", username);
    formdata.append("phone", phone);
    formdata.append("address", address);
    formdata.append("gender", gender);

    if (avatar.value) {
      formdata.append("avatar", avatar.files[0]);
      isCLickRemoveAvatarRef.current = false;
    } else if (isCLickRemoveAvatarRef.current) {
      formdata.append("avatar", new File([], ""));
    }

    fetch(ApiUser.UPDATE_PROFILE, {
      method: 'PUT',
      body: formdata,
      headers: {
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
          authenDispatch({ type: 'UPDATE_PROFILE', payload: json.data });
          isValidErrorUserProfileRef.current = false;

          (document.querySelector('#username-dropdown-avatar-option') as HTMLInputElement).innerText = json.data.username;
          (document.querySelector('#avatarButton') as HTMLInputElement).src = json.data.avatar || '/img/fb-no-img.png';

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Update profile successfully',
          });
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', `${window.location.pathname}${window.location.search.toString()}`);
          window.location.href = `/authen/login`;
        } else {
          setErrors(json.errors);
          isValidErrorUserProfileRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }

  const handleChangePassword = () => {
    const oldPassword = (document.querySelector('#old-password') as HTMLInputElement).value;
    const newPassword = (document.querySelector('#new-password') as HTMLInputElement).value;
    const confirmPassword = (document.querySelector('#confirm-password') as HTMLInputElement).value;

    fetch(ApiUser.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify({
        oldPassword,
        newPassword,
        confirmPassword,
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
        return response.json();
      })
      .then((json) => {
        if (json.data) {
          setErrors([]);
          isValidErrorChangePasswordRef.current = false;
          (document.querySelector('#old-password') as HTMLInputElement).value = '';
          (document.querySelector('#new-password') as HTMLInputElement).value = '';
          (document.querySelector('#confirm-password') as HTMLInputElement).value = '';

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: json.data.message,
          });
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', `${window.location.pathname}${window.location.search.toString()}`);
          window.location.href = `/authen/login`;
        } else {
          setErrors(json.errors);
          isValidErrorChangePasswordRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    (document.querySelectorAll('input[name="gender"]') as any).forEach((item: any) => {
      if (item.value.toLowerCase() === authenState?.gender) {
        item.checked = true;
      }
    });
  }, [authenState]);

  return (
    <>
      <div className="p-8 md:p-8 bg-white rounded-lg shadow dark:bg-gray-700 w-1/2 md:inset-0 h-[calc(100%-1rem)] max-h-full">
        {
          isValidErrorUserProfileRef.current && <AlertError errors={errors} />
        }
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Your profile
        </h1>
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
              defaultValue={authenState?.username}
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
              disabled
              readOnly
              defaultValue={authenState?.email}
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
              defaultValue={authenState?.phone}
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
              defaultValue={authenState?.address}
            />
          </div>
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
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleUpdateProfile}
        >
          Submit
        </button>
      </div>
      <div className="mt-6 p-8 md:p-8 bg-white rounded-lg shadow dark:bg-gray-700 w-1/2 md:inset-0 h-[calc(100%-1rem)] max-h-full">
        {
          isValidErrorChangePasswordRef.current && <AlertError errors={errors} />
        }
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Change your password
        </h1>
        <div className="mt-6 mb-6">
          <label
            htmlFor="old-password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Old password
          </label>
          <input
            type="password"
            id="old-password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            required
          />
        </div>
        <div className="mb-6">
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
        <div className="mb-6">
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleChangePassword}
        >
          Submit
        </button>
      </div>

    </>
  );
}
