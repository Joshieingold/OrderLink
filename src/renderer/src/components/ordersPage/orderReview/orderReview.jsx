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
                const seen = new Set();
                const updated = data.map((order, index) => {
                    const rawId = order.OrderID || `temp-${Date.now()}-${index}`;
                    let uniqueKey = rawId;
                    if (seen.has(uniqueKey)) {
                        uniqueKey += `-${index}`; // ensure uniqueness
                    }
                    seen.add(uniqueKey);
                    return { ...order, rawId, uniqueKey };
                });
                setOrders(updated);
            })
            .catch(console.error);
    }, []);

    // Function to refresh the data in the parent component
    const refreshData = () => {
        fetchTempOrdersData()
            .then(data => {
                const seen = new Set();
                const updated = data.map((order, index) => {
                    const rawId = order.OrderID || `temp-${Date.now()}-${index}`;
                    let uniqueKey = rawId;
                    if (seen.has(uniqueKey)) {
                        uniqueKey += `-${index}`; // ensure uniqueness
                    }
                    seen.add(uniqueKey);
                    return { ...order, rawId, uniqueKey };
                });
                setOrders(updated);
            })
            .catch(console.error);
    };

    const activeOrder = orders.find(order => order.rawId === expandedId);
    const otherOrders = orders.filter(order => order.rawId !== expandedId);

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
                        key={activeOrder ? activeOrder.uniqueKey : "placeholder"}
                        className="active-card-box"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activeOrder ? (
                            <ReviewCard
                            orderId={activeOrder.rawId}
                            name={activeOrder.Technician}
                            location={activeOrder.Location}
                            waybill={activeOrder.Waybill || "N/A"}
                            devices={activeOrder.Devices || {}}
                            boxes={activeOrder.Boxes || 0}
                            skids={activeOrder.Skids || 0}
                            date={activeOrder.DateCompleted || new Date().toLocaleDateString()}
                            note={activeOrder.Note}
                            isExpanded={true}
                            onClick={() => {}}
                            onClose={() => setExpandedId(null)}
                            onDeleteSuccess={refreshData} // ✅ FIXED: Make sure it's onDeleteSuccess
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
                            key={order.uniqueKey}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ReviewCard
                                orderId={order.rawId}
                                name={order.Technician}
                                location={order.Location}
                                waybill={order.Waybill || "N/A"}
                                devices={order.Devices || {}}
                                boxes={order.Boxes || 0}
                                skids={order.Skids || 0}
                                date={order.DateCompleted || new Date().toLocaleDateString()}
                                isExpanded={false}
                                onClick={() => setExpandedId(order.rawId)}
                                onClose={() => {}}
                                onUpdate={refreshData} // Pass onUpdate to refresh data
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
