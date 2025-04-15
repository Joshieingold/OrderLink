import "./activeOrder.css";
export const ActiveOrder = ({ orderData }) => {
    return (
        <div className="active-order-main">
            <div className="active-order">
                <div className="info-container">
                    <h2>ID: {orderData.OrderID}</h2>
                    <h2 className="border-title">Name: {orderData.Technician}</h2>
                    <p>Location: {orderData.Location}</p>
                    <p>Waybill: {orderData.Waybill}</p>
                    <p>Boxes: {orderData.Boxes}</p>
                    <p>Skids: {orderData.Skids}</p>
                    <p>Date Completed: {new Date(orderData.Date).toLocaleDateString()}</p>
                </div>
                <div className="device-info-container">
                    
                    <ul>
                        <h2 className="border-title">Devices</h2>
                        {orderData.Devices
                            ? Object.entries(orderData.Devices).map(([deviceName, count]) => (
                                <li key={deviceName}>
                                    {deviceName}: {count}
                                </li>
                            ))
                            : <li>No devices found</li>}
                    </ul>
                </div>
            </div>
            <div className="note-section">
                <p>{orderData.Note}</p>
            </div>
        </div>
    );
};
