import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { formatDataTime } from "../utils/Format";

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
    zIndex: 1000, //
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
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    width: "90%", 
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    position: "relative", 
    zIndex: 1001, 
  }
}

const ClientLogDetail = ({ selectedClientLog, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [clientLog, setClientLog] = useState({});

  if (selectedClientLog) {
    useEffect(() => {
      axiosClient
        .get(`/client-logs/${selectedClientLog.id}`)
        .then(({ data }) => {
          setClientLog(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }
  return (
      <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Prevent click inside modal from closing it */}
        <button style={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div>
          {selectedClientLog && <h2>Detail Client-Log ID: #{clientLog.id}</h2>} <br />

          {loading && <div>Loading...</div>}
          {!loading && (
            <form>
              <h4>User ID</h4>
              <input defaultValue={clientLog.userId} placeholder="User ID" disabled/>
              <h4>App Info</h4>
              <textarea defaultValue={JSON.stringify(clientLog.app_info)} placeholder="App Info" disabled/>
              <h4>Device Info</h4>
              <textarea defaultValue={JSON.stringify(clientLog.device_info)} placeholder="Device Info" disabled/>
              <h4>Param</h4>
              <textarea defaultValue={JSON.stringify(clientLog.param)} placeholder="Param" disabled/>
              <h4>Log Date</h4>
              <p>{formatDataTime(clientLog.createdAt)}</p>
            </form>
          )}
        </div>
        </div>
      </div>
  );
};

export default ClientLogDetail;
