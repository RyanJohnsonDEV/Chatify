/* eslint-disable react/prop-types */
import classes from './Message.module.css';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../store/auth-context';
import { ChatContext } from '../../store/chat-context';
import { Timestamp } from 'firebase/firestore';

function Message(props) {
  const { currentUser } = useContext(AuthContext);
  const { userData } = useContext(ChatContext);
  const messageRef = useRef();
  const minutes = Math.round(
    (Timestamp.now().seconds - props.message.date.seconds) / 60
  );
  const hours = Math.floor(minutes / 60);
  const year = new Date().getFullYear();

  useEffect(() => {
    messageRef.current.scrollIntoView();
  }, [props.message]);

  return (
    <div
      className={`${classes.message} ${
        props.message.senderId === currentUser.uid && classes.owner
      }`}
      ref={messageRef}
    >
      <div className={classes['message-info']}>
        <img src={userData.user.photoURL} alt="" />
        <p className={classes['message-info-time']}>
          {Timestamp.now().seconds - props.message.date.seconds <= 60
            ? 'Just now'
            : Timestamp.now().seconds - props.message.date.seconds <= 86400
            ? hours >= 1
              ? `${hours}hr${
                  Math.round(minutes / hours - 60) !== 0
                    ? ' ' + Math.round((minutes / 60 - hours) * 60) + 'm'
                    : ''
                }`
              : `${minutes}m`
            : props.message.date.toDate().toString().split(year)[0]}
        </p>
      </div>
      <div className={classes['message-content']}>
        {props.message.text !== '' && (
          <p className={classes['message-text']}> {props.message.text}</p>
        )}
        {props.message.file && <img src={props.message.file} alt="" />}
      </div>
    </div>
  );
}
export default Message;
