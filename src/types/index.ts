import firebase from "firebase/compat/app";

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    file: File[];
    email: string;
  };

  
  export type INewPost = {
    userId: string;
    instructorId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string[];
    likes: string[];
    saves?: string[]
    time?: firebase.firestore.Timestamp;
  };
  
  export type IMNewPost = {
    userId: string;
    instructorId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string[];
    likes: string[];
    saved?: string[]
    time?: firebase.firestore.Timestamp;
  };

  export type IUpdatePost = {
    postId: string;
    caption: string;
    location?: string;
    tags?: string[];
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    liked: string[];
    followers: string[];
    following: string[];
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: ()=> Promise<IUser | null>
  }