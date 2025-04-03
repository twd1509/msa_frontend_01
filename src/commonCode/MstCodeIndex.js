import React, {useEffect, useState, useContext} from 'react'
import {Link, Navigate} from 'react-router-dom'
import '../css/menuindex.css';
import {MemberInfoContext} from '../components/MemberInfoContext';

const MstCodeIndex = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const params = new URLSearchParams(window.location.search);
    let start = params.get("start") == null ? 0 : params.get("start");
    let paramSearchKey = params.get("searchKey") == null ? "" : params.get("searchKey");
    let paramKeyword = params.get("keyword") == null ? "" : params.get("keyword");

    let i = 1 + parseInt(start);
    
    const [msts,setMsts] = useState([]);
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

    var formData = new FormData();
    formData.append('start', start);
    formData.append('scale', scale);
    formData.append('searchKey', searchKey);
    formData.append('keyword', keyword);

    useEffect(() => {
        fetch('http://localhost:9191/api/code/mstIndex', {
            method:"POST",
            body : formData
        })
        .then((res) => res.json())
        .then((res)=>{
            //console.log(res);
            setMsts(res.mstList);
            setTotal(res.total);
        });
    }, []);

    const handleSubmit = (e, mstCd) => {
        if(window.confirm("삭제 하시겠습니까?")) {
            e.preventDefault();
            fetch('http://localhost:9191/api/code/mstDelete', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: mstCd
            })
            .then(response => response.text())
            .then((res) => {
                alert(res);
                window.location.href= `/commonCode/MstCodeIndex?searchKey=${searchKey}&keyword=${keyword}`;
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
            window.location.href = `/commonCode/MstCodeIndex?searchKey=${searchKey}&keyword=${keyword}`;
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
            <h2>공통 코드 관리</h2>
            <div class="search-container">
                <select class="search-select" name="searchKey" onChange={(e) => changeSearchKeyValue(e)}>
                    <option value="">전체</option>
                    <option value="mst_cd" selected={searchKey == "mst_cd"}>코드</option>
                    <option value="mst_nm" selected={searchKey == "mst_nm"}>코드명</option>
                </select>
                <input type="text" class="search-input" name="keyword" value={keyword} onChange={(e) => changeKeywordValue(e)} onKeyDown={handleSearch} />
                <a class="search-button" href={`/commonCode/MstCodeIndex?searchKey=${searchKey}&keyword=${keyword}`}>검색</a>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>코드</th>
                        <th>코드명</th>
                        <th>내용</th>
                        <th>상세코드 조회</th>
                        {memberInfo.grade == 3 &&
                        <th>관리</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                    msts.length === 0 ? (
                        <tr>
                        {memberInfo.grade == 3 ? (
                            <td colSpan={6} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                        ) : (
                            <td colSpan={5} style={{textAlign: "center"}}>데이터가 없습니다.</td>
                        )}
                        </tr>
                    ) : (
                    msts.map((mst)=>(
                        <tr key={mst.mstCd}>
                            <td>{i++}</td>
                            <td>{mst.mstCd}</td>
                            <td>{mst.mstNm}</td>
                            <td>{mst.dsctn}</td>
                            <td><button type="button"><Link to={`/commonCode/DtlCodeIndex?code=${mst.mstCd}`}>조회</Link></button></td>
                            {memberInfo.grade == 3 &&
                            <td>
                                <button type="button"><Link to={`/commonCode/CodeReg?code=${mst.mstCd}&type=mst`}>수정</Link></button>
                                <button type="button" onClick={(e) => handleSubmit(e, mst.mstCd)}>삭제</button>
                            </td>
                            }
                        </tr>
                        ))
                    )}
                </tbody>
            </table>
            {memberInfo.grade == 3 &&
            <button type="button"><Link to="/commonCode/CodeReg">등록</Link></button>
            }
            <div class="pagination">
                <a href={pageNum > 1 ? `/commonCode/MstCodeIndex?start=${(prevPage - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`: '#'}>&laquo;</a>
                {pageNumbers.map(number =>(
                    <a href={`/commonCode/MstCodeIndex?start=${(number - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`} class={currentPage === number ? 'active' : ''} key={number}>{number}</a>
                ))}
                <a href={pageNum < totalPageScale ? `/commonCode/MstCodeIndex?start=${(nextPage - 1) * scale}&searchKey=${searchKey}&keyword=${keyword}`: '#'}>&raquo;</a>
            </div>
            
        </div>
    );
};

export default MstCodeIndex;