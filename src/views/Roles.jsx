import { useEffect, useState} from "react";
import axiosClient from "../axios-client";
import { formatDataTime, capitalizeFirstLetter } from "../utils/Format";

const Roles= () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/roles");
            const { rows, count } = response.data;
            setRoles(rows);
        } catch (error) {
            console.error("Error loading roles", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchRoles();
    }, []);

    const styles = {
        tr: {
            width: "25%",
        },
    }
    
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
            <h1>Role Management</h1>
            </div>
            <div className="card animated fadeInDown ">
                <div className="card-body">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th style={styles.tr}>ID</th>
                            <th style={styles.tr}>Name</th>
                            <th style={styles.tr}>Created Date</th>
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
                    <tbody>
                        {roles.map((role) => (
                            <tr style={{
                                height: "48px",
                                width: "25%",
                            }} key={role.id}>
                            <td style={styles.tr}>{role.id}</td>
                            <td style={styles.tr}>{capitalizeFirstLetter(role.title)}</td>
                            <td style={styles.tr}>{formatDataTime(role.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

export default Roles;