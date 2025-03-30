import { useState } from "react";

function Login({ setAuthToken }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        fetch("https://localhost:5000/auth/sign_in.json", {
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({ email, password }),
        })
        .then(res => {
            if(!res.ok) throw new Error("Login failed");
            
            const accessToken = res.headers.get("access-token");
            const client = res.headers.get("client");
            const uid = res.headers.get("uid");

            if(accessToken && client && uid){
                localStorage.setItem("access-token", accessToken);
                localStorage.setItem("client", client);
                localStorage.setItem("uid", uid);
                setAuthToken(true);
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