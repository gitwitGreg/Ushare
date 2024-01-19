import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader";
import { AuthContext } from "@/context/AuthContext";
import { INITIAL_USER } from "@/context/AuthUtils";
import { useGetSavedPosts } from "@/lib/reactQuery/queriesAndMutations"
import { useContext } from "react";

const Saved = () => {
  const { user } = useContext(AuthContext) ?? { user: INITIAL_USER };
  const { data: savedPosts, isLoading  } = useGetSavedPosts(user.username);

  if(isLoading){
    return <Loader />
  }
  if(!savedPosts){
    return (
      <div>
        <h1>No saved posts</h1>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <img 
        src='/assets/save.svg'/>
        <h1 className="text-2xl font-semibold">
          Saved Posts
        </h1>
      </div>
      <GridPostList 
      posts={savedPosts}/>
    </div>
  )
}

export default Saved
