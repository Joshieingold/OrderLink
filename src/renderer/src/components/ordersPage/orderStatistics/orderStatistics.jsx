import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './orderStatistics.css';
import "../../General/General.css";
import { fetchOrdersData } from '../../General/database/databaseFunctions.jsx';
import OptChart from './Components/OrdersPerTechChart/optChart.jsx';
import DptChart from "./Components/DevicesPerTechChart/dptChart.jsx";
import WaybillTreemap from './Components/OrdersTreeMap/OrdersTreeMap.jsx';
import { Navbar } from '../../General/navbar/navbar.jsx';
import OrdersNavbar from './components/ordersNavbar/ordersNavbar.jsx';

const OrderStatisticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <motion.div
      className='order-statistics-page'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />
      <h1 className='main-title-text'>Order Overview</h1>
      <div className="two-bubble-container">
        <div className="bubble">
          {loading ? <p>Loading chart...</p> : <OptChart data={data} />}
        </div>
        <div className="bubble">
          {loading ? <p>Loading chart...</p> : <DptChart data={data} />}
        </div>
      </div>
      <div className='one-bubble-container'>
        <div className="bubble big">
          <h2 className='title-text-big'>Order Visualization</h2>
          {loading ? <p>Loading chart...</p> : <WaybillTreemap data={data} />}
        </div>  
      </div>
      <OrdersNavbar />
    </motion.div>
  );
};

export default OrderStatisticsPage;
