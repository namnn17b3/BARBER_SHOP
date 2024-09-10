import { toQueryString } from "@/common/utils/utils";
import Link from "next/link";

export default function Pagination(props: {
  page: number;
  totalRecords: number;
  items: number;
  nodes: number;
  handlePageChange: Function;
  qsObject: any;
}) {
  const { page, totalRecords, items, nodes, handlePageChange, qsObject } = props;

  let totalPages = parseInt((totalRecords / items).toString());
  if (totalRecords % items == 0) totalPages += 1;

  const startPage = page - (page - 1) % nodes;
  const endPage = startPage + nodes - 1 > totalPages ? totalPages : startPage + nodes - 1;

  const pagy: any[] = [];
  if (page > 1) {
    pagy.push(<li key={-1}>
      <Link
        href={`?${toQueryString({ ...qsObject, page: page - 1 })}`}
        className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={() => handlePageChange(page - 1)}
      >
        <span className="sr-only">Previous</span>
        <svg
          className="w-3 h-3 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 1 1 5l4 4"
          />
        </svg>
      </Link>
    </li>);
  }
  for (let i = startPage; i <= endPage; i++) {
    if (i == page) {
      pagy.push(
        <li key={i}>
          <Link
            href={`?${toQueryString({ ...qsObject, page: i })}`}
            aria-current="page" className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Link>
        </li>
      );
    }
    else {
      pagy.push(<li key={i}>
        <Link
          href={`?${toQueryString({ ...qsObject, page: i })}`}
          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Link>
      </li>);
    }
  }
  if (page < totalPages) {
    pagy.push(<li key={-2}>
      <Link
        href={`?${toQueryString({ ...qsObject, page: page + 1 })}`}
        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={() => handlePageChange(page + 1)}
      >
        <span className="sr-only">Next</span>
        <svg
          className="w-3 h-3 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 9 4-4-4-4"
          />
        </svg>
      </Link>
    </li>);
  }

  return (
    <nav aria-label="Page navigation example" className="flex justify-center">
      <ul className="flex items-center -space-x-px h-10 text-base mb-6">
        {pagy}
      </ul>
    </nav>
  );
}
