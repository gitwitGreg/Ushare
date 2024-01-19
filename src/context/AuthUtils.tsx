export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    liked: [''],
    bio : '',
    followers: [],
    following: [],
}

 export const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: ()=> {},
    setIsAuthenticated: ()=> {},
    checkAuthUser: async () => false as boolean
}
