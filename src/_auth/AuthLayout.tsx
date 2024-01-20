import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';


const AuthLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/'/>
      ):
      <>
        <section className='flex flex-1 justify-center items-center flex-col py-10'>
          <Outlet />
        </section>

        <img 
        src='./assets/side-img.svg'
        className=' hidden xl:block h-screen w-1/2 object-cover bg-no-repeat' />
      </>
      }
    </>
  )
}

export default AuthLayout
