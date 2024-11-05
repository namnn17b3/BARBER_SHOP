import { capitalize, generateTimeSlots } from '@/common/utils/utils';
import { Modal } from '@/components/modal/Modal';

export default function OrderModalGroup(props: any) {
  const {
    hairColorInputs,
    hairColorIdRef,
    timeInputRef,
    hanldeClickNextStep,
    orderInfo,
    paymentTypeInputRef,
    hanlePaymentClick,
  } = props;
  const timeSlots = generateTimeSlots();

  return (
    <>
      <button
        data-modal-target="datetime-modal"
        data-modal-toggle="datetime-modal"
        type="button"
        className="hidden"
        id="toggle-datetime-modal"
      >
        Toggle Date Time Modal<div role="status" className="flex">
          <svg aria-hidden="true" className="m-auto w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </button>

      <button
        data-modal-target="order-info-modal"
        data-modal-toggle="order-info-modal"
        data-modal-hide="datetime-modal"
        type="button"
        className="hidden"
        id="toggle-order-info-modal"
      >
        Toggle Order Info Modal
      </button>

      <Modal id="datetime-modal" title="Choose date time and hair color">
        <div>
          <div className="pt-5 pb-10 border-t border-gray-200 dark:border-gray-800 flex sm:flex-row flex-col sm:space-x-5 rtl:space-x-reverse">
            <div
              suppressHydrationWarning
              className="inline-datepicker text-white mx-auto sm:mx-0"
              style={{ marginLeft: 'auto' }}
            >
              abc
            </div>
            <div className="sm:ms-7 sm:ps-5 sm:border-s border-gray-200 dark:border-gray-800 w-full sm:max-w-[15rem] mt-5 sm:mt-0" style={{ marginRight: 'auto' }}>
              <button
                type="button"
                className="inline-flex items-center w-full py-2 px-5 me-2 justify-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className="w-4 h-4 text-gray-800 dark:text-white me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clipRule="evenodd"
                  />
                </svg>
                Pick a time
              </button>
              <label className="sr-only">Pick a time</label>
              <ul id="timetable" className="grid max-h-80 overflow-y-auto w-full grid-cols-2 gap-2 mt-5 pr-3">
                {
                  timeSlots.map((time, index) => (
                    <li key={index}>
                      <input
                        type="radio"
                        id={`time-${time.replace(':', '-')}`}
                        defaultValue=""
                        className="hidden peer"
                        name="timetable"
                      />
                      <label
                        htmlFor={`time-${time.replace(':', '-')}`}
                        className="label-time-input inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white hover:bg-blue-500 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500"
                        onClick={() => { timeInputRef.current = time; }}
                      >
                        {time}
                      </label>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>

          <h3 className="mb-4 font-semibold text-center text-gray-900 dark:text-white">Hair color</h3>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {
              hairColorInputs?.map((hairColor: any, idx: number) => {
                if (idx === 0) {
                  hairColorIdRef.current = hairColor.id;
                }
                return (
                  <li key={idx} className={idx < hairColorInputs?.length - 1 ? 'w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600' : 'w-full dark:border-gray-600'}>
                    <div className="flex items-center ps-3">
                      <input
                        id={hairColor.color}
                        type="radio"
                        defaultValue=""
                        name="hair-color-input"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        onClick={() => { hairColorIdRef.current = hairColor.id }}
                        defaultChecked={idx === 0}
                        value={`${hairColor.id}`}
                      />
                      <label
                        htmlFor={hairColor.color}
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        style={{ color: hairColor.colorCode }}
                      >
                        {hairColor.color && capitalize(hairColor.color)}
                      </label>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={hanldeClickNextStep}
          >
            Next step
          </button>
          <button data-modal-hide="datetime-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
        </div>
      </Modal>

      <Modal id="order-info-modal" title="Order info">
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-5">
          <div className="mx-auto max-w-2xl px-4 2xl:px-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
              Thanks for your order!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
              We support two types of online payment via VNPAY and MOMO. After successful payment, check your account registered email to see order information.
            </p>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 mb-8">
              <div className="h-56 w-full">
                <a>
                  <img
                    className="mx-auto h-full dark:hidden"
                    src={orderInfo?.barber?.avatar}
                    alt=""
                  />
                  <img
                    className="mx-auto hidden h-full dark:block"
                    src={orderInfo?.barber?.avatar}
                    alt=""
                  />
                </a>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Barber:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {orderInfo?.barber?.name}
                </dd>
              </dl>
            </div>

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Username:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {orderInfo?.user?.username}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Email:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {orderInfo?.user?.email}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Phone number:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {orderInfo?.user?.phone}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Address:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {orderInfo?.user?.address}
                </dd>
              </dl>
            </div>

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Hair style:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {orderInfo?.hairStyle?.name}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Price:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {Number(orderInfo?.hairStyle?.price).toLocaleString('vi')} đ
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Discount:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {Number(orderInfo?.hairStyle?.discount?.value).toLocaleString('vi')} {orderInfo?.hairStyle?.discount?.unit === '%' ? '%' : 'đ'}
                </dd>
              </dl>
            </div>

            {
              orderInfo?.hairColor && (
                <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
                  <dl className="sm:flex items-center justify-between gap-4">
                    <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                      Hair color:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white sm:text-end" style={{ color: orderInfo?.hairColor?.colorCode }}>
                      {orderInfo?.hairColor?.color && capitalize(orderInfo?.hairColor?.color)}
                    </dd>
                  </dl>
                  <dl className="sm:flex items-center justify-between gap-4">
                    <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                      Price:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                      {Number(orderInfo?.hairColor?.price).toLocaleString('vi')} đ
                    </dd>
                  </dl>
                </div>)
            }

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Amount:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {Number(orderInfo?.amount).toLocaleString('vi')} đ
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Payment type:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  <button
                    id="payment-type"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    data-dropdown-toggle="payment-type-dropdown"
                    defaultValue="VNPAY"
                  >
                    VNPAY
                  </button>
                  <div
                    id="payment-type-dropdown"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    aria-hidden
                  >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="payment-type">
                      {
                        ['VNPAY', 'MOMO'].map((item, index) => (    
                          <li key={index} className="cursor-pointer" onClick={() => {
                            paymentTypeInputRef.current = item;
                            (document.querySelector('#payment-type') as any).innerText = item;
                          }}>
                            <span className="block px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </section>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            data-modal-target="datetime-modal"
            data-modal-toggle="datetime-modal"
            data-modal-hide="order-info-modal"
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Back step
          </button>
          <button
            type="button"
            className="py-2.5 px-5 ms-3 text-sm focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={hanlePaymentClick}
          >
            Payment
          </button>
        </div>
      </Modal>
      <script src="/js/hair-style.js"></script>
    </>
  );
}
