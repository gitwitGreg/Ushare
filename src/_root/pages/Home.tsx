import PostCard from '@/components/cards/PostCard';
import { useGetRecentPosts } from '@/lib/reactQuery/queriesAndMutations';
import { INewPost } from '@/types';
import { Loader } from 'lucide-react';

const Home = () => {
  const { data: posts, isLoading, isError } = useGetRecentPosts();
  if(isLoading){
    return (
      <div>
        <Loader />
      </div>
    )
  }
  if(isError){
    return(
      <div>
        there was an error loading posts
      </div>
    )
  }
  return (
    <div
    className=' ml-10'>
      <h1
      className='text-white text-3xl font-bold mb-8'>Home Feed</h1>
      {posts && posts.map((post: INewPost,) => (
        <PostCard 
        post={post}
        key = {post.instructorId}/>
      ))}
    </div>
  );
};

export default Home
