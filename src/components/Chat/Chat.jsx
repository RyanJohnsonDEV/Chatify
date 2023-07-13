import classes from './Chat.module.css';
import Messages from './Messages';
import Input from './Input';
import { useContext } from 'react';
import { ChatContext } from '../../store/chat-context';

const Chat = () => {
  const { userData } = useContext(ChatContext);

  return (
    <div className={classes.chat}>
      <div className={classes['chat-info']}>
        <span className={classes.username}>{userData.user.displayName}</span>
        <div className={classes['user-actions']}>
          <button>
            <i className="fa-solid fa-user-plus"></i>
          </button>
          <button>
            <i className="fa-solid fa-video"></i>
          </button>
          <button>...</button>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};
export default Chat;
