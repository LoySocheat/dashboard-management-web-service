import React from "react";

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, 
  },
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    width: "90%", 
    maxHeight: "80vh", 
    overflowY: "auto", 
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    position: "relative", 
    zIndex: 1001, 
    display: "flex",
    flexDirection: "column", 
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#666",
  },
  header: {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
    textAlign: "center", 
  },
  productItem: {
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "10px",
    marginBottom: "10px",
    lineHeight: "1.5", 
  },
  note: {
    fontStyle: "italic",
    color: "#888", 
    marginTop: "5px", 
  },
  total: {
    fontWeight: "bold",
    fontSize: "20px", 
    color: "#333", 
    borderTop: "1px solid #eee", 
    paddingTop: "10px", 
    marginTop: "20px", 
    textAlign: "right", 
  },
  productName: {
    fontWeight: "bold", 
    fontSize: "14px", 
  },
  productDetails: {
    color: "#666", 
    fontSize: "14px", 
  },
  status: {
    
    fontWeight: "bold",
    display: "inline-block",
    padding: "2px 5px",
    borderRadius: "5px",
    textTransform: "uppercase",
    fontSize: "12px",
    margin: "5px",
  },
  statusPending: {
    backgroundColor: "#f0ad4e",
    color: "white",
  },
  statusConfirmed: {
    backgroundColor: "#5cb85c",
    color: "white",
  },
  statusRejected: {
    backgroundColor: "#d9534f",
    color: "white",
  },
  statusCancelled: {
    backgroundColor: "#6c757d",
    color: "white",
  },
  productNumber: {
    fontWeight: "bold",
    marginRight: "10px",
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  userInfo: {
    fontStyle: "italic",
  },
  productLayout: {
    display: "flex",
    alignItems: "center",
    margin: "5px",
    gap: "100px",
  },
};

const OrderDetail = ({ order, onClose }) => {
  // Calculate total price
  const totalPrice = order.products.reduce(
    (acc, product) => acc + product.price * product.pivot.quantity,
    0
  );

  // Function to get status style based on order status
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "confirmed":
        return styles.statusConfirmed;
      case "rejected":
        return styles.statusRejected;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return {};
    }
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      {" "}
      {/* Close modal when backdrop is clicked */}
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Prevent click inside modal from closing it */}
        <button style={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div style={styles.header}>
          <h2>Order ID: {order.id}</h2>
          <p>
            Status:{" "}
            <span style={{ ...styles.status, ...getStatusStyle(order.status) }}>
              {order.status}
            </span>
          </p>
          <p>
            Note: <span style={styles.note}>{order.note}</span>
          </p>
        </div>
        <div>
          <h3>Selected Products</h3> <br/>
          {order.products.map((product, index) => (
            <div key={product.id} style={styles.productItem}>
              <p>
                <span style={styles.productNumber}>#{index + 1}</span>
                <span style={styles.productName}>Name: {product.name}</span>
              </p>
              <div style={styles.productLayout}>
                <div>
                  <p>Price: <span style={styles.productDetails}>${product.price}</span></p>

                  <p>Brand: <span style={styles.productDetails}>{product.brand}</span></p>
                  <p>
                    Processor: <span style={styles.productDetails}>{product.processor}</span>
                  </p>
                </div>
                <div>
                  <p>RAM: <span style={styles.productDetails}>{product.ram}</span></p>
                  <p>
                    Storage: <span style={styles.productDetails}>{product.storage}</span>
                  </p>

                  <p>
                    Quantity: <span style={styles.productDetails}>{product.pivot.quantity}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.bottomRow}>
          <div style={styles.userInfo}>
            <h4>Order By:</h4>
            <p>Name: {order.user.name}</p>
            <p>Email: {order.user.email}</p>
          </div>
          <p style={styles.total}>Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
