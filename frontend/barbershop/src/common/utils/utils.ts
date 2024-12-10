// import ApexCharts from "apexcharts";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function toQueryString(obj: any) {
  let qs = '';
  let first = true;
  for (const key in obj) {
    if (obj[key]) {
      qs += `${first ? '' : '&'}${key}=${encodeURIComponent(obj[key])}`;
      first = false;
    }
  }
  return qs;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function generateTimeSlots() {
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
    const timeString = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    times.push(timeString);
    if (hour !== 20) {
      const halfHourString = hour < 10 ? `0${hour}:30` : `${hour}:30`;
      times.push(halfHourString);
    }
  }
  return times;
};

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCookie(key: string) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(key + '=') === 0) {
      return cookie.substring(key.length + 1);
    }
  }
  return null;
}

export function setCookie(key: string, value: string, millisecondsToExpire = null) {
  if (millisecondsToExpire) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + millisecondsToExpire);
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${key}=${value}; ${expires}; path=/`;
  } else {
    const expirationDate = new Date('Fri, 31 Dec 9999 23:59:59 GMT');
    document.cookie = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  }
}

export function deleteCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function camelToSentenceCase(str: string) {
  if (!str) return "";

  // Thêm khoảng trắng trước các chữ cái viết hoa
  const spaced = str.replace(/([A-Z])/g, " $1");

  // Chuyển chữ cái đầu thành chữ hoa, phần còn lại viết thường
  const sentence = spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();

  return sentence.trim(); // Loại bỏ khoảng trắng thừa ở đầu/cuối
};

export async function exportExcel(data: any, columns: any, fileName: string = new Date().getTime().toString(), sheetName: string = 'Sheet1') {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Thêm header
  // worksheet.columns = [
  //   { header: "ID", key: "id", width: 10 },
  //   { header: "Name", key: "name", width: 30 },
  //   { header: "Age", key: "age", width: 10 },
  //   { header: "Avatar", key: "avatar", width: 40 },
  // ];

  worksheet.columns = columns;

  let numberOfNotImageFiled = 0;
  // Thêm dữ liệu (dữ liệu không có ảnh trước)
  data.forEach((item: any, idx: number) => {
    const tmp: any = {};
    for (const key in item) {
      if (!item[key].isImage) {
        tmp[key] = item[key];
      }
    }
    worksheet.addRow(tmp);
    if (idx > 0) worksheet.getRow(idx + 1).height = 100;
    if (idx === data.length - 1) worksheet.getRow(idx + 2).height = 100;
    numberOfNotImageFiled = Object.keys(tmp).length;
  });

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const index = i;
    const tmp: any = {};
    for (const key in item) {
      if (item[key].isImage) {
        tmp[key] = item[key];
      }
    }
    let j = 0;
    for (const key in tmp) {
      // Tải ảnh từ URL
      const response = await fetch(item[key].url);
      const buffer = await response.arrayBuffer();

      const contentType = response.headers.get('Content-Type');

      // Thêm ảnh vào workbook
      const imageId = workbook.addImage({
        buffer,
        extension: contentType === 'image/jpeg' ? 'jpeg' : 'png', // Định dạng ảnh (png, jpg, v.v.)
      });

      // Tính toán vị trí ảnh (chỉ mục hàng = index + 2 vì header chiếm hàng đầu)
      worksheet.addImage(imageId, {
        tl: { col: numberOfNotImageFiled + j + 0.5, row: index + 1.25 }, // Top-Left (vị trí bắt đầu)
        ext: { width: 100, height: 100 }, // Kích thước ảnh
      });

      j++;
    }
  }

  /*
  // Chèn ảnh vào cột "Avatar"
  const imagePromises = data.map(async (item: any, index: number) => {
    if (item.avatar) {
      // Tải ảnh từ URL
      const response = await fetch(item.avatar);
      const buffer = await response.arrayBuffer();
  
      // Thêm ảnh vào workbook
      const imageId = workbook.addImage({
        buffer,
        extension: "png", // Định dạng ảnh (png, jpg, v.v.)
      });
  
      // Tính toán vị trí ảnh (chỉ mục hàng = index + 2 vì header chiếm hàng đầu)
      worksheet.addImage(imageId, {
        tl: { col: 3, row: index + 1.5 }, // Top-Left (vị trí bắt đầu)
        ext: { width: 100, height: 100 }, // Kích thước ảnh
      });
    }
  });

  // Đợi tất cả ảnh được tải và thêm vào
  await Promise.all(imagePromises);
  */

  // Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

export function drawLineChart(chartElement: any, data: any, labels: any, classChartLib: any) {
  const options = {
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      },
    },
    series: [
      {
        name: "New users",
        data: data,
        color: "#1A56DB",
      },
    ],
    xaxis: {
      categories: labels,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  }

  if (chartElement && typeof classChartLib !== 'undefined') {
    const chart = new classChartLib(chartElement, options);
    chart.render();
  }
}

export function clearModalInput(parentElement: any) {
  let nextElementSiblingColorInput: any = null;
  parentElement?.querySelectorAll('input')?.forEach((item: any) => {
    if (item.type === 'checkbox') return;
    if (item.type === 'color') {
      item.value = '#2563eb';
      nextElementSiblingColorInput = item.nextElementSibling;
      return;
    }
    item.value = '';
  });
  if (nextElementSiblingColorInput) {
    nextElementSiblingColorInput.value = '#2563eb';
  }
  parentElement?.querySelectorAll('.preview-image')?.forEach((item: any) => {
    item.src = '';
  });
  parentElement?.querySelectorAll('select')?.forEach((item: any) => {
    item.firstElementChild.selected = true;
  });
  parentElement?.querySelectorAll('textarea')?.forEach((item: any) => {
    item.value = '';
  });
}
