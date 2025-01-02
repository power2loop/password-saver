import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { baseURL } from '../../url';

function StorePassword() {
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return {};
        }
        return {
            Authorization: `Bearer ${token}`, // Include token in headers
        };
    }

    function changeHandler(event) {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function saveHandler(event) {
        event.preventDefault();

        try {
            const response = await axios.post(`${baseURL}/add`, formData, {
                headers: getAuthHeaders(), // Include token in request headers
            });
            console.log('Password saved:', response.data);
            toast.success("Password saved successfully!");
            setTimeout(() => navigate('/dashboard'), 500);

            // Reset form after saving
            setFormData({
                name: "",
                url: "",
                email: "",
                password: "",
            });
        } catch (error) {
            console.error('Error saving password:', error);

            if (error.response) {
                // Log the error response from the backend
                console.log('Backend error response:', error.response);
                toast.error(` ${error.response.data.message || 'Unknown error'}`);
            } else {
                // alert("Error saving password.");
                toast.error("Error saving password")
            }
        }
    }

    return (
        <div className="store-password">
            <h2>Store Password</h2>
            <form onSubmit={saveHandler}>
                <div>
                    <input
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={formData.name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <br />
                <div>
                    <input
                        type="text"
                        placeholder="Enter URL or Title"
                        name="url"
                        value={formData.url}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <br />
                <div>
                    <input
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <br />
                <div>
                    <input
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <br />
                <button type="submit"> submit

                </button>
            </form>
            <ToastContainer
                position="top-center"
                autoClose={500}
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

export default StorePassword;
