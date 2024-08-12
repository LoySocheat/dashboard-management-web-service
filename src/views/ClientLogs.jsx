import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { formatDataTime } from "../utils/Format";
import Pagination from "../components/Pagination";
import ClientLogDetail from "./ClientLogDetail";

const ClientLogs = () => {
    const [clientLogs, setClientLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingPage, setLoadingPage] = useState(false);
    const [limit, setLimit] = useState(10);
    const [userId, setUserId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchRoles = async ( userId = "", startDate = "", endDate = "") => {
        setLoading(true);
        setLoadingPage(false)
        const payload = {
            limit: limit,
            offset: (currentPage - 1) * limit,
        };
        if (userId) {
            payload.userId = userId;
        }
        if (startDate) {
            payload.startDate = startDate;
        }
        if (endDate) {
            payload.endDate = endDate;
        }

        try {
            const response = await axiosClient.get("/client-logs", { params: payload});
            const { rows, count } = response.data;
            setLoading(false);
            setClientLog(rows);
            setTotalPages(Math.ceil(count / limit));
        } catch (error) {
            console.error("Error loading clientLogs", error);
        } finally {
            setLoading(false);
        }
    };

    const previousPage = () => {
        if (currentPage === 1) {
          return;
        }
        setCurrentPage(currentPage - 1);
    };
      
    const nextPage = () => {
        if (currentPage === totalPages) {
          return;
        }
        setCurrentPage(currentPage + 1);
    };

    const setLimitPage = (number) => {
        setLimit(number);
    };

    const [isModalDetailOpen , setIsModalDetailOpen] = useState(false);
    const [selectedClientLogId, setSelectedClientLog] = useState(null);

    const handleOpenModalDetail = (clientLog) => {
        setSelectedClientLog(clientLog);
        setIsModalDetailOpen(true);
    }

    const handleCloseModalDetail = () => {
        setSelectedClientLog(null);
        setIsModalDetailOpen(false);
    }

    const handleSearch = () => {
        setLoadingPage(true);
        setCurrentPage(1);
        fetchRoles(
            userId,
            startDate,
            endDate,
        );
    }

    const refreshSearch = () => {
        setLoadingPage(true);
        setUserId("");
        setStartDate("");
        setEndDate("");
        fetchRoles();
    }
    
    useEffect(() => {
        fetchRoles();
    }, [currentPage, loadingPage]);    
    return (
        <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
          }}
          >
          <h1>Client Logs Management</h1>
        </div>
        <div
            style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                paddingBottom: "20px",
            }}
        >
            <div>
            {/* <p>User ID</p> */}
            <input
                style={
                    {
                        width: "200px",
                        padding: "10px",
                        marginBottom: "10px",
                        marginRight: "10px",
                    }
                }
                type="text"  
                placeholder="User ID"
                onChange={(e) => setUserId(e.target.value)}
                value={userId}
            />
            </div>
            <div>
            {/* <p>Start Date</p> */}
            <input
                style={
                    {
                        width: "200px",
                        padding: "10px",
                        marginBottom: "10px",
                        marginRight: "10px",
                    }
                }
                type="date"  
                placeholder="Start Date"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
            />
            </div>
            <div 
                style={
                    {
                        padding: "10px",
                        marginBottom: "10px",
                        marginRight: "10px",
                    }
                }
            >TO</div>
            <div>
            {/* <p>End Date</p> */}
            <input
                style={
                    {
                        width: "200px",
                        padding: "10px",
                        marginBottom: "10px",
                        marginRight: "10px",
                    }
                }
                type="date"  
                placeholder="End Date"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
            />
            </div>
            <div>
                <button
                    style={
                        {
                            padding: "10px",
                            marginBottom: "10px",
                            marginRight: "10px",
                        }
                    }
                    onClick={handleSearch}
                >
                    Search
                </button>
                <button
                    style={
                        {
                            padding: "10px",
                            marginBottom: "10px",
                            marginRight: "10px",
                        }
                    }
                    onClick={refreshSearch}
                >
                    Refresh
                </button>
            </div>
            
        </div>
        <div className="card animated fadeInDown ">
            <div className="card-body">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>App Info</th>
                            <th>Device Info</th>
                            <th>Error Info</th>
                            <th>Created Date</th>
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
                    {!loading && <tbody>
                        {clientLogs.map((clientLog) => (
                            <tr 
                                className="hover-element"
                                key={clientLog.id} 
                                onClick={(event) => handleOpenModalDetail(clientLog, event)}
                            >
                                <td>{clientLog.id}</td>
                                <td>{clientLog.userId}</td>
                                <td>{clientLog.app_info.model}</td>
                                <td>{clientLog.device_info.model}</td>
                                <td>{clientLog.param.error}</td>
                                <td>{formatDataTime(clientLog.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>}
                </table>
            </div>
        </div>
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
            onPage={setCurrentPage}
        />
        {isModalDetailOpen && (
            <ClientLogDetail
                onClose={handleCloseModalDetail}
                selectedClientLog={selectedClientLogId}
            />
        )}
        </div>


    );
}

export default ClientLogs;