import React, {useEffect, useState, useContext} from "react";
import {Link, Navigate} from 'react-router-dom'
import '../css/Ntc.css';
import {MemberInfoContext} from '../components/MemberInfoContext';
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";


const NtcIndex = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const[ntcs,setNtc] = useState([]);
    let i = 1;

    const params = new URLSearchParams(window.location.search);
    let start = params.get("start") == null ? 0 : params.get("start");
    let paramSearchKey = params.get("searchKey") == null ? "title" : params.get("searchKey");
    let paramKeyword = params.get("keyword") == null ? "" : params.get("keyword");
    
    const [total, setTotal] = useState(0);
    const [searchKey, setSearchKey] = useState(paramSearchKey);
    const [keyword, setKeyword] = useState(paramKeyword);

    const scale = 5;
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

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            window.location.href = `/ntc/NtcIndex?searchKey=${searchKey}&keyword=${keyword}`;
        }
    }

    useEffect(() => {
        fetch(`${LocalHostInfoContext.common}/api/ntc/index?start=${start}&searchKey=${searchKey}&keyword=${keyword}`,{
            method:"GET",
            credentials: 'include',
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            }
        })
        .then((res) => res.json())
        .then((res)=>{
            setNtc(res.ntcList);
            setTotal(res.total);
        });
    }, []);

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
                    window.location.reload();
                }
            });
        }
    };

    const changeKeywordValue = (e) => {
        setKeyword(e.target.value);
    }

    const changeSearchKeyValue = (e) => {
        setSearchKey(e.target.value);
    }

    if(memberInfo.loading) {
        return <div>로딩 중...</div>
    }

    if(!memberInfo.email) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/lgn/Lgn" replace />
    }
    
    return (
        <div class="ntc-container">
            <h1 class="ntc-title">공지사항</h1>
            <div class="search-container">
                <select class="search-select" name="searchKey" onChange={(e) => changeSearchKeyValue(e)}>
                    <option value="title" selected={searchKey == "title"}>제목</option>
                    <option value="name" selected={searchKey == "name"}>작성자</option>
                </select>
                <input type="text" class="search-input" name="keyword" value={keyword} onChange={(e) => changeKeywordValue(e)} onKeyDown={handleSearch} />
                <a class="search-button" href={`/ntc/NtcIndex?searchKey=${searchKey}&keyword=${keyword}`}>검색</a>
            </div>
            <table class="board">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>작성자</th>
                        {memberInfo.grade == 3 &&
                        <th>관리</th>
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    ntcs.length === 0 ? (
                        <tr>
                        {memberInfo.grade == 3 ? (
                            <td colSpan={5} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                        ) : (
                            <td colSpan={4} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                        )}
                        </tr>
                    ) : (
                    ntcs.map((item) => (
                    <tr key={item.no}>
                        <td>
                            {
                                item.ntcYn == 'Y' ? '공지' : i++
                            }
                        </td>
                        <td><Link to={`/ntc/NtcDtl?no=${item.no}`}>{item.title}</Link></td>
                        <td>{item.regDt}</td>
                        <td>{item.mbrVo.name}</td>
                        
                        {memberInfo.grade == 3 &&
                        <td>
                            <button type="button" class="text-register"><Link to={`/ntc/NtcReg?no=${item.no}`}>수정</Link></button>
                            <button type="button" onClick={(e) => handleSubmit(e, item.no)}>삭제</button>
                        </td>
                        }
                        
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            <div>
            {memberInfo.grade == 3 &&
            <div>
                <button type="button" class="text-register"><Link to={'/ntc/NtcReg'}>등록</Link></button>
            </div>
            }
            </div>
            <div class="pagination">
                <a href={pageNum > 1 ? `/ntc/NtcIndex?start=${(prevPage - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`: '#'}>&laquo;</a>
                {pageNumbers.map(number =>(
                    <a href={`/ntc/NtcIndex?start=${(number - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`} class={currentPage === number ? 'active' : ''} key={number}>{number}</a>
                ))}
                <a href={pageNum < totalPageScale ? `/ntc/NtcIndex?start=${(nextPage - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`: '#'}>&raquo;</a>
            </div>
        </div>
    );
};

export default NtcIndex;