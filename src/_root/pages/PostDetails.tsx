import { useDeletePost, useGetPostById, useLikePost } from "@/lib/reactQuery/queriesAndMutations"
import { Link, useParams } from "react-router-dom"
import timestampToDaysHours from "@/components/time/Timestamp";
import { useEffect, useContext, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getRecentPostProfile } from "@/lib/firebase/api";
import { useNavigate } from "react-router-dom";
import { INewPost, IUser } from "@/types";
import PostStats from "@/components/shared/PostStats";
import { INITIAL_USER } from "@/context/AuthUtils";

const PostDetails = () => {
  const [ postProfile, setPostProfile] = useState<IUser | undefined>(undefined);
  const [post, setPost] = useState<INewPost>();
  const [postLikeCount, setPostLikeCount] = useState<number>();
  const newTime = post?.time ? timestampToDaysHours(post.time) : 'N/A';
  const { id } = useParams() ;
  const { user } = useContext(AuthContext) || {user: INITIAL_USER};
  const { mutateAsync: getPostById }  = useGetPostById();
  const { mutateAsync: deletePost } = useDeletePost();
  const navigate = useNavigate();
  const IsuserPost = post?.userId === user.username;
  const userLikedPost = post?.likes.includes(user.username);
  const { mutateAsync: likePost } = useLikePost()


  const deleteParams = {
    postId : String(post?.instructorId),
    fileUrl : String(post?.file) ,
  }

  const likeParams = {
    postId: post?.instructorId as string,
    userId: user.id
  }

  const fetchPost = useCallback(async () => {
    try {
      const result = await getPostById(id as string);
      if (result) {
        setPost(result as INewPost);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id, getPostById]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if(post?.likes){
      setPostLikeCount(post?.likes.length)
    }
  }, [post?.likes])

  const handleDelete = async () => {
    try{
      await deletePost(deleteParams);
      navigate('/')
      
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if(post){
      getRecentPostProfile(post)
      .then((postProfile) => {
        if(postProfile){
          setPostProfile(postProfile);
        }
      })
    }
  }, [post, postProfile])

  const handleLike = () => {
    likePost(likeParams);
  }


  if(!user){
    return(
      <div>
        No user
      </div>
    )
  }
  
  return (
    <div>
      {postProfile !== undefined && (
        <>
        <div className=" px-40 mt-10">
          <img
            width={900}
            height={400}
            src={String(post?.file) || 'assets/profile-placeholder.svg'}
            className="border-4 border-dark-2 h-[600px] w-[600px]" />
        </div>
        <div
          className="post_details-container">
            <div className="post_details-card">
              <div className="w-full h-full flex gap-4">
                <Link
                  to={`/profile/${post?.userId}`}>
                  <img
                    src={postProfile?.imageUrl || '/assets/profile-placeholder.svg'}
                    className="rounded-full w-12 lg:h-12 mt-2" />
                </Link>
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.userId}
                  </p>
                  <p className="subtle-semibold lg:small-regular text-light-3">
                    {post?.location}
                  </p>
                  <p className="w-[100px] subtle-semibold lg:small-regular gap-2 text-light-3">
                    {newTime}
                  </p>
                </div>
              </div>
              {IsuserPost? (
                <div>
                  <img
                  src="/assets/delete.svg"
                  alt='trash'
                  width={40}
                  height={40}
                  className="cursor-pointer"
                  onClick={handleDelete} 
                  />
                  <Link
                  className="py-4"
                  state={post?.instructorId}
                  to={`/update-post/${post?.userId.trim()}`}>
                  <img
                  src="/assets/edit.svg"
                  alt='edit'
                  width={40}
                  height={40} />
                  </Link>
                </div>
              ): <p className="flex justify-center items-center gap-2">
                <img  src={userLikedPost? '/assets/liked.svg' : '/assets/like.svg'}
                onClick={handleLike}
                className="cursor-pointer"/>
                  {postLikeCount}
                </p>}
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div
              className="small-medium lg:base-medium w-full">
              <p>
                {post?.caption}
              </p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.[0]?.split(',').map((tag: string) => (
                  <li key={tag.trim()} className="text-light-3">
                    #{tag.trim()}
                  </li>
                ))}
              </ul>
              <PostStats 
              post={post as INewPost}
              userId={postProfile.username}/>
            </div>
          </div>
          </>
      )}
    </div>
  )
}

export default PostDetails
