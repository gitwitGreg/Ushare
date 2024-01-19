import { Link, NavLink, useLocation } from "react-router-dom"
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";
import { useSignout } from "@/lib/reactQuery/queriesAndMutations";
import { useNavigate } from "react-router-dom";
import { INITIAL_STATE } from "@/context/AuthUtils";

const Leftbar = () => {
  const {mutateAsync: signOut , isSuccess} = useSignout();
  const { user } = useContext(AuthContext) || {user: INITIAL_STATE};
  const navigate = useNavigate();
  const { pathname } = useLocation();


  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in')
    }
  },[isSuccess, navigate])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className='flex gap-3 items-center'>
            <img 
              src='/assets/logo.png' 
              height={50} 
              width={50}
              alt='logo'
              />
        </Link>
        <Link to={`profile/${user.id}`}
        className="flex gap-3 items-center">
          {user.imageUrl? (
            <img 
            src={user.imageUrl} 
            className="h-16 w-16 rounded-full"/>
          ):(
            <img src='/assets/profile-placeholder.svg' />
          )}
          <div className="flex flex-col">
            <p className="body-bold">
              {user?.name}
            </p>
            <p className="small-regular
             text-light-3">
              @{user.username}
            </p>
          </div>
        </Link>
        
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            
            return(
            <li
            key={link.label}
            className={`leftsidebar-link group ${
              isActive && 'bg-primary-500'
            }`}>
              <NavLink 
              to={link.route}
              className='flex gap-4 items-center p-4'>
                <img 
                src={link.imgURL}
                alt={link.label}
                className={`group-hover:invert-white ${
                  isActive && "invert-white"
                }`}
                />
                {link.label}
              </NavLink>
            </li>
          );
        })}
        </ul>
        <Button 
            variant='ghost' 
            className='shad_button_ghost text-l ml-[-50%] mt-[150%]'
            onClick={()=>signOut(user)}>
                <img 
                src='/assets/logout.svg'
                alt='logout'/>
                <p className="small-medium lg:base-medium">Log out</p>
        </Button>
      </div>
    </nav>
  )
}

export default Leftbar
