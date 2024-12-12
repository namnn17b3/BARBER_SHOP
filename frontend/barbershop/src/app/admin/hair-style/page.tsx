'use client';

import { ApiHairStyle } from "@/common/constant/api-url.constant";
import { clearModalInput, toQueryString } from "@/common/utils/utils";
import AlertError from "@/components/alert/AlertError";
import { Modal } from "@/components/modal/Modal";
import NoResult from "@/components/NoResult";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function HairStyleAdminPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setResponse] = useState({});
  const [errors, setErrors] = useState([]);
  const [modalErrors, setModalErrors] = useState([]);

  const isValidErrorRef: any = useRef();
  const isCLickRemoveAvatarRef: any = useRef<any>(false);

  const [filterValue, setFilterValue] = useState({
    name: searchParams.get('name'),
    priceMin: searchParams.get('ageMin'),
    priceMax: searchParams.get('ageMax'),
    sorting: searchParams.get('sorting'),
    active: searchParams.get('active')?.length ?
      searchParams.get('active') ? 'true' : 'false'
      : '',
    page: searchParams.get('page') || 1,
    items: 9,
  });

  const bindingQueryParams = () => {
    const searchHairStyleNameInput: any = document.querySelector('#search-hair-style-name');
    const searchHairStylePriceMinInput: any = document.querySelector('#min-price-input');
    const searchHairStylePriceMaxInput: any = document.querySelector('#max-price-input');

    searchHairStyleNameInput.value = filterValue.name || '';
    searchHairStylePriceMinInput.value = filterValue.priceMin || '100000';
    searchHairStylePriceMaxInput.value = filterValue.priceMax || '300000';

    const sorting = filterValue?.sorting?.split(',');
    const rating = sorting?.[0]?.split(':')?.[1];
    const booking = sorting?.[1]?.split(':')?.[1];
    const priority = sorting?.[2]?.split(':')?.[1];

    (document.querySelector('#rating-none-input') as any).checked = true;
    [...(document.querySelectorAll('input[name="rating"]') as any)].forEach(item => {
      if (item.value.toLowerCase() === rating?.toLowerCase()) {
        item.checked = true;
      }
    });

    (document.querySelector('#booking-none-input') as any).checked = true;
    [...(document.querySelectorAll('input[name="booking"]') as any)].forEach(item => {
      if (item.value.toLowerCase() === booking?.toLowerCase()) {
        item.checked = true;
      }
    });

    (document.querySelector('#priority-none-input') as any).checked = true;
    [...(document.querySelectorAll('input[name="priority"]') as any)].forEach(item => {
      if (item.value.toLowerCase() === priority?.toLowerCase()) {
        item.checked = true;
      }
    });

    (document.querySelector('#all-status-input') as any).checked = true;
    [...(document.querySelectorAll('input[name="status"]') as any)].forEach(item => {
      if (item.value.toLowerCase() === filterValue.active?.toLowerCase()) {
        item.checked = true;
      }
    });
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
    const url = `${ApiHairStyle.GET_ALL}?${toQueryString(filterValue)}`;
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
    const name = (document.querySelector('#search-hair-style-name') as any).value;
    const priceMin = (document.querySelector('#min-price-input') as any).value;
    const priceMax = (document.querySelector('#max-price-input') as any).value;

    let rating = '';
    [...(document.querySelectorAll('input[name="rating"]') as any)].forEach(item => {
      if (item.checked === true) {
        rating = item.value;
      }
    });

    let booking = '';
    [...(document.querySelectorAll('input[name="booking"]') as any)].forEach(item => {
      if (item.checked === true) {
        booking = item.value;
      }
    });

    let priority = '';
    [...(document.querySelectorAll('input[name="priority"]') as any)].forEach(item => {
      if (item.checked === true) {
        priority = item.value;
      }
    });

    const sorting = `rating:${rating},booking:${booking},priority:${priority}`;

    let active = '';
    [...(document.querySelectorAll('input[name="status"]') as any)].forEach(item => {
      if (item.checked === true) {
        active = item.value;
      }
    });

    if (active === 'all') active = '';

    const newFilterValue = {
      ...filterValue,
      page: 1,
      name,
      priceMin,
      priceMax,
      sorting,
      active,
    }
    router.push(`?${toQueryString(newFilterValue)}`);
    setFilterValue(newFilterValue as any);
  }

  const methodRef = useRef<any>('POST');
  const hairStyleIdRef = useRef<any>(0);

  const handleOpenModal = (i: number, method: string) => {
    (document.querySelector('#toggle-submit-modal') as any)?.click();
    (document.body.lastElementChild as any).setAttribute('style', 'z-index:400');
    setModalErrors([]);

    methodRef.current = method;
    if (method === 'POST') {
      const toggleDiscountInputGroup: any = document.querySelector('#toggle-discount-input-group');
      const discountInputGroup: any = document.querySelector('#discount-input-group');
      if (toggleDiscountInputGroup.checked) {
        discountInputGroup.classList.add('hidden');
        discountInputGroup.classList.remove('grid');
        toggleDiscountInputGroup.checked = false;
      }
      clearModalInput(document.querySelector('#submit-modal'));
      isCLickRemoveAvatarRef.current = false;
      return;
    }

    let hairStyle = (response as any)?.data?.[i];
    hairStyleIdRef.current = hairStyle?.id;

    const url = `${ApiHairStyle.GET_DETAIL}/${hairStyle?.id}`;
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
          (document.querySelector('#name-input') as any).value = json.data.name;
          (document.querySelector('#price-input') as any).value = json.data.price;
          (document.querySelector('#status-input') as any).value = json.data.active;
          (document.querySelector('#description-input') as any).value = json.data.description;
          (document.querySelector('#discount-value-input') as any).value = json.data?.discount?.value || '';
          (document.querySelector('#discount-unit-input') as any).value = json.data?.discount?.unit || '';
          const toggleDiscountInputGroup = document.querySelector('#toggle-discount-input-group') as any;
          if (json.data.discount) {
            toggleDiscountInputGroup.checked = true;
          } else {
            toggleDiscountInputGroup.checked = false;
          }
          const discountInputGroup: any = document.querySelector('#discount-input-group');
          if (toggleDiscountInputGroup.checked) {
            discountInputGroup.classList.remove('hidden');
            discountInputGroup.classList.add('grid');
          } else {
            discountInputGroup.classList.add('hidden');
            discountInputGroup.classList.remove('grid');
          }
          for (let i = 1; i <= 5; i++) {
            (document.querySelector(`#preview-${i}`) as any).src = json.data.imgs.find((item: any) => item.id === i)?.url || '';
            (document.querySelector(`#show-image-${i}`) as any).innerText = json.data.imgs.find((item: any) => item.id === i)?.url ? 'true' : 'false';
          }
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

  const handleSubmit = () => {
    const url = `${ApiHairStyle.ADMIN_SAVE_HAIR_STYLE}${methodRef.current === 'PUT' ? `/${hairStyleIdRef.current}` : ''}`;

    const name = (document.querySelector('#name-input') as any).value;
    const price = (document.querySelector('#price-input') as any).value;
    const active = (document.querySelector('#status-input') as any).value;
    const description = (document.querySelector('#description-input') as any).value;
    const isDiscount = (document.querySelector('#toggle-discount-input-group') as any).checked;
    const discountValue = (document.querySelector('#discount-value-input') as any).value;
    const discountUnit = (document.querySelector('#discount-unit-input') as any).value;
    const fileUploads = [];
    for (let i = 1; i <= 5; i++) {
      fileUploads.push(document.querySelector(`#file-upload-${i}`));
    }

    const formdata = new FormData();
    const fileRequire: any = {};
    formdata.append("name", name);
    formdata.append("price", price);
    formdata.append("description", description);
    formdata.append("active", active);
    formdata.append("isDiscount", isDiscount ? 'true' : 'false');
    formdata.append("discount", JSON.stringify({
      value: discountValue,
      unit: discountUnit,
    }));
    for (let i = 1; i <= 5; i++) {
      const fileUpload = fileUploads[i - 1];
      formdata.append(`img${i}`, fileUpload.files[0]);
      const showImage: any = document.querySelector(`#show-image-${i}`);
      if (fileUpload.files[0]) {
        showImage.innerText = 'true';
      }
      fileRequire[`img${i}`] = showImage.innerText === 'true' ? true : false;
    }
    formdata.append("fileRequire", JSON.stringify(fileRequire));

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
            text: methodRef.current === 'PUT' ? 'Update hair style successfully' : 'Create hair style successfully',
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

      <Modal id="submit-modal" title="Hair style">
        <div>
          <div className="flex justify-center items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <span><span className="font-medium">NOTE:</span> Hair style has obvious face.</span>
          </div>
          {
            modalErrors?.length ? <AlertError errors={modalErrors} /> : ''
          }
          <div>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="name-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name-input"
                  id="name-input"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write hair style name"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="price-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price-input"
                  id="price-input"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write price"
                  min={100000}
                  max={300000}
                  defaultValue={100000}
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

              <label className="inline-flex items-center cursor-pointer">
                <input id="toggle-discount-input-group" type="checkbox" defaultValue="false" className="sr-only peer" defaultChecked={false}
                  onClick={() => {
                    const toggleDiscountInputGroup: any = document.querySelector('#toggle-discount-input-group');
                    const discountInputGroup: any = document.querySelector('#discount-input-group');
                    if (toggleDiscountInputGroup.checked) {
                      discountInputGroup.classList.remove('hidden');
                      discountInputGroup.classList.add('grid');
                    } else {
                      discountInputGroup.classList.add('hidden');
                      discountInputGroup.classList.remove('grid');
                    }
                  }}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Discount</span>
              </label>

              <div id="discount-input-group" className="col-span-6 hidden grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="discount-value-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Value
                  </label>
                  <input
                    type="number"
                    name="discount-value-input"
                    id="discount-value-input"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write value"
                    min={1}
                    defaultValue={1}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="discount-unit-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Unit
                  </label>
                  <select id="discount-unit-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="%" selected>%</option>
                    <option value="VNĐ">VNĐ</option>
                  </select>
                </div>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="description-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description-input"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Write a description..."
                  style={{ height: 125 }}
                  defaultValue={""}
                />
              </div>
            </div>
            {
              [1, 2, 3, 4, 5].map(idx => (
                <div key={idx} className="flex justify-center items-center mt-6">
                  <div className="w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6" id={`dropzone-${idx}`}>
                    <div className="text-center">
                      <img className="mx-auto h-12 w-12" src="https://www.svgrepo.com/show/357902/image-upload.svg" alt="" />

                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        <label htmlFor={`file-upload-${idx}`} className="relative">
                          <span>Drag and drop </span>
                          <span className="text-indigo-600 hover:underline cursor-pointer">or browse</span>
                          <span> to upload image {idx}</span>
                          <input id={`file-upload-${idx}`} name="file-upload" type="file" className="sr-only" />
                        </label>
                        <div
                          style={{ color: '#dc3545' }}
                          className="hover:underline cursor-pointer"
                          onClick={() => {
                            (document.querySelector(`#file-upload-${idx}`) as any).value = '';
                            (document.querySelector(`#preview-${idx}`) as any).src = '';
                            (document.querySelector(`#show-image-${idx}`) as any).innerText = 'false';
                            isCLickRemoveAvatarRef.current = true;
                          }}
                        >
                          Remove image {idx}
                        </div>
                        <span className="hidden" id={`show-image-${idx}`}>false</span>
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>

                    <img
                      src=''
                      // className={`mt-4 mx-auto max-h-40 ${authenState?.avatar ? '' : 'hidden'}`}
                      className="mt-4 mx-auto max-h-40 preview-image"
                      id={`preview-${idx}`}
                    />
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleSubmit}
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
                    onClick={() => handleOpenModal(idx - 1, 'PUT')}
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
                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500" aria-current="page">Hair style</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Manage hair style</h1>
      </div>

      <div className="flex flex-col-reverse sm:flex-row-reverse flex-wrap space-y-4 sm:space-y-0 items-center justify-between py-4">
        <div>
          <button
            data-dropdown-toggle="filter-dropdown"
            id="filter-dropdown-btn"
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
          {/* Dropdown menu */}
          <div
            className="z-50 p-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 hidden"
            id="filter-dropdown"
            data-popper-placement="bottom"
          >
            <div className="flex flex-col justify-between flex-1">
              <div>
                {/* Name */}
                <div className="max-w-md mx-auto">
                  <label
                    htmlFor="search-hair-style-name"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <input type="text" id="search-hair-style-name" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search hair style name" />
                  </div>
                </div>

                {/* Price */}
                <div className="mt-3">
                  <h6 className="text-base font-medium text-black dark:text-white">
                    Price:
                  </h6>
                  <div>
                    <div className="w-full">
                      <label
                        htmlFor="min-price-input"
                        className="block mt-3 mb-3 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Min (đ)
                      </label>
                      <input
                        type="number"
                        id="min-price-input"
                        defaultValue={100000}
                        min={100000}
                        max={300000}
                        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="max-price-input"
                        className="block mt-3 mb-3 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Max (đ)
                      </label>
                      <input
                        type="number"
                        id="max-price-input"
                        defaultValue={300000}
                        min={100000}
                        max={300000}
                        className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Rating */}
                <div className="space-y-2">
                  <h6 className="mt-3 text-base font-medium text-black dark:text-white">
                    Rating:
                  </h6>
                  <div className="flex items-center">
                    <input
                      id="rating-asc-input"
                      type="radio"
                      defaultValue="asc"
                      name="rating"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="rating-asc-input" className="flex items-center ml-2">Ascending</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="rating-desc-input"
                      type="radio"
                      defaultValue="desc"
                      name="rating"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="rating-desc-input" className="flex items-center ml-2">Descending</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="rating-none-input"
                      type="radio"
                      defaultValue="none"
                      name="rating"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="rating-none-input" className="flex items-center ml-2">None</label>
                  </div>
                </div>
                {/* Booking */}
                <div className="space-y-2">
                  <h6 className="mt-3 text-base font-medium text-black dark:text-white">
                    Booking:
                  </h6>
                  <div className="flex items-center">
                    <input
                      id="booking-asc-input"
                      type="radio"
                      defaultValue="asc"
                      name="booking"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="booking-asc-input" className="flex items-center ml-2">Ascending</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="booking-desc-input"
                      type="radio"
                      defaultValue="desc"
                      name="booking"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="booking-desc-input" className="flex items-center ml-2">Descending</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="booking-none-input"
                      type="radio"
                      defaultValue="none"
                      name="booking"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="booking-none-input" className="flex items-center ml-2">None</label>
                  </div>
                </div>
                {/* Priority */}
                <div className="space-y-2">
                  <h6 className="mt-3 text-base font-medium text-black dark:text-white">
                    Priority:
                  </h6>
                  <div className="flex items-center">
                    <input
                      id="priority-rating-input"
                      type="radio"
                      defaultValue="rating"
                      name="priority"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="priority-rating-input" className="flex items-center ml-2">Ascending</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-booking-input"
                      type="radio"
                      defaultValue="booking"
                      name="priority"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="priority-booking-input" className="flex items-center ml-2">Descending</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-none-input"
                      type="radio"
                      defaultValue="none"
                      name="priority"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="priority-none-input" className="flex items-center ml-2">None</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <h6 className="mt-3 text-base font-medium text-black dark:text-white">
                    Status:
                  </h6>
                  <div className="flex items-center">
                    <input
                      id="active-input"
                      type="radio"
                      defaultValue="true"
                      name="status"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="active-input" className="flex items-center ml-2">Active</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="inactive-input"
                      type="radio"
                      defaultValue="false"
                      name="status"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="inactive-input" className="flex items-center ml-2">Inactive</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="all-status-input"
                      type="radio"
                      defaultValue="all"
                      defaultChecked
                      name="status"
                      className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="all-status-input" className="flex items-center ml-2">All status</label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-3 px-5 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
                onClick={() => handleFilter()}
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
        <div className="flex relative">
          <button
            type="button" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => { handleOpenModal(0, 'POST') }}
          >
            <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"></path>
            </svg>
            Add hair style
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
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Booking
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Rating
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
                        (response as any)?.data?.map((hairStyle: any, idx: number) => (
                          <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">{(+filterValue?.page - 1) * (+filterValue?.items) + idx + 1}</td>
                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex items-center mr-3">
                                <img src={hairStyle?.img?.url} alt="iMac Front Image" className="h-8 w-auto mr-3" />
                                {hairStyle?.name}
                              </div>
                            </th>
                            <td className="px-6 py-4">{hairStyle?.price}</td>
                            <td className="px-6 py-4">{hairStyle?.booking || 'No booking'}</td>
                            <td className="px-6 py-4">
                              {
                                hairStyle?.rating ?
                                  <div className="flex items-center">
                                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">{hairStyle?.rating}</span>
                                  </div>
                                  : 'No rating'
                              }
                            </td>
                            <td className="px-6 py-4">
                              {
                                hairStyle?.active === true ?
                                  <div className="flex items-center">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> Active
                                  </div> :
                                  hairStyle?.active === false ?
                                    <div className="flex items-center">
                                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> Inactive
                                    </div> : ''
                              }
                            </td>
                            <td className="px-6 py-4" id={`action-${idx}`} data-block-time-id={hairStyle?.id}></td>
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
      <script src="/js/drag-and-rop-list-image-upload.js" defer></script>
    </>
  );
}
