import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { INITIAL_USER } from '@/context/AuthUtils';
import { useFollowUser, useUnfollowUser } from '@/lib/reactQuery/queriesAndMutations';

type UserProp = {
  imageUrl: string;
  username: string;
  name: string;
  id: string;
  followers: string[];
};

const ProfileCard = ({ profile }: { profile: UserProp }) => {
  const { user } = useContext(AuthContext) ?? { user: INITIAL_USER };
  const [followed, setFollowed] = useState(() => {
    const storedFollowed = 
    localStorage.getItem(`${user.id}_${profile.username}_followed`);
    return storedFollowed ? JSON.parse(storedFollowed) : false;
  });
  const {mutateAsync: follow } = useFollowUser();
  const {mutateAsync: unFollow } = useUnfollowUser();

  
  const followParams = {
    likeUser: user.username,
    userProfile: profile.id,
  }


  const handleClick = async () => {
    if (profile) {
      const isUserFollowed = 
      profile.followers && profile.followers.includes(user.username);
      console.log(isUserFollowed);
      if (isUserFollowed) {
        await unFollow(followParams);
      } else {
        await follow(followParams);

      }
      setFollowed(!followed);
    }

  };


  return (
    <div className='flex flex-col items-center gap-2 ml-10'>
      <Link to={``}>
        <img
          src={profile.imageUrl || '/assets/profile-placeholder.svg'}
          className='w-20 h-20 rounded-full mb-2'
          alt={profile.username}
        />
        <div className='text-center'>
          <h1 className='text-lg font-semibold'>
            {profile.name}
          </h1>
          <p className='text-light-3 text-sm'>
            @ {profile.username}
          </p>
          <Button className='bg-purple-300 w-[100px] mt-2'
          onClick={handleClick}>
            {followed? 'unfollow': 'follow'}
          </Button>
        </div>
      </Link>
    </div>
  );
};


export default ProfileCard;