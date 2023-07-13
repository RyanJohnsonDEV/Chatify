import { useContext, useEffect, useState } from 'react';
import Message from './Message';
import classes from './Messages.module.css';
import { ChatContext } from '../../store/chat-context';
import { db } from '../../firebase';
import { onSnapshot, doc } from 'firebase/firestore';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { userData } = useContext(ChatContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', userData.chatId), (doc) => {
      doc.exists() &&
        doc.data() !== undefined &&
        setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    };
  }, [userData.chatId]);

  return (
    <div className={classes['messages-container']}>
      <div className={classes.messages}>
        {messages.length !== 0 &&
          messages.map((message) => {
            return <Message message={message} key={message.id} />;
          })}
      </div>
    </div>
  );
};
export default Messages;
