'use client';

import { ApiHairColor } from "@/common/constant/api-url.constant";
import { ColorMaper } from "@/common/constant/color.constant";
import { capitalize, clearModalInput, toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import ListHairColorImageShow from "@/components/ListHairColorImageShow";
import { Modal } from "@/components/modal/Modal";
import NoResult from "@/components/NoResult";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function HairColorAdminPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setResponse] = useState({});
  const [errors, setErrors] = useState([]);
  const [modalErrors, setModalErrors] = useState([]);

  const isValidErrorRef: any = useRef();
  const isCLickRemoveAvatarRef: any = useRef<any>(false);

  const colorImageIdRef: any = useRef<any>(0);

  const [filterValue, setFilterValue] = useState({
    keywords: searchParams.get('keywords'),
    page: searchParams.get('page') || 1,
    items: 9,
  });

  const bindingQueryParams = () => {
    const keywordInput: any = document.querySelector('#keyword');
    keywordInput.value = filterValue.keywords || '';
  }

  const listTableRowDropdown = useRef<any>([]);
  useEffect(() => {
    while (listTableRowDropdown.current.length) {
      listTableRowDropdown.current.pop();
    }
    for (let i = 0; i < filterValue.items; i++) {
      const dropdown = document.querySelector(`#wapper-table-row-dropdown-${i + 1}`);
      listTableRowDropdown.current.push(dropdown);
    }
    bindingQueryParams();
  }, []);

  useEffect(() => {
    const url = `${ApiHairColor.GET_ALL_COLOR_FOR_ADMIN}?${toQueryString(filterValue)}`;
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
          setResponse(json);
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

  useEffect(() => {
    if (!(response as any)?.data?.length) return;
    for (let i = 0; i < filterValue.items; i++) {
      const fc = listTableRowDropdown.current[i];
      const dropdownParent: any = document.getElementById(`action-${i}`);
      if (dropdownParent) {
        dropdownParent.appendChild(fc);
      }
    }
  }, [response]);

  const handlePageChange = (page: number) => {
    setFilterValue({
      ...filterValue,
      page,
    });
  }

  const handleFilter = () => {
    const keyword = (document.querySelector('#keyword') as any).value;

    const newFilterValue = {
      ...filterValue,
      keyword,
      page: 1,
    }
    router.push(`?${toQueryString(newFilterValue)}`);
    setFilterValue(newFilterValue as any);
  }

  const methodRef = useRef<any>('POST');

  const handleOpenModalHairColor = (i: number, method: string) => {
    (document.querySelector('#toggle-submit-modal') as any)?.click();
    (document.body.lastElementChild as any).setAttribute('style', 'z-index:400');
    setModalErrors([]);

    methodRef.current = method;
    if (method === 'POST') {
      clearModalInput(document.querySelector('#submit-modal'));
      isCLickRemoveAvatarRef.current = false;
      return;
    }

    const hairColorFromResponse = (response as any)?.data?.[i];

    const url = `${ApiHairColor.GET_DETAIL_COLOR_FOR_ADMIN}/${hairColorFromResponse?.id}`;
    fetch(url, {
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
          (document.querySelector('#color-input') as any).value = json.data.color;
          (document.querySelector('#color-code-input') as any).value = json.data.colorCode;
          (document.querySelector('#color-code-preview-input') as any).value = json.data.colorCode;
          (document.querySelector('#price-input') as any).value = json.data.price;
          (document.querySelector('#status-input') as any).value = json.data.active;
          setHairColor(json.data);
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error has occurred',
          });
        }
      })
      .catch((error) => console.log(error));
  }

  const handleSubmitHairColor = () => {
    const url = `${ApiHairColor.ADMIN_SAVE_COLOR}${methodRef.current === 'PUT' ? `/${hairColor?.id}` : ''}`;

    const color = (document.querySelector('#color-input') as any).value;
    const colorCode = (document.querySelector('#color-code-input') as any).value;
    const price = (document.querySelector('#price-input') as any).value;
    const active = (document.querySelector('#status-input') as any).value;

    fetch(url, {
      method: methodRef.current,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        color,
        colorCode,
        price,
        active,
      }),
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
            icon: 'success',
            title: 'Success',
            text: methodRef.current === 'PUT' ? 'Update barber successfully' : 'Create barber successfully',
          }).then((result) => {
            window.location.reload();
          });
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          setModalErrors(json.errors);
        }
      })
      .catch((error) => console.log(error));
  }

  const handleOpenModalColorImage = (method: string) => {
    (document.querySelector('#toggle-submit-color-image-modal') as any)?.click();
    (document.querySelector('#btn-cancel-color-image-modal') as any)?.click();
    (document.body.lastElementChild as any).setAttribute('style', 'z-index:400');
    setModalErrors([]);

    const btnDeleteColorImage = document.querySelector('#btn-delete-color-image');
    methodRef.current = method;
    if (method === 'POST') {
      clearModalInput(document.querySelector('#submit-color-image-modal'));
      isCLickRemoveAvatarRef.current = false;
      btnDeleteColorImage?.classList.add('hidden');
      return;
    }

    btnDeleteColorImage?.classList.remove('hidden');
    const url = `${ApiHairColor.GET_DETAIL_COLOR_IMAGE_FOR_ADMIN}/${colorImageIdRef.current}`;
    fetch(url, {
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
          (document.querySelector('#preview') as any).src = json.data.url;
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error has occurred',
          });
        }
      })
      .catch((error) => console.log(error));
  }

  const handleSubmitColorImage = () => {
    const url = `${ApiHairColor.ADMIN_SAVE_COLOR_IMAGE}${methodRef.current === 'PUT' ? `/${colorImageIdRef.current}` : ''}`;

    const imageInput = (document.querySelector('#file-upload') as any);

    const formdata = new FormData();
    formdata.append("hairColorId", hairColor.id);
    formdata.append("image", imageInput.files[0]);

    fetch(url, {
      method: methodRef.current,
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      },
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
        if (json.data) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: methodRef.current === 'PUT'
              ? `Update color image for ${capitalize(hairColor?.color || ' ')} successfully`
              : `Create color image for ${capitalize(hairColor?.color || ' ')} successfully`,
          }).then((result) => {
            window.location.reload();
          });
        }
        else if (json.status === 401) {
          window.sessionStorage.setItem('prePath', window.location.pathname);
          window.location.href = `/authen/login`;
        } else {
          setModalErrors(json.errors);
        }
      })
      .catch((error) => console.log(error));
  }

  const [hairColor, setHairColor] = useState<any>(null);
  const handleClickColorImages = (i: number) => {
    (document.querySelector('#toggle-color-modal') as any)?.click();
    const hairColor = (response as any)?.data?.[i];
    setHairColor(hairColor);
  }

  const hanleClickConfirmDeleteColorImage = () => {
    const url = `${ApiHairColor.ADMIN_DELETE_COLOR_IMAGE}/${colorImageIdRef.current}`;
    fetch(url, {
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
            text: json.data.message,
          }).then((result) => {
            window.location.reload();
          });;
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

  const handleClickDeleteColorImage = () => {
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
        hanleClickConfirmDeleteColorImage();
      }
    });
  }

  return (
    <>
      <button
        data-modal-target="submit-modal"
        data-modal-toggle="submit-modal"
        type="button"
        className="hidden"
        id="toggle-submit-modal"
      >
        Toggle Model Edit
      </button>

      <button
        data-modal-target="submit-color-image-modal"
        data-modal-toggle="submit-color-image-modal"
        type="button"
        className="hidden"
        id="toggle-submit-color-image-modal"
      >
        Toggle Model Edit Color Image
      </button>

      <button
        data-modal-target="color-image-modal"
        data-modal-toggle="color-image-modal"
        type="button"
        className="hidden"
        id="toggle-color-modal"
      >
        Toggle Model Color Image
      </button>

      <Modal id="submit-modal" title="Hair color">
        <div>
          {
            modalErrors?.length ? <AlertError errors={modalErrors} /> : ''
          }
          <div>
            <div className="grid grid-cols-6 gap-6">
              <div className="mb-6 col-span-6 sm:col-span-3">
                <label
                  htmlFor="color-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Color
                </label>
                <input
                  type="text"
                  name="color-input"
                  id="color-input"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write color"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="color-code-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Color code
                </label>
                <div className="flex">
                  <input
                    type="color"
                    name="color-code-input"
                    id="color-code-input"
                    className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                    placeholder="Write color code"
                    min={18}
                    max={40}
                    required
                    defaultValue="#2563eb"
                    onChange={() => {
                      const colorCode = (document.querySelector('#color-code-input') as any).value;
                      (document.querySelector('#color-code-preview-input') as any).value = colorCode;
                    }}
                  />
                  <input
                    type="text"
                    disabled
                    id="color-code-preview-input"
                    defaultValue="#2563eb"
                    className="shadow-sm ml-4 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="mb-6 col-span-6 sm:col-span-3">
                <label
                  htmlFor="price-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price (VNĐ)
                </label>
                <input
                  type="number"
                  name="price-input"
                  id="price-input"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write price"
                  min={1000}
                  defaultValue={1000}
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="status-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
                <select id="status-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="true" selected>Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSubmitHairColor}
          >
            Submit
          </button>
          <button
            data-modal-hide="submit-modal"
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal title="Color image" id="color-image-modal">
        <ListHairColorImageShow
          hairColor={hairColor}
          handleOpenModalColorImage={handleOpenModalColorImage}
          colorImageIdRef={colorImageIdRef}
        />

        <button
          type="button"
          className="mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          data-modal-hide="color-image-modal"
          id="btn-choose-or-edit-color-image"
          onClick={() => { handleOpenModalColorImage('PUT') }}
        >
          Edit
        </button>
      </Modal>

      <button
        type="button"
        id="btn-cancel-color-image-modal"
        data-modal-hide="color-image-modal"
        className="hidden"
      />

      <Modal id="submit-color-image-modal" title="Color image">
        <div>
          {
            modalErrors?.length ? <AlertError errors={modalErrors} /> : ''
          }
          <>
            <div className="w-full">
              <div className="flex w-full">
                <label
                  htmlFor="color-input-disabled"
                  className="flex mr-3 text-sm font-medium text-gray-900 dark:text-white text-center"
                >
                  <span className="self-center p-2.5">Color</span>
                </label>
                <input
                  type="text"
                  name="color-input-disabled"
                  id="color-input-disabled"
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  style={{ color: hairColor?.colorCode }}
                  defaultValue={capitalize(hairColor?.color || '')}
                />
              </div>
            </div>
            <div className="flex justify-center items-center mt-6">
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
                      className={methodRef.current === 'PUT' ? "hidden" : "hover:underline cursor-pointer"}
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
                  src=''
                  className="mt-4 mx-auto max-h-40 preview-image"
                  id="preview"
                />
              </div>
            </div>
          </>
        </div>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            data-modal-hide="submit-color-image-modal"
            onClick={() => {
              (document.querySelector('#toggle-color-modal') as any).click();
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="py-2.5 px-5 ms-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={handleSubmitColorImage}
          >
            Submit
          </button>
          <button
            type="button"
            id="btn-delete-color-image"
            className="hidden py-2.5 px-5 ms-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={() => {
              handleClickDeleteColorImage();
            }}
          >
            Delete
          </button>
          <button
            data-modal-hide="submit-color-image-modal"
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>

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
                  <li
                    onClick={() => handleClickColorImages(idx - 1)}
                  >
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
                      Color images
                    </button>
                  </li>
                  <li
                    onClick={() => handleOpenModalHairColor(idx - 1, 'PUT')}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                    >
                      <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                        <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                      </svg>
                      Edit
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
                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500" aria-current="page">Hair color</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Manage hair color</h1>
      </div>

      <div className="flex flex-col-reverse sm:flex-row-reverse flex-wrap space-y-4 sm:space-y-0 items-center justify-between py-4">
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
              placeholder="Enter keyword (color or color code)"
              title="Enter keyword (color or color code)"
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
        <div className="flex relative">
          <button
            type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => { handleOpenModalHairColor(0, 'POST') }}
          >
            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
            </svg>
            Add hair color
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
                          Color
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Color code
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        (response as any)?.data?.map((hairColor: any, idx: number) => (
                          <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{(+filterValue?.page - 1) * (+filterValue?.items) + idx + 1}</td>
                            <td className="px-6 py-4" style={{ color: hairColor?.colorCode || ColorMaper['NORMAL'] }}>{capitalize(hairColor?.color || '')}</td>
                            <td className="px-6 py-4">{capitalize(hairColor?.colorCode || '')}</td>
                            <td className="px-6 py-4">{Number(hairColor?.price).toLocaleString('vi')} đ</td>
                            <td className="px-6 py-4">
                              {
                                hairColor?.active === true ?
                                  <div className="flex items-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> Active
                                  </div> :
                                  hairColor?.active === false ?
                                    <div className="flex items-center">
                                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> Inactive
                                    </div> : ''
                              }
                            </td>
                            <td className="px-6 py-4" id={`action-${idx}`} data-block-time-id={hairColor?.id}></td>
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
      <script src="/js/drag-and-rop-image-upload.js" defer></script>
    </>
  );
}
