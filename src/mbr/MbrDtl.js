import React, {useContext, useEffect, useState} from "react";
import {Link, useParams, Navigate} from 'react-router-dom'
import '../css/Ntc.css';
import { MemberInfoContext } from "../components/MemberInfoContext";
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";


const NtcDtl = () => {
    const memberInfo = useContext(MemberInfoContext);
    const { Mbremail } = useParams(); // URL에서 email 값 가져오기
    const[menureg,setMenureg] = useState({
        email: '',
        name: '',
        phone: '',
        zip: '',
        address1: '',
        address2: '',
        regDt: ''

    });
   

    useEffect(() => {
            if (!Mbremail) return; // email 값이 없으면 요청 안 보냄
            fetch(`${LocalHostInfoContext.common}/api/mbr/getmbr`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({email:Mbremail})
            })
            .then((response)=>{
                if(response.status==200){
                    
                    if(Mbremail){
                        response.json().then(data => {
                            
                            setMenureg(prevState => ({
                                ...prevState,
                                email: data.email,
                                name: data.name,
                                phone: data.phone,
                                zip: data.zip,
                                address1: data.address1,
                                address2: data.address2,
                                regDt : data.regDt
                            }));
                        })
                    }
                }
            });
    
           
        },[Mbremail]);

    const handleSubmit = (e) => {
        if(window.confirm("삭제 하시겠습니까?")) {
            e.preventDefault();
            fetch(`${LocalHostInfoContext.common}/api/mbr/mbrdelete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({email:Mbremail})
            })
            .then((response) => {
                if(response.status == 200) {
                    alert("삭제 되었습니다.");
                    window.location.href= "/mbr/MbrIndex";
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

    if(memberInfo.grade != 3 && memberInfo.email != Mbremail) {
        alert("권한이 없습니다.");
        return <Navigate to="/" replace />
    }

    return (
        <div class="ntc-container">
            <div class="ntc-title">회원정보</div>
            <div style={{ width: '50%', margin: 'auto'   }} >
                <table class="member-table">
                    <colgroup>
                        {/* <col style={{ width: "100px" }} />
                        <col style={{ width: "100px" }} />
                        <col style={{ width: "200px" }} /> */}
                    </colgroup>
                    <tr>
                        <th>이메일</th><td>{menureg.email}</td>
                    </tr>
                    <tr>
                        <th>이름</th><td>{menureg.name}</td>
                    </tr>
                    <tr>
                        <th>연락처</th><td>{menureg.phone}</td>
                    </tr>
                    <tr>
                        <th>주소</th><td>{menureg.zip} {menureg.address1} {menureg.address2}</td>
                    </tr>
                    <tr>
                        <th>등록일</th><td>{menureg.regDt}</td>
                    </tr>
                </table>
            </div>
            <div class="ntc-buttons">
            <Link to="/mbr/MbrIndex"><button class="text-register">목록</button></Link>
                {sessionStorage.getItem('grade') > 2 &&
                <div>
                    <Link to={`/mbr/MbrJoin/${Mbremail}`}><button>수정</button></Link>
                    <button onClick={handleSubmit}>삭제</button>
                </div>
                }
            </div>
        </div>
    );
};

export default NtcDtl;