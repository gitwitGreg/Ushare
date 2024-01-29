import { useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { addAccount, createUserAccount, deletePost , deleteSave, followUser, getAllProfiles, getCurrentUser, 
  getInfinitePosts, getPostById, getRecentPostProfile ,
  getRecentPosts, getSavedPosts, getUserLikedPosts, getUserPosts, 
  likePost, makeNewPost, savePost, searchPost, 
signInAccount, signOutUser, unfollowUser, updatePost, updateUserInfo} from '../firebase/api';
import { IMNewPost, INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import { DocumentData } from 'firebase/firestore';


// ====================================================
// AUTH QUERIES
// ====================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn : (user: INewUser) => createUserAccount(user)
    })
}


export const useGetAllProfiles = (): UseQueryResult<DocumentData[] | undefined> => {

  const options: UseQueryOptions<DocumentData[] | undefined> = {
    queryKey: [QUERY_KEYS.GET_ALL_PROFILES],
    queryFn: getAllProfiles,
  };
  return useQuery(options);
}



export const useAddAccount = () => {
    return useMutation({
        mutationFn : (user: INewUser) => addAccount(user)
    })
}


export const useSignInAccount = () => {
    return useMutation({
        mutationFn : (user:{
            email: string, 
            password: string
        }) => signInAccount(user)
    })
}


export const useSignout = () => {
    return useMutation({
        mutationFn : () => signOutUser()
    })
}


export const useGetCurrUser = () => {
    return useMutation({
        mutationFn : () =>getCurrentUser()
    })
}


export const useUpdateUserInfo = () => {
  return useMutation({
      mutationFn : (userInfo: IUpdateUser) =>updateUserInfo(userInfo)
  })
}


// ====================================================
// POST QUERIES
// ====================================================

export const useGetUserPosts = (username:string) => {
  return useQuery({
    queryFn: () => getUserPosts(username),
    queryKey: [QUERY_KEYS.GET_USER_POSTS]
  })
}

export const useGetUserLikedPosts = (username:string) => {
  return useQuery({
    queryFn: () => getUserLikedPosts(username),
    queryKey: [QUERY_KEYS.GET_USER_LIKED_POSTS]
  })
}


export const useGetRecentPosts = () => {
  return useQuery({
    queryFn: () => getRecentPosts(),
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    
  })
}


export const useMakeNewPost = () => {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: (post: INewPost) => makeNewPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}


export const useGetRecentPostProfile = () => {
    return useMutation({
        mutationFn: (post: IMNewPost) => getRecentPostProfile(post)
})
}


export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { postId: string; userId: string }) => {
        return likePost(params.postId, params.userId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LIKE_POST]
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURR_USER]
        });
      }
    });
  };

  export const useFollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { likeUser: string; userProfile:string }) => { 
        return followUser(params.likeUser, params.userProfile)
      },
      mutationKey: [QUERY_KEYS.FOLLOW_USER],
      onSuccess: () => queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLLOW_USER]
      })
    })
  }


  export const useUnfollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { likeUser: string; userProfile:string }) => { 
        return unfollowUser(params.likeUser, params.userProfile)
      },
      mutationKey: [QUERY_KEYS.UNFOLLOWUSER],
      onSuccess: () => queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.UNFOLLOWUSER]
      })
    })
  }


  export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { postId: string; userId: string }) => {
        return savePost(params.postId, params.userId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LIKE_POST]
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURR_USER]
        });
      }
    });
  };

  export const useDeleteSave = () => {
    return useMutation({
      mutationFn: (params: {postId: string, userName: string}) => deleteSave(params.postId, params.userName),
      mutationKey: [QUERY_KEYS.DELETE_SAVE]
    })
  }
  

  export const useGetSavedPosts = (username: string) => {
    return useQuery({
      queryFn: () => getSavedPosts(username),
      queryKey: [QUERY_KEYS.GETSAVEDPOSTS, username],
    })
}


export const useGetPostById = () => {
  return useMutation({
    mutationFn: (postId: string) => getPostById(postId),
    mutationKey: [QUERY_KEYS.GET_POST_BY_ID]
  });
};


export const useUpdatePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId:IUpdatePost) => updatePost(postId),
    onSuccess: (data) => {
      QueryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data]
      })
    }
  })
}


export const useDeletePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {postId: string, fileUrl: string}) => deletePost(params.postId, params.fileUrl),
    onSuccess: (data) => {
      QueryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data]
      })
    }
  })
}


export const useSearchPosts = (searchTerm: string) => {
  return(
    useQuery({
      queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
      queryFn: () => searchPost(searchTerm),
      enabled: !!searchTerm,
    })
  )
}


export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: getInfinitePosts as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getNextPageParam: (lastPage: any) => {
      if(!lastPage){
        return null;
      }
      if (lastPage === null || lastPage.length === 0) {
        return null;
      } 
      const lastId = lastPage[lastPage.length -1 ].instructorId;
      const pageSize = 3;
      if (lastPage.length < pageSize) {
        return null; 
      }
      return lastId 
    },
    initialPageParam: '0' ,
  });
};
