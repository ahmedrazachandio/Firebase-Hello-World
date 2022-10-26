import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  onSnapshot,
  query,
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





function App() {

    const[postText, setPostText] = useState("");
    const[posts, setPosts] = useState([]);
    const[isLoading, setIsloading] = useState(false);
  
  
  
    useEffect(() => {

      const getData = async () =>{
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => `,  doc.data());


          let newArray = [...posts, doc.data()];
          
          setPosts(newArray);
        });
      }
      getData();

  
    },[])
  
  
  
    const savePost = async (e) => {
      e.preventDefault();
      // console.log("PostText:", postText);

      try {
        const docRef = await addDoc(collection(db, "posts"), {
          text: postText,
          createdOn: new Date().getTime(),
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

return (
    <div className="App">
      <h1>Firebase HelloWorld</h1>
     <h3>Social Media App</h3>

      <form onSubmit={savePost}>
          
        <input
         type="text"
          placeholder='add your minds ....'
          onChange={(e) => {
            setPostText(e.target.value)
          }}
          />
          <button type='submit'>Save Post</button>

      </form>
      <div>
        {(isLoading) ? "loading..." : ""}

        {posts.map(eachPost => (
          <div className="post" key={eachPost?.createdOn}>
            <img src='https://avatars.githubusercontent.com/u/86877851?s=400&u=29c92d79043f506ee35a390b12953fd998b5402a&v=4'/>

            <h3 className="title">
              {eachPost?.text}
            </h3>

            <span>{
              moment(eachPost?.sdfjsdfjsd)
                .format('Do MMMM, h:mm a')
            }</span>

            {/* <h3>{eachPost?.description}</h3>

            <img src={
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
