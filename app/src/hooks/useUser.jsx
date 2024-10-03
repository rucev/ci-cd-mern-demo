import { useEffect, useState } from 'react';
import logic from '../logic';
import { useNavigate } from 'react-router-dom';

function useUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(logic.isUserLoggedIn());
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const fetchUserName = async () => {
        const email = await logic.retrieveUser();
        const fetchedName = email.split('@')[0];
        setUsername(fetchedName)
    }

    const login = async (email, password) => {
        try {
            await logic.authenticateUser(email, password);
            await fetchUserName();
            setIsLoggedIn(true)
            navigate('/home')
        } catch (error) {
            alert(`login error: ${error.message}`);
        }
    };

    const register = async (email, password, repeatPassword) => {
        try {
            await logic.registerUser(email, password, repeatPassword);
            login(email, password);
        } catch (error) {
            alert(`register error: ${error.message}`);
        }
    }

    const logout = () => {
        logic.logoutUser();
        navigate('/login');
    };

    useEffect(() => {
        if (!isLoggedIn) {
            setUsername('');
        } else {
            fetchUserName();
        }
    }, [isLoggedIn])

    return { register, login, logout, username, isLoggedIn };
}

export default useUser