import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import ThreadData from './ThreadData';
import Login from './Login';
import SignUp from './SignsUp';

function App() {

  const [threads, setThread] = useState([]);
  const [authToken, setAuthToken] = useState(false);
  const titleRef = useRef();
  const summaryRef = useRef();

  const getAuthHeaders = () => {
    return{
      "access-token": localStorage.getItem("access-token"),
      "client": localStorage.getItem("client"),
      "uid": localStorage.getItem("uid"),
    };
  };

  const handleSinup = () => {
  };

  const handleLogin = () => {
    fetch("http://localhost:5000/auth/sign_in", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email: "your_email@example.com", password: "your_passward"}),
    })
    .then(res => {
      if(!res.ok) throw new Error("Login faild");

      const accessToken = res.headers.get("access-token");
      const client = res.headers.get("client");
      const uid = res.headers.get("uid");

      if(accessToken && client && uid){
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("client", client);
        localStorage.setItem("uid", uid);
        setAuthToken(true);
      }

      return res.json()
    })
    .catch(error => console.error("Error:", error));
  };

  useEffect(() => {
    // fetch("http://localhost:5000/auth/sign_in", {
    //   method: "POST",
    //   headers: { "Content-TYpe": "application/json", },
    //   body: JSON.stringify({ email: "your_email@example.com", password: "your_password"}),
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if(data && data.token){
    //     setAuthToken(data.token);
    //   }
    // })
    // .catch(error => console.log("Error:", error));

    fetch("https://localhost:5000/threads")
    .then(res => res.json())
    .then(data => {
      console.log("API response", data);
      setThread(Array.isArray(data) ? data : []);
    })
    .catch(error => console.error("Error:", error));
  }, []);

  const handlePost = () => {
    const title = titleRef.current.value;
    const summary = summaryRef.current.value;

    fetch("https://localhost:5000/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread:{ title: title, summary: summary}
      }),
    })
    .then(red => red.json())
    .then(data => {
      setThread(pre => [...pre, data]);
      titleRef.current.value = "";
      summaryRef.current.value = "";
    });
  };

  return(
    <Router>
      <div>
        {!authToken ? (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">SingUp</Link>
        </div>) : (<p>ログイン済み</p>)}
      </div>
      <Routes>
        <Route path="/" element={
          <div>
            <div>
            <h1>新しいスレッド</h1>
            <input type="text" ref = {titleRef}></input>
            <div><input type="text" ref = {summaryRef}></input></div>
            <div><button onClick={handlePost}>投稿</button></div>
            </div>
            <h1>スレッド一覧</h1>
            <ul>
              {threads.map(thread => (
                <li key={thread.id}>
                  <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        }/>
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/signup" element={<SignUp setAuthToken={setAuthToken} />} />
        <Route path="/threads/:id" element={<ThreadData />}/>
      </Routes>
    </Router>
  );
}

export default App;
