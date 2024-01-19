import ProfileCard from "@/components/cards/ProfileCard";
import { useGetAllProfiles } from "@/lib/reactQuery/queriesAndMutations"
import { IUser } from "@/types";


const AllUsers = () => {
  const {data: users}  = useGetAllProfiles()
  if(!users){
    return <div>No users</div>
  }
  return (
    <div>
      <h1 className="text-3xl font-bold">All Users</h1>
      <div className="grid-post_link flex-wrap flex justify-around py-5">
          {users.map((user, index) =>(
            <ProfileCard 
            profile={user as IUser}
            key={index}/>
          ))}
      </div>
    </div>
  )
}

export default AllUsers
