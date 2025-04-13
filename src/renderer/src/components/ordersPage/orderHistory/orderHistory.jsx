import "./orderHistory.css";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { Navbar } from "../../General/navbar/navbar";
import { OrderTable } from "./components/orderTable";
import { useState, useEffect } from "react";
import { fetchOrdersData } from "../../General/database/databaseFunctions";

export const OrderHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrdersData();
        setData(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="order-history-page">
      <Navbar />
      <OrdersNavbar />
      <div className={`order-history-wrapper ${fadeIn ? "fade-in" : ""}`}>
        <h1 className="main-title-text">Order History</h1>
        <OrderTable data={data} />
      </div>
    </div>
  );
};
