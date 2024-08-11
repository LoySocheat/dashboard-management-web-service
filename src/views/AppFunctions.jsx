import { useEffect, useState, useMemo } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import Pagination from "../components/Pagination";
import { formatDataTime } from "../utils/Format";
import IconEdit from "../assets/icons/IconEdit";
import IconTrash from "../assets/icons/IconTrash";
import { capitalizeFirstLetter } from "../utils/Format";
import AppFunctionForm from "./AppFunctionForm";
import ConfirmDeleteModal from "./ConfimDeleteModel";

const AppFunctions = () => {
    const [appFunctions, setAppFunctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setNotification} = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingPage, setLoadingPage] = useState(false);
    const [limit, setLimit] = useState(6);
    const [permissions, setPermissions] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const fetchAppFunctions = async (username = 'socheat') => {
        setLoading(true);

        const payload = {
            limit: limit,
            offset: (currentPage - 1) * limit,
        };

        try {
            const response = await axiosClient.get('/app-functions', {params: payload});
            const {rows , count} = response.data;
            setAppFunctions(rows);
            setLoading(false);
            setTotalPages(Math.ceil(count / limit));
        } catch (error) {
            setNotification({type: 'error', message: error.message});
            setLoading(false);
        }

    };
    const getMe = async () => {
        try {
          const response = await axiosClient.get(`/users/me`);
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

    const [selectedAppFunction, setSelectedAppFunction] = useState(null);
    const [isAppFunctionFormVisible, setIsAppFunctionFormVisible] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleAddClick = () => {
        setSelectedAppFunction(null);
        setIsAppFunctionFormVisible(true);
    };

    const handleEditClick = (appFunction, event) => {
        event.stopPropagation();
        setSelectedAppFunction(appFunction.id);
        setIsAppFunctionFormVisible(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedAppFunction(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = () => {
        axiosClient.delete(`/app-functions/${selectedAppFunction}`)
        .then(() => {
            setNotification('Function deleted successfully');
            fetchAppFunctions();
            setIsDeleteModalOpen(false);
        })
        .catch((error) => {
            // setNotification({type: 'error', message: error.message});
            setIsDeleteModalOpen(false);
        });
    };

    useEffect(() => {
        fetchAppFunctions();
        getMe();
    }, [currentPage, limit]);
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
                <h1>App Functions</h1>
            {permissions != '3' && '4' && <button onClick={() => handleAddClick()} className="btn-add">
                New Function
                </button>}
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Function Name</th>
                            <th>Remark</th>
                            <th>Last Updated</th>
                            <th>Status</th>
                            {permissions != '3' && '4' &&  <th>Actions</th>}
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
                            {appFunctions.map((appFunction) => (
                                <tr className="hover-element" key={appFunction.id}>
                                    <td>{appFunction.id}</td>
                                    <td>{appFunction.group}</td>
                                    <td>{
                                        appFunction.remark ? appFunction.remark : 'No Data'    
                                    }</td>
                                    <td>{formatDataTime(appFunction.updatedAt)}</td>
                                    <td>
                                        <div                       
                                            style={{
                                              display: "flex",
                                            }}
                                        >
                                        <p
                                            style={{
                                                width: '100px',
                                                color: appFunction.AppFunctionStatus.status === 'normal' ? 'rgb(138 199 50 / 1)' :
                                                appFunction.AppFunctionStatus.status === 'maintenance' ? 'rgb(250 204 21 / 1)' :
                                                appFunction.AppFunctionStatus.status === 'updating' ? 'rgb(0 128 128 / 1)' :
                                                appFunction.AppFunctionStatus.status === 'developing' ? 'rgb(79 70 229 / 1)' : 'white',
                                                borderRadius: '5px',
                                                height: '30px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: appFunction.AppFunctionStatus.status === 'normal' ? 'rgb(138 199 50 / 0.4)' : 
                                                appFunction.AppFunctionStatus.status === 'maintenance' ? 'rgb(250 204 21 / 0.4)' : 
                                                appFunction.AppFunctionStatus.status === 'updating' ? 'rgb(0 128 128 / 0.4)' : 
                                                appFunction.AppFunctionStatus.status === 'developing' ? 'rgb(79 70 229 / 0.4)' : 'black',

                                            }}
                                        >    
                                            {capitalizeFirstLetter(appFunction.AppFunctionStatus.status)}
                                        </p>
                                        </div>
                                    </td>
                                    {permissions != 3 && 4 && <td>
                                        <div
                                            style={{
                                                display: "flex",
                                            }}
                                        >
                                            <button
                                                style={{
                                                    marginRight: "5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                                className="btn-edit"
                                                onClick={() => handleEditClick(appFunction, event)}
                                            >
                                                Edit&nbsp;
                                                <IconEdit iconSize="20px" iconColor="#ffffff" />
                                            </button>
                                            <button
                                                style={{
                                                    marginRight: "5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                                className="btn-delete"
                                                onClick={() => handleDeleteClick(appFunction.id)}
                                            >
                                                Delete&nbsp;
                                                <IconTrash iconSize="20px" iconColor="#ffffff" />
                                            </button>
                                        </div>
                                    </td>}
                                </tr>
                            ))}
                        </tbody>
                    )}
                    </table> 
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={previousPage}
                onNextPage={nextPage}
                onPage={setCurrentPage}
            />
            {isAppFunctionFormVisible && (
            <AppFunctionForm
                functionId={selectedAppFunction}
                onClose={() => setIsAppFunctionFormVisible(false)}
                handleClickUpdate={fetchAppFunctions}
            />
            )}
            {isDeleteModalOpen && (
            <ConfirmDeleteModal
                isOpen={setIsDeleteModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                description="Are you sure you want to delete this function?"
            />
            )}
        </div>
    );
};

export default AppFunctions;