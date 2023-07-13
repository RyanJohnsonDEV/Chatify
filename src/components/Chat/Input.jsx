import { useContext, useState } from 'react';
import classes from './Input.module.css';
import { AuthContext } from '../../store/auth-context';
import { ChatContext } from '../../store/chat-context';
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState();
  const [hasImage, setHasImage] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { userData } = useContext(ChatContext);

  async function handleSend(event) {
    event.preventDefault();
    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask.then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', userData.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text ? text : '',
                senderId: currentUser.uid,
                date: Timestamp.now(),
                file: downloadURL,
              }),
            });
            await updateDoc(doc(db, 'userChats', currentUser.uid), {
              [userData.chatId + '.lastMessage']: {
                text: text ? text : 'image',
              },
              [userData.chatId + '.messageDate']: serverTimestamp(),
            });
            await updateDoc(doc(db, 'userChats', userData.user.uid), {
              [userData.chatId + '.lastMessage']: {
                text: text ? text : 'image',
              },
              [userData.chatId + '.messageDate']: serverTimestamp(),
            });
            setText('');
            setHasImage(false);
            setFile(null);
          });
        },
        (error) => {
          console.log(error, 'set user error');
        }
      );
    } else {
      if (text !== '') {
        await updateDoc(doc(db, 'chats', userData.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [userData.chatId + '.lastMessage']: { text },
          [userData.chatId + '.messageDate']: serverTimestamp(),
        });
        await updateDoc(doc(db, 'userChats', userData.user.uid), {
          [userData.chatId + '.lastMessage']: { text },
          [userData.chatId + '.messageDate']: serverTimestamp(),
        });
        setText('');
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSend} className={classes.input}>
        {hasImage && (
          <div className={`${classes['image-preview']}`}>
            <div className={classes['image-wrapper']}>
              <img
                src={URL.createObjectURL(file)}
                alt="image-preview"
                className={classes['preview-image']}
              />
              <p className={classes['preview-image-text']}>{file.name}</p>
              <button
                type="button"
                className={classes['preview-remove-button']}
                onClick={() => {
                  setFile(null);
                  setHasImage(false);
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}
        <input
          type="text"
          placeholder="Send message..."
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <div className={classes['input-actions']}>
          <label htmlFor="attachment" className={classes['icon-button']}>
            <i className="fa-solid fa-paperclip"></i>
            <input
              type="file"
              id="attachment"
              onChange={(event) => {
                setFile(event.target.files[0]);
                setHasImage(true);
              }}
            />
          </label>
          <label htmlFor="image" className={classes['icon-button']}>
            <i className="fa-solid fa-image"></i>
            <input
              type="file"
              id="image"
              accept="image/*"
              onClick={(event) => (event.target.value = null)}
              onChange={(event) => {
                setFile(event.target.files[0]);
                setHasImage(true);
              }}
            />
          </label>
          <button className={classes['send-button']}>Send</button>
        </div>
      </form>
    </>
  );
};
export default Input;
