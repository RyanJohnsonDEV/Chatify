/* eslint-disable react/prop-types */
import { AuthContext } from './auth-context';
import { useContext, useReducer, createContext } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = (props) => {
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (state, action) => {
    if (action.type === 'CHANGE_USER') {
      return {
        user: action.payload,
        chatId:
          currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid,
      };
    } else {
      return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ userData: state, dispatch }}>
      {props.children}
    </ChatContext.Provider>
  );
};
