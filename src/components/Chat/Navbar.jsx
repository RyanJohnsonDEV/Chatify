import classes from './Navbar.module.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className={classes.navbar}>
      <div className={classes.logo}>
        <div>Chatify</div>{' '}
        <div>
          <i className="fa-solid fa-comment" />
        </div>
      </div>
      <div className={classes.user}>
        <img src={currentUser.photoURL} alt="" />
        <span className={classes['display-name']}>
          {currentUser.displayName}
        </span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};
export default Navbar;
