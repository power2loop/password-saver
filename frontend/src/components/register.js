import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../url';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function changeHandler(event) {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function submitHandler(event) {
        event.preventDefault();


        if (formData.password !== formData.confirmPassword) {
            toast.warn("Passwords do not match!");
            return;
        }


        try {
            // Send registration data to the backend
            const response = await axios.post(`${baseURL}/register`, formData);
            console.log(response);

            // Check if the registration was successful and a token is returned
            if (response.status === 201) {
                toast.success("Registration successful! Please login.");
                // Redirect to dashboard directly after registration
                setTimeout(() => navigate('/login'), 1000);
            } else {
                console.log("Failed to register. Please try again.");
                toast.error("Failed to register. Please try again.");
            }
        } catch (error) {
            console.log("User already exist! Please try again");
            toast.info("User already exist! Please try again.");
        }
    }



    return (
        <div className="register">
            <h2>Register</h2>
            <form>
                <div className="txt_field">
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={changeHandler}
                    />
                </div>

                <div className="txt_field">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                    />
                </div>

                <div className="txt_field">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                    />
                </div>


                <div className="txt_field">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={changeHandler}
                    />
                    <label>Confirm Password</label>
                </div>

                <button onClick={submitHandler}>Register</button>
            </form >
            <div className="signup_link">
                Already have an account? <a href="/login">Login here</a>
            </div>
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


        </div >
    );
}

export default Register;
