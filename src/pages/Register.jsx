import { Link } from 'react-router-dom';
import classes from './Register.module.css';
import FormPanel from '../components/UI/FormPanel';
import placeHolderImage from '../assets/placeHolderImage.jpg';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [avatarImage, setAvatarImage] = useState(placeHolderImage);
  const [avatarName, setAvatarName] = useState('');
  const [error, setError] = useState([false, '']);
  const [registered, setRegistered] = useState(false);
  const [registerInProgress, setRegisterInProgress] = useState(false);
  const navigate = useNavigate();

  function loadImage(event) {
    if (event.target.files[0] !== undefined) {
      setAvatarImage(URL.createObjectURL(event.target.files[0]));
      setAvatarName(event.target.files[0].name.toString());
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const displayName = event.target[1].value;
    const password = event.target[2].value;
    const avatar = event.target[4].files[0];

    if (event.target[2].value !== event.target[3].value) {
      setError([true, 'Passwords do not match']);
    } else if (
      event.target[0].value === '' ||
      event.target[1].value === '' ||
      event.target[2].value === '' ||
      event.target[4].files[0] === undefined
    ) {
      setError([true, 'Please complete all fields']);
    } else {
      setRegisterInProgress(true);
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        setError([false, '']);

        const storageRef = ref(storage, displayName + res.user.id);

        const uploadTask = uploadBytesResumable(storageRef, avatar);

        await uploadTask.then(
          (snapshot) => {
            getDownloadURL(snapshot.ref).then(async (downloadURL) => {
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
              await setDoc(doc(db, 'users', res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
              });
              await setDoc(doc(db, 'userChats', res.user.uid), {});
              await signInWithEmailAndPassword(auth, email, password);
              setRegistered(true);
              setRegisterInProgress(false);
            });
          },
          (error) => {
            setError([true, error.toString()]);
            console.log(error, 'set user error');
          }
        );
        navigate('/');
      } catch (error) {
        setError([true, error.toString().split('Firebase: ')[1]]);
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (registered === true) {
      navigate('/');
    }
  }, [registered, navigate]);

  return (
    <FormPanel>
      <h1>
        Chatify <i className="fa-solid fa-comment" />
      </h1>
      <p className={classes.gray}>Register</p>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Display Name" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <div className={classes['file-upload']}>
            <label htmlFor="avatar" className={classes['custom-file-uploader']}>
              <img src={avatarImage} alt="" />
              <p className={classes.gray}>
                {avatarImage === placeHolderImage
                  ? 'Upload profile picture'
                  : avatarName}
              </p>
              <input
                type="file"
                name="avatar"
                id="avatar"
                className={classes.uploader}
                accept="image/*"
                onChange={loadImage}
              />
            </label>
          </div>
        </div>
        <div>
          <button>Sign up</button>
          {registerInProgress && !registered && !error[0] ? (
            <p style={{ color: 'gray', margin: '1rem' }}>Registering...</p>
          ) : (
            registerInProgress &&
            registered && (
              <p style={{ color: 'lime', margin: '1rem' }}>
                Registered! Redirecting...
              </p>
            )
          )}
          {error[0] && (
            <p style={{ color: 'red', margin: '1rem' }}>{error[1]}</p>
          )}
          <p className={classes['account-link']}>
            Already have an account? <Link to={'/login'}>Sign in</Link>
          </p>
        </div>
      </form>
    </FormPanel>
  );
}

export default Register;
