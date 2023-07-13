import { Link } from 'react-router-dom';
import FormPanel from '../components/UI/FormPanel';
import classes from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [error, setError] = useState([false, '']);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    if (event.target[0].value === '' || event.target[1].value === '') {
      setError([true, 'Please fill in email and password']);
    } else {
      setIsSigningIn(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
        setIsSigningIn(false);
      } catch (error) {
        setError([true, error.toString().split('Firebase: ')[1]]);
      }
    }
  }

  return (
    <FormPanel>
      <h1>
        Chatify <i className="fa-solid fa-comment" />
      </h1>
      <p className={classes.gray}>Login</p>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <div>
          <button>Sign in</button>
          {isSigningIn && (
            <p style={{ color: 'gray', margin: '1rem' }}>Signing in...</p>
          )}
          {error[0] && (
            <p style={{ color: 'red', margin: '1rem' }}>{error[1]}</p>
          )}
          <p className={classes['account-link']}>
            Dont have an account? <Link to={'/register'}>Register</Link>
          </p>
        </div>
      </form>
    </FormPanel>
  );
}
export default Login;
