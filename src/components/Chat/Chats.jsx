import classes from './Chats.module.css';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';
import { ChatContext } from '../../store/chat-context';

const Chats = () => {
  const [chats, setChats] = useState();
  const [firstUpdate, setfirstUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    function getChats() {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    }

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  function handleSelect(userInfo) {
    dispatch({ type: 'CHANGE_USER', payload: userInfo });

  }

  useEffect(() => {
    function setFirstChatter() {
      if (!firstUpdate) {
        handleSelect({});
      }
      if (!firstUpdate && chats && Object.keys(chats).length !== 0) {
        handleSelect(
          Object.entries(chats).sort((a, b) =>
            b[1].messageDate ? b[1].messageDate - a[1].messageDate : -1
          )[0][1].userInfo
        );
        setfirstUpdate(true);
      }
    }

    currentUser.uid && setFirstChatter();
  }, [currentUser.uid, chats]);

  return (
    <div className={classes.chats}>
      {chats &&
        Object.entries(chats)
          .sort((a, b) =>
            b[1].messageDate ? b[1].messageDate - a[1].messageDate : -1
          )
          .map((chat) => {
            const userInfo = chat[1].userInfo;

            return (
              <div
                key={userInfo.uid}
                className={classes['user-chat-container']}
                onClick={() => handleSelect(userInfo)}
              >
                <div className={classes['user-chat']}>
                  <img
                    src={userInfo.photoURL}
                    alt=""
                    className={classes.userImage}
                  />
                  <div className={classes['user-chat-info']}>
                    <span>{userInfo.displayName}</span>
                    <p className={classes.lastMessage}>
                      {chat[1].lastMessage && chat[1].lastMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};
export default Chats;
