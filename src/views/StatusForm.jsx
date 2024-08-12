import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const StatusForm = ({statusId, onClose, handleClickUpdate}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [status, setStatus] = useState({
    id: null,
    status: "",
    note: "",
    status_code: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (statusId) {
      const payload = {
        status: status.status,
        note: status.note,
        status_code: status.status_code,
      };
      axiosClient
      .put(`/app-function-statuses/${statusId}`, payload)
      .then(() => {
        // TODO show notification
        onClose();
        setNotification("Status was successfully updated");
        handleClickUpdate();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
      .finally(() => {setLoading(false)});
    } else {
      const payload = {
        status: status.status,
        note: status.note,
        status_code: status.status_code,
      }
      axiosClient
      .post(`/app-function-statuses`, payload)
      .then(() => {
        // TODO show notification
        onClose();
        setNotification("Status was successfully created");
        setLoading(true);
        handleClickUpdate();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      }).finally(() => {setLoading(false)});
    }
  }

  useEffect(() => {
    console.log("statusId", statusId);
    if (statusId) {
      axiosClient
      .get(`/app-function-statuses/${statusId}`)
      .then((response) => {
        setStatus(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  },[]);

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
              {!statusId && <h1>New Status</h1>}
              {statusId && <h1>Update Status</h1>}
              <input
                type="text"
                placeholder="Status"
                value={status.status}
                onChange={(ev) =>
                  setStatus({ ...status, status: ev.target.value })
                }
              />
              <input
                type="text"
                placeholder="Note"
                value={status.note}
                onChange={(ev) =>
                  setStatus({ ...status, note: ev.target.value })
                }
              />
              <input
                type="text"
                placeholder="Status Code"
                value={status.status_code}
                onChange={(ev) =>
                  setStatus({ ...status, status_code: ev.target.value })
                }
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

export default StatusForm;
