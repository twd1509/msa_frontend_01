import React, {useContext, useEffect, useState} from "react";
import {Link, Navigate} from 'react-router-dom'
import '../css/Ntc.css';
import { MemberInfoContext } from "../components/MemberInfoContext";
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";


const NtcDtl = () => {
    const memberInfo = useContext(MemberInfoContext);
    const[ntc, setNtc] = useState({});
    const params = new URLSearchParams(window.location.search);
    const no = params.get("no");

    useEffect(() => {
        fetch(`${LocalHostInfoContext.common}/api/ntc/get?no=${no}`)
        .then((res) => res.json())
        .then((res) => {
            setNtc(res);
        });
    }, {no});

    const handleSubmit = (e, no) => {
        if(window.confirm("삭제 하시겠습니까?")) {
            e.preventDefault();
            fetch(`${LocalHostInfoContext.common}/api/ntc/delete`, {
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

    if(memberInfo.loading) {
        return <div>로딩 중...</div>
    }

    if(!memberInfo.email) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/lgn/Lgn" replace />
    }

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