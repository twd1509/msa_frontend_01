import React, {useState,useEffect,useContext} from 'react'
import {Link, useParams, Navigate } from 'react-router-dom'
import '../css/menureg.css';
import {MemberInfoContext} from '../components/MemberInfoContext';

const MbrJoin = () => {
    const memberInfo  = useContext(MemberInfoContext);
    
    const[menureg,setMenureg] = useState({
        email: '',
        name: '',
        phone: '',
        zip: '',
        address1: '',
        address2: ''

    });
    const { Mbremail } = useParams(); // URL에서 email 값 가져오기
        
    useEffect(() => {
        if (!Mbremail) return; // email 값이 없으면 요청 안 보냄
        fetch('http://localhost:9191/api/mbr/getmbr',{
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
                            address2: data.address2
                        }));
                    })
                }
            }
        });

       
    },[Mbremail]);
    useEffect(() => {
         // 다음 주소 API 스크립트 로드
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
    }, []);
     
      
    const[previousLength,setPreviousLength] = useState(0);
    const changeValue=(e)=>{
        let val;
        if(e.target.name == "phone"){
            val = e.target.value.replace(/[^\d]/g, "");
            
            if(val.length < previousLength){
                e.target.value = val;
            }else{
                
                if(val.length <= 11 && val.length >= 7){
                    e.target.value = val.slice(0,3) + "-" + val.slice(3,7) + "-" + val.slice(7);
                }else if(val.length <= 12){
                    e.target.value = val.slice(0,4) + "-" + val.slice(4,8) + "-" + val.slice(8);
                }else{
                    e.target.value = val;
                }
            }
            setPreviousLength(val.length);
        }
        setMenureg({
            ...menureg,
            [e.target.name]:e.target.value
        })
    }

    

    
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll("div[data-info] input");
        let pwd = inputs[1].value;
        let pwdconfirm = inputs[2].value;

        for(const input of inputs){
            if(!(memberInfo.email && input.name == "password")){
                if(!input.value.trim()){
                    alert(input.title + "을 입력하세요.");
                    input.focus();
                    return false;
                }
            }
            

        }

        
        if(!Mbremail &&(pwd != pwdconfirm)){
            alert("비밀번호를 정확히 입력해주세요.");
            return false;
        }
        
        
        let apiPath="";
        if(Mbremail){
            apiPath = "http://localhost:9191/api/mbr/mbrupdate";
        }else{
            apiPath = "http://localhost:9191/api/mbr/join";
        }
        
        fetch(apiPath,{
            method:"POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify(menureg)
        })
        .then((response)=>{
            
            if(response.status == 200){
                return response.text().then((data)=>{
                    alert(data);
                    if(memberInfo.grade == 3){
                        window.location.href = "/mbr/MbrIndex";
                    }else{
                        window.location.href = "/";
                    }
                });
            }else{
                return response.text().then((data)=>{
                    alert(data);
                });
            }
        });
    };

    
    // 주소 검색 실행 함수
    const handlePostcode = () => {
        new window.daum.Postcode({
        oncomplete: (data) => {
            let addr = ""; // 도로명 주소
            let extraRoadAddr = ""; // 추가 정보

            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            if(data.userSelectedType === 'R'){
                if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
                }
                if (data.buildingName !== "" && data.apartment === "Y") {
                extraRoadAddr += extraRoadAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
                }
                if (extraRoadAddr !== "") {
                extraRoadAddr = ` (${extraRoadAddr})`;
                }
            }

            setMenureg((prev) => ({
                ...prev,
                address1: addr,
                zip: data.zonecode,
                
            }));
        },
        }).open();
    };

    const handleSecession = (e) => {
        e.preventDefault();
        if(window.confirm("삭제 하시겠습니까?")) {
            fetch('http://localhost:9191/api/mbr/mbrdelete',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({email:menureg.email})
            })
            .then((response)=>{
                if(response.status==200){
                   
                    alert("삭제되었습니다.");
                    if(memberInfo.grade != 3){
                        fetch("http://localhost:9191/api/mbr/logout", {
                            method: "POST",
                            credentials: "include", // 쿠키를 포함하도록 설정
                            headers: {
                                "Content-Type": "application/json; charset=utf-8",
                            },
                        }).then((res) => {
                            console.log(res);
                            document.cookie = "JSESSIONID=; Path=/; Max-Age=0";
                            window.location.href = "/";
                        });
                    }else{
                        window.location.href = "/mbr/MbrIndex";
                    }
                    
                      
                }
            });
        }
    };
         
    if(Mbremail) {
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
    }

    return (
        <div>
            <div id="content_center" style={{ textAlign: 'center', width: '1800px' }}>
                <h1 class="title" >회원가입</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div class="form-container" data-info>
                    <div class="menu-form-group">
                        <label for="email">이메일</label>
                        <input type="email" id="email" name="email" value={menureg.email} readOnly={Mbremail} onChange={(e) => changeValue(e)} title="이메일"  placeholder="이메일을 입력하세요" />
                    </div>
                    <div class="menu-form-group">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" name="password" value={menureg.menuLnkg} onChange={(e) => changeValue(e)}  title="비밀번호" placeholder="비밀번호를 입력하세요" />
                    </div>
                   {!Mbremail && (
                    <div class="menu-form-group">
                        <label for="passwordconfirm">비밀번호 확인</label>
                        <input type="password" id="passwordconfirm" name="passwordconfirm"  onChange={(e) => changeValue(e)}  title="비밀번호확인" placeholder="비밀번호확인를 입력하세요" />
                    </div>
                   )}
                    
                    <div class="menu-form-group">
                        <label for="name">이름</label>
                        <input type="text" id="name" name="name" value={menureg.name} onChange={(e) => changeValue(e)} title="이름" placeholder="이름을 입력하세요" />
                    </div>
                    <div class="menu-form-group">
                        <label for="phone">연락처</label>
                        <input type="text" id="phone" name="phone" value={menureg.phone} onChange={(e) => changeValue(e)} maxLength="14" title="연락처" placeholder="연락처를 입력하세요" />
                    </div>
                    <div class="menu-form-group">
                        <label for="address2">주소</label>
                        <div>
                            <input type="text" id="zip" name="zip" readOnly value={menureg.zip} onChange={(e) => changeValue(e)} title="우편번호" placeholder="우편번호" />
                            <input type="text" id="address1" name="address1" readOnly value={menureg.address1} onChange={(e) => changeValue(e)} title="주소" placeholder="주소" />
                            <input type="text" id="address2" name="address2" value={menureg.address2}  onChange={(e) => changeValue(e)} title="상세주소" placeholder="상세주소를 입력하세요." />
                        </div>
                        <div>
                            <button type="button" onClick={handlePostcode}>
                                주소 검색
                            </button>
                        </div>
                    </div>
                    
                    {/* <div class="menu-form-group">
                        <label>사용 여부</label>
                        <div class="checkbox-group">
                            <input type="checkbox" name="useYn" id="use" value="Y" checked={menureg.useYn == 'Y'} onChange={changeChkValue}/><label for="use"> 사용</label>
                        </div>
                    </div> */}
                    <div class="menu-button-group">
                        <button type="button"><Link to="/mbr/MbrIndex">목록</Link></button>
                        <button type="submit">{Mbremail ? "수정":"등록"}</button>
                        {Mbremail && (
                            <button type="button" onClick={handleSecession} >탈퇴</button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
};

export default MbrJoin;