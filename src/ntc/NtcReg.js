import React, { useState, useEffect, useContext } from 'react'
import {Link, useParams, Navigate} from 'react-router-dom'
import '../css/Ntc.css';
import {MemberInfoContext} from '../components/MemberInfoContext';

const NtcReg = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const params = new URLSearchParams(window.location.search);
    let no = params.get("no") ? params.get("no") : 0;
    let mode = "";

    if(no !== 0) {
        mode = "update";
    } else {
        mode = "insert";
    }
    const[ntc, setNtc] = useState({
        no : '',
        ntcYn : '',
        title : '',
        content : '',
        regId : '',
        regDt : '',
        uptId : '',
        uptDt : '',
        useYn : "Y"
    });
    
    
    useEffect(() => {
        fetch(`http://localhost:9191/api/ntc/get?no=${no}`)
        .then((res) => {
            if(no !== 0){
                res.json().then(data => {
                    setNtc(data);
                })
            }
        });
    }, {no});



    const changeValue = (e) => {
        setNtc({
            ...ntc,
            [e.target.name] : e.target.value
        })
    }

    const changeChkValue = (e) => {
        const { name, checked } = e.target;
        setNtc((ntc) => ({
            ...ntc,
            [e.target.name] : checked ? "Y" : ""
        }))
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(ntc.title === '' || ntc.title === null || ntc.title === undefined) {
            alert("제목을 입력해주세요.");
            return false;
        }

        if(ntc.content === '' || ntc.content === null || ntc.content === undefined) {
            alert("내용을 입력해주세요.");
            return false;
        }

        if(mode == "insert") {
            setNtc({
                ...ntc,
                regId : memberInfo.email,
                uptId : memberInfo.email
            })

            fetch('http://localhost:9191/api/ntc/reg', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(ntc)
            })
            .then(response => response.text())
            .then((res) => {
                alert(res);
                window.location.href = "/ntc/NtcIndex";
            });
        } else {
            setNtc({
                ...ntc,
                uptId : memberInfo.email
            })

            fetch(`http://localhost:9191/api/ntc/update`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(ntc)
            })
            .then(response => response.text())
            .then((res) => {
                alert(res);
                window.location.href = "/ntc/NtcIndex";
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

    if(memberInfo.grade != 3) {
        alert("권한이 없습니다.");
        return <Navigate to="/" replace />
    }
    return (
        <div class="ntc-container">
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="no" value={no} />
                <input type="hidden" name="mode" value={mode} />
                <div class="ntc-title">공지사항 {mode == "insert" ? "등록" : "수정"}</div>
                <table class="ntc-form-table">
                    <tr>
                        <th>*제목</th>
                        <td><input type="text" name="title" placeholder="제목을 입력하세요." value={ntc.title} onChange={(e) => changeValue(e)} /></td>
                    </tr>
                    <tr>
                        <th>*내용</th>
                        <td><textarea placeholder="내용을 입력하세요." name="content" rows="4" onChange={(e) => changeValue(e)} value={ntc.content}></textarea></td>
                    </tr>
                    <tr>
                        <th>공지여부</th>
                        <td><input type="checkbox" id="ntc" name="ntcYn" checked={ntc.ntcYn === "Y"} value="Y" onChange={changeChkValue} /> <label for="ntc">공지</label></td>
                    </tr>
                    <tr>
                        <th>사용여부</th>
                        <td><input type="checkbox" id="use" name="useYn" value="Y" checked={ntc.useYn === "Y"} onChange={changeChkValue} /> <label for="use">사용여부</label></td>
                    </tr>
                </table>
                <div class="ntc-buttons">
                    <button type="button" class="text-register"><Link to="/ntc/NtcIndex">목록</Link></button>
                    <button type="submit">{mode == "insert" ? "등록" : "수정"}</button>
                </div>
            </form>
        </div>
    );
};

export default NtcReg;