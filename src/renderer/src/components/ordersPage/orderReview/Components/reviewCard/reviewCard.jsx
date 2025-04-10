import './ReviewCard.css';

export const ReviewCard = ({ orderId, name, location, waybill, devices, boxes, skids, date, isExpanded, onClick, onClose }) => {

    return (
        <div className={`review-card ${isExpanded ? 'expanded' : ''}`} onClick={!isExpanded ? onClick : undefined}>
            <div className="review-card-front">
                <h3>#{orderId}</h3>
                <p>{name}</p>
                <p className="small">{new Date(date).toLocaleDateString()}</p>
            </div>

            {isExpanded && (
                <div className="review-card-details">
                    
                    <div className='order-info'>

                        <p><strong>Location:</strong> {location}</p>
                        <p><strong>Waybill:</strong> {waybill}</p>
                        <h4>Devices</h4>
                        <ul>
                            {Object.entries(devices).map(([deviceName, count]) => (
                                <li key={deviceName}>{deviceName}: {count}</li>
                            ))}
                        </ul>
                        <p><strong>Boxes:</strong> {boxes}</p>
                        <p><strong>Skids:</strong> {skids}</p>
                    </div>
                    <div className='btn-container'>

                        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
                        <button className='edit-btn'>Edit</button>
                        <button className='send-btn'>Send</button>
                        <button className='delete-btn'>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};