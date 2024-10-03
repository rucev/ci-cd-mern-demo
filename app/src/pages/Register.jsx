import { useNavigate } from 'react-router-dom';
import logic from '../logic';
import useUser from '../hooks/useUser';
import { useEffect } from 'react';


const Register = ({ handleShowFeedback }) => {
    const navigate = useNavigate();
    const { register } = useUser();

    const handleLoginClick = () => {
        navigate('/login')
    }

    useEffect(() => {
        if (logic.isUserLoggedIn()) navigate('/home')
    }, [])

    const handleRegister = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const repeatPassword = event.target.password.value;

        register(email, password, repeatPassword);
    }

    return <section className="form-page">
        <h2>Register</h2>
        <form className="form-page__form" onSubmit={handleRegister}>
            <input name="email" type="email" placeholder="your email" required />
            <input name="password" type="password" placeholder="your password"
                required />
            <input name="repeatPassword" type="password" placeholder="confirm your password" required />
            <button type="submit">create user</button>
        </form>
        <div className="form-page__change-view">
            <p>Already have an account?</p>
            <p><a className="form-page__change-view--link" onClick={handleLoginClick}>Sign in</a></p>
        </div>
    </section>
}

export default Register;