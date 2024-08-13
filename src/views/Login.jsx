import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors , setErrors] = useState();
    const {setUser, setToken} = useStateContext();
    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            phone: emailRef.current.value,
            password: passwordRef.current.value,
        }
        axiosClient.post('/login-dashboard', payload)
        .then(({data}) => {
            setToken(data.accessToken)
            localStorage.setItem('permissions', JSON.stringify(data.user.roleId))
            setUser(data.user)
            console.log(data.user)
        })
        .catch(err => {
            const response = err.response;
            setErrors(response.data)
        })
    }
    return ( 
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Login into your account
                    </h1>
                    { errors && <div className="alert"
                        style={{background: '#FF5963' }}
                    >
                        <p>{errors.message}</p>
                    </div>
                    }
                    <input
                        style={errors&& {borderColor: '#FF5963'}}  
                    ref={emailRef} type="text" placeholder="Phone" />
                    <input
                        style={errors&& {borderColor: '#FF5963'}}
                    ref={passwordRef} type="password" placeholder="Password" />
                    <button className="btn btn-block">
                        Login
                    </button>
                    <p className="message">
                        Not Registered? <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
     );
}
 
export default Login;