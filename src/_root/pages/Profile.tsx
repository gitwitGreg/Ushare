import GridPostList from '@/components/shared/GridPostList';
import { AuthContext } from '@/context/AuthContext'
import { INITIAL_USER } from '@/context/AuthUtils'
import { useGetUserLikedPosts, useGetUserPosts } from '@/lib/reactQuery/queriesAndMutations';
import { INewPost } from '@/types';
import { useContext, useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [ followerCount, setFollowerCount ] = useState(0);
  const [shouldShowPosts, setShouldShowPosts] = useState(false);
  const [shouldShowLikedPosts, setShouldShowLikedPosts] = useState(false);
  const [ followingCount, setFollowingCount ] = useState(0);
  const [ userPostsCount, setUserPostCount ]  = useState(0);
  const { user } = useContext(AuthContext) ?? { user: INITIAL_USER };
  const { data: userPosts } = useGetUserPosts(user.username);
  const { data: userLikedPosts } = useGetUserLikedPosts(user.username);

  const goToProfile = () => {
    navigate(`/update-profile/${user.id}`);
  }

  const showPosts = () => {
    setShouldShowPosts((prev) => !prev);
    setShouldShowLikedPosts(false);
  }
  
  const showLikedPosts = () => {
    setShouldShowLikedPosts((prev) => !prev);
    setShouldShowPosts(false);
  }

  useEffect(() => {
    if(user){
      if(user.followers){
        setFollowerCount(user.followers.length);
      }
      if(user.following){
        setFollowingCount(user.following.length);
      }
      if(userPosts){
        setUserPostCount(userPosts.length);
      }
    }
  },[user, userPosts])


  if(!user){
    return(
    <div>No User</div>
    )
  }


  return (
    <div>
      <div className='flex gap-8 ml-20'>
        <img 
        src={user.imageUrl || 
        '/assets/profile-placeholder.svg'}
        className='rounded-full h-[150px] w-[150px]'
        />
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold'>
            {user.name}
          </h1>
          <p className='text-light-4'>
            @{user.username}
          </p>
          <div className='flex gap-4 mt-8'>
            <p>
              <span className='text-blue-500'>
                {userPostsCount}
              </span> Posts
            </p>
            <p>
              <span className='text-blue-500'>
                {followerCount}
              </span> Followers
            </p>
            <p>
              <span className='text-blue-500'>
                {followingCount}
              </span> Following
            </p>
          </div>
        </div>
        <div className='ml-20 flex'>
          <button 
          className= 'flex w-[180px] h-[45px] bg-dark-4 rounded items-center justify-center'
          onClick={goToProfile}>
            <img 
            src='/assets/edit.svg'
            alt='editIcon'
            className='mr-[10px] h-5'
            />
            Edit Post
          </button>
        </div>
      </div>
      <div className='flex mt-16'>
        <button 
          className= 'flex w-[180px] h-[45px] bg-dark-4 rounded items-center justify-center ml-16'
          onClick={showPosts}>
            <img 
            src='/assets/gallery-add.svg'
            alt='editIcon'
            className='mr-[10px] h-5'
            />
            Posts
        </button>
        <button 
          className= 'flex w-[180px] h-[45px] bg-dark-4 rounded items-center justify-center ml-16'
          onClick={showLikedPosts}>
            <img 
            src='/assets/like.svg'
            alt='editIcon'
            className='mr-[10px] h-4'
            />
            Liked Posts
        </button>
      </div>
      {shouldShowPosts? (
        <div className=' ml-10 mt-10'>
          <h1 className='font-bold text-xl mb-5'>Posts</h1>
          <GridPostList 
          posts={userPosts as INewPost[]}/>
        </div>
      ): shouldShowLikedPosts? (
        <div className='ml-10 mt-10'>
          <h1 className='text-xl font-bold'>Liked Posts</h1>
          <GridPostList 
          posts={userLikedPosts as INewPost[]}/>
        </div>
      ): <div></div>}
    </div>
  )
}

export default Profile
