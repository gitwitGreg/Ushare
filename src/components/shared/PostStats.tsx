import { IMNewPost} from '@/types'
import { useLikePost, useGetPostById, useSavePost, useDeleteSave } from '@/lib/reactQuery/queriesAndMutations'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { removeLike } from '@/lib/firebase/api'

type PostStatsProps = {
  post: IMNewPost,
  userId: string,
  username: string,
}


const PostStats = ({ post, userId, username }: PostStatsProps) => {
  const pParms = {
    postId : post.instructorId,
    userId: userId,
  }
  const deleteParams = {
    postId: post.instructorId,
    userName: username
  }

  const context = useContext(AuthContext);
  const user = context?.user || undefined;
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: getPostById }  = useGetPostById();
  const { mutateAsync: savePost } = useSavePost();
  const {mutateAsync: deleteSave } = useDeleteSave();


  useEffect(() => {
    if(!post){
      return;
    }
    if(post.likes.includes(String(user?.username))){
      setIsLiked(true);
    }
  },[post.likes, user?.username, post])


  const likingPost = async () => {
    if(user){
      if(post.likes.includes(user.username)){
        await removeLike(pParms.postId, user.username);
        const updatedPost = await getPostById(post.instructorId);
        if(updatedPost){
          setIsLiked(false);

        }
      }else{
        await likePost(pParms);
        const newPost = await getPostById(post.instructorId);
        if(newPost){
          setIsLiked(true);
        }
      }
    }
  }

  const savingPost = async () => {
    if(user){
      if(post.saved?.includes(user.username)){
        await deleteSave(deleteParams);
        setIsSaved(false);
        return;
      }
      else{
        await savePost(pParms);
        const newPost = await getPostById(post.instructorId);
        if(newPost){
          setIsSaved(true);
          return;
        }
      }
    }
  }

  if(!post){
    return (
      <div>
        no posts stats
      </div>
    )
  }

  return (
    <div
    className='flex justify-between items-center z-20 mt-6'>
      <div
      className='flex gap-2 mr-5'>
        <img 
        src= {isLiked? '/assets/liked.svg': '/assets/like.svg'}
        width={20}
        height={20}
        onClick={likingPost}
        className='cursor-pointer'
        />
        <p
        className='small-medium lg:base-medium'>
          {post.likes.length}
        </p>
      </div>
      <div
      className='flex gap-2'>
        <img 
        src= {isSaved ? '/assets/saved.svg':'/assets/save.svg'}
        width={20}
        height={20}
        onClick={savingPost}
        className='cursor-pointer'
        />
        <p
        className='small-medium lg:base-medium'>
          {post.saved?.length || 0} 
        </p>
      </div>
    </div>
  )
}

export default PostStats
