import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useSignout } from '@/lib/reactQuery/queriesAndMutations'
import { useEffect } from 'react';

const Topbar = () => {
    const {mutateAsync: signOut , isSuccess} = useSignout();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext) || {};



    useEffect(()=>{
        if(isSuccess) {
            navigate('/sign-in')
        }
    },[isSuccess, navigate])

  return (
    <section className='topbar'>
    <div className='flex-between py-4 px-5 flex'>
        <Link to="/" className='flex gap-3 items-center'>
            <img 
            src='/assets/logo.png' 
            height={50} 
            width={50}
            alt='logo'/>
        </Link>
        <div className='flex gap-4'>
            <Button 
            variant='ghost' 
            className='shad_button_ghost'
            onClick={()=>signOut()}>
                <img src='/assets/logout.svg' />
            </Button>
            <Link
             to={`profile/${user?.id}`} 
             className="flex-center gap-3
             ">
                {user?.imageUrl? (
                    <img 
                    src={user.imageUrl}
                    className = 'h-10 w-10 rounded-full' />
                ):
                <img 
                src='/assets/profile-placeholder.svg' 
                className='h-10 w-10 rounded-full '/>}
            </Link>
        </div>
    </div>
</section>
  )
}

export default Topbar;
