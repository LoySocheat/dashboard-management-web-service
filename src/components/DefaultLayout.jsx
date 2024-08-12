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
    // backgroundImage: "linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)"
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
  const { user, token, setUser, setToken, notification } = useStateContext();
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
        console.log(data.roleId);
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
      <aside style={styles.sideBar}>
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
      <div className="content">
        <header>
          <div>
          <img src={Logo} alt="Computer Logo" style={styles.logoImage}/>
          </div>
          <div  style={{color: 'white'}}>
            Yoo! <strong style={{color: 'green', marginRight: '30px'}}>{user.name}</strong>
            <a href="#" onClick={onLogout} className="btn-logout" style={{color: 'white', border: '1px solid #b72424', padding: '5px'}}>
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default DefaultLayout;
