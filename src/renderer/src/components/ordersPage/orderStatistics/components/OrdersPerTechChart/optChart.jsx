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

const OptChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    saintJohn: true,
    moncton: true,
    fredericton: true,
    misc: true,
  });

  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");     // YYYY-MM-DD

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received");
      setLoading(false);
      return;
    }

    let techOrders = {};

    data.forEach((item) => {
      const techName = item.Technician || "Unknown";
      const location = item.Location || "Unknown";
      const dateStr = item.Date;
      const date = dateStr ? new Date(dateStr) : null;

      // Apply date range filter if set
      if (startDate && date && date < new Date(startDate)) return;
      if (endDate && date && date > new Date(endDate)) return;

      if (!techOrders[techName]) {
        techOrders[techName] = {
          TotalOrders: 0,
          Location: location,
        };
      }
      techOrders[techName].TotalOrders += 1;
    });

    if (Object.keys(techOrders).length > 0) {
      let filteredOrders = Object.entries(techOrders)
        .filter(([_, details]) => {
          const location = details.Location || "Unknown";
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
          acc[techName] = details.TotalOrders || 0;
          return acc;
        }, {});

      setChartData({
        labels: Object.keys(filteredOrders),
        datasets: [
          {
            label: "Total Orders",
            data: Object.values(filteredOrders),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartData(null);
    }

    setLoading(false);
  }, [data, filters, startDate, endDate]);

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
          label: function (tooltipItem) {
            return `Orders: ${tooltipItem.raw}`;
          },
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
          text: "Orders",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="title-text">Orders Requested</h2>

      {/* Date Filters */}
      <div className="filter-section">
        <div className="date-filter-section">
          <label>
            Start Date:{" "}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: "10px" }}>
            End Date:{" "}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        {/* Checkbox Filters */}
        <div className="filter-section">
          <label className="Checkbox-Text">
            <input
              type="checkbox"
              name="saintJohn"
              checked={filters.saintJohn}
              onChange={handleFilterChange}
            />
            Saint John
          </label>
          <label className="Checkbox-Text">
            <input
              type="checkbox"
              name="moncton"
              checked={filters.moncton}
              onChange={handleFilterChange}
            />
            Moncton
          </label>
          <label className="Checkbox-Text">
            <input
              type="checkbox"
              name="fredericton"
              checked={filters.fredericton}
              onChange={handleFilterChange}
            />
            Fredericton
          </label>
          <label className="Checkbox-Text">
            <input
              type="checkbox"
              name="misc"
              checked={filters.misc}
              onChange={handleFilterChange}
            />
            Purolator
          </label>
        </div>
      </div>

      {/* Chart Display */}
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default OptChart;
