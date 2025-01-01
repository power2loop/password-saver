import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MdLogout } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated by checking for the token
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token found, redirect to the login page
            navigate('/login');
        }
    }, [navigate]);

    function handleLogout() {
        // Clear the token from localStorage
        localStorage.removeItem('token');

        toast.error("Logout successful");
        setTimeout(() => navigate('/login'), 900);
    }

    return (
        <div className="dashboard">
            <h2>Welcome to Password Vault</h2>
            <button onClick={() => navigate('/store-password')}>Store Password</button>
            <br />
            <br />
            <button onClick={() => navigate('/search-password')}>Search Password</button>
            <br />
            <br />
            <button onClick={handleLogout}>Logout<MdLogout /></button>


            <ToastContainer
                position="top-right"
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

export default Dashboard;
