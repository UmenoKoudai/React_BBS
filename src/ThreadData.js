import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function ThreadData() {
    const { id } = useParams();
    const [thread, setThread] = useState(null);
    const [comments, setComment] = useState([]);
    const [page, setpage] = useState(1);
    const [totalePage, setTotalPage] = useState(1);
    const [user, setUser] = useState(null);
    
    const commentRef = useRef();
    const postNameRef = useRef();

    const limit = 10;


    // useEffect(() => {
    //     fetch("http://localhost:5000/auth/user", { credentials: "include"})
    //     .then(res => res.json())
    //     .then(data => setUser(data))
    //     .catch(error => console.error("Error:", error));
    // }, [])

    useEffect(() => {
        fetch(`http://localhost:5000/threads/${id}?page=${page}&limit=10`)
        .then( res => res.json())
        .then( data => {
            console.log(data);
            setThread(data.thread);
            setComment(data.comments);
            setTotalPage(data.totalePage);
        })
        .catch(error => console.error("Error:", error));
        
    }, [id, page]);

    const handleCommentPost = () => {
        const comment = commentRef.current.value.trim();
        const postname = postNameRef.current.value.trim() || "名無し";

        const currentPage = Math.ceil((comments.length / limit));
        console.log("投稿した後のコメント数：", comments.length);
        console.log("投稿した後のリミット数：", limit);
        console.log("投稿した後のトータルページ数：", currentPage);

        if(comments.length >= 50){
            alert("このスレッドは上限に達したので新しくスレッドを立ててください");
            return;
        }
        if(!comment){
            alert("名前とコメントを入力してください");
            return;
        }
        if(comment.length > 200){
            alert("コメントは200字いないで入力してください");
            return;
        }
        console.log(`Requesting: http://localhost:5000/threads/${id}/comments`);
        
        fetch(`http://localhost:5000/threads/${id}/comments`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: { name: postname, text: comment }
            }),
        })
        .then( res => res.json())
        .then( data => {
            console.log(data);
            setComment(prev => [...prev,data]);
            postNameRef.current.value = "";
            commentRef.current.value = "";
        })
        .catch(error => console.error("Error:",error));
    };


    const deleteThread = () => {
        if(window.confirm("本当にスレッドを削除しますか？")){
            fetch(`http://localhost:5000/threads/${id}`, {
                method: "DELETE",
                headers: { "content-Type": "application/json"},
                credentials: "include",
            })
            .then(res => {
                if(res.ok){
                    alert("スレッドを削除しました");
                    window.location.href = "/";
                }
                else{
                    alert("削除に失敗しました");
                }
            })
            .catch(error => console.error("Error:", error));
        }
    };

    const deleteComment = (commentId) => {
        if(window.confirm("本当にコメントを削除しますか？")){
            fetch(`http://localhost:5000/threads/${id}/comments/${commentId}`,{
                method: "DELETE",
                headers: { "content-Type": "application/json" },
                credentials: "include",
            })
            .then(res => {
                if(res.ok){
                    alert("コメントを削除しました")
                    setComment(prev => prev.filter(c => c.id !== commentId));
                }
                else{
                    alert("コメントの削除に失敗しました")
                }
            })
            .catch(error => console.error("Error:", error));
        }
    }

    return(
        <div>
            {thread && (
                <>
                <h2>タイトル：{thread.title}</h2>
                <p>サマリー：{thread.summary}</p>
                <h3>コメント</h3>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                            <h4>名前：{comment.name}</h4>
                            <div><p>{comment.text}</p></div>
                            {user?.role === "admin" && (
                                <button onClick={() => {console.log("コメントの削除:", comment, id); deleteComment(comment.id);}}>削除</button>
                            )}
                        </li>
                    ))}
                </ul>
            

                <div>
                    <label>
                        名前：<input type="text" ref = {postNameRef}/>
                    </label>
                </div>
                <div>
                    <textarea ref = { commentRef}
                     placeholder="コメントを入力"
                     style={{
                        width: "100%",
                        height: "100px",
                        padding: "8px",
                        fontSize: "16px"
                     }}></textarea>
                </div>
                <div><button onClick={handleCommentPost}>コメント投稿</button></div>
                <div>
                    <button onClick={ () => {setpage(page - 1); console.log("前へボタンをおしましたページ数:", page)}} disabled={page <= 1}>前へ</button>
                    <button onClick={ () => {setpage(page + 1); console.log("次へボタンをおしましたページ数:", page)}} disabled = { page >= totalePage}>次へ</button>
                    {user?.role === "admin" && (
                       <button onClick={deleteThread} style={{backgroundColor: "red", color:"white"}}>スレッド削除</button>
                    )}
                </div>

                </>
            )}
        </div>
    );
}

export default ThreadData;