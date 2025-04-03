import { MemberInfoContext } from "../components/MemberInfoContext"; // 쿠키 정보가 들어있는 MemberInfoContext 임포트

import React, { useEffect, useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";



const RequirementList = () => {

  const memberInfo = useContext(MemberInfoContext); //쿠키 정보를 js객체 형태로 변수에 담기 { email:"문자열 값", grade: 숫자 값 } )

  const [requestData, setRequestData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const navigate = useNavigate();



  // ✅ 페이징 관련 상태값

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [searchQuery, setSearchQuery] = useState("");

  // 이메일 전송 관련 상태값

  const [emailSending, setEmailSending] = useState({});

  // 분석 되었는지 확인하기



  // ✅ 데이터 불러오기

  useEffect(() => {

    const fetchRequests = async () => {

      setLoading(true);



      let EmlAddr = memberInfo.email;
      let memGrade = memberInfo.grade;

      if (memGrade === 3) {

        EmlAddr = "";

      }



      try {

        const response = await fetch(

          `http://localhost:3002/api/getRequirements?memId=${EmlAddr}&memGrade=${memGrade}`

        );

        if (!response.ok) throw new Error(`네트워크 오류: ${response.status}`);

        const data = await response.json();

        setRequestData(data);

      } catch (error) {

        console.error("데이터 불러오기 오류:", error);

        setError(error.message);

      } finally {

        setLoading(false);

      }

    };



    fetchRequests();

  }, [memberInfo, navigate]);



  // ✅ 삭제 요청 핸들러

  const handleDelete = async (reqNo) => {

    if (!window.confirm("정말 삭제하시겠습니까?")) return;



    try {

      const response = await fetch(

        `http://localhost:3002/api/RequirementDel?reqNo=${reqNo}`,

        {

          method: "DELETE",

        }

      );



      if (!response.ok) {

        throw new Error(`삭제 실패: ${response.status}`);

      }



      alert("삭제가 완료되었습니다.");



      // ✅ 삭제된 항목을 화면에서 제거

      setRequestData((prevData) =>

        prevData.filter((item) => item.reqNo !== reqNo)

      );

    } catch (error) {

      console.error("삭제 오류:", error);

      alert("삭제 중 오류가 발생했습니다.");

    }

  };



  // ✅ AI 분석 요청 핸들러

  const handelAiRequest = async (reqNo) => {

    if (!window.confirm("분석 요청 하시겠습니까?")) return;



    try {

      const response = await fetch(

        `http://localhost:3002/api/AiAnalysisReq?reqNo=${reqNo}`,

        {

          method: "GET",

        }

      );



      if (!response.ok) {

        throw new Error(`분석 요청 실패: ${response.status}`);

      }



      alert("요청 완료되었습니다.");

      window.location.reload();

    } catch (error) {

      console.error("요청 오류:", error);

      alert("요청 중 오류가 발생했습니다.");

    }

  };



  // 이메일로 분석결과 전송

  const handleEmailButtonClick = async (reqNo) => {

    setEmailSending((prevState) => ({ ...prevState, [reqNo]: true }));

    try {

      const response = await fetch(`http://localhost:3002/api/email/send`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: reqNo,

      });



      if (!response.ok) {

        throw new Error(`이메일 전송 실패: ${response.status}`);

      }

      const result = await response.json();

      if (result == 3) {

        alert("AI 분석을 수행해 주십시오.");

      } else if (result == 2) {

        console.log("이메일 전송 성공:", result);

        alert("이메일 전송 완료");

      } else if (result == 1) {

        alert("이메일 전송에 실패했습니다.");

      } else if (result == 0) {

        alert("이메일 전송 이력이 있습니다.\n재전송은 불가합니다.");

      }

    } catch (error) {

      console.log("이메일 전송 오류: ", error);

      alert(`이메일 전송 오류: ${error.message}`);

    } finally {

      setEmailSending((prevState) => ({ ...prevState, [reqNo]: false })); // 전송 완료 후 원래 상태로 복구

    }

  };



  // ✅ 페이지당 표시할 항목 개수 변경 핸들러

  const handleSelectedOption = (e) => {

    setItemsPerPage(Number(e.target.value));

    setCurrentPage(1);

  };



  // ✅ 페이지 이동 핸들러

  const handlePageChange = (page) => {

    setCurrentPage(page);

  };

  // ✅ 검색 입력 변경 핸들러

  const handleSearchChange = (e) => {

    setSearchQuery(e.target.value.toLowerCase());

    setCurrentPage(1); // 검색 시 첫 페이지로 이동

  };

  // ✅ 검색어 필터링

  const filteredData = requestData.filter(

    (item) =>

      item.title.toLowerCase().includes(searchQuery) ||

      item.memId.toLowerCase().includes(searchQuery) ||

      item.status.toLowerCase().includes(searchQuery)

  );



  // ✅ 페이징 처리

  const totalItems = filteredData.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;

  const endIdx = startIdx + itemsPerPage;

  const pagedData = filteredData.slice(startIdx, endIdx);



  // 상세결과 화면으로 이동 핸들러

  const handleToDetailPage = async (reqNo) => {

    //분석결과 있는지 확인

    const isAnalysed = await fetch(

      `http://localhost:3002/api/anlsRslt/isAnalyzed`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: reqNo,

      }

    );

    const result = await isAnalysed.json();

    if (result) {

      navigate(`/requirements/AnlsRsltsDetail/${reqNo}`);

    } else if (!result) {

      alert("AI 분석을 수행해 주십시오.");

    }

  };

  if (memberInfo.loading)

    return <div className="loading_memberInfo_smj">loading MemberInfo</div>;



  if (!memberInfo.email) {

    alert("로그인 이후 이용해 주세요");

    navigate(`/lgn/lgn`);

  }



  return (

    <div className="course-list_jsh">

      <h1>요청사항 목록</h1>



      {loading && <p>데이터 불러오는 중...</p>}

      {error && <p style={{ color: "red" }}>오류 발생: {error}</p>}

      {/* ✅ 검색 입력 필드 추가 */}

      <div className="search-container_jsh">

        <input

          type="text"

          placeholder="제목, 회원ID, 상태 검색..."

          value={searchQuery}

          onChange={handleSearchChange}

          className="search-input_jsh"

        />

      </div>

      {/* 페이지당 표시할 요청 개수 선택 */}

      <div className="showCnt_jsh">

        <label htmlFor="itemsPerPage_jsh">페이지당 표시할 요청 수: </label>

        <select

          id="itemsPerPage_jsh"

          className="itemsPerPage_jsh"

          onChange={handleSelectedOption}

          value={itemsPerPage}

        >

          <option value={2}>2</option>

          <option value={5}>5</option>

          <option value={10}>10</option>

          <option value={15}>15</option>

          <option value={20}>20</option>

          <option value={50}>50</option>

        </select>

      </div>



      <table className="table_jsh">

        <thead>

          <tr>

            <th className="no-column_jsh">No</th>

            <th>글제목</th>

            <th>회원ID</th>

            <th>등록 날짜</th>

            <th>상태</th>

            <th>설정</th>

          </tr>

        </thead>

        <tbody>

          {pagedData.length > 0 ? (

            pagedData.map((item) => (

              <tr key={item.reqNo}>

                <td>{item.reqNo}</td>

                <td>

                  {memberInfo.email ? (

                    <Link

                      to={`/requirements/RequirementView/${item.reqNo}`}

                      className="title-link_jsh"

                    >

                      {item.title}

                    </Link>

                  ) : (

                    <span>{item.title}</span>

                  )}

                </td>



                <td>{item.memId}</td>

                <td>

                  {new Date(item.regDt)

                    .toLocaleDateString("ko-KR")

                    .replace(/\.$/, "")}

                </td>

                <td>{item.status}</td>

                <td className="setting-links_jsh">

                  {memberInfo.grade === 3 && (

                    <>

                      <button

                        onClick={() => handleDelete(item.reqNo)}

                        className="setting-btn_delete"

                      >

                        삭제

                      </button>

                      <button

                        onClick={() =>

                          navigate(

                            `/requirements/RequirementUpdate/${item.reqNo}`

                          )

                        }

                        className="setting-btn_modify"

                      >

                        수정

                      </button>

                      <button

                        onClick={() => {

                          alert(`AI 분석 요청이 접수되었습니다`);

                          console.log(`AI 분석 요청: ${item.reqNo}`);

                          handelAiRequest(item.reqNo);

                        }}

                        className="setting-btn_analysis"

                      >

                        AI분석

                      </button>

                      {emailSending[item.reqNo] ? (

                        <button

                          id="setting-btn_email_sending"

                          className="setting-btn_email"

                          disabled

                        >

                          전송 중...

                        </button>

                      ) : (

                        <button

                          onClick={() => {

                            handleEmailButtonClick(item.reqNo);

                          }}

                          className="setting-btn_email"

                        >

                          이메일 전송

                        </button>

                      )}

                    </>

                  )}

                  <button

                    onClick={() => {

                      handleToDetailPage(item.reqNo);

                    }}

                    className="setting-btn_result"

                  >

                    결과 확인

                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="6" style={{ textAlign: "center" }}>

                등록된 요청이 없습니다.

              </td>

            </tr>

          )}

        </tbody>

      </table>



      <div className="pagination_jsh">

        <button

          onClick={() => handlePageChange(currentPage - 1)}

          disabled={currentPage === 1}

        >

          이전

        </button>

        {Array.from({ length: totalPages }, (_, idx) => (

          <button

            key={idx + 1}

            onClick={() => handlePageChange(idx + 1)}

            className={currentPage === idx + 1 ? "active" : ""}

          >

            {idx + 1}

          </button>

        ))}

        <button

          onClick={() => handlePageChange(currentPage + 1)}

          disabled={currentPage === totalPages}

        >

          다음

        </button>

      </div>



      <div className="submit-section_jsh">

        
        {memberInfo.email != "" && (

          <Link to="/requirements/RequirementCreate" className="create-btn_jsh">

            요청 생성

          </Link>

        )}

      </div>

    </div>

  );

};



export default RequirementList;