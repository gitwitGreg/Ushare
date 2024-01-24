import { INewUser, IUpdatePost, IUser, IMNewPost, INewPost, IUpdateUser } from "@/types";
import { createUserWithEmailAndPassword, 
signInWithEmailAndPassword, getAuth, 
onAuthStateChanged, signOut } from "firebase/auth";
import { auth, storage } from "./config";
import { v4 as uuidv4 } from 'uuid';
import { app } from "./config";
import { collection,addDoc, 
where, query, getDocs, getFirestore, 
orderBy, serverTimestamp, Timestamp, 
arrayUnion, updateDoc, doc, arrayRemove, deleteDoc, DocumentData,
limit, startAfter} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";

export async function makeNewPost (post: IMNewPost) {
  console.log(post.file);
    try{
        const db = getFirestore(app)
        const picUrl =  await uploadPhoto(post.file);
        await addDoc(collection(db, "posts"), {
          caption: post.caption,
          instructorId: post.instructorId,
          file: picUrl,
          location: post.location,
          userId: post.userId,
          tags: post.tags,
          likes: post.likes,
          saved: [],
          time: serverTimestamp()
        });
        return
    }catch(error){
        console.log(error);
        throw error
    }
}


export async function uploadPhoto(file: File[]) {
  try{
    if(file && file.length > 0 && file[0].name){
      const storageRef = ref (storage, 'pictures/' + String(file[0].name));
      console.log(file[0].name)
      await uploadBytes(storageRef, file[0]);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } else {
      console.log('no file');
    }
  }catch(error){
    console.log(error);
  }
}


export async function updatePost(post: IUpdatePost) {
  try{
      const db = getFirestore(app);
      const posts = collection( db, 'posts');
      const queryPosts= query(posts, where( 'instructorId','==', post.postId));
      const querySnapshot = await getDocs(queryPosts);
      if(!querySnapshot.empty){
        const foundPost = querySnapshot.docs[0].id;
        const postDocRef = doc(db, 'posts',foundPost);
        await updateDoc( postDocRef, {
            caption: post.caption,
            tags: post.tags,
            location: post.location,
            });
      }else{
        return null;
      }
  }catch(error){
      console.log('failure updating post', error);
  }
}

export async function deletePost(postId: string, fileUrl: string){
  try{
    const db = getFirestore(app);
    const posts = collection(db, 'posts');
    const postQuery = query(posts, where('instructorId', '==', postId));
    const querySnapshot = await getDocs(postQuery);
    if(querySnapshot.empty){
      console.log('no post');
      return null;
    }else{
      try{
        const storage = getStorage(app);
        const postImageRef = ref(storage, fileUrl);
        await deleteObject(postImageRef);
        console.log('image Deleted');
        const post = querySnapshot.docs[0].ref;
        await deleteDoc(post);
        console.log('deleted post');
        return {status: 'ok'}
      }catch(innerError){
        console.error('Error deleting image or post:', innerError);
      }
    }
  }catch(error){
    console.log(error);
  }
}


export async function addAccount (user: INewUser) {
  try{
      const db = getFirestore(app);
      await addDoc(collection(db, "profiles"), {
        bio: '',
        email: user.email,
        id: uuidv4(),
        imageUrl: '',
        name: user.name,
        username: user.username
      });
      console.log('user Created');
  }catch(error){
      console.error('Error adding user:', error);
  }
}


export async function createUserAccount(user: INewUser) {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password,
    );

    const aUser = userCredentials.user;
    return aUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function signInAccount(user: { email: string; password: string }) {
  try {
    const auth = getAuth();
    const credentials = await signInWithEmailAndPassword(auth, user.email, user.password);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is authenticated:', user);
      } else {  
        console.log('User is not authenticated');
      }
    });
    return credentials.user; 
  } catch (error) {
    const message = error;
    toast({
      description: `${message}`,
    });
    throw error;
  }
}


export async function signOutUser() {
  const auth = getAuth(app);
  try{
    if (auth != null) {
      signOut(auth).then(() => {
      console.log('Sign Out Success');
      }).catch((error) => {
      console.log(error);
      });
    }
  }catch(error){
    console.log(error);
    throw error
  }
}

export async function updateUserInfo(userInfo: IUpdateUser) {
  const db = getFirestore();
  const users = collection(db, 'profiles');
  try{
    const userQuery = query(users, where('email', '==', userInfo.email));
    const querySnap = await getDocs(userQuery);
    if(querySnap.empty){
      console.log('No user');
      return;
    }
    const docId = querySnap.docs[0].id
    const user = doc(db, 'profiles', docId);
    const picUrl =  await uploadPhoto(userInfo.file);
    await updateDoc(user, {
      userId: userInfo.userId,
      name: userInfo.name,
      bio: userInfo.bio,
      imageUrl: picUrl,
      email: userInfo.email,
    })
  }catch(error){
    console.log(error)
  }
}


export const getCurrentUser = (): Promise<IUser | null> => {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email;
        const profileQuery = query(collection(db, 'profiles'), where('email', '==', userEmail));
        getDocs(profileQuery)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data() as IUser;
              resolve(userData);
            } else {
              console.log('No matching data');
              resolve(null);
            }
          })
          .catch((error) => {
            console.error('Error getting documents:', error);
            reject(error);
          })
          .finally(() => {
            unsubscribe();
          });
      }
    });
  });
};


export async function getRecentPosts() {
  try {
    const time = Timestamp.fromDate(new Date())
    const db = getFirestore(app)
    const postRef= collection(db, 'posts');
    const q = query(postRef, where('time', '<', time ), orderBy('time', 'desc'));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
      console.log('querySnap empty');
      return null;
    }
    const posts: INewPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data() as INewPost);
    })
    return posts;
  }catch(error){
    console.log(error);
    throw error;
  }
  }


export async function getRecentPostProfile (post: IMNewPost ) {
  try{
    const db = getFirestore(app);
    const userRef = collection(db, 'profiles');
    const userQuery = query(userRef, where('username', '==', post.userId ));
    const querySnapshot = await getDocs(userQuery);
    if(querySnapshot.empty){
      console.log('querySnap empty');
      return undefined; 
    }
    const profile: IUser[] = [];
    querySnapshot.forEach((doc) => {
      profile.push(doc.data() as IUser);
    })
    return profile[0];
  }catch(error){
    console.log(error);
    return undefined;
  }
}


export async function followUser(likeUser: string, userId: string) {
  console.log('starting following');
  const db = getFirestore(app);
  const profiles = collection(db, 'profiles');
  const userQuery = query(profiles, where('id', '==', userId));
  try{
    const querySnap = await getDocs(userQuery);
    if(querySnap.empty){
      console.log('no user');
      return;
    }
    const docId = querySnap.docs[0].id
    const user = doc(db, 'profiles', docId);
    const existingFollowers = querySnap.docs[0].data().followers
    const updatedFollowers = existingFollowers? arrayUnion(likeUser) : [likeUser]
    console.log('follower follower array', updatedFollowers);
    await updateDoc( user, {
      followers: updatedFollowers
    });
  }catch(error){
    console.log(error);
  }
}


export async function unfollowUser(likeUser: string, userId: string) {
  console.log('starting unfollow');
  const db = getFirestore(app);
  const profiles = collection(db, 'profiles');
  const userQuery = query(profiles, where('id', '==', userId));
  try{
    const querySnap = await getDocs(userQuery);
    if(querySnap.empty){
      console.log('no user');
      return;
    }
    const docId = querySnap.docs[0].id
    const user = doc(db, 'profiles', docId);
    const updatedFollowers =  arrayRemove(likeUser)
    console.log('unfollowed')
    await updateDoc( user, {
      followers: updatedFollowers
    });
  }catch(error){
    console.log(error);
  }
}


export async function likePost(postId: string, userId: string) {
  try {
    const db = getFirestore(app);
    const posts = collection(db, 'posts');
    const q = query(posts,
      where('instructorId', '==', postId),
      orderBy('time', 'desc'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('querySnap empty');
      return;
    }
    const qPost = querySnapshot.docs[0]; 
    const user = await findLikeUser(userId);

    const postRef = doc(db, 'posts', qPost.id);
    const existingLikes = qPost.data().likes;
    console.log(existingLikes);
    if(user && user.username.trim()!==''){
      const updatedLikes = existingLikes ? arrayUnion(user.username) : [user.username];
      await updateDoc(postRef, {
        likes: updatedLikes,
      });
    }else{
      return { success: false, messasge: 'user not found' }
    }
    console.log('Post liked successfully!');
    return { success: true, postId: qPost.id, likedBy: user?.username };
  } catch (error) {
    console.error('Error liking post:', error);
    return {success: false, message: 'error liking post' }
  }
}

export async function findLikeUser(Id: string) {
  try{
    const db = getFirestore(app);
    const profiles = collection(db, 'profiles');
    const likeUserQuery = query(profiles, where('id', '==', Id));
    const likeUserQuerySnap = await getDocs(likeUserQuery);
   if(likeUserQuerySnap.empty){
    console.log('No user');
   }
   const qLiker = likeUserQuerySnap.docs[0]; 
   return qLiker.data();
  }catch(error){
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const db = getFirestore(app);
    const posts = collection(db, 'posts');
    const q = await query(posts, 
    where('instructorId', '==', postId), 
    orderBy('time', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('querySnap empty');
      return;
    }

    const qPost = querySnapshot.docs[0]; 
    const user = await findLikeUser(userId);
    console.log(user);
    const postRef = doc(db, 'posts', qPost.id);
    const existingSaves = qPost.data().likes;
    if(user && user.username.trim()!==''){
      const updatedSaves = existingSaves? arrayUnion(user.username) : [user.username]
      await updateDoc(postRef, {
        saved: updatedSaves,
      });
    }else{
      return { success: false, messasge: 'user not found' }
    }
    console.log('Post saved!');
    return { success: true, postId: qPost.id, likedBy: user?.username };
  } catch (error) {
    console.error('Error saving post:', error);
    return {success: false, message: 'error saving post' }
  }
}

export async function getSavedPosts(username: string){
  const db = getFirestore(app);
  const posts = collection(db, 'posts');
  const savedQuery = query(posts, where('saved', 'array-contains', username ));
  try{
    const querySnap = await getDocs(savedQuery);
    if(querySnap.empty){
      console.log('user has no saved posts');
      return [];
    }
    const savedArray: IMNewPost[] = [];
    querySnap.docs.forEach((doc) => {
      savedArray.push(doc.data() as INewPost);
    })
    return savedArray;
  }catch(error){
    console.log(error);
  }
}


export async function getPostById(postId: string) {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'posts');
    const postQuery = query(userRef, where('instructorId', '==', postId ));
    const postQuerySnap = await getDocs(postQuery);
    if(postQuerySnap.empty){
      console.log('no post');
      return null
    }
    return postQuerySnap.docs[0].data();
  }catch(error){
    console.log(error);
    throw error;
  }
}

export async function deleteSave(postId: string, userName: string) {
  try{
    console.log('starting remove post');
    const db = getFirestore(app);
    const postRef = collection(db, 'posts');
    const postQuery = query(postRef, where('instructorId', '==',  postId));
    const postQuerySnap = await getDocs(postQuery);
    console.log('got query');
    if(postQuerySnap.empty){
     console.log('No post');
     return null;
    }
    const qPost = postQuerySnap.docs[0]; 
    const post = doc( db, 'posts', qPost.id);
    await updateDoc(post, {
      saved: arrayRemove(userName)   
    });
    console.log('post save removed');
  }catch(error){
    console.log(error);
  }
}

export async function removeLike(postId: string, userId:string){
  try{
    console.log(postId);
    console.log(userId);

    const db = getFirestore(app);
    const postRef = collection(db, 'posts');
    const postQuery = query(postRef, where('instructorId', '==',  postId));
    const querySnap = await getDocs(postQuery);
    if(querySnap.empty){
      console.log('no post');
      return null;
    }
    const qPost = querySnap.docs[0];
    const qPostId = qPost.id;
    const post = doc( db, 'posts', qPostId);
    await updateDoc(post,{
      likes: arrayRemove(userId)
    });  
  }catch(error){
    console.log(error);
  }
}

export async function searchPost(searchTerm: string){
  try{
    console.log('starting');
    const db = getFirestore(app);
    const posts = collection(db, 'posts');
    const searchQuery = query(posts, where('caption', '==', searchTerm));
    const querySnap = await getDocs(searchQuery);
    if(querySnap.empty){
      console.log('no posts maching search parameters');
      return null;
    }
    const postResults: DocumentData[] = [];
    querySnap.forEach((post) => {
      const postData = post.data()
      postResults.push(postData);
    })
    return postResults;
  }catch(error){
    console.log(error);
  }

}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  const PAGE_SIZE = 3;
  try {
    const db = getFirestore(app);
    let postQuery = query(collection(db, 'posts'), 
    orderBy('instructorId', 'asc'), limit(PAGE_SIZE));

    if (pageParam) {
      postQuery = query(collection(db, 'posts'), 
      orderBy('instructorId', 'asc'), startAfter(pageParam), limit(PAGE_SIZE));
    }

    const postsSnapshot = await getDocs(postQuery);
    if(postsSnapshot.empty){
      return null;
    }
    const posts: DocumentData[] = [];

    postsSnapshot.forEach((doc) => {
      posts.push(doc.data());
    });

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getAllProfiles(){
  try{
    const db = getFirestore(app);
    const profiles = collection(db, 'profiles');
    const querysnap = await getDocs(profiles);
    if(querysnap.empty){
      console.log('no profiles');
      return;
    }
    const userArray: DocumentData[] = [];
    querysnap.docs.forEach((user) => {
      userArray.push(user.data());
    })
    return userArray;
  }catch(error){
    console.log(error);
  }
}

export async function getUserPosts(username: string){
  const db = getFirestore(app);
  const posts = collection(db, 'posts');
  const postQuery = query(posts, where('userId', '==', username));
  try{
    const querySnap = await getDocs(postQuery);
    if(querySnap.empty){
      console.log('no user posts')
      return;
    }
    const userPosts: IMNewPost[] = [];
    querySnap.forEach((doc) => {
      userPosts.push(doc.data() as INewPost);
    })
    return userPosts;
  }catch(error){
    console.log(error);
  }
}

export async function getUserLikedPosts(username: string){
  const db = getFirestore(app);
  const posts = collection(db, 'posts');
  const postQuery = query(posts, where('likes', 'array-contains', username));
  try{
    const querySnap = await getDocs(postQuery);
    if(querySnap.empty){
      console.log('no user posts')
      return;
    }
    const userPosts: IMNewPost[] = [];
    querySnap.forEach((doc) => {
      userPosts.push(doc.data() as INewPost);
    })
    return userPosts;
  }catch(error){
    console.log(error);
  }
}