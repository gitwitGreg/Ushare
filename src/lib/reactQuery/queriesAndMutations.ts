import {useMutation} from '@tanstack/react-query'
import { addAccount, createUserAccount, getCurrentUser, makeNewPost, signInAccount, signOutUser} from '../firebase/api';
import { IMNewPost, INewUser } from '@/types';


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn : (user: INewUser) => createUserAccount(user)
    })
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

export const useMakeNewPost = () => {
    return useMutation({
        mutationFn: (post: IMNewPost)=> makeNewPost(post)
    })
}