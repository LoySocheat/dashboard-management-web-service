import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

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

const UserDetail = ({ selectedUser, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  console.log(user);

  if (selectedUser) {
    useEffect(() => {
      axiosClient
        .get(`/users/${selectedUser.id}`)
        .then(({ data }) => {
          console.log(data);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }
  return (
      <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Prevent click inside modal from closing it */}
        <button style={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        <div>
          {selectedUser && <h2>Information User ID: #{user.id}</h2>} <br />

          {!loading && (
            <form>

              <h4>Username</h4>
              <input defaultValue={user.username} placeholder="Username"/>

              <h4>Phone Number</h4>
              <input defaultValue={user.phone} placeholder="Phone Number" />

              <h4>Encrypted Password</h4>
              <input defaultValue={user.password} placeholder="Password" />

              <h4>User Created Date (UTC)</h4>
              <input defaultValue={(user.createdAt)} placeholder="Created Date" />

              <h4>Last Updated Date (UTC)</h4>
              <input defaultValue={user.updatedAt} placeholder="Updated Date" />
            </form>
          )}
        </div>
        </div>
      </div>
  );
};

export default UserDetail;
