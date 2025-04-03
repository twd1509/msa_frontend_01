import React, {useEffect, useState, useContext} from 'react'
import {Link, Navigate} from 'react-router-dom'
import '../css/menuindex.css';
import {MemberInfoContext} from '../components/MemberInfoContext';
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const DtlCodeIndex = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const params = new URLSearchParams(window.location.search);
    let start = params.get("start") == null ? 0 : params.get("start");
    let paramSearchKey = params.get("searchKey") == null ? "dtl_cd" : params.get("searchKey");
    let paramKeyword = params.get("keyword") == null ? "" : params.get("keyword");
    let paramCode = params.get("code");

    if(paramCode === "" || paramCode === null) {
        alert("잘못된 접근 입니다.");
        window.location.href = "/commonCode/MstCodeIndex";
    }

    let idx = 1 + parseInt(start);
    
    const [dtls,setDtls] = useState([]);
    const [total, setTotal] = useState(0);
    const [searchKey, setSearchKey] = useState(paramSearchKey);
    const [keyword, setKeyword] = useState(paramKeyword);

    const scale = 2;
    const pageScale = 5;
    const currentPage = Math.ceil(start / pageScale) + 1;
    const pageNumbers = [];
    const totalPage = Math.ceil(total / scale); // 전체 페이징 수
    const totalPageScale = Math.ceil(totalPage/pageScale); //  총 페이지 수
    const pageNum = Math.ceil(currentPage/pageScale); // 페이지 번호
    const startPage = pageScale * (pageNum - 1) + 1; // 페이지 시작 번호
    const nextPage = pageNum * pageScale + 1; // 다음 페이지 시작 번호
    const prevPage = nextPage - pageScale - 1; // 이전 페이지 
    
    for (let num = startPage; num<= startPage+pageScale-1; num++) {
        if(num <= totalPage){
            pageNumbers.push(num);
        }
    }

    let formData = new FormData();
    formData.append('start', start);
    formData.append('scale', scale);
    formData.append('searchKey', searchKey);
    formData.append('keyword', keyword);
    formData.append('mstCd', paramCode);

    useEffect(() => {
        fetch(`${LocalHostInfoContext.common}/api/code/dtlIndex`, {
            method:"POST",
            body : formData
        })
        .then((res) => res.json())
        .then((res)=>{
            console.log(res);
            setDtls(res.dtlList);
            setTotal(res.total);
        });
    }, []);

    const handleSubmit = (e, dtlCd) => {
        if(window.confirm("삭제 하시겠습니까?")) {
            e.preventDefault();
            fetch(`${LocalHostInfoContext.common}/api/code/dtlDelete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: dtlCd
            })
            .then((response) => response.text())
            .then((res) => {
                alert(res);
                window.location.href= `/commonCode/DtlCodeIndex?code=${paramCode}&searchKey=${searchKey}&keyword=${keyword}`;
            });
        }
    };

    const changeKeywordValue = (e) => {
        setKeyword(e.target.value);
    }

    const changeSearchKeyValue = (e) => {
        setSearchKey(e.target.value);
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            window.location.href = `/commonCode/DtlCodeIndex?code=${paramCode}&searchKey=${searchKey}&keyword=${keyword}`;
        }
    }

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
        <div class="content">
            <h2>공통 코드 관리(상세)</h2>
            <div class="search-container">
                <select class="search-select" name="searchKey" onChange={(e) => changeSearchKeyValue(e)}>
                    <option value="">전체</option>
                    <option value="dtl_cd" selected={searchKey == "dtl_cd"}>코드</option>
                    <option value="dtl_nm" selected={searchKey == "dtl_nm"}>코드명</option>
                </select>
                <input type="text" class="search-input" name="keyword" value={keyword} onChange={(e) => changeKeywordValue(e)} onKeyDown={handleSearch} />
                <a class="search-button" href={`/commonCode/DtlCodeIndex?code=${paramCode}&searchKey=${searchKey}&keyword=${keyword}`}>검색</a>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>마스터 코드</th>
                        <th>상세 코드</th>
                        <th>코드명</th>
                        <th>내용</th>
                        {memberInfo.grade == 3 &&
                        <th>관리</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                    dtls.length === 0 ? (
                        <tr>
                        {memberInfo.grade == 3 ? (
                            <td colSpan={6} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                        ) : (
                            <td colSpan={5} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                        )}
                        </tr>
                    ) : (
                        dtls.map((dtl) => (
                        <tr key={dtl.dtlCd}>
                            <td>{idx++}</td>
                            <td>{dtl.mstCd}</td>
                            <td>{dtl.dtlCd}</td>
                            <td>{dtl.dtlNm}</td>
                            <td>{dtl.dsctn}</td>
                            {memberInfo.grade == 3 &&
                            <td>
                                <button type="button">
                                    <Link to={`/commonCode/CodeReg?code=${dtl.dtlCd}&type=dtl`}>수정</Link>
                                </button>
                                <button type="button" onClick={(e) => handleSubmit(e, dtl.dtlCd)}>삭제</button>
                            </td>
                            }
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
            {memberInfo.grade == 3 &&
            <button type="button"><Link to="/commonCode/CodeReg?type=dtl">등록</Link></button>
            }
            <button type="button"><Link to="/commonCode/MstCodeIndex">목록</Link></button>
           
            <div class="pagination">
                <a href={pageNum > 1 ? `/commonCode/DtlCodeIndex?code=${paramCode}&start=${(prevPage - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`: '#'}>&laquo;</a>
                {pageNumbers.map(number =>(
                    <a href={`/commonCode/DtlCodeIndex?code=${paramCode}&start=${(number - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`} class={currentPage === number ? 'active' : ''} key={number}>{number}</a>
                ))}
                <a href={pageNum < totalPageScale ? `/commonCode/DtlCodeIndex?code=${paramCode}&start=${(nextPage - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`: '#'}>&raquo;</a>
            </div>
            
        </div>
    );
};

export default DtlCodeIndex;