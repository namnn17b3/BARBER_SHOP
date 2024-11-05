'use client';

import { ApiPayment } from "@/common/constant/api-url.constant";
import { toQueryString } from "@/common/utils/utils";
import React, { useEffect } from "react";
import Swal from "sweetalert2";

export default function PaymentResultPage() {
  useEffect(() => {
    const params = window.location.search;

    fetch(`${ApiPayment.VERIFY}${params}`)
      .then((response) => {
        if ([404, 500].includes(response.status)) {
          window.location.href = `/error/${response.status}`;
          return;
        }
        return response.json();
      })
      .then((json) => {
        const travolta = (document.querySelector('.travolta') as any);
        if (json.data) {
          const checksum = json.data.checksum;
          if (checksum == 1) {
            travolta.style.background = "url('/img/thank-you.gif') center center no-repeat";
            travolta.style.backgroundSize = 'cover';
            Swal.fire({
              title: 'Notify',
              text: 'Payment successful, please check the information in the email',
              icon: 'success',
            });
          } else if (checksum == 0) {
            travolta.style.background = "url('/img/no-data.gif') center center no-repeat";
            travolta.style.backgroundSize = 'cover';
            Swal.fire({
              title: 'Oops...',
              text: 'Checksum Failed',
              icon: 'error',
            });
          } else {
            travolta.style.background = "url('/img/error.gif') center center no-repeat";
            travolta.style.backgroundSize = 'cover';
            Swal.fire({
              title: 'Error...',
              text: 'Payment Failed!',
              icon: 'error',
            });
          }
        }
        else {
          travolta.style.background = "url('/img/no-data.gif') center center no-repeat";
          travolta.style.backgroundSize = 'cover';
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/no.data.css" />
      <h1><a href="/">Back to home</a></h1>
      <div className="travolta"></div>
    </>
  );
}
