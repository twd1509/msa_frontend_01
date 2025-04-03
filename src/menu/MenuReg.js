import React, {useState,useEffect, useContext} from 'react'
import {Link, useParams, Navigate } from 'react-router-dom'
import '../css/menureg.css';
import { MemberInfoContext } from '../components/MemberInfoContext';
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const MenuReg = () => {
    const memberInfo = useContext(MemberInfoContext);
    const params = new URLSearchParams(window.location.search);
    let paramNo = params.get("no");
    

    const[menureg,setMenureg] = useState({
        no: '',
        rfrncNo: '',
        rfrncGroup: '',
        menuNm: '',
        menuLnkg: '',
        rlsMbrAuthrt: 1,
        useYn: 'Y',
        regId: '',
        uptId: '',
        regDt: '',
        uptDt: '',
        layer: ''

        });

    useEffect(() => {
        fetch(`${LocalHostInfoContext.common}/api/getmenu`,{
            method:"POST",
            credentials: 'include', // 쿠키를 포함하도록 설정
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({no:paramNo})
        })
        .then((response)=>{
            if(response.status==200){
                if(paramNo){
                    response.json().then(data => {
                        setMenureg(prevState => ({
                            ...prevState,
                            no: data.no,
                            rfrncNo: data.rfrncNo,
                            rfrncGroup: data.rfrncGroup,
                            menuNm: data.menuNm,
                            menuLnkg: data.menuLnkg,
                            rlsMbrAuthrt: data.rlsMbrAuthrt,
                            useYn: data.useYn,
                            regId: data.regId,
                            uptId: data.uptId,
                            regDt: data.regDt,
                            uptDt: data.uptDt,
                            layer: data.layer
                        }));
                    })
                }
            }
        });
    },[]);
     
    
    const changeValue=(e)=>{
        setMenureg({
            ...menureg,
            [e.target.name]:e.target.value
        })
    }

    const changeChkValue=(e)=>{
        const { name, checked } = e.target;
        setMenureg((menureg)=>({
            ...menureg,
            [e.target.name]: checked ? "Y":"",
        }))
    }

    
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll("div[data-info] input");

        for(const input of inputs){
            if(!input.value.trim()){
                alert(input.title + "을/를 입력하세요.");
                input.focus();
                return false;
            }
        }

        let apiPath="";
        if(paramNo){
            apiPath = `${LocalHostInfoContext.common}/api/menuupdate`;
        }else{
            apiPath = `${LocalHostInfoContext.common}/api/menuform`;
        }
        
        fetch(apiPath,{
            method:"POST",
            credentials: 'include', // 쿠키를 포함하도록 설정
            headers:{
                "Content-Type":"application/json; charset=utf-8"
                
            },
            body: JSON.stringify(menureg)
        })
        .then((response)=>{
            if(response.status==200){
                window.location.href = "./MenuIndex";
                if(paramNo){
                    alert("수정되었습니다.");
                }else{
                    alert("등록되었습니다.");
                }
            }
        });
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
        <div>
            <div id="content_center" style={{ textAlign: 'center', width: '1800px' }}>
                <h1 class="title" >메뉴 {paramNo ? "수정":"등록"}</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div class="form-container" data-info>
                    <div class="menu-form-group">
                        <label for="menu-name">메뉴명</label>
                        <input type="text" id="menu-name" name="menuNm" value={menureg.menuNm} onChange={(e) => changeValue(e)} placeholder="메뉴명을 입력하세요" title="메뉴명" />
                    </div>
                    <div class="menu-form-group">
                        <label for="link">링크</label>
                        <input type="text" id="link" name="menuLnkg" value={menureg.menuLnkg} onChange={(e) => changeValue(e)} placeholder="링크를 입력하세요" title="링크" />
                    </div>
                    <div class="menu-form-group">
                        <label>회원 권한</label>
                        <div class="radio-group">
                            <input type="radio" id="auth1" name="rlsMbrAuthrt" value="1" checked={menureg.rlsMbrAuthrt == 1}  onChange={changeValue}/><label for="auth1"> 일반</label>
                            <input type="radio" id="auth3" name="rlsMbrAuthrt" value="3" checked={menureg.rlsMbrAuthrt == 3} onChange={changeValue}/><label for="auth3"> 관리자</label>
                        </div>
                    </div>
                    {/* <div class="form-group">
                        <label for="category">분류</label>
                        <select id="category" width="50px;" name="category">
                            <option value="">선택하세요</option>
                            <option value="페이지">페이지</option>
                            <option value="공개여부">공개 여부</option>
                        </select>

                    </div> */}
                    <div class="menu-form-group">
                        <label>사용 여부</label>
                        <div class="checkbox-group">
                            <input type="checkbox" name="useYn" id="use" value="Y" checked={menureg.useYn == 'Y'} onChange={changeChkValue}/><label for="use"> 사용</label>
                        </div>
                    </div>
                    <div class="menu-button-group">
                        <button type="button"><Link to="/menu/MenuIndex">목록</Link></button>
                        <button type="submit">{paramNo ? "수정":"등록"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MenuReg;