import { FEED_BACK_DURATION } from "@/common/constant/feedback.constant";
import { capitalize, sleep } from "@/common/utils/utils";
import { Modal } from "@/components/modal/Modal";
import React from "react";

export default function OrderDetailAndFeedbackModalGroup(props: any) {
  const {
    order,
    feedback,
    handleClickStarVote,
    hanldeClickReview,
    handleClickSubmit,
    hanleClickDelete,
    isAdmin,
  } = props;

  let isDisplaySubmitButton = true;
  const now = Date.now();
  const schedule = new Date(order?.schedule).getTime();
  if (!order?.cutted || now < schedule || now > schedule + FEED_BACK_DURATION) {
    isDisplaySubmitButton = false;
  }

  return (
    <>
      <button
        data-modal-target="order-detail-modal"
        data-modal-toggle="order-detail-modal"
        type="button"
        className="hidden"
        id="toggle-order-detail-modal"
      >
        Toggle Order Detail Modal
      </button>

      <button
        data-modal-target="review-modal"
        data-modal-toggle="review-modal"
        type="button"
        className="hidden"
        id="toggle-review-modal"
      >
        Toggle Review Modal
      </button>

      <Modal title="Order Detail" id="order-detail-modal">
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-5">
          <div className="mx-auto max-w-2xl px-4 2xl:px-0">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 mb-8">
              <div className="h-56 w-full">
                <a>
                  <img
                    className="mx-auto h-full dark:hidden"
                    src={order?.barber?.avatar}
                    alt=""
                  />
                  <img
                    className="mx-auto hidden h-full dark:block"
                    src={order?.barber?.avatar}
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
                  {order?.barber?.name}
                </dd>
              </dl>
            </div>

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Username:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.user?.username}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Email:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.user?.email}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Phone number:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.user?.phone}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Address:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.user?.address}
                </dd>
              </dl>
            </div>

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Hair style:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.hairStyle?.name}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Price:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {Number(order?.hairStyle?.price).toLocaleString('vi')} đ
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Discount:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {Number(order?.hairStyle?.discount?.value).toLocaleString('vi')} {order?.hairStyle?.discount?.unit === '%' ? '%' : 'đ'}
                </dd>
              </dl>
            </div>

            {
              order?.hairColor && (
                <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
                  <dl className="sm:flex items-center justify-between gap-4">
                    <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                      Hair color:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white sm:text-end" style={{ color: order?.hairColor?.colorCode }}>
                      {order?.hairColor?.color && capitalize(order?.hairColor?.color)}
                    </dd>
                  </dl>
                  <dl className="sm:flex items-center justify-between gap-4">
                    <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                      Price:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                      {Number(order?.hairColor?.price).toLocaleString('vi')} đ
                    </dd>
                  </dl>
                </div>)
            }

            <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Order code:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  BBSOD{order?.id}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Order time:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.orderTime}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Schedule:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.schedule}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Cutted:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.cutted ? 'Yes' : 'No'}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Amount:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {Number(order?.amount).toLocaleString('vi')} đ
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Status:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end" style={{ color: '#28a745'}}>
                  {order?.status}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Bank code:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.bankCode}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Bank tran no:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {order?.bankTranNo}
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
                    disabled
                  >
                    {order?.paymentType}
                  </button>
                </dd>
              </dl>
            </div>
          </div>
        </section>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            data-modal-hide="order-detail-modal"
            onClick={async () => {
              hanldeClickReview(order?.id);
              await sleep(300);
              (document.querySelector('#toggle-review-modal') as any).click();
            }}
          >
            Review
          </button>
          <button
            data-modal-hide="order-detail-modal"
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal title="Review" id="review-modal">
        <section className="bg-white dark:bg-gray-900 py-8 lg:py-8 antialiased">
          <div className="max-w-2xl mx-auto px-4">
            {
              isAdmin ? '' : 
              <div className="p-4 mb-8 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                <span className="font-medium">Note!</span> You can only rate the service within 3 days of your use.
              </div>
            }

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                {isAdmin ? "Comment and rating" : "Enter your comment"}
              </h2>
            </div>
            
            <div className="flex items-center mb-4">
              {
                [1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    <input
                      type="radio"
                      name="star"
                      className="hidden"
                      id={`star-${star}`}
                      defaultValue={star}
                      defaultChecked={(feedback == null && star === 1) || star <= feedback?.star}
                      onClick={handleClickStarVote}
                      disabled={isAdmin || !isDisplaySubmitButton}
                    />
                    <label htmlFor={`star-${star}`} className={!isAdmin && isDisplaySubmitButton ? `cursor-pointer` : ''}>
                      <svg
                        className={(feedback == null && star === 1) || star <= feedback?.star ? "w-8 h-8 ms-3 text-yellow-300" : "w-8 h-8 ms-3 text-gray-300 dark:text-gray-500"}
                        // className="w-8 h-8 ms-3 text-gray-300 dark:text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    </label>
                  </span>
                ))
              }
            </div>

            <div>
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows={6}
                className="py-2 w-full px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={isAdmin ? "No comment..." : "Write a comment..."}
                required
                disabled={isAdmin || !isDisplaySubmitButton}
                defaultValue={feedback?.comment || ''}
              />
            </div>

            <div className={`${feedback?.comment ? '' : 'hidden'} mb-5 text-sm text-gray-500 dark:text-gray-400`}>
              <p>Reviewed at {feedback?.time}</p>
            </div>
          </div>
        </section>

        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            data-modal-hide="review-modal"
            onClick={() => {
              (document.querySelector('#toggle-order-detail-modal') as any).click();
            }}
          >
            Back
          </button>
          {
            !isAdmin && isDisplaySubmitButton &&
            <button
              type="button"
              className="py-2.5 px-5 ms-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => {
                handleClickSubmit(isDisplaySubmitButton && feedback);
              }}
            >
              Submit
            </button>
          }
          {
            !isAdmin && isDisplaySubmitButton && feedback &&
            <button
              type="button"
              className="py-2.5 px-5 ms-3 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => {
                hanleClickDelete(feedback?.id);
              }}
            >
              Delete
            </button>
          }
          <button
            data-modal-hide="review-modal"
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
