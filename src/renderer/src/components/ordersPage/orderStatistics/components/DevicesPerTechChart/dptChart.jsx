import { Bar } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const DptChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [filters, setFilters] = useState({
    saintJohn: true,
    moncton: true,
    fredericton: true,
    misc: true,
  });

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received");
      setLoading(false);
      return;
    }

    let filteredData = [...data];

    // Filter by date range
    if (dateFilter.start || dateFilter.end) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.Date); // Make sure `item.Date` exists and is valid
        const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
        const endDate = dateFilter.end ? new Date(dateFilter.end) : null;

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    let techDevices = {};

    filteredData.forEach((item) => {
      const techName = item.Technician || "Unknown";
      const location = item.Location || "Unknown";
      const devices = item.Devices || {};

      if (!techDevices[techName]) {
        techDevices[techName] = {
          location,
          totalDevices: 0,
        };
      }

      Object.values(devices).forEach((quantity) => {
        techDevices[techName].totalDevices += quantity;
      });
    });

    if (Object.keys(techDevices).length > 0) {
      const filteredOrders = Object.entries(techDevices)
        .filter(([_, details]) => {
          const location = details.location;
          return (
            (filters.saintJohn && location.includes("Saint John")) ||
            (filters.moncton && location.includes("Moncton")) ||
            (filters.fredericton && location.includes("Fredericton")) ||
            (filters.misc &&
              !["Saint John", "Moncton", "Fredericton"].some((city) =>
                location.includes(city)
              ))
          );
        })
        .reduce((acc, [techName, details]) => {
          acc[techName] = details.totalDevices;
          return acc;
        }, {});

      setChartData({
        labels: Object.keys(filteredOrders),
        datasets: [
          {
            label: "Total Devices Received",
            data: Object.values(filteredOrders),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
    }

    setLoading(false);
  }, [data, filters, dateFilter]);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Devices: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // hides technician names
        },
        grid: {
          display: false, // optional: hides vertical grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: "Devices",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="title-text">Devices Received</h2>

      {/* Date Filter Section */}
      <div className="filter-section">
        <div className="date-filter-section">
          <label>
            Start Date:
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, start: e.target.value }))
              }
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </label>
        </div>

        {/* Checkbox Filters */}
        <div className="filter-section">
          {["saintJohn", "moncton", "fredericton", "misc"].map((filter) => (
            <label key={filter} className="Checkbox-Text">
              <input
                type="checkbox"
                name={filter}
                checked={filters[filter]}
                onChange={handleFilterChange}
              />
              {filter === "misc"
                ? "Purolator"
                : filter
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
            </label>
          ))}
        </div>
      
      </div>

      {loading ? <p>Loading...</p> : chartData && <Bar className="bar-data" data={chartData} options={options} />}
    </div>
  );
};

export default DptChart;
