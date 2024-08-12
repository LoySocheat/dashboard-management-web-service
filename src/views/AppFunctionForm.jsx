import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { capitalizeFirstLetter } from "../utils/Format";

const AppFunctionForm = ({functionId, onClose, handleClickUpdate}) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    const [permissions , setPermissions] = useState([]);
    const [appFunction, setAppFunction] = useState({
        id: null,
        remark: "",
        group: "",
        status: "",
    });
    const [status, setStatus] = useState();

    const onSubmit = (ev) => {

        ev.preventDefault();
        if (functionId) {
            axiosClient.put(`/app-functions/${functionId}/status-update`, appFunction)
            .then(() => {
                setNotification(
                    "Function updated successfully"
                );
                handleClickUpdate();
                onClose();
            })
            .catch((error) => {
                // setErrors(error.response);
            });
        } else {
            const payload = {
                group: appFunction.group,
                status_id: appFunction.status,
                remark: appFunction.remark,
            };
            axiosClient.post(`/app-functions`, payload)
            .then(() => {
                setNotification(
                    "Function created successfully"
                );
                handleClickUpdate();
                onClose();
            })
            .catch((error) => {
                // setErrors(error.response);
            });

        }
    };
    const fetchAppFunction = () => {
        setLoading(true);
        axiosClient.get(`/app-functions/${functionId}`)
        .then((response) => {
            setAppFunction(response.data);
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    }

    const getMe = () => {
        axiosClient.get("/users/me")
        .then(({ data }) => {
            setPermissions(data.roleId);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        })
    };

    useEffect(() => {
        getMe();
        if (functionId) {
            fetchAppFunction();
        };
        getStatuses();
    },[]);

    const getStatuses = () => {
        axiosClient.get('/app-function-statuses')
        .then((response) => {
            setStatus(response.data.rows);
        })
        .catch(() => {
            setStatus([]);
        });
    };

    return (
        <div>
            <div className="card animated fadeInDown modal-backdrop" onClick={onClose}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                    {Object.keys(errors).map((key) => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        {!functionId && <h1>Add App Function</h1>}
                        {functionId && <h1>Update App Function</h1>}
                        {console.log(permissions)}
                        <input
                            disabled={permissions != 1 && permissions != 2}
                            value={appFunction.group}
                            onChange={(ev) => setAppFunction({ ...appFunction, group: ev.target.value })}
                            placeholder="Function Name"
                        />

                        <select
                            value={appFunction.status}
                            onChange={(ev) => setAppFunction({ ...appFunction, status: ev.target.value })}
                        >
                            <option value="">Select Status</option>
                            {status && status.map((item) => (
                                <option key={item.id} value={item.id}>{capitalizeFirstLetter(item.status)}</option>
                            ))}
                        </select>
                        <input
                            value={appFunction.remark}
                            onChange={(ev) => setAppFunction({ ...appFunction, remark: ev.target.value })}
                            placeholder="Remark"
                        />

                        <div>
                            <button className="btn-edit set-margin">Save</button>
                            <button type="button" className="btn-delete" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                </div>
                </div>
        </div>
    );

};

export default AppFunctionForm;