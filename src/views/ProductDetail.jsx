import React, { useState } from "react";

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
  closeButton: {
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
    marginBottom: "20px",
  },
  detailRow: {
    marginBottom: "10px",
    lineHeight: "1.6",
  },
  label: {
    fontWeight: "bold",
  },
  imageGallery: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  imageWrapper: {
    width: "150px",
    height: "150px",
    marginRight: "10px",
    marginBottom: "10px",
    overflow: "hidden",
    borderRadius: "8px",
    position: "relative",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.2s ease-in-out",
  },
};

const ProductDetail = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState();

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div style={styles.header}>
          <h2>Product Details</h2>
        </div>
        <p style={styles.detailRow}>
          <span style={styles.label}>Name:</span> {product.name}
        </p>
        <p style={styles.detailRow}>
          <span style={styles.label}>Price:</span> ${product.price}
        </p>
        <p style={styles.detailRow}>
          <span style={styles.label}>Brand:</span> {product.brand}
        </p>
        <p style={styles.detailRow}>
          <span style={styles.label}>Processor:</span> {product.processor}
        </p>
        <p style={styles.detailRow}>
          <span style={styles.label}>RAM:</span> {product.ram} GB
        </p>
        <p style={styles.detailRow}>
          <span style={styles.label}>Storage:</span> {product.storage} GB
        </p>
        <div>
          <h3>Images</h3>
          <div style={styles.imageGallery}>
            {/* {product.images.map((image) => (
              <div
                key={image.id}
                style={styles.imageWrapper}
                onMouseEnter={() => setSelectedImage(image.image_path)}
                onFocus={() => setSelectedImage(image.image_path)}
              >
                <img
                  src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${image.image_path}`}
                  alt="Product"
                  style={styles.image}
                />
              </div>
            ))} */}
            {product.images.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_APP_BASE_URL}/storage/${product.images[0].image_path}`}
                  alt={`Product ${product.id} Image`}
                  style={{ width: "100px", height: "auto", margin: "5px" }}
                />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
