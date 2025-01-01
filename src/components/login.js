import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoHome } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function changeHandler(event) {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function clickHandler(event) {
        event.preventDefault(); // Prevent form refresh


        if (!formData.username || !formData.password) {
            toast.error("Both username and password are required.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            if (response.data.success) {
                // Store the JWT token in localStorage
                localStorage.setItem('token', response.data.token);


                toast.success("Login successful!");
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setError(response.data.message || "Invalid username or password");
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "Error logging in. Please try again."
            );
        }
    }

    function goToHome() {
        navigate('/');
    }
    return (
        <div className="login">
            <h2>Login</h2>
            <form>
                <div className="txt_field">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={changeHandler}
                        name="username"
                        value={formData.username}
                    />
                </div>
                <div className="txt_field">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={changeHandler}
                        name="password"
                        value={formData.password}
                    />
                </div>


                <button onClick={clickHandler}>Login <IoMdLogIn /></button>

            </form>
            {error && <p>{error}</p>}
            <button className='btn-home' onClick={goToHome}>Home<IoHome /></button>
            <ToastContainer
                position="top-center"
                autoClose={900}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"

            />

        </div>
    );
}

export default Login;
