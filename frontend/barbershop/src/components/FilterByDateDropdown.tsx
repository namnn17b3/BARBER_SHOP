export default function FilterByDateDropdown(props: any) {
  const { idToggle, isShowChartOption, year, month, handleView } = props;

  const setDisplay = (element: any, display: string) => {
    if (display === "hidden") {
      element.classList.add("hidden");
    } else {
      element.classList.remove("hidden");
    }
  }

  return (
    <div
      className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 hidden"
      id={idToggle}
      data-popper-placement="bottom"
    >
      <ul className="py-1 w-64" role="none">
        <li>
          <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
            <input
              onClick={() => {
                setDisplay(document.querySelector(`.month-input-group-${idToggle}`), "block");
                setDisplay(document.querySelector(`.year-input-group-${idToggle}`), "hidden");
                setDisplay(document.querySelector(`.range-input-group-${idToggle}`), "hidden");
              }}
              id={`filter-by-month-${idToggle}`} defaultChecked type="radio" value="month" name={`filter-${idToggle}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor={`filter-by-month-${idToggle}`} className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Month</label>
          </div>
          <div className={`month-input-group-${idToggle}`}>
            <div className="mx-4 my-2 flex justify-center items-center">
              <input defaultValue={year} type="number" id={`year1-${idToggle}`} aria-describedby="helper-text-explanation" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a year" required />
            </div>
            <div className="mx-4 my-2 flex justify-center items-center">
              <input defaultValue={month} type="number" id={`month-${idToggle}`} aria-describedby="helper-text-explanation" className="border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a month of year" required min={1} max={12} />
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
            <input
              onClick={() => {
                setDisplay(document.querySelector(`.month-input-group-${idToggle}`), "hidden");
                setDisplay(document.querySelector(`.year-input-group-${idToggle}`), "block");
                setDisplay(document.querySelector(`.range-input-group-${idToggle}`), "hidden");
              }}
              id={`filter-by-year-${idToggle}`} type="radio" value="year" name={`filter-${idToggle}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor={`filter-by-year-${idToggle}`} className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Year</label>
          </div>
          <div className={`year-input-group-${idToggle} hidden`}>
            <div className="mx-4 my-2 flex justify-center items-center">
              <input type="number" id={`year2-${idToggle}`} aria-describedby="helper-text-explanation" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a year" required />
            </div>
          </div>
        </li>
        <li>
          <div className="range-div flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
            <input
              onClick={() => {
                setDisplay(document.querySelector(`.month-input-group-${idToggle}`), "hidden");
                setDisplay(document.querySelector(`.year-input-group-${idToggle}`), "hidden");
                setDisplay(document.querySelector(`.range-input-group-${idToggle}`), "block");
              }}
              id={`filter-by-range-${idToggle}`} type="radio" value="range" name={`filter-${idToggle}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor={`filter-by-range-${idToggle}`} className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Range</label>
          </div>
          <div className={`hidden range-input-group-${idToggle}`}>
            <div className="mx-4 my-2 flex justify-center items-center">
              <div className="relative w-5/6">
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
                  id={`start-date-${idToggle}`}
                  datepicker-format="yyyy-mm-dd"
                  // datepicker
                  type="date"
                  className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Start date"
                />
              </div>
            </div>
            <div className="mx-4 my-2 flex justify-center items-center">
              <div className="relative w-5/6">
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
                  id={`end-date-${idToggle}`}
                  datepicker-format="yyyy-mm-dd"
                  // datepicker
                  type="date"
                  className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
        </li>
        <div className={`${isShowChartOption ? "" : "hidden"} chart-input-group-${idToggle}`}>
          <h6 className="px-4 pt-2 text-base font-medium text-black dark:text-white">
            Chart options:
          </h6>
          <li>
            <div className="flex items-center px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
              <input
                defaultChecked
                id={`line-chart-${idToggle}`} type="radio" value="line" name={`chart-${idToggle}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={`line-chart-${idToggle}`} className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Line chart</label>
            </div>
          </li>
          <li>
            <div className="flex items-center px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
              <input
                id={`circle-chart-${idToggle}`} type="radio" value="circle" name={`chart-${idToggle}`} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={`circle-chart-${idToggle}`} className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Circle chart</label>
            </div>
          </li>
        </div>
      </ul>
      <div className="p-2 flex justify-center items-center">
        <button
          onClick={handleView}
          id={`btn-view-${idToggle}`}
          type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
        >
          View
        </button>
      </div>
    </div>
  );
}
