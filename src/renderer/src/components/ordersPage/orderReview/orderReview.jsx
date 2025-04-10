import "./orderReview.css";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { Navbar } from "../../General/navbar/navbar";
import { useEffect, useState } from "react";
import { fetchTempOrdersData } from "../../General/database/databaseFunctions.jsx";
import { ReviewCard } from "./Components/reviewCard/reviewCard.jsx";
import { AnimatePresence, motion } from "framer-motion";

export const OrderReview = () => {
    const [orders, setOrders] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchTempOrdersData()
            .then(data => {
                const updated = data.map((order, index) => ({
                    ...order,
                    OrderID: order.OrderID || `temp-${Date.now()}-${index}`
                }));
                setOrders(updated);
            })
            .catch(console.error);
    }, []);

    const activeOrder = orders.find(order => order.OrderID === expandedId);
    const otherOrders = orders.filter(order => order.OrderID !== expandedId);

    return (
        <div className="order-review-page">
            <Navbar />
            <OrdersNavbar />
            <h1 className="main-title-text">Order Review</h1>

            <div className="review-button-container">
                <button className="review-button">Create Orders</button>
            </div>

            {/* Active/Placeholder Box */}
            <div className="active-card-wrapper">
                <AnimatePresence mode="wait">
                    <motion.div
                        layout
                        key={activeOrder ? activeOrder.OrderID : "placeholder"}
                        className="active-card-box"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                    >
                        {activeOrder ? (
                            <ReviewCard
                                orderId={activeOrder.OrderID}
                                name={activeOrder.Technician}
                                location={activeOrder.Location}
                                waybill={activeOrder.Waybill || "N/A"}
                                devices={activeOrder.Devices || {}}
                                boxes={activeOrder.Boxes || 0}
                                skids={activeOrder.Skids || 0}
                                date={activeOrder.DateCompleted || Date()}
                                isExpanded={true}
                                onClick={() => {}}
                                onClose={() => setExpandedId(null)}
                            />
                        ) : (
                            <div className="placeholder-content">
                                <p className="placeholder-text">No order selected</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Inactive Orders List */}
            <div className="card-container">
                <AnimatePresence>
                    {otherOrders.map(order => (
                        <motion.div
                            key={order.OrderID}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ReviewCard
                                orderId={order.OrderID}
                                name={order.Technician}
                                location={order.Location}
                                waybill={order.Waybill || "N/A"}
                                devices={order.Devices || {}}
                                boxes={order.Boxes || 0}
                                skids={order.Skids || 0}
                                date={order.DateCompleted || Date()}
                                isExpanded={false}
                                onClick={() => setExpandedId(order.OrderID)}
                                onClose={() => {}}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
