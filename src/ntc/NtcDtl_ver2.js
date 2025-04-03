import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom'
import '../css/Ntc.css';


const NtcDtl = () => {
    const[ntc, setNtc] = useState({});
    const params = new URLSearchParams(window.location.search);
    const no = params.get("no");

    useEffect(() => {
        fetch(`http://localhost:9191/api/ntc/get?no=${no}`)
        .then((res) => res.json())
        .then((res) => {
            setNtc(res);
        });
    }, {no});

    const handleSubmit = (e, no) => {
        if(window.confirm("삭제 하시겠습니까?")) {
            e.preventDefault();
            fetch('http://localhost:9191/api/ntc/delete', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: no
            })
            .then((response) => {
                if(response.status == 200) {
                    alert("삭제 되었습니다.");
                    window.location.href= "/ntc/NtcIndex";
                }
            });
        }
    };

    return (
        <div class="ntc-container">
            <div class="ntc-title">{ntc.title}</div>
            <div class="ntc-info">
                <span>등록일</span>
                <span>{ntc.regDt}</span>
            </div>
            <div class="ntc-content">{ntc.content}</div>
            <div class="ntc-buttons">
                <button class="text-register"><Link to="/ntc/NtcIndex">목록</Link></button>
                {sessionStorage.getItem('mbrNo') > 2 &&
                <div>
                    <button><Link to={`/ntc/NtcReg?no=${no}`}>수정</Link></button>
                    <button onClick={(e) => handleSubmit(e, no)}>삭제</button>
                </div>
                }
            </div>
        </div>
    );
};

export default NtcDtl;