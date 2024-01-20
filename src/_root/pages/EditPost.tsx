import PostForm from '@/components/forms/PostForm'
import { useLocation } from 'react-router-dom';
import { useGetPostById } from '@/lib/reactQuery/queriesAndMutations';
import { useEffect, useState } from 'react';
import { INewPost } from '@/types';

const EditPost = () => {
  const { state } = useLocation();
  const postInstructorId = state;
  const { mutateAsync: getPostById }  = useGetPostById();
  const [post, setPost] = useState<INewPost | undefined>();
  useEffect(() => {
    async function getPost() {
     try{
      const post  = await getPostById(postInstructorId) as INewPost;
      if(post){
        setPost(post)
      }
     }catch(error){
      console.log(error);
     }
    }
    getPost();
  },[getPostById, postInstructorId])
  return (
    <div className='top-32 left-[30%] sm:left-[35%] sm:top-10'>
      <div className='common-container'>
        <div className='max-w-5xl flex gap-3 justify-start w-full'>
          <img 
            src= '/assets/add-post.svg'
            className='max-w-full h-auto'
            alt= 'add post'
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Post</h2>
        </div>
        <PostForm
        action = 'update'
        post={post as INewPost}/>
      </div>
    </div>
  )
}

export default EditPost
