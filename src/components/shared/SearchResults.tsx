import { INewPost } from '@/types'
import GridPostList from './GridPostList'

type searchResultsProps = {
  isSearchFetching: boolean,
  searchedPosts: INewPost[]
}

const SearchResults = ({isSearchFetching, searchedPosts}: searchResultsProps) => {

  if(isSearchFetching){
    return(
        <div>
          <h1>Still loading</h1>
        </div>
    )
  }
  if(searchedPosts != undefined){
    return(
      <GridPostList 
      posts={searchedPosts}
      />
    )
  }

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults
