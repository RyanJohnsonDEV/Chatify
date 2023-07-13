/* eslint-disable react/prop-types */
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Login from './pages/Login';

import './App.css';
import Register from './pages/Register';
import Home from './pages/Home';
import { useContext } from 'react';
import { AuthContext } from './store/auth-context';

function App() {
  const { currentUser } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (currentUser === undefined) {
      return <p>loading...</p>;
    } else if (!currentUser && currentUser !== undefined) {
      return <Navigate to={'/login'} />;
    } else {
      return children;
    }
  };

  const router = createBrowserRouter([
    {
      index: true,
      path: '/',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
