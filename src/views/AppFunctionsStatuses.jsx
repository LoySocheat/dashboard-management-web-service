import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { formatDataTime, capitalizeFirstLetter } from "../utils/Format";
import IconTrash from "../assets/icons/IconTrash";
import IconEdit from "../assets/icons/IconEdit";
import Pagination from "../components/Pagination";
import StatusForm from "./StatusForm";
import ConfirmDeleteModal from "./ConfimDeleteModel";

const AppFunctionsStatuses = () => {
    const [appFunctionsStatuses, setAppFunctionsStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setNotification } = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingPage, setLoadingPage] = useState(false);
    const [limit, setLimit] = useState(6);
    const [permissions, setPermissions] = useState([]);

    const fetchAppFunctionsStatuses = async () => {
        setLoading(true);
        setLoadingPage(false);
        const payload = {
            limit: limit,
            offest: (currentPage - 1) * limit,
        };
        try {
            const response = await axiosClient.get("/app-function-statuses", {
                params: payload,
            });
            const { rows, count } = response.data;
            setLoading(false);
            setAppFunctionsStatuses(rows);
            setTotalPages(Math.ceil(count / limit));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const getMe = async () => {
        try {
            const response = await axiosClient.get("/users/me");
            const { roleId } = response.data;
            setPermissions(roleId);
        } catch (error) {
            console.error("Error fetching user data:", error);
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

    const [selectedAppFunctionsStatus, setSelectedAppFunctionsStatus] =
        useState(null);
    const [isAppFunctionsStatusModalOpen, setIsAppFunctionsStatusModalOpen] =
        useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleAddClick = () => {
        console.log("Add new app functions status");
        setSelectedAppFunctionsStatus(null);
        setIsAppFunctionsStatusModalOpen(true);
    };

    const handleEditClick = (appFunctionsStatus, event) => {
        setSelectedAppFunctionsStatus(appFunctionsStatus);
        setIsAppFunctionsStatusModalOpen(true);
    };

    const handleDeleteClick = (appFunctionsStatus) => {
        setSelectedAppFunctionsStatus(appFunctionsStatus);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = (event) => {
        axiosClient
        .delete(`/app-function-statuses/${selectedAppFunctionsStatus.id}`)
        .then((res) => {
          if (!res.data.success) {
            console.log(res.success);
            return setNotification(
              "An error occurred while deleting the App Functions Status"
            );
          }
          setIsDeleteModalOpen(false);
          setLoadingPage(true);
          return setNotification("App Functions Status deleted successfully");
        }) 
    };

    

    useEffect(() => {
        fetchAppFunctionsStatuses();
        getMe();
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
                <h1>User Management</h1>
                {permissions != "3" && "4" && (
                    <button onClick={() => handleAddClick()} className="btn-add">
                        Function Statuses
                    </button>
                )}
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Status</th>
                            <th>Note</th>
                            <th>Status ID</th>
                            <th>Created At</th>
                            { (permissions == 1 || permissions == 2 ) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {appFunctionsStatuses.map((appFunctionsStatus) => (
                            <tr key={appFunctionsStatus.id}>
                                <td>{appFunctionsStatus.id}</td>
                                <td>{capitalizeFirstLetter(appFunctionsStatus.status)}</td>
                                <td>{appFunctionsStatus.note}</td>
                                <td>{appFunctionsStatus.status_code}</td>
                                <td>{formatDataTime(appFunctionsStatus.createdAt)}</td>
                                { (permissions == 1 || permissions == 2 ) && <td
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    <button
                                        onClick={() => handleEditClick(appFunctionsStatus)}
                                        className="btn-edit"
                                        style={{
                                            marginRight: "10px",
                                            display: "flex",
                                        }}
                                    >
                                        Edit&nbsp;
                                        <IconEdit iconSize="20px" iconColor="#ffffff" />
                                    </button>
                                    <button
                                        style={{
                                            marginRight: "10px",
                                            display: "flex",
                                        }}
                                        onClick={() => handleDeleteClick(appFunctionsStatus)}
                                        className="btn-delete"
                                    >
                                        Delete&nbsp;
                                        <IconTrash iconSize="20px" iconColor="#ffffff" />
                                    </button>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={previousPage}
                onNextPage={nextPage}
                onPage={setCurrentPage}
            />
            {isAppFunctionsStatusModalOpen && (
            <StatusForm
                statusId={selectedAppFunctionsStatus?.id}
                onClose={() => setIsAppFunctionsStatusModalOpen(false)}
                handleClickUpdate={() => {
                    setIsAppFunctionsStatusModalOpen(false);
                    fetchAppFunctionsStatuses();
                }}
            />
            )}
            {isDeleteModalOpen && (
                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    description="Are you sure you want to delete this app functions status?"
                />
            )}
        </div>
    );
};

export default AppFunctionsStatuses;
