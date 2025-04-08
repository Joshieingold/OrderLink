import { endOfWeek, format, startOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance
import { Timestamp, addDoc } from "firebase/firestore";

export const fetchOrdersData = async () => {
    try {
        const deliveryRef = collection(db, "DeliveryTracker");
        const querySnapshot = await getDocs(query(deliveryRef));
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        let orderData = [];
        querySnapshot.forEach((doc) => {
            const order = doc.data();

            const boxes = order.Boxes || 1;
            const dateCompleted = order.DateCompleted && typeof order.DateCompleted.toDate === "function" 
                ? order.DateCompleted.toDate() 
                : new Date(); // Default to current date if not present
            const weight = order.Weight || 0;
            const location = order.Location || "Unknown";
            const orderNumber = order.ID || "Unknown";
            const skids = order.Skids || 1/24;
            const techName = order.TechName || "Unknown";
            const waybill = order.Waybill || "Unknown";
            const devices = order.Devices || {};

            orderData.push({
                Boxes: boxes || 1,
                Date: dateCompleted ? dateCompleted : new Date(),
                Weight: weight || 0,
                Location: location,
                OrderID: orderNumber || "Unknown",
                Skids: skids,
                Technician: techName || "Unknown",
                Waybill: waybill || "Unknown",
                Devices: devices || {},
            });
        });
        return orderData;
    }
    catch (error) {
        console.error("Error fetching orders data:", error);
    }
};
export const fetchTempOrdersData = async () => {
    try {
        const deliveryRef = collection(db, "TempOrders");
        const querySnapshot = await getDocs(query(deliveryRef));

        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return [];
        }

        let orderData = [];

        querySnapshot.forEach((doc) => {
            const order = doc.data();

            // Convert Firestore Timestamp to JS Date safely
            const dateCompleted = order.DateCompleted?.toDate?.() ?? console.log("fuck");

            orderData.push({
                Boxes: order.Boxes ?? 1,
                Date: dateCompleted,
                Weight: order.Weight ?? 0,
                Location: order.Location ?? "Unknown",
                OrderID: order.OrderID ?? "Unknown",
                Skids: order.Skids ?? (1 / 24),
                Technician: order.TechName ?? "Unknown",
                Waybill: order.Waybill ?? "Unknown",
                Devices: order.Devices ?? {},
            });
        });

        return orderData;
    } catch (error) {
        console.error("Error fetching orders data:", error);
        return [];
    }
};


export const fetchTechData = async () => {
    try {
        const techRef = collection(db, "TechDatabase");
        const querySnapshot = await getDocs(query(techRef));
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        let techData = [];
        querySnapshot.forEach((doc) => {
            const tech = doc.data();
            const techName = tech.Name || "Unknown";
            const location = tech.Location || "Unknown";
            const sendBy = tech.SendingMethod || "Purolator";
            

            techData.push({
                Name : techName || "Unknown",
                Location : location || "Unknown",
                SendingMethod : sendBy || "Purolator",
            });
        });
        return techData;
    }
    catch (error) {
        console.error("Error fetching orders data:", error);
    }
};
export const fetchDeviceData = async () => {
    try {
        const deviceRef = collection(db, "DeviceDatabase");
        const querySnapshot = await getDocs(query(deviceRef));
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        let deviceData = [];
        querySnapshot.forEach((doc) => {
            const device = doc.data();
            const deviceName = device.Name || "Unknown";
            const fullBox = device.FullBox || 10;
            

            deviceData.push({
                Name : deviceName || "Unknown",
                FullBox : fullBox || 10,
            });
        });
        return deviceData;
    }
    catch (error) {
        console.error("Error fetching orders data:", error);
    }
};
export const sendOrderData = async (order) => {
    try {
        const deliveryRef = collection(db, "DeliveryTracker");

        // Construct the order object in the expected Firestore format
        const payload = {
            Boxes: order.Boxes || 1,
            DateCompleted: order.Date instanceof Date ? Timestamp.fromDate(order.Date) : Timestamp.fromDate(new Date()),
            Weight: order.Weight || 0,
            Location: order.Location || "Unknown",
            ID: order.OrderID || "Unknown",
            Skids: order.Skids || 1/24,
            TechName: order.Technician || "Unknown",
            Waybill: order.Waybill || "Unknown",
            Devices: order.Devices || {},
        };

        const docRef = await addDoc(deliveryRef, payload);
        console.log("Order successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding order to database:", error);
        throw error;
    }
};