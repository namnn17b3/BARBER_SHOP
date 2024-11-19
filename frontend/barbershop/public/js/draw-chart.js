let chart = null;

const drawChart = () => {
  const chartElement = document.getElementById('inline-chart');
  if (chart) {
    chart.destroy();
  }
  const dataFromJson = JSON.parse(document.querySelector('#api-data-chart').innerText);
  const chartType = [...document.querySelectorAll(`input[name="chart-stats-dropdown-chart"`)].find((item) => item.checked);
  let fnDrawChart = null;
  if (chartType.value === 'line') {
    fnDrawChart = drawLineChart;
  } else if (chartType.value === 'circle') {
    fnDrawChart = drawCircleChart;
  } else if (chartType.value === 'bar') {
    fnDrawChart = drawBarChart;
  }

  if (fnDrawChart) {
    fnDrawChart(
      chartElement,
      dataFromJson.map(item => item.totalAmount),
      dataFromJson.map(item => item.date ? item.date : item.month),
    );
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

function drawBarChart(chartElement, data, labels) {
  const options = {
    // colors: ["#1A56DB", "#FDBA8C"],
    series: [
      {
        name: "Revenue",
        color: generateRandomColors(1)[0],
        data: data.map((item, idx) => {
          return {
            x: labels[idx],
            y: item,
          }
        }),
      },
    ],
    chart: {
      type: "bar",
      height: "320px",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
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
    fill: {
      opacity: 1,
    },
  }

  if (chartElement && typeof ApexCharts !== 'undefined') {
    chart = new ApexCharts(chartElement, options);
    chart.render();
  }
}
