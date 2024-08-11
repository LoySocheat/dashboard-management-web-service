import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import OrderDetail from "./OrderDetail";
import IconConfirm from "../assets/icons/IconConfirm";
import IconReject from "../assets/icons/IconReject";

const Orders = () => {
  const styles = {
    status: {
      fontWeight: "bold",
    },
    statusPending: {
      color: "#f0ad4e",
    },
    statusConfirmed: {
      color: "#5cb85c",
    },
    statusRejected: {
      color: "#d9534f",
    },
    statusCancelled: {
      color: "#6c757d",
    },
  };
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      setLoadingPage(false);
      try {
        const response = await axiosClient.get(`/orders?page=${currentPage}`);
        const { data, meta } = response.data;
        setLoading(false);
        setOrders(data);
        setTotalPages(meta.last_page);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching order data:", error);
      }
    };

    getOrders();
  }, [currentPage, loadingPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGoToPage = () => {
    const parsedPage = parseInt(goToPage, 10);
    if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
      setCurrentPage(parsedPage);
      setGoToPage("");
    } else {
      // Handle invalid input (e.g., show an error message)
    }
  };

  const handleClose = () => {
    return setModalOpen(false);
  };

  const handleRowClick = (orderId, event) => {
    axiosClient.get(`/orders/${orderId}`).then((res) => {
      if (!res.data.success) {
        console.log(res.success);
        return setNotification(res.data.message);
      }
      console.log(res.data);
      setOrder(res.data.order);
      setModalOpen(true);
      return;
    });
  };

  const handleConfirmClick = (orderId, event) => {
    event.stopPropagation();
    axiosClient.put(`/orders/${orderId}/confirm`).then((res) => {
      if (!res.data.success) {
        console.log(res.success);
        return setNotification(res.data.message);
      }
      setLoadingPage(true);
      return setNotification(res.data.message);
    });
  };

  const handleRejectClick = (orderId, event) => {
    event.stopPropagation();
    axiosClient.put(`/orders/${orderId}/reject`).then((res) => {
      if (!res.data.success) {
        return setNotification(res.data.message);
      }
      setLoadingPage(true);
      return setNotification(res.data.message);
    });
  };

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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Order Management</h1>
      </div>
      <div className="card animated fadeInDown ">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Order By</th>
              <th>Total Quantity</th>
              <th>Total Price</th>
              <th>Note</th>
              <th>Status</th>
              <th>Date Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {orders.map((U) => (
                <tr
                  key={U.id}
                  className="hover-element"
                  onClick={(event) => handleRowClick(U.id, event)}
                >
                  <td>{U.id}</td>
                  <td>{U.user.email}</td>
                  <td>{U.total_quantity}</td>
                  <td>
                    {U.products
                      .reduce((acc, product) => {
                        return (
                          acc + parseFloat(product.price) * product.quantity
                        );
                      }, 0)
                      .toFixed(2)}
                    $
                  </td>
                  <td>{U.note}</td>
                  <td style={{ ...styles.status, ...getStatusStyle(U.status) }}>
                    {U.status}
                  </td>
                  <td>{U.created_at}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <button
                        onClick={(event) => handleConfirmClick(U.id, event)}
                        className="btn-edit"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Confirm&nbsp;
                        <IconConfirm iconSize="20px" iconColor="#ffffff" />
                      </button>
                      &nbsp;&nbsp;
                      <button
                        onClick={(event) => handleRejectClick(U.id, event)}
                        className="btn-delete"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Reject&nbsp;
                        <IconReject iconSize="20px" iconColor="#ffffff" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="pagination">
        <div className="current-search">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <input
            type="text"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            placeholder={`1-${totalPages}`}
          />
          <button onClick={handleGoToPage}>Go</button>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && <OrderDetail order={order} onClose={handleClose} />}
    </div>
  );
};

export default Orders;
