import { useState, useEffect } from "react";
import { Navbar } from "../../General/navbar/navbar";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { ActiveOrder } from "./Components/activeOrder/activeOrder";
import { fetchTempOrdersData } from "../../General/database/databaseFunctions";
import { MiniOrder } from "./Components/miniOrder/miniOrder";
import { AnimatePresence, motion } from 'framer-motion';
import "./orderReview.css";
export const OrderReview = () => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [orderData, setOrderData] = useState([]); // Initialize orderData with an empty array

    // Function to fetch data
    const RefreshData = async () => {
        const data = await fetchTempOrdersData();
        setOrderData(data); // Set the fetched data to orderData state
    };
    const HandleMiniContainerClick = (doc) => {
        setActiveOrder(doc)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        RefreshData(); // Fetch data when the component mounts
    }, []); // Empty dependency array means this runs once on mount

    return (
        <motion.div className="order-review-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} >
            <Navbar />
            <OrdersNavbar />
            <h1>Order Review</h1>
            <div className="header-button-container">
                <button>Create Order</button>
            </div>
            <div className="active-order-container">
                <AnimatePresence mode="wait">
                    {activeOrder ? (
                    <motion.div key={activeOrder.OrderID} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="motion-full" >
                        <ActiveOrder orderData={activeOrder} />
                        <div className="order-button-container">
                            <button className="active-order-button" onClick={() => setActiveOrder(null)}>X</button>
                            <button className="active-order-button">Edit</button>
                            <button className="active-order-button">Delete</button>
                            <button className="active-order-button">Submit</button>
                        </div>
                    </motion.div>
                    ) : (
                    <motion.p key="no-order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >
                        Select an order to review
                    </motion.p>
                    )}
                </AnimatePresence>
            </div>
            <div className="mini-order-container">
                {orderData.map((doc, index) => (
                    <MiniOrder key={index} doc={doc} onClick={() => {HandleMiniContainerClick(doc)}} isActive={activeOrder && doc.OrderID === activeOrder.OrderID}/>
                ))}
            </div>
        </motion.div>
    );
};

      