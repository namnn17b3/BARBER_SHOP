import { useAuthen } from "@/hooks/user.authen";
import React from "react";

export default function FilterFeedback(props: any) {
  const {
    handleFilter,
    minStarInputRef,
    maxStarInputRef,
    startDateInputRef,
    endDateInputRef,
    ascendingRatingInputRef,
    descendingRatingInputRef,
    noneRatingInputRef,
    ascendingDateInputRef,
    descendingDateInputRef,
    noneDateInputRef,
    priorityRatingInputRef,
    priorityDateInputRef,
    priorityNoneInputRef,
    yourFeedbackInputRef,
  } = props;

  const { authenState } = useAuthen();

  return (
    <>
      <div
        id="drawer-example"
        className="fixed top-0 left-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 -translate-x-full"
        tabIndex={-1}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Apply filters
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-example"
          aria-controls="drawer-example"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
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
          <span className="sr-only">Close menu</span>
        </button>
        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-6">
            {/* Price */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Star
              </h6>
              <div className="flex items-center justify-between col-span-2 space-x-3">
                <div className="w-full">
                  <label
                    htmlFor="min-star-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Min
                  </label>
                  <input
                    type="number"
                    id="min-star-input"
                    defaultValue={1}
                    min={1}
                    max={5}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    ref={minStarInputRef}
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="max-star-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Max
                  </label>
                  <input
                    type="number"
                    id="max-star-input"
                    defaultValue={5}
                    min={1}
                    max={5}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    ref={maxStarInputRef}
                  />
                </div>
              </div>
            </div>

            {/* Your Feedback */}
            {
              authenState && (
                <div className="flex items-center">
                  <input id="tv" type="checkbox" value=""
                    ref={yourFeedbackInputRef}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />

                  <label htmlFor="tv" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Your Feedback
                  </label>
                </div>
              )
            }

            {/* Feedback Time */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Feedback Time
              </h6>
              <div id="date-range-picker">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </div>
                  <input
                    id="datepicker-format-start"
                    datepicker-format="yyyy-mm-dd"
                    // datepicker
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select start date"
                    ref={startDateInputRef}
                  />
                </div>
                <span className="mx-4 text-gray-500"></span>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </div>
                  <input
                    id="datepicker-format-end"
                    datepicker-format="yyyy-mm-dd"
                    // datepicker
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select end date"
                    ref={endDateInputRef}
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Rating
              </h6>
              <div className="flex items-center">
                <input
                  id="ascending-rating-input"
                  type="radio"
                  defaultValue=""
                  name="rating"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={ascendingRatingInputRef}
                />
                <label htmlFor="ascending-rating-input" className="flex items-center ml-2">Ascending</label>
              </div>
              <div className="flex items-center">
                <input
                  id="descending-rating-input"
                  type="radio"
                  defaultValue=""
                  name="rating"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={descendingRatingInputRef}
                />
                <label htmlFor="descending-rating-input" className="flex items-center ml-2">Descending</label>
              </div>
              <div className="flex items-center">
                <input
                  id="none-rating-input"
                  type="radio"
                  defaultValue=""
                  name="rating"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked
                  ref={noneRatingInputRef}
                />
                <label htmlFor="none-rating-input" className="flex items-center ml-2">None</label>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Date
              </h6>
              <div className="flex items-center">
                <input
                  id="descending-date-input"
                  type="radio"
                  defaultValue=""
                  name="date"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={descendingDateInputRef}
                />
                <label htmlFor="descending-date-input" className="flex items-center ml-2">Most recent</label>
              </div>
              <div className="flex items-center">
                <input
                  id="ascending-date-input"
                  type="radio"
                  defaultValue=""
                  name="date"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={ascendingDateInputRef}
                />
                <label htmlFor="ascending-date-input" className="flex items-center ml-2">Latest</label>
              </div>
              <div className="flex items-center">
                <input
                  id="none-date-input"
                  type="radio"
                  defaultValue=""
                  name="date"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked
                  ref={noneDateInputRef}
                />
                <label htmlFor="none-date-input" className="flex items-center ml-2">None</label>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Priority
              </h6>
              <div className="flex items-center">
                <input
                  id="priority-rating-input"
                  type="radio"
                  defaultValue=""
                  name="priority"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={priorityRatingInputRef}
                />
                <label htmlFor="priority-rating-input" className="flex items-center ml-2">Rating</label>
              </div>
              <div className="flex items-center">
                <input
                  id="priority-date-input"
                  type="radio"
                  defaultValue=""
                  name="priority"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={priorityDateInputRef}
                />
                <label htmlFor="priority-date-input" className="flex items-center ml-2">Date</label>
              </div>
              <div className="flex items-center">
                <input
                  id="priority-none-input"
                  type="radio"
                  defaultValue=""
                  name="priority"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked
                  ref={priorityNoneInputRef}
                />
                <label htmlFor="priority-none-input" className="flex items-center ml-2">None</label>
              </div>
            </div>
          </div>
          <div className="bottom-0 left-0 flex justify-center w-full pb-4 mt-6 space-x-4 md:px-4 md:absolute">
            <button
              type="button"
              className="w-full px-5 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
              onClick={handleFilter}
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>

      <script src="/js/hair-style.js"></script>
    </>
  );
}
