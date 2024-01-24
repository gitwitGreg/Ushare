import { useGetRecentPostProfile } from '@/lib/reactQuery/queriesAndMutations';
import { INewPost, IUser } from '@/types'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { INITIAL_USER } from '@/context/AuthUtils';
import { AuthContext } from '@/context/AuthContext';


type gridProp = {
  posts: INewPost[],
  showUser?: boolean,
  showStats?: boolean,
}

const GridPostList = ({posts, showUser = true, showStats = true}: gridProp) => {
  const [profiles, setProfiles] = useState<IUser[]>([]);
  const { user } = useContext(AuthContext) ?? { user: INITIAL_USER };
  const {mutateAsync: getRecentPostProfile} = useGetRecentPostProfile();


  if(!posts){
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const profiles: IUser[] = [];

  for (const post of posts) {
    const profilePromise =  getRecentPostProfile(post);
    profilePromise.then((profile) => {
      profiles.push(profile as IUser);
    })
  }
  setProfiles(profiles);
  }, [getRecentPostProfile, posts])

  if(!posts){
    return null;
  }



  return (
    <ul className='grid-container'>
      {posts.map((post: INewPost, index: number) => (
        <li
        key={post.instructorId}
        className='relative min-w-80 h-80 gap-60'>
          <Link
          to={`/posts/${post.instructorId}`}
          className='grid-post_link'>
            <img 
            src={String(post.file)}
            alt='post'
            className='h-full w-full object-cover'
            /> 
          </Link>
          <div className='grid-post_user'>
            {showUser && profiles? (
              <div
              className='flex items-center justify-start gap-2 flex-1'>
                {profiles[index] && 
                <img src={profiles[index].imageUrl || 
                  '/assets/profile-placeholder.svg'} 
                className='h-8 w-8 rounded-full'
                alt='userImage' 
                />}
                <p className='line-clamp-1'>
                  {post.userId}
                </p>
              </div>
            ):(
              <h1>Something Went wrong retry</h1>
            )}
            {showStats && (
              <PostStats 
              post={post}
              userId={post.userId}
              username={user.username}/>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
