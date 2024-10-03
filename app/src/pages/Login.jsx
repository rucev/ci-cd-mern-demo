import { useEffect } from 'react';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import logic from '../logic';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useUser();

    const handleRegisterClick = () => {
        navigate('/register')
    }

    const handleLogin = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        login(email, password);
    }

    useEffect(() => {
        if (logic.isUserLoggedIn()) navigate('/home')
    }, [])

    return <section className="form-page">
        <h2> Login </h2>
        <form className="form-page__form" onSubmit={handleLogin}>
            <input name="email" type="text" placeholder="your email" required />
            <input name="password" type="password" placeholder="your password" required />
            <button type="submit">sign in</button>
        </form>
        <div className="form-page__change-view">
            <p>You're new here?</p>
            <p><a className="form-page__change-view--link" onClick={handleRegisterClick}>Sign up</a></p>
        </div>
    </section>

}

export default Login;