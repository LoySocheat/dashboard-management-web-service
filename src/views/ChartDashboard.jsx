import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axiosClient from "../axios-client";

const ChartDashboard = () => {
  const [chartData, setChartData] = useState({});
  const [chartLoaded, setChartLoaded] = useState(false);

  const generateMonthRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dates;
  };

  const processOrdersData = (orders) => {
    const salesPerStatus = {
      confirmed: {},
      rejected: {},
      cancelled: {},
      pending: {},
    };

    orders.forEach(order => {
      const monthYear = order.created_at.substring(0, 7); // Extract YYYY-MM format
      if (!salesPerStatus[order.status][monthYear]) {
        salesPerStatus[order.status][monthYear] = { totalProductsSold: 0 };
      }
      order.products.forEach(product => {
        salesPerStatus[order.status][monthYear].totalProductsSold += product.quantity;
      });
    });

    const orderDates = orders.map(order => new Date(order.created_at));
    const minDate = new Date(Math.min.apply(null, orderDates));
    const maxDate = new Date(Math.max.apply(null, orderDates));

    const minDateFormatted = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, '0')}`;
    const maxDateFormatted = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}`;

    const allMonths = generateMonthRange(minDateFormatted, maxDateFormatted);

    const datasets = Object.keys(salesPerStatus).map(status => {
      const salesCounts = allMonths.map(month => salesPerStatus[status][month] ? salesPerStatus[status][month].totalProductsSold : 0);
      const backgroundColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
      return {
        label: `${status.charAt(0).toUpperCase() + status.slice(1)} Products`,
        data: salesCounts,
        backgroundColor,
        borderColor: backgroundColor.replace('0.5', '1'),
        borderWidth: 1,
      };
    });

    return {
      labels: allMonths,
      datasets: datasets,
    };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get(`/orders`);
        if (response.data && response.data.data) {
          const processedData = processOrdersData(response.data.data);
          setChartData(processedData);
          setChartLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Monthly Product Sales by Status</h2>
      {chartLoaded ? (
        <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } }}} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ChartDashboard;
