import { useGetRecentPostProfile } from "@/lib/reactQuery/queriesAndMutations";
import { IMNewPost, IUser } from "@/types"
import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import timestampToDaysHours from "../time/Timestamp";
import PostStats from "../shared/PostStats";
import { INITIAL_USER } from "@/context/AuthUtils";


interface PostCardProps {
    post: IMNewPost;
}

const PostCard: React.FC<PostCardProps> = ({ post })  => {
    const [ postProfile, setPostProfile] = React.useState<IUser | undefined>(undefined);
    const { user } = useContext(AuthContext) ?? { user: INITIAL_USER };
    const {mutateAsync: getRecentPostProfile} = useGetRecentPostProfile();
    const newTime = post?.time ? timestampToDaysHours(post.time) : 'N/A';

    useEffect(() => {
      getRecentPostProfile(post)
      .then((postProfile) => {
        if(postProfile){
          setPostProfile(postProfile);
        }
      })
    }, [getRecentPostProfile, post, user.username])

    
  return (
    <div
    className='post-card text-white mb-10'>
      <div
      className="flex items-center gap-3">
        <Link
        to={`/profile/${post.userId}`}>
            <img
            src={postProfile?.imageUrl || '/assets/profile-placeholder.svg'}
            className="rounded-full w-12 lg:h-12">
            </img>
        </Link>
        <div
        className="flex flex-col">
          <p
          className="base-medium lg:body-bold text-light-1">
            {post.userId}
          </p>
          <div
          className="flex-center mr-[47px]  gap-2 text-light-3">
            <p
            className="subtle-semibold lg:small-regular">
              {post.location}
            </p>
          </div>
          <div>
            <p
            className="w-[100px] subtle-semibold lg:small-regular gap-2 text-light-3">
              {newTime}
            </p>
          </div>
        </div>
        {post.userId === user.username&& (
          <div className="ml-[60%]">
            <Link
              className=""
              state={ post.instructorId }
              to={`/update-post/${post.userId.trim()}`}>
                <img 
                src="/assets/edit.svg"
                alt='edit'
               width={40}
                height={40}
                className="sm:w-10 sm:h-10">
                </img>
            </Link>
          </div>
        )}
    </div>
    <Link
    to='#'>
      <div 
      className="small-medium lg:base-medium py-5">
        <p>
          {post.caption}
        </p>
        <ul className="flex gap-1 mt-2">
          {post.tags?.[0]?.split(',').map((tag: string) => (
            <li key={tag.trim()} className="text-light-3">
                  #{tag.trim()}
            </li>
          ))}
        </ul>
      </div>
      <img 
      src={
        String(post.file) || 'assets/profile-placeholder.svg'
      }/>
    </Link>
    <PostStats 
      post={post}
      userId={user.id}
    />
  </div>
  )
}

export default PostCard
