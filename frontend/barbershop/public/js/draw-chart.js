let chart = null;

const drawChart = () => {
  const chartElement = document.getElementById('inline-chart');
  // chartElement.innerHTML = '';
  // chartElement.setAttribute('style', '');
  if (chart) {
    chart.destroy();
  }
  const dataFromJson = JSON.parse(document.querySelector('#api-data-chart').innerText);
  const chartType = [...document.querySelectorAll(`input[name="chart-stats-dropdown-chart"`)].find((item) => item.checked);
  if (chartType.value === 'line') {
    drawLineChart(
      chartElement,
      dataFromJson.map(item => item.totalAmount),
      dataFromJson.map(item => item.date ? item.date : item.month),
    );
  } else if (chartType.value === 'circle') {
    drawCircleChart(
      chartElement,
      dataFromJson.map(item => item.totalAmount),
      dataFromJson.map(item => item.date ? item.date : item.month),
    )
  }
}

document.querySelector('#btn-view-stats-dropdown-chart').addEventListener('click', drawChart);

document.addEventListener('apiStatisticRevenueStatus', (event) => {
  if (event?.detail?.status === 'success') {
    drawChart();
  }
});

function generateRandomColors(length) {
  var colors = new Set();
  while (colors.size < length) {
    var color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    if (color != '#ffffff') {
      colors.add(color.toLocaleUpperCase());
    }
  }
  return Array.from(colors);
}

function drawCircleChart(chartElement, data, labels) {
  const colors = generateRandomColors(data.length);
  const options = {
    series: data,
    colors: colors,
    chart: {
      height: 420,
      width: "100%",
      type: "pie",
    },
    stroke: {
      colors: ["white"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        labels: {
          show: true,
        },
        size: "100%",
        dataLabels: {
          offset: -25
        }
      },
    },
    labels: labels,
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + "%"
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value + "%"
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
  }

  // const options = {
  //   series: [52.8, 26.8, 20.4],
  //   colors: ["#1C64F2", "#16BDCA", "#9061F9"],
  //   chart: {
  //     height: 420,
  //     width: "100%",
  //     type: "pie",
  //   },
  //   stroke: {
  //     colors: ["white"],
  //     lineCap: "",
  //   },
  //   plotOptions: {
  //     pie: {
  //       labels: {
  //         show: true,
  //       },
  //       size: "100%",
  //       dataLabels: {
  //         offset: -25
  //       }
  //     },
  //   },
  //   labels: ["Direct", "Organic search", "Referrals"],
  //   dataLabels: {
  //     enabled: true,
  //     style: {
  //       fontFamily: "Inter, sans-serif",
  //     },
  //   },
  //   legend: {
  //     position: "bottom",
  //     fontFamily: "Inter, sans-serif",
  //   },
  //   yaxis: {
  //     labels: {
  //       formatter: function (value) {
  //         return value + "%"
  //       },
  //     },
  //   },
  //   xaxis: {
  //     labels: {
  //       formatter: function (value) {
  //         return value  + "%"
  //       },
  //     },
  //     axisTicks: {
  //       show: false,
  //     },
  //     axisBorder: {
  //       show: false,
  //     },
  //   },
  // }

  if (chartElement && typeof ApexCharts !== 'undefined') {
    chart = new ApexCharts(chartElement, options);
    chart.render();
  }
}

function drawLineChart(chartElement, data, labels) {
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
        name: "Revenue",
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

  if (chartElement && typeof ApexCharts !== 'undefined') {
    chart = new ApexCharts(chartElement, options);
    chart.render();
  }
}
