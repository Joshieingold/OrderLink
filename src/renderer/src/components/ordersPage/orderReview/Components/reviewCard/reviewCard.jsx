import { useState } from "react";
import { doc, getDocs, collection, query, where, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../General/database/firebase"; // adjust this path to where your firebase config lives
import './reviewCard.css';

export const ReviewCard = ({
    orderId,
    name,
    location,
    waybill,
    devices,
    boxes,
    skids,
    weight,
    date,
    note,
    isExpanded,
    onClick,
    onClose,
    onDeleteSuccess // <- passed from parent
}) => {
    const [isEditing, setIsEditing] = useState(false); // Track if it's in edit mode
    const [editedData, setEditedData] = useState({
        name, // Tech name
        location,
        waybill,
        boxes,
        skids,
        devices,
        date, // Date
        note,
        weight,
    });

    // Handle input change when editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            const q = query(collection(db, "TempOrders"), where("OrderID", "==", orderId));
            const snapshot = await getDocs(q);
            const deletePromises = snapshot.docs.map(docu => deleteDoc(doc(db, "TempOrders", docu.id)));
            await Promise.all(deletePromises);
            if (onClose) onClose();
            if (onDeleteSuccess) onDeleteSuccess();
            
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const q = query(collection(db, "TempOrders"), where("OrderID", "==", orderId));
            const snapshot = await getDocs(q);
    
            // Delete existing documents with same OrderID
            const deletePromises = snapshot.docs.map(docu => deleteDoc(doc(db, "TempOrders", docu.id)));
            await Promise.all(deletePromises);
    
            // Create a new document with updated structure
            const newDocRef = doc(collection(db, "TempOrders"));
            await setDoc(newDocRef, {
                OrderID: orderId,
                TechName: editedData.name,
                Location: editedData.location,
                Waybill: editedData.waybill,
                Boxes: Number(editedData.boxes),
                Skids: Number(editedData.skids),
                Devices: typeof editedData.devices === "string" ? JSON.parse(editedData.devices) : editedData.devices,
                DateCompleted: new Date(editedData.date),
                Note: editedData.note || "",
                Weight: editedData.weight // hardcoded or replace with editable if needed
            });
    
            setIsEditing(false);
            if (onDeleteSuccess) onDeleteSuccess();
        } catch (error) {
            console.error("Error saving edited document:", error);
        }
    };
    
    

    return (
        <div
            className={`review-card ${isExpanded ? "expanded" : ""}`}
            onClick={!isExpanded ? onClick : undefined}
        >
            <div className="review-card-front">
                <h3>#{orderId}</h3>
                <p>{name}</p>
                <p className="small">{new Date(date).toLocaleDateString()}</p>
            </div>

            {isExpanded && (
                <div className="review-card-details">
                    <div className="order-info">
                        <div className="info-container">
                            <div className="general-info">
                                <h4 className="section-title">Order Details</h4>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="location"
                                            value={editedData.location}
                                            onChange={handleInputChange}
                                            placeholder="Location"
                                        />
                                        <input
                                            type="text"
                                            name="waybill"
                                            value={editedData.waybill}
                                            onChange={handleInputChange}
                                            placeholder="Waybill"
                                        />
                                        <input
                                            type="number"
                                            name="boxes"
                                            value={editedData.boxes}
                                            onChange={handleInputChange}
                                            placeholder="Boxes"
                                        />
                                        <input
                                            type="number"
                                            name="skids"
                                            value={editedData.skids}
                                            onChange={handleInputChange}
                                            placeholder="Skids"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Location:</strong> {location}</p>
                                        <p><strong>Waybill:</strong> {waybill}</p>
                                        <p><strong>Boxes:</strong> {boxes}</p>
                                        <p><strong>Skids:</strong> {skids}</p>
                                    </>
                                )}
                            </div>

                            <div className="device-container">
                                <h4 className="section-title">Devices</h4>
                                {isEditing ? (
                                    // You can add similar inputs for devices if needed
                                    <input
                                        type="text"
                                        name="devices"
                                        value={JSON.stringify(editedData.devices)} // Show devices as a JSON string or customize it
                                        onChange={handleInputChange}
                                        placeholder="Devices"
                                    />
                                ) : (
                                    <ul>
                                        {Object.entries(devices).map(([deviceName, count]) => (
                                            <li key={deviceName}>
                                                {deviceName}: {count}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="edit-info">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedData.name}
                                        onChange={handleInputChange}
                                        placeholder="Tech Name"
                                    />
                                    <input
                                        type="date"
                                        name="date"
                                        value={editedData.date}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <p><strong>Tech Name:</strong> {name}</p>
                                    <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
                                </>
                            )}
                        </div>

                        <p><strong>Note:</strong> {note}</p>
                    </div>

                    <div className="btn-container">
                        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>Close</button>
                        <button className="delete-btn" onClick={handleDelete}>Remove</button>
                        {isEditing ? (
                            <button className="save-btn" onClick={handleSaveEdit}>Save</button>
                        ) : (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                        )}
                        <button className="send-btn">Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};
