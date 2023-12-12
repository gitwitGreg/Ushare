import { getCurrentUser } from '@/lib/firebase/api';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { INITIAL_USER } from './AuthUtils';
import { IUser } from '@/types';
import { AuthContext } from './AuthContext';



export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
      checkAuthUser();
    }, []);

    useEffect(() => {
      checkAuthUser();
    }, [user]);

    const checkAuthUser = async () => {
        try {
            const currAccount = await getCurrentUser();
            if (currAccount) {
              const user = {
                name: currAccount.name,
                username: currAccount.username,
                bio: currAccount.bio,
                imageUrl: currAccount.imageUrl,
                liked: currAccount.liked,
                email: currAccount.email,
                id: currAccount.id
              }
              setUser(user);
            }
            setIsAuthenticated(true);
            return null;
          } catch (error) {
            console.log(error);
            throw error;
          } finally {
            setIsLoading(false)
          }
    }

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }
    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}