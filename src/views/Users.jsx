import { useEffect, useState, useMemo } from "react";
import axiosClient from "../axios-client";2
import { useStateContext } from "../contexts/ContextProvider";
import UserForm from "./UserForm";
import ConfirmDeleteModal from "./ConfimDeleteModel";
import UserDetail from "./UserDetail";
import IconTrash from "../assets/icons/IconTrash";
import IconEdit from "../assets/icons/IconEdit";
import IconRepeat from "../assets/icons/IconRepeat";
import { formatDate, capitalizeFirstLetter } from "../utils/Format";
import ConfirmChangeUserStatusModal from "./ConfimChangeUserStatus";
import Pagination from "../components/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [limit, setLimit] = useState(10);
  const [permissions , setPermissions] = useState(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const getUsers = async (username = '', phone = '') => {
    setLoading(true);
    setLoadingPage(false)
    const payload = {
      limit : limit,
      offset : (currentPage - 1) * limit,
    }
    if (username) {
      payload.username = username;
    }
    if (phone) {
      payload.phone = phone;
    }
    try {
      const response = await axiosClient.get(`/users`, {params: payload});
      const { rows, count } = response.data;
      setLoading(false);
      setUsers(rows);
      setTotalPages(Math.ceil(count / limit));
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user data:", error);
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
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalDetailOpen, setIsModalModalOpen] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  
  const handleEditClick = (user, event) => {
    event.stopPropagation();
    setSelectedUser(user);
    setIsUserFormVisible(true);
  };
  
  const handleAddClick = () => {
    setSelectedUser(null);
    setIsUserFormVisible(true);
  };
  
  const handleDeleteClick = (user, event) => {
    event.stopPropagation();
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };
  
  const handleConfirmDelete = (event) => {
    console.log("Deleting user:", selectedUser);
    axiosClient
    .delete(`/users/${selectedUser.id}`)
    .then((res) => {
      if (!res.data.success) {
        console.log(res.success);
        return setNotification(
          "An error occurred while deleting the user"
        );
      }
      setIsDeleteModalOpen(false);
      setLoadingPage(true);
      return setNotification("User was successfully deleted");
    })
    
  };
  
  const handleChangeStatusClick = (user, event) => {
    event.stopPropagation();
    setSelectedUser(user);
    setIsChangeStatusModalOpen(true);
  }
  
  const handleCloseChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
    setSelectedUser(null);
  }

  const handleConfirmChangeStatus = (event) => {
    console.log("Changing status of user:", selectedUser);
    if(selectedUser.isActive === true) {
      axiosClient
      .put(`/users/${selectedUser.id}/deactivate`)
      .then((res) => {
        if (!res.data.message === 'success') {
          console.log(res.success);
          return setNotification(
            "An error occurred while changing the status of the user"
          );
          }
          setIsChangeStatusModalOpen(false);
          setLoadingPage(true);
          return setNotification(
            "The status of the user was successfully changed"
          );
        })
      } else {
        axiosClient
        .put(`/users/${selectedUser.id}/activate`)
        .then((res) => {
          if (!res.data.message === 'success') {
            console.log(res.success);
            return setNotification(
              "An error occurred while changing the status of the user"
            );
          }
          setIsChangeStatusModalOpen(false);
          setLoadingPage(true);
          return setNotification(
            "The status of the user was successfully changed"
          );
        })
      }
    }
    
    const handleOpenDetailUser = (user, event) => {
    setSelectedUser(user);
    setIsModalModalOpen(true);
  };

  const handleCloseDetailUser = (event) => {
    setIsModalModalOpen(false);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getUsers(username, phone);
  };

  const refreshPage = () => {
    setUsername('');
    setPhone('');
    getUsers();
  }

  useEffect(() => {
    getUsers();
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
        {permissions != '3' && '4' && <button onClick={() => handleAddClick()} className="btn-add">
          New User
        </button>}
      </div>
      <div>
        <input 
          style={
            {
              width: "20%",
              padding: "10px",
              marginBottom: "10px",
              marginRight: "10px",
            }
          }
          placeholder="Search by username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          style={
            {
              width: "20%",
              padding: "10px",
              marginBottom: "10px",
              marginRight: "10px",
            }
          }
          placeholder="Search by phone"
          type="text"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
        <button
          onClick={handleSearch}
          style={
            {
              padding: "10px",
              marginBottom: "10px",
              marginRight: "10px",
            }
          }
        >
          Search
        </button>
        <button
          onClick={refreshPage}
          style={
            {
              padding: "10px",
              marginBottom: "10px",
            }
          }
        >
          Refresh
        </button>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Role</th>
              <th>Create Date</th>
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
              {users.map((U) => (
                <tr
                  className="hover-element"
                  key={U.id}
                  onClick={(event) => handleOpenDetailUser(U, event)}
                >
                  <td style={{
                    width: "100px",
                  }}>{U.id}</td>
                  <td>{capitalizeFirstLetter(U.username)}</td>
                  <td>{U.phone}</td>
                  <td
                    style={{
                      color: U.isActive === true ? "green" : "red",
                    }}
                  >
                    {U.isActive === true ? "Active" : "Inactive"}
                  </td>
                  <td>{capitalizeFirstLetter(U.Role.title)}</td>
                  <td>{formatDate(U.createdAt)}</td>
                  {permissions != 3 && 4 && <td>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <button
                        onClick={(event) => handleEditClick(U.id, event)}
                        className="btn-edit"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Edit&nbsp;
                        <IconEdit iconSize="20px" iconColor="#ffffff" />
                      </button>
                      &nbsp;&nbsp;
                      <button
                        onClick={(event) => handleDeleteClick(U, event)}
                        className="btn-delete"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Delete&nbsp;
                        <IconTrash iconSize="20px" iconColor="#ffffff" />
                      </button>
                      &nbsp;&nbsp;

                      <button
                        onClick={(event) => handleChangeStatusClick(U, event)}
                        className="btn-is-active"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {!U.isActive ? "Active" : "Deactive"}
                        &nbsp;
                        <IconRepeat iconSize="20px" iconColor="#ffffff" />
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
      {isUserFormVisible && (
        <UserForm
          userId={selectedUser}
          onClose={() => setIsUserFormVisible(false)}
          handleClickUpdate={getUsers}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={setIsDeleteModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          description="Are you sure you want to delete user? This action cannot be undone, and related orders will also be
            deleted."
        />
      )}

      {isModalDetailOpen && (
        <UserDetail
          selectedUser={selectedUser}
          onClose={handleCloseDetailUser}
        />
      )}

      {isChangeStatusModalOpen && (
        <ConfirmChangeUserStatusModal
          isOpen={setIsChangeStatusModalOpen}
          onClose={handleCloseChangeStatusModal}
          onConfirm={handleConfirmChangeStatus}
          description={
            selectedUser.isActive
              ? "Are you sure you want to deactivate this user?"
              : "Are you sure you want to activate this user?"
          }
          // userName={selectedUser ? selectedUser.name : ""}
        />
      )}
    </div>
  );
};

export default Users;
