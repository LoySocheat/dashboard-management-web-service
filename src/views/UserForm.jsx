import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { capitalizeFirstLetter } from "../utils/Format";

const UserForm = ({userId, onClose, handleClickUpdate}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [user, setUser] = useState({
    id: null,
    username: "",
    phone: "",
    roleId: "",
    password: "",
    password_confirmation: "",
  });
  const onSubmit = (ev) => {
    ev.preventDefault();
    if (userId) {
      const payload = {
        username: user.username,
        phone: user.phone,
      };
      axiosClient
      .put(`/users/${userId}`, payload)
      .then(() => {
        // TODO show notification
        onClose();
        setNotification("User was successfully updated");
        handleClickUpdate();
      })
      .catch((err) => {
        const response = err.response;
        setErrors(response.data.message);
        // if (response && response.status === 422) {
        // }
      })
      .finally(() => {setLoading(false)});
    } else {
      if (user.password != user.password_confirmation ){
        setErrors('Password and Password Confirmation must be the same');
        return true;
      }
      const payload = {
        username: user.username,
        password: user.password,
        phone: user.phone,
        roleId: parseInt(user.roleId),
      }
      axiosClient
      .post(`/users`, payload)
      .then(() => {
        // TODO show notification
        onClose();
        setNotification("User was successfully created");
        setLoading(true);
        handleClickUpdate();
      })
      .catch((err) => {
        const response = err.response;
        setErrors(response.data.message);
        }).finally(() => {setLoading(false)});
      }
  };
  
  useEffect(() => {
    if (userId) {
      setLoading(true);
      axiosClient
        .get(`/users/${userId}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    hanldeCheckRole();
  },[]);

  const [role, setRole] = useState([]);
  const hanldeCheckRole = async () => {
    try {
      const response = await axiosClient.get(`/roles`);
      setRole(response.data.rows);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
      <div className="card animated fadeInDown modal-backdrop">
        <div className="modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {loading && <div className="text-center">Loading...</div>}
          {errors && (
            <div className="alert">
              <p>{errors}</p>
            </div>
          )}
          {!loading && (
            <form onSubmit={onSubmit}>
              {!userId && <h1>New User</h1>}
              {userId && <h1>Update User</h1>}
              <input
                value={user.username}
                onChange={(ev) => setUser({ ...user, username: ev.target.value })}
                placeholder="Name"
              />
              <input
                value={user.phone}
                onChange={(ev) => setUser({ ...user, phone: ev.target.value })}
                placeholder="Phone Number"
              />
              {!userId && <select
                value={user.roleId}
                onChange={(ev) => setUser({ ...user, roleId: ev.target.value })}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {role.map((r) => (
                  <option key={r.id} value={r.id}>
                    {capitalizeFirstLetter(r.title)}
                  </option>
                ))}
              </select>}
              {!userId && (
                <div>
                  <input
                    value={user.password}
                    onChange={(ev) => setUser({ ...user, password: ev.target.value })}
                    placeholder="Password"
                  />
                  <input
                    onChange={(ev) =>
                      setUser({ ...user, password_confirmation: ev.target.value })
                    }
                    placeholder="Password Confirmation"
                  />
                </div>
              ) }

                {/* disabled  */}
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
    </>
  );
};

export default UserForm;
