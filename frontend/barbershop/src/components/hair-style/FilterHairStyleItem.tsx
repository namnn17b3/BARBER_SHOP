export default function FilterHairStyleItem(props: any) {
  const {
    nameInputRef,
    priceMinInputRef,
    priceMaxInputRef,
    descendingRatingInputRef,
    ascendingRatingInputRef,
    noneRatingInputRef,
    ascendingBookingInputRef,
    descendingBookingInputRef,
    noneBookingInputRef,
    ratingPriorityInputRef,
    bookingPriorityInputRef,
    nonePriorityInputRef,
    handleFilter,
  } = props;
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
            {/* Name */}
            <div className="max-w-md mx-auto">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search Hair Style Name"
                  required
                  ref={nameInputRef}
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Price
              </h6>
              <div className="flex items-center justify-between col-span-2 space-x-3">
                <div className="w-full">
                  <label
                    htmlFor="min-price-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Min (đ)
                  </label>
                  <input
                    type="number"
                    id="min-price-input"
                    defaultValue={100000}
                    min={100000}
                    max={300000}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    required
                    ref={priceMinInputRef}
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="max-price-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Max (đ)
                  </label>
                  <input
                    type="number"
                    id="max-price-input"
                    defaultValue={300000}
                    min={100000}
                    max={300000}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                    required
                    ref={priceMaxInputRef}
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
                  onChange={() => {}}
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
                  onChange={() => {}}
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
                  onChange={() => {}}
                />
                <label htmlFor="none-rating-input" className="flex items-center ml-2">None</label>
              </div>
            </div>

            {/* Booking */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black dark:text-white">
                Booking
              </h6>
              <div className="flex items-center">
                <input
                  id="ascending-booking-input"
                  type="radio"
                  defaultValue=""
                  name="booking"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={ascendingBookingInputRef}
                  onChange={() => {}}
                />
                <label htmlFor="ascending-booking-input" className="flex items-center ml-2">Ascending</label>
              </div>
              <div className="flex items-center">
                <input
                  id="descending-booking-input"
                  type="radio"
                  defaultValue=""
                  name="booking"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={descendingBookingInputRef}
                  onChange={() => {}}
                />
                <label htmlFor="descending-booking-input" className="flex items-center ml-2">Descending</label>
              </div>
              <div className="flex items-center">
                <input
                  id="none-booking-input"
                  type="radio"
                  defaultValue=""
                  name="booking"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked
                  ref={noneBookingInputRef}
                  onChange={() => {}}
                />
                <label htmlFor="none-booking-input" className="flex items-center ml-2">None</label>
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
                  ref={ratingPriorityInputRef}
                  onChange={() => {}}
                />
                <label htmlFor="priority-rating-input" className="flex items-center ml-2">Rating</label>
              </div>
              <div className="flex items-center">
                <input
                  id="priority-booking-input"
                  type="radio"
                  defaultValue=""
                  name="priority"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  ref={bookingPriorityInputRef}
                  onChange={() => {}}
                />
                <label htmlFor="priority-booking-input" className="flex items-center ml-2">Booking</label>
              </div>
              <div className="flex items-center">
                <input
                  id="priority-none-input"
                  type="radio"
                  defaultValue=""
                  name="priority"
                  className="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  defaultChecked
                  ref={nonePriorityInputRef}
                  onChange={() => {}}
                />
                <label htmlFor="priority-none-input" className="flex items-center ml-2">None</label>
              </div>
            </div>
          </div>
          <div className="bottom-0 left-0 flex justify-center w-full pb-4 mt-6 space-x-4 md:px-4 md:absolute">
            <button
              type="submit"
              className="w-full px-5 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
              onClick={() => handleFilter()}
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
