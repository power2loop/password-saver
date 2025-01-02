import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { TbPassword } from "react-icons/tb";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { baseURL } from '../../url';

function SearchPassword() {
    const [searchUrl, setSearchUrl] = useState("");
    const [passwordData, setPasswordData] = useState(null);
    const [allPasswords, setAllPasswords] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function handleLogout() {
        // Clear the token from localStorage
        localStorage.removeItem('token');

        toast.success('Logout successful');
        setTimeout(() => navigate('/login'), 900);
    }


    function searchHandler() {

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authentication required. Please log in.");

            return;
        }
        const normalizedUrl = normalizeUrl(searchUrl);
        const searchUrlEncoded = encodeURIComponent(normalizedUrl);

        // Set up authorization headers with the token
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios.get(`${baseURL}/search/${searchUrlEncoded}`, { headers })
            .then((response) => {

                if (response.data) {
                    setPasswordData(response.data);
                    setMessage("Password found");
                } else {
                    setPasswordData(null);
                    setMessage("No matching record found.");
                }
            })
            .catch((error) => {

                setPasswordData(null);
                setMessage(error.response?.status === 404 ? "No matching record found." : "Error fetching data. Please try again.");
            });
    }

    // Function to normalize the URL (remove trailing slashes)
    function normalizeUrl(url) {
        return url.trim().replace(/\/+$/, '').toLowerCase() + '/';
    }

    // Delete handler for deleting passwords by URL
    function deleteHandler() {

        const normalizedUrl = normalizeUrl(searchUrl);
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage("Authentication required. Please log in.");

            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`, // Add the token in the request headers
        };

        axios.delete(`${baseURL}/${encodeURIComponent(normalizedUrl)}`, { headers })
            .then((response) => {

                setPasswordData(null);
                setMessage("Password deleted successfully.");
            })
            .catch((error) => {

                setPasswordData(null);
                setMessage(error.response?.status === 404 ? "No matching record found to delete." : "Error deleting data. Please try again.");
            });
    }

    // Function to fetch all passwords
    function fetchAllPasswords() {

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authentication required. Please log in.");

            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios.get(`${baseURL}/all`, { headers })
            .then((response) => {

                setAllPasswords(response.data.data); // Store all passwords in state
            })
            .catch((error) => {

                setMessage("Error fetching all passwords. Please try again.");
            });
    }




    return (
        <div className="search-password">
            <h2>Search / Delete Password</h2>
            <div className="txt_field">
                <input
                    type="text"
                    placeholder="Enter URL to search or delete"
                    value={searchUrl}
                    onChange={(e) => setSearchUrl(e.target.value)}
                />
            </div>
            <button onClick={searchHandler} >Search<FaSearch /></button>
            <button onClick={deleteHandler} >Delete<MdDelete /></button>
            <button onClick={fetchAllPasswords} >Fetch All Passwords<TbPassword /></button>
            <button onClick={handleLogout}>Logout<MdLogout /></button>

            {passwordData && (
                <div>
                    <h3>Details Found:</h3>
                    <p><b>Name:</b> {passwordData.name}</p>
                    <p><b>Email:</b> {passwordData.email}</p>
                    <p><b>Password:</b> {passwordData.password}</p>
                </div>
            )}

            {allPasswords.length > 0 && (
                <div>
                    <h3>Your all saved URL:</h3>
                    <ul>
                        {allPasswords.map((password) => (
                            <li key={password._id}>
                                <strong>Name:</strong> {password.name} | <strong>Email:</strong> {password.email} |{' '}
                                <strong>URL:</strong> {password.url}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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

export default SearchPassword;
