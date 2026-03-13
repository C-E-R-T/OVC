import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

function OAuthSuccess(){
    const navigate=useNavigate();

    useEffect(()=>{
        const params=new URLSearchParams(window.location.search);
         console.log("URL:", window.location.search);
        const token=params.get("token");
          console.log("token:", token);

        if(token) {
            localStorage.setItem("accessToken",token);
           
            setTimeout(()=>{
                navigate("/mypage");
            },0);
        }
    },[]);

    return <div>처리 중...</div>
}

export default OAuthSuccess