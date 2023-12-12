import { INewUser, IUpdatePost, IUser, IMNewPost } from "@/types";
import { createUserWithEmailAndPassword, 
signInWithEmailAndPassword, getAuth, 
onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from "./config";
import firebase from "firebase/compat/app";
import { app } from "./config";
import { collection,addDoc, 
where, query, getDocs, getFirestore} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";


export async function makeNewPost (post: IMNewPost) {
    try{
        const db = getFirestore(app)
        await addDoc(collection(db, "posts"), {
          caption: post.caption,
          instructorId: post.instructorId,
          file: post.file,
          location: post.location,
          userId: post.userId,
          tags: post.tags,
          likes: post.likes
        });
    }catch(error){
        toast({
          description: 'Post failed try agaian'
        })
    }
}


export async function updatePost(post: IUpdatePost) {
  try{
      const db = firebase.firestore();
      const posts =  db.collection('posts');
      const querySnapshot = await posts.where( 'postId','==' , post.postId).get();
      if(!querySnapshot.empty){
          const postDoc = querySnapshot.docs[0];
          await postDoc.ref.update({
              caption: post.caption,
              imageId: post.imageId,
              tags: post.tags,
              file: post.file,
              imageUrl: post.imageUrl,
              location: post.location,
              postId: post.postId
              });
          }else{
              console.log('No matching post al location');
          }
          console.log('Updated post sucessfully');
  }catch(error){
      console.log('failure updating post', error);
  }
}


export async function addAccount (user: INewUser) {
  try{
      const db = firebase.firestore();
      const userCollection = db.collection('users');
      const userData = {
        name: user.name,
        password: user.password,
        email: user.email,
        username: user.username,
      }
      const docRef = await addDoc(userCollection, userData );
      console.log('user added with Id' , docRef.id);
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
    throw error; // Re-throw the error to handle it in the calling code
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