import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import ThreadData from './ThreadData';
import Login from './Login';
import SignUp from './SignsUp'
//import { useNavigate } from 'react-router-dom';

function App() {

  const [threads, setThread] = useState([]);
  const [authToken, setAuthToken] = useState(false);
  const [user, setUser] = useState(null);
  const titleRef = useRef();
  const summaryRef = useRef();
  //const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const client = localStorage.getItem("client");
    const uid = localStorage.getItem("uid");
    console.log("accessToken:", accessToken, "client:", client, "uid:", uid)

    if(accessToken && client && uid){
      setAuthToken(true);
      fetch("http://localhost:5000/v1/auth/validate_token",{
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          "Access-token": accessToken,
          "Client": client,
          "Uid": uid,
        },
      })
      .then(res => {
        if(!res.ok){
          return res.json().then(err => {
            throw new Error(`Error ${res.status}: ${JSON.stringify(err)}`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log("User:", data);
        setUser(data);
      })
      .catch(error => console.error("Error:", error));
    }


  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/threads")
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

    fetch("http://localhost:5000/threads", {
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

  const handleLogout = () => {
    const accessToken = localStorage.getItem("access-token");
    const client = localStorage.getItem("client");
    const uid = localStorage.getItem("uid");

    // ログアウトリクエスト
    fetch("http://localhost:5000/v1/auth/sign_out", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-token": accessToken,
        "Client": client,
        "Uid": uid,
      },
    })
      .then((response) => {
        if (response.ok) {
          // ログアウト成功後、ローカルストレージをクリア
          localStorage.removeItem("access-token");
          localStorage.removeItem("client");
          localStorage.removeItem("uid");

          setAuthToken(false); // 認証トークンを更新

          //navigate("/"); // トップページにリダイレクト
        } else {
          alert("ログアウトに失敗しました");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("ログアウトに失敗しました");
      });
  };


  return(
    <Router>
      <div>
        <button onClick={handleLogout}>ログアウト</button>
        {!authToken ? (
        <div>
          <Link to="/login">Login </Link>
          <Link to="/signup"> SingUp</Link>
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
        <Route path="/threads/:id" element={<ThreadData user={user}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
