import React, {useState,useEffect, useContext} from 'react'
import {Link, useParams, Navigate } from 'react-router-dom'
import '../css/menureg.css';
import { MemberInfoContext } from '../components/MemberInfoContext';

const CodeReg = () => {
    const memberInfo = useContext(MemberInfoContext);
    const params = new URLSearchParams(window.location.search);
    let paramCode = params.get("code");
    let paramType = params.get("type");
    
    const[codeReg,setCodeReg] = useState({
        dtlCd : '',
        dtlNm : '',
        dsctn : '',
        mstCd : ''
    });
    const[mstCodeReg,setMstCodeReg] = useState([]);
    const[codeOption, setCodeOption] = useState('mst');
    const[mstValue, setMstValue] = useState('');
    const[updateCode, setUpdateCode] = useState(false);

    let start = 0;
    let scale = 5;

    useEffect(() => {
        const mstCodeFetch = async () => {
            try {
                const response = await fetch('http://localhost:9191/api/code/getMstCode');
                const data = await response.json();
                setMstCodeReg(data);
                if(paramType) { 
                    setCodeOption(paramType); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
      
        mstCodeFetch();

        if(paramCode) {
            setUpdateCode(true);
            let getCodeUrl = "";
            if(paramType == "dtl") {
                getCodeUrl = `http://localhost:9191/api/code/getDtlByCode`;
            } else {
                getCodeUrl = `http://localhost:9191/api/code/getMstByCode`;
            }
            const codeFetch = async () => {
                try {
                    const response = await fetch(getCodeUrl, {
                        method:"POST",
                        body: paramCode
                    });
                    
                    const data = await response.json();
                    //console.log(data);
                    if(paramType == "mst") {
                        setCodeReg({
                            dtlCd : data.mstCd,
                            dtlNm : data.mstNm,
                            dsctn : data.dsctn
                        });
                    } else {
                        setCodeReg(data);
                    }
                    setCodeOption(data.type);
                    if(paramType == "dtl") {
                        setMstValue(data.mstCd);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            codeFetch();
        }
    }, []);
     
    
    const changeValue=(e)=>{
        setCodeReg({
            ...codeReg,
            [e.target.name]:e.target.value
        })
    }

    const changeTypeValue=(e)=>{
        setCodeReg({
            ...codeReg,
            [e.target.name]:e.target.value
        })
        setCodeOption(e.target.value);
        setMstValue('');
    }

    const changeMstCdValue=(value)=>{
        setCodeReg({
            ...codeReg,
            mstCd: value
        })
        setMstValue(value);
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if(codeOption === "dtl" && mstValue === "") {
            alert("마스터 코드를 선택해주세요.");
            return false;
        }
        if(codeReg.dtlCd === "") {
            alert("코드를 입력해주세요.");
            return false;
        }
        if(codeReg.dtlCd.length >= 10) {
            alert("10자리 미만으로 입력해주세요.");
            return false;
        }
        if(codeReg.dtlNm === "") {
            alert("코드명을 입력해주세요.");
            return false;
        }
        let apiPath="";

        if(paramCode && paramType){
            apiPath = "http://localhost:9191/api/code/modify";
        }else{
            apiPath = "http://localhost:9191/api/code/reg";
        }
        
        fetch(apiPath,{
            method:"POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
                dtlVO : codeReg,
                type : codeOption
            })
        })
        .then(response => response.text())
        .then((res)=>{
            if(paramCode && paramType){
                alert(res);
            } else{
                alert(res);
            }

            if(paramCode && paramType == "dtl") {
                window.location.href = `/commonCode/DtlCodeIndex?code=${codeReg.mstCd}`;
            } else {
                window.location.href = "/commonCode/MstCodeIndex";
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
                <h1 class="title" >공통 코드 {paramCode !== null ? '수정' : '등록'}</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div class="form-container">
                    <div class="menu-form-group">
                        <label>코드 선택</label>
                        <div class="radio-group">
                            <input type="radio" id="type1" name="type" value="mst" checked={codeOption === "mst"} onChange={paramCode && paramType ? undefined : changeTypeValue} /><label for="type1">마스터 코드</label>
                            <input type="radio" id="type2" name="type" value="dtl" checked={codeOption === "dtl"} onChange={paramCode && paramType ? undefined : changeTypeValue} /> <label for="type2">상세 코드</label>
                        </div>
                    </div>
                    <div class="menu-form-group" style={{ display: codeOption === "dtl" ? 'flex' : 'none' }}>
                        <label for="menu-name">마스터 코드</label>
                        <select name="mstCd" value={mstValue} onChange={(e) => changeMstCdValue(e.target.value)}>
                            <option value="">선택하세요.</option>
                            {mstCodeReg.map((item)=>(
                                <option key={item.mstCd} value={item.mstCd}>{item.mstNm}</option>
                            ))}
                        </select>
                    </div>
                    <div class="menu-form-group">
                        <label for="menu-name">코드</label>
                        <input type="text" id="menu-name" name="dtlCd" value={codeReg.dtlCd} onChange={(e) => changeValue(e)} readOnly={updateCode} placeholder="코드를 입력하세요" />
                    </div>
                    <div class="menu-form-group">
                        <label for="mstNm">코드명</label>
                        <input type="text" id="name" name="dtlNm" value={codeReg.dtlNm} onChange={(e) => changeValue(e)} placeholder="코드명을 입력하세요" />
                    </div>
                    <div class="menu-form-group">
                        <label for="link">내용</label>
                        <textarea placeholder="내용을 입력하세요." name="dsctn" rows="4" onChange={(e) => changeValue(e)} value={codeReg.dsctn}></textarea>
                    </div>
                    <div class="menu-button-group">
                        <button type="button"><Link to="/commonCode/MstCodeIndex">목록</Link></button>
                        {/* <button type="button" onClick={window.location.href='/'}>목록</button> */}
                        <button type="submit">{paramCode != null ? '수정' : '등록'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CodeReg;