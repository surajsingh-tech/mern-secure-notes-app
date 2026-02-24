import React from 'react'
import {createBrowserRouter , RouterProvider} from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Verify from './pages/Verify';
import ProtectedRoutes from './components/ProtectedRoutes';
import ForgotPassword from './pages/ForgetPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
export default function App() {
  const router = createBrowserRouter([
    {
      path : '/',
      element : <ProtectedRoutes> <Home/> </ProtectedRoutes> 
    },
      {
      path : '/signup',
      element : <Signup/> 
    },
      {
      path : '/login',
      element : <Login/> 
    },
     {
      path : '/verify',
      element : <VerifyEmail/> 
    },
      {
      path : '/verify/:token',
      element : <Verify/> 
    },
    {
      path : '/forgot-password',
      element : <ForgotPassword/> 
    },
    {
      path : '/verify-otp/:email',
      element : <VerifyOTP/> 
    }, {
      path : '/change-password/:email',
      element : <ChangePassword/> 
    }
  ])
  return (
      <div>
        <RouterProvider router={router}/>
      </div>
  )
}
