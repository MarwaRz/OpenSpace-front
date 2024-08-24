import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from 'api/userApi'; 

const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logoutUser(); 
                navigate('/login'); 
            } catch (error) {
                console.error('Logout failed:', error);
                navigate('/login'); 
            }
        };

        performLogout();
    }, [navigate]);

};

export default Register ;
