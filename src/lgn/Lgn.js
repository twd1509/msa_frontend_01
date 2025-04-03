import React,{ useState, useEffect, useContext } from 'react'
import {Link} from 'react-router-dom'
import '../css/lgn.css';

const Lgn = () => {
    const [selectedmbrNo, setSelectedMbrNo] = useState({mbrNo : 1}); // 기본값 설정
    const[mbr, setMbr] = useState({
        email : '',
        password : '',
        grade : ''
    });

    const handleRadioChange = (e) => {
        setMbr({
            [e.target.name] : e.target.value
        }); // 선택된 기관 업데이트
    };

    const changeValue = (e) => {
        setMbr({
            ...mbr,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출 방지
        
        if (!mbr.grade) {
            alert('하나의 기관을 선택해 주세요.');
            return false;
        } else {
            fetch('http://localhost:9191/api/mbr/lgn', {
                method: "POST",
                credentials: 'include', // 쿠키를 포함하도록 설정
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(mbr)
            })
            .then((res) => res.json())
            .then((res) => {
                
                if(res.email) {
                    alert("로그인 되었습니다.");
                    window.location.href = "/";
                } else {
                    alert("사용자 아이디 또는 비밀번호를 확인해주세요.");
                    window.location.reload();
                }
            });
        }        
    };

    useEffect(() => {
        setMbr({grade : '1'}); // 페이지 로드 시 기본값 설정
        
    }, []);
    
    return (
        
        <div class="login-container ">
            <div class="login-center">
            <h2>로그인</h2>
                <form onSubmit={handleSubmit}>
                    <div class="form-group-lgn">
                        <div class="radio-group">
                            <input type="radio" id="mbrNo1" name="grade" value="1" checked={mbr.grade == 1}
                        onChange={handleRadioChange}/><label for="mbrNo1"> 일반</label>
                            <input type="radio" id="mbrNo3" name="grade" value="3" checked={mbr.grade == 3}
                        onChange={handleRadioChange}/> <label for="mbrNo3">관리자</label>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="username">사용자 이름</label>
                        <input type="text" id="username" name="email" onChange={changeValue} required />
                    </div>
                    <div class="input-group">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" name="password" onChange={changeValue} required />
                    </div>
                    <button type="submit">로그인</button>
                </form>
            </div>
        </div>
        
        
    );
};

export default Lgn;