import React, {useEffect, useState, useContext} from 'react'
import {Link, Navigate} from 'react-router-dom'
import '../css/Mbr.css';
import MbrItem from './MbrItem';
import { MemberInfoContext } from '../components/MemberInfoContext';

const MbrIndex = () => {
    const memberInfo = useContext(MemberInfoContext);

    const [search, setSearch] = useState({
        searchKey : '',
        keyword : ''
    });

    const changeKeywordValue = (e) => {
        setSearch((search)=>({
            ...search,
            [e.target.name]:e.target.value
        }));
        
    }

    const[mbrs,setMbrs] = useState([]);
    const [lengthOfMbrs, setLengthOfMbrs] = useState(0);
    useEffect(() => {
        handleSubmit(1,1);
    },[]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const pageScale = 5;
    const [isActive, setIsActive] = useState(false);
    const [isActive2, setIsActive2] = useState(false);
    const [gradeSave,setGradeSave] = useState(0);
    
    // 현재 페이지에 해당하는 데이터 계산
    const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
    // const currentItems = menus.slice(indexOfFirstItem, indexOfLastItem); // 배열에 현재 페이지에 해당하는 아이템 잘라내어 가져옴.
    
        const pageNumbers = [];
        const totalPage = Math.ceil(lengthOfMbrs / itemsPerPage); // 전체 페이징 수
        const totalPageScale = Math.ceil(totalPage/pageScale); //  총 페이지 수
        const pageNum = Math.ceil(currentPage/pageScale); // 페이지 번호
        const startPage = pageScale * (pageNum - 1) + 1; // 페이지 시작 번호
        const nextPage = pageNum * pageScale +1; // 다음 페이지 시작 번호
        const prevPage = nextPage - pageScale -1; // 이전 페이지 
    
    for (let i = startPage; i<= startPage+pageScale-1; i++) {
        if(i <= totalPage){
            pageNumbers.push(i);
        }
    }
    
    const handleSubmit = (number,grade) => {
        const indexOfLastItem = number * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setIndexOfFirstItem(indexOfFirstItem);
        setIsActive(number);
        setCurrentPage(number);
        if(grade == 1){
            setIsActive2(false);
        }else{
            setIsActive2(true);
        }
        setGradeSave(grade);
        
        fetch('http://localhost:9191/api/mbr/index',{
            method:"POST",
            headers:{
                "Content-Type":"application/json; charset=utf-8"
            },
            body: JSON.stringify({
                itemsPerPage: itemsPerPage,   // 한 페이지당 아이템 개수
                indexOfFirstItem: indexOfFirstItem, // 현재 페이지의 첫 번째 아이템 인덱스
                grade : grade,
                searchkey : search.searchKey,
                keyword : search.keyword
            })
        })
        .then((res) => res.json())
        .then((res)=>{
            setMbrs(res.mbrList);
            setLengthOfMbrs(res.mbrTotal);
        });
        
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
          // 검색 함수 실행
          handleSubmit(1,1);
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
        <div class="mbr-container">
            <div class="title">회원 관리</div>
            <div class="buttons-top">
                <div>
                    <a href="#" onClick={()=>handleSubmit(1,1)} class={isActive2 ? '' : 'active'}>일반</a>
                    <a href="#" onClick={()=>handleSubmit(1,3)} class={isActive2 ? 'active' : ''}>관리자</a>
                </div>
            </div>
            <div class="search-container">
                <select class="search-select" name="searchKey" onChange={(e) => changeKeywordValue(e)}>
                    <option>선택</option>
                    <option value="email" selected={search.searchKey == "email"}>이메일</option>
                    <option value="name" selected={search.searchKey == "name"}>이름</option>
                    <option value="phone" selected={search.searchKey == "phone"}>연락처</option>
                </select>
                <input type="text" class="search-input" name="keyword" onKeyUp={handleKeyUp}  onChange={(e) => changeKeywordValue(e)} />
                <a href="#" class="search-button"  onClick={()=>handleSubmit(1,1)}>검색</a>
                
            </div>
            <table class="member-table">
                <colgroup>
                    <col style={{ width: "10px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "200px" }} />
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "100px" }} />
                </colgroup>
                <tr>
                    <th>번호</th>
                    <th>이메일(ID)</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>만족도 조사 결과</th>
                    <th>관리</th>
                </tr>
                {mbrs && mbrs.map((mbr,index)=>(
                    <MbrItem key={mbr.email} mbr={mbr} index={indexOfFirstItem+index+1}/>
                ))}
               
            </table>
            <button type="button"><Link to="/mbr/MbrJoin">등록</Link></button>
            <div class="pagination">
                <a href="#" onClick={()=>pageNum > 1 ? handleSubmit(prevPage,gradeSave):''}>&laquo;</a>
                {pageNumbers.map(number =>(
                    <a href="#" class={isActive === number ? 'active' : ''} key={number} onClick={()=>handleSubmit(number,gradeSave)}>{number}</a>
                ))}
                <a href="#" onClick={()=>pageNum < totalPageScale ? handleSubmit(nextPage,gradeSave): ''}>&raquo;</a>
            </div>
        </div>
    );
};

export default MbrIndex;