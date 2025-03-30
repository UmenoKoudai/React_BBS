import { useState } from "react";

function SignUp({ setAuthToken }){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignin = () => {
        
        if(!email || !password){
            alert("EmailとPasswordは必須です");
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            alert("無効なEmail形式です");
            return;
        }
        fetch("https://localhost:5000/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "user@example.com",      
                password: "dsgia4d2", 
            })
        })
        // .then(res => {
        //     if(!res.ok) throw new Error("Sign up failed");
        //     return res.json();
        // })
        // .then(data => {
        //     if(data && data.token){
        //         handleLogin();
        //     }
        // })
        .catch(error => console.error("Error:", error));
    }

    const handleLogin = () => {
        fetch("http://localhost:5000/auth/sign_in", {
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
        <h1>サインアップ</h1>
        <div>
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
        <div><button onClick={handleSignin}>サインアップ</button></div>
        </>
    );

}

export default SignUp;