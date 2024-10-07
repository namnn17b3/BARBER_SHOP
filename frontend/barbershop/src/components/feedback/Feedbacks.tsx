'use client'

import { ApiFeedback } from "@/common/constant/api-url.constant";
import { toQueryString } from "@/common/utils/utils";
import FeedbackStatistic from "@/components/feedback/FeedbackStatistic";
import FilterFeedback from "@/components/feedback/FilterFeedback";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { DateFormatType } from "@/common/constant/date-format.constant";
import { TimeZone } from "@/common/constant/timezone.constant";
import AlertError from "@/components/alert/AlertError";
import Pagination from "@/components/Pagination";
import NoResult from "@/components/NoResult";
import FeedbackItem from "@/components/feedback/FeedbackItem";
import { useAuthen } from "@/hooks/user.authen";
import React from "react";

dayjs.extend(customParseFormat as any);
dayjs.extend(utc as any);
dayjs.extend(timezone as any);

export default function Feedbacks(props: any) {
  const { hairStyleId } = props;

  const searchParams = useSearchParams();

  const router = useRouter();

  const [response, setReponse] = useState({});
  const [errors, setErrors] = useState([]);

  const { authenState } = useAuthen();

  const isValidErrorRef: any = useRef();

  const [filterValue, setFilterValue] = useState({
    minStar: searchParams.get('minStar'),
    maxStar: searchParams.get('maxStar'),
    starDate: searchParams.get('starDate'),
    endDate: searchParams.get('endDate'),
    sorting: searchParams.get('sorting'),
    page: searchParams.get('page') || 1,
    items: 10,
  });

  const minStarInputRef = useRef<any>();
  const maxStarInputRef = useRef<any>();
  const startDateInputRef = useRef<any>();
  const endDateInputRef = useRef<any>();
  const ascendingRatingInputRef = useRef<any>();
  const descendingRatingInputRef = useRef<any>();
  const noneRatingInputRef = useRef<any>();
  const ascendingDateInputRef = useRef<any>();
  const descendingDateInputRef = useRef<any>();
  const noneDateInputRef = useRef<any>();
  const priorityRatingInputRef = useRef<any>();
  const priorityDateInputRef = useRef<any>();
  const priorityNoneInputRef = useRef<any>();
  const yourFeedbackInputRef = useRef<any>();

  useEffect(() => {
    const url = `${ApiFeedback.GET_ALL}?hairStyleId=${hairStyleId}&${toQueryString(filterValue)}`;
    fetch(url, authenState && {
      headers: {
        'authorization': `Bearer ${window.localStorage.getItem('token')}`,
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
          setReponse(json);
          isValidErrorRef.current = false;
        }
        else {
          setErrors(json.errors);
          isValidErrorRef.current = true;
        }
      })
      .catch((error) => console.log(error));
  }, [filterValue]);

  const handleFilter = () => {
    const minStar = minStarInputRef.current.value;
    const maxStar = maxStarInputRef.current.value;
    const startDate = dayjs(startDateInputRef.current.value, DateFormatType.YYYY_MM_DD, true).isValid() ? dayjs.tz(startDateInputRef.current.value, DateFormatType.YYYY_MM_DD, TimeZone.ASIA_HCM).toDate().toISOString() : null;
    const endDate = dayjs(endDateInputRef.current.value, DateFormatType.YYYY_MM_DD, true).isValid() ? dayjs.tz(endDateInputRef.current.value, DateFormatType.YYYY_MM_DD, TimeZone.ASIA_HCM).toDate().toISOString() : null;
    let sorting = '';
    sorting = sorting + (ascendingRatingInputRef.current.checked ? 'star:asc,' : descendingRatingInputRef.current.checked ? 'star:desc,' : 'star:none,');
    sorting = sorting + (ascendingDateInputRef.current.checked ? 'time:asc,' : descendingDateInputRef.current.checked ? 'time:desc,' : 'time:none,');
    sorting = sorting + (priorityRatingInputRef.current.checked ? 'priority:star' : priorityDateInputRef.current.checked ? 'priority:time' : 'priority:none');

    console.log(minStar, maxStar, sorting);
    const newFilterValue = {
      ...filterValue,
      minStar,
      maxStar,
      startDate,
      endDate,
      sorting,
    }
    router.push(`?${toQueryString(newFilterValue)}`);
    setFilterValue(newFilterValue);
  }

  const handlePageChange = (page: number) => {
    console.log(page);
    setFilterValue({
      ...filterValue,
      page,
    });
  }


  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* Filter Feedback Statistics */}
        <FeedbackStatistic
          hairStyleId={hairStyleId}
        />

        {/* Filter Feedback */}
        <FilterFeedback
          minStarInputRef={minStarInputRef}
          maxStarInputRef={maxStarInputRef}
          startDateInputRef={startDateInputRef}
          endDateInputRef={endDateInputRef}
          ascendingRatingInputRef={ascendingRatingInputRef}
          descendingRatingInputRef={descendingRatingInputRef}
          noneRatingInputRef={noneRatingInputRef}
          ascendingDateInputRef={ascendingDateInputRef}
          descendingDateInputRef={descendingDateInputRef}
          noneDateInputRef={noneDateInputRef}
          priorityRatingInputRef={priorityRatingInputRef}
          priorityDateInputRef={priorityDateInputRef}
          priorityNoneInputRef={priorityNoneInputRef}
          yourFeedbackInputRef={yourFeedbackInputRef}
          handleFilter={handleFilter}
        />

        {
          isValidErrorRef.current ? <AlertError errors={errors} /> :
            <>
              {/* Feedback List */}
              <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
                {(response as any)?.data?.map((feedback: any, idx: number) =>
                  <FeedbackItem
                    key={idx}
                    isFirst={idx == 0 ? true : false}
                    star={feedback.star}
                    comment={feedback.comment}
                    time={feedback.time}
                    user={feedback.user}
                  />
                )}
              </div>
              {!!(response as any)?.data?.length && <Pagination
                page={+filterValue.page}
                items={10}
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
      </div>
    </section>
  );
}
