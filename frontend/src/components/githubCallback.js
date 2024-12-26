import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const GitHubCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.sub;
            console.log("User ID (sub):", userId);
            document.cookie = `user_id=${userId}; path=/`;
            navigate('/seguimiento');
        }
    }, [navigate]);

    return <div>Cargando...</div>;
};

export default GitHubCallback;
