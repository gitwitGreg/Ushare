import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import SearchResults from '@/components/shared/SearchResults'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useGetInfinitePosts, useSearchPosts } from '@/lib/reactQuery/queriesAndMutations'
import { INewPost } from '@/types'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'


const Explore = () => {
  const  { ref, inView } = useInView();
  const [ searchValue, setSearchValue ] = useState('')
  const deBouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(deBouncedValue);
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults;
  const { data:posts, hasNextPage, fetchNextPage, status } = useGetInfinitePosts();
  
  
  if (status !== 'success') {
    return <div>Loading...</div>;
  }

  if (!searchValue && inView && hasNextPage) {
    console.log('about to fetch');
    fetchNextPage();
    console.log('fetched');
  }


  return (
    <div className='explor-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Post</h2>
        <div className='flex gap-1 px-4 w-full bg-dark-4'>
          <img 
          src='/assets/search.svg'
          width={24}
          height={24}
          alt='search'
          />
          <Input 
          type='text'
          placeholder='Search'
          className='explore-search'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md: md:h3-bold'>Popular Today</h3>
        <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
          <p className='small-medium md:bas-medium text-light-2'>All</p>
          <img 
          src='/assets/filter.svg'
          width={20}
          height={20}
          alt='filter'/>
        </div>
      </div>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
      {shouldShowSearchResults ? (
        <SearchResults 
        isSearchFetching={isSearchFetching}
        searchedPosts={searchedPosts as INewPost[]}
        />
      ) : shouldShowPosts ? (
        posts? (
          posts.pages.map((item: INewPost[]) => (
            <GridPostList 
            posts={ item } 
            key={String(String(item[item.length-1].time))}
            />
          ))
        ) : (
          <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
        )
      ) : null}
    </div>
    {hasNextPage && !searchValue && (
      <div ref={ref} className='mt-10 ml-[30%]'>
        <Loader />
      </div>
    )}
    </div>
  )
}

export default Explore
