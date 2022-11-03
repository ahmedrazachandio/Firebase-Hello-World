import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { initializeApp } from "firebase/app";
import {
  getFirestore,collection,
  addDoc,getDocs,
  doc,onSnapshot,
  query,serverTimestamp,orderBy,deleteDoc ,updateDoc,
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA4El0SHGsH31K0luD8DqcpfDfbyHFKk0Q",
    authDomain: "fir-helloworld-cloud.firebaseapp.com",
    projectId: "fir-helloworld-cloud",
    storageBucket: "fir-helloworld-cloud.appspot.com",
    messagingSenderId: "105671768368",
    appId: "1:105671768368:web:c640d5649a7f2e50f4b0f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);





function App(props) {

    const[postText, setPostText] = useState("");
    const[para, setPara] = useState("");
    const[posts, setPosts] = useState([]);
    const[isLoading, setIsloading] = useState(false);

    const [editing, setEditing] = useState({
      editingId: null,
      editingText: "",
    });
  
  
  
    useEffect(() => {

      const getData = async () =>{
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => `,  doc.data());

          setPosts((prev) =>{
            let newArray = [...prev, doc.data()];
            return newArray;
            
          });
        });
      }
      // getData();
      let unsubscribe = null;
      const getRealtimeData = async () => {
        const q = query(collection(db, "posts"), orderBy("createdOn","desc"));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
              const posts = [];
              querySnapshot.forEach((doc) => {
                posts.unshift(doc.data());
                  // posts.push(doc.data());
                  // let data = doc.data();
                  // data.id = doc.id;

                  posts.push({ id: doc.id, ...doc.data() });
              });

            setPosts(posts);    


              console.log("posts: ", posts);

            });
        
      } 
      getRealtimeData();

      return () =>{
        console.log("cleanup function");
        unsubscribe();
      }


  
    },[])
  
  
  
    const savePost = async (e) => {
      e.preventDefault();

      // console.log("PostText:", postText);

      try {
        const docRef = await addDoc(collection(db, "posts"), {
          text: postText,
          parag: para,
          // createdOn: new Date().getTime(),
          createdOn: serverTimestamp(),
          
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    

    // const deletePost = async () => {
    //   console.log("postId: ", props.id);
  
    //   await deleteDoc(doc(db, "posts", props.id));
    // };




    const deletePost = async (id) => {
      console.log("postId: ", id);
  
      await deleteDoc(doc(db, "posts", id));
    };


    const updatePost = async (e) => {
      e.preventDefault();
  
      await updateDoc(doc(db, "posts", editing.editingId), {
        text: editing.editingText,
      });
  
      setEditing({
        editingId: null,
        editingText: "",
      });
    };




return (
    <div className="App">
      <h1>Firebase HelloWorld</h1>
     <h3>Social Media App</h3>
     { (false) ? console.log("ahmad"):console.log("raza")   }
      <form onSubmit={savePost}>
          
        <input
         type="text"
          placeholder='add your minds ....'
          onChange={(e) => {
            setPostText(e.target.value)
          }}
          />
          <br />
          <textarea
          type="text"
          placeholder='add your paragraph ....'
          onChange={(e) => {
            setPara(e.target.value)
          }}
          />
          <br />
          <button type='submit'>Save Post</button>

      </form>
      <div className='mainPost'>
        {(isLoading) ? "loading..." : ""}

        {posts.map((eachPost, i) => (
          <div className="post" key={i}>

          
            <img src='https://avatars.githubusercontent.com/u/86877851?s=400&u=29c92d79043f506ee35a390b12953fd998b5402a&v=4'/>

            <span>
            {moment(props?.postDate?.seconds * 1000 || undefined)
              .fromNow()
            }
              {/* .format("D MMM, h:mm a") */}
          </span><h3 className="title">
              {eachPost?.text}
            </h3>

            <p>{eachPost?.parag}</p>
            <span>{
              moment(eachPost?.createdOn?.secounds)
                .format('Do MMMM, h:mm a')
            }</span>
            <br />
            <br />
            <br />
            <button onClick={() => deletePost(eachPost?.id)}>Delete</button>


            {editing.editingId === props?.id ? null : (
          <button
            onClick={() => {
              setEditing({
                editingId: props?.id,
                editingText: props?.postText,
              });
            }}
          >
            Edit
          </button>
        )}

          {props.id === editing.editingId ? (
            <form onSubmit={updatePost}>
              <input
                type="text"
                value={editing.editingText}
                onChange={(e) => {
                  setEditing({
                    ...editing,
                    editingText: e.target.value,
                  });
                }}
                placeholder="please enter updated value"
              />
              <button type="submit">Update</button>
            </form>
          ) : (
            <p className="post" rel="noreferrer">
              {props?.postText}

              
            </p>
          )}




            <br />
            <br />
            <br />
           {/* <img src={
              eachPost?.image?.thumbnail?.contentUrl
                .replace("&pid=News", "")
                .replace("pid=News&", "")
                .replace("pid=News", "")
            } alt="" /> */}

          </div>
        ))}
      </div>
</div>
   
  );
}

export default App;
