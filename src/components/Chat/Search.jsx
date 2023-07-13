import classes from './Search.module.css';
import { useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';

const Search = () => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  async function handleSubmit(event) {
    event.preventDefault();
    setUsers([]);
    const ref = collection(db, 'users');
    const q = query(
      ref,
      where('displayName', 'in', [
        `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
        username,
      ])
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      setUsers([
        {
          name: 'User Not Found',
          avatar: '',
          uid: '1',
        },
      ]);
    }
    querySnapshot.forEach((doc) => {
      setUsers((prev) => [
        ...prev,
        {
          name: doc.get('displayName'),
          avatar: doc.get('photoURL'),
          uid: doc.get('uid'),
        },
      ]);
    });
  }

  async function handleSelected(user) {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    const ref = doc(db, 'chats', combinedId);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      await setDoc(ref, { messages: [] });
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [combinedId + '.userInfo']: {
          uid: user.uid,
          displayName: user.name,
          photoURL: user.avatar,
        },
        [combinedId + '.date']: serverTimestamp(),
      });
      await updateDoc(doc(db, 'userChats', user.uid), {
        [combinedId + '.userInfo']: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      });
    }
    setUsers([]);
    setUsername('');
  }

  return (
    <div className={classes.search}>
      <form className={classes['search-form']} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Find a user..."
          className={classes['search-input']}
          onChange={(event) => {
            setUsername(event.target.value);
            setUsers([]);
          }}
          value={username}
        />
      </form>
      {users.length !== 0 && users[0].uid !== '1'
        ? users
            .filter((user) => user.uid !== currentUser.uid)
            .map((user) => {
              function handleSelect() {
                handleSelected(user);
              }

              return (
                <div
                  className={classes['search-user']}
                  key={user.uid}
                  onClick={handleSelect}
                >
                  <div style={{ display: 'none' }}>{user.uid}</div>
                  <img src={user.avatar} alt="" />
                  <div className={classes['search-user-info']}>
                    <span>{user.name}</span>
                  </div>
                </div>
              );
            })
        : users.length !== 0 && (
            <div className={classes['not-found']}>
              <p>User Not found</p>
            </div>
          )}
    </div>
  );
};
export default Search;
