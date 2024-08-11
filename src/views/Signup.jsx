import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
const Signup = () => {
    const nameRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const roleRef = useRef();
    const passwordConfirmationRef = useRef();
    const [errors , setErrors] = useState();
    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            username: nameRef.current.value,
            phone: phoneRef.current.value,
            password: passwordRef.current.value,
            roleId: roleRef.current.value,
        }
        axiosClient.post('/users', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if(response && response.status === 422){
                    setErrors(response.data.errors)
                }
            })
    }
    return ( 
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Signup for free
                    </h1>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                    }
                    <input ref={nameRef} type="text" placeholder="Full Name" />
                    <input ref={phoneRef} type="email" placeholder="Email Address" />
                    <input ref={roleRef} type="text" placeholder="Number role" />
                    <input ref={passwordRef} type="password" placeholder="Password" />
                    <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
                    <button className="btn btn-block">
                        Signup
                    </button>
                    <p className="message">
                        Already Registered? <Link to="/login">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
     );
}
 
export default Signup;