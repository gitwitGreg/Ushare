import { IMNewPost} from '@/types'
import { useLikePost, useGetPostById, useSavePost } from '@/lib/reactQuery/queriesAndMutations'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { deleteSave, removeLike } from '@/lib/firebase/api'

type PostStatsProps = {
  post: IMNewPost,
  userId: string,
}


const PostStats = ({ post, userId }: PostStatsProps) => {
  const pParms = {
    postId : post.instructorId,
    userId: userId,
  }
  const context = useContext(AuthContext);
  const user = context?.user || undefined;
  const [ likes, setLikes ] = useState(0);
  const [ saves, setSaves ] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { mutateAsync: likePost } = useLikePost();
  const { mutateAsync: getPostById }  = useGetPostById();
  const { mutateAsync: savePost } = useSavePost();


  const likingPost = async () => {
    if(user){
      if(post.likes.includes(user.username)){
        await removeLike(pParms.postId, user.username);
        const updatedPost = await getPostById(post.instructorId);
        if(updatedPost){
          setIsLiked(false);
          setLikes(updatedPost.likes.length);
        }
      }else{
        await likePost(pParms);
        const newPost = await getPostById(post.instructorId);
        if(newPost){
          setLikes(newPost.likes.length);
          setIsLiked(true);
        }
      }
    }
  }

  const savingPost = async () => {
    if(user){
      const newPost = await getPostById(post.instructorId);
      if(newPost){
        if(newPost.saved.includes(user.username)){
          await deleteSave(pParms.postId, user.username);
          const updatedPost = await getPostById(post.instructorId);
          if(updatedPost){
            setSaves(updatedPost.saved.length);
          }
        }
        else{
          await savePost(pParms);
          setIsSaved(true);
          setSaves(newPost.saved.length);
        }
      }
    }
  }

  useEffect(() => {
    // Fetch initial likes count when the component mounts
    const fetchInitialLikes = async () => {
      const initialPost = await getPostById(post.instructorId);
      if(user){
        if (initialPost && initialPost.likes && initialPost.saved) {
          const initialLikes = initialPost.likes.length;
          const initialSaves = initialPost.saved.length;
          setLikes(initialLikes);
          setSaves(initialSaves);
          // Save initial likes count to localStorage
          localStorage.setItem(`saves_${post.instructorId}`, initialSaves.toString());
          if(initialPost.likes.includes(user.username)){
            setIsLiked(true);
          }
        }
      }
    };

    fetchInitialLikes();
  }, [getPostById, post.instructorId, user]);

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
          {likes}
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
          {saves}
        </p>
      </div>
    </div>
  )
}

export default PostStats
