import { Navigate, Outlet, Link , useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect,useState } from "react";
import axiosClient from "../axios-client";
import IconUser from "../assets/icons/IconUser";
import Logo from '../assets/images/logo.jpg';
import IconBrandStackshare from "../assets/icons/IconBrandStackshare";
import IconGraph from "../assets/icons/IconGraph";
import IconPower from "../assets/icons/IconPower";
import IconAppsFilled from "../assets/icons/IconAppsFilled";

const styles = {
  content: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    margin: "5px 0",
  },
  sideBar: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
    paddingBottom: "30vh",
    position: "relative",
    zIndex: 100,
  },
  logoImage: {
    width: '20%',
    height: '20%'
  },

  routerLocation: {
    backgroundColor: "#1e1e1e",
  },

};
const DefaultLayout = () => {
  const { user, token, setUser, setToken, notification, sessionExpired, setSessionExpired } = useStateContext();
  if (!token) {
    return <Navigate to="/login" />;
  }
  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });

    localStorage.removeItem('ACCESS_TOKEN');
    return window.location.reload();
  };

  const location = useLocation();
  const currentPath = location.pathname;
  const [permissions, setPermissions] = useState([]);

  const getMe = () => {
    axiosClient.get("/users/me").then(({ data }) => {
        setUser(data);
        setPermissions(data.roleId);
      }).catch((err) => {
        setSessionExpired(true);
      }
    );
  };

  useEffect(() => {
    getMe();
    axiosClient.get("/users").then(({ data }) => {
      setUser(data);
    });
  }, []);
  return (
    <div id="defaultLayout">
      <aside style={styles.sideBar}
      >
        {/* show only roles 1 or 2 */}
          { permissions 
            && (permissions === 1 || permissions === 2)
          &&<Link to="/roles" 
              style={{...styles.content,
              backgroundColor: currentPath === "/roles" ? "rgba(0, 0, 0, 0.2)" : "transparent",
            }}
          >
            <IconBrandStackshare iconColor="#ffffff" />
            &nbsp; Roles
          </Link>}
        <Link to="/users" 
          style={{...styles.content,
            backgroundColor: currentPath === "/users" ? "rgba(0, 0, 0, 0.2)" : "transparent",
          }}
        >
          <IconUser iconColor="#ffffff" />
          &nbsp; Users
        </Link>
        
        <Link to="/client-logs" 
            style={{...styles.content,
            backgroundColor: currentPath === "/client-logs" ? "rgba(0, 0, 0, 0.2)" : "transparent",
          }}
        >
          <IconGraph iconColor="#ffffff" />
          &nbsp; Client logs
        </Link>
        <Link to="/app-functions" 
            style={{...styles.content,
            backgroundColor: currentPath === "/app-functions" ? "rgba(0, 0, 0, 0.2)" : "transparent",
          }}
        >
          <IconAppsFilled iconColor="#ffffff" />
          &nbsp; App Functions
        </Link>
        <Link to="/function-statuses" 
            style={{...styles.content,
            backgroundColor: currentPath === "/function-statuses" ? "rgba(0, 0, 0, 0.2)" : "transparent",
          }}
        >
          <IconPower iconColor="#ffffff" />
          &nbsp; Function Statuses
        </Link>
      </aside>
      <div className="content"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            display: "flex",
            zIndex: 1000,
          }}
        >
          <div>
          <img src={Logo} alt="Computer Logo" style={styles.logoImage}/>
          </div>
          <div  style={{color: 'white'}}>
            Yoo! 
            <strong 
              style={{
                color: 'white',
                marginRight: '30px',
                textTransform: "capitalize",
              }}
            >
            &nbsp;{user.username}
            </strong>
            <a href="#" onClick={onLogout} className="btn-logout" style={{color: 'white', border: '1px solid #b72424', padding: '5px'}}>
              Logout
            </a>
          </div>
        </header>
        <main 
          style={{
            position: "relative",
            padding: "20px",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Outlet />
        </main>
      </div>
      {notification && <div className="notification">{notification}</div>}
      {sessionExpired && <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "5px",
            textAlign: "center",
            width: "500px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: "red",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >Session Expired</h1>
          <p>Your session is expired, please log in again!</p>
          
          <button className="btn-edit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "5px",
              textDecoration: "none",
            }}
            onClick={onLogout}
          >
            Login again
          </button>
        </div>
      </div>}
    </div>
  );
};

export default DefaultLayout;
