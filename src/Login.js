import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setAuthToken }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log(JSON.stringify({ email, password }));
        fetch("http://localhost:5000/v1/auth/sign_in", {
            method: "POST",
            headers: { 
                "Content-type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then(res => {
            if(!res.ok) throw new Error("Login failed");
            
            const accessToken = res.headers.get("access-token");
            const client = res.headers.get("client");
            const uid = res.headers.get("uid");
            console.log("access-token", accessToken, "client", client, "uid", uid);

            if(accessToken && client && uid){
                console.log("トークンなど受け取れている");
                localStorage.setItem("access-token", accessToken);
                localStorage.setItem("client", client);
                localStorage.setItem("uid", uid);
                setAuthToken(true);
                navigate("/threads/1");
            }
            return res.json();
        })
        .catch(error => console.error("Error:", error));
    };

    return(
        <>
        <div>
            <h1>ログイン</h1>
            <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
        </div>
        <div><button onClick={handleLogin}>ログイン</button></div>
        </>
    );

}

export default Login;