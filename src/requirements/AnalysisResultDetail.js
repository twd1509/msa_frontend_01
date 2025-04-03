import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MemberInfoContext } from "../components/MemberInfoContext";
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";
import "../css/AnlsRsltsDetail.css"; // 스타일 시트 임포트

const AnlsRsltsDetail = () => {
  const navigate = useNavigate();
  const { reqNo } = useParams();
  const [anlsRslts, setAnlsRslts] = useState({});
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  const [error, setError] = useState(null);

  //쿠키 정보를 js객체 형태로 변수에 담기 { email:"문자열 값", grade: 숫자 값 } )
  const memberInfo = useContext(MemberInfoContext);

  // 분석 데이터 상세정보 가져오기
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${LocalHostInfoContext.aianalysis}/api/anlsRslt/detail/read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: reqNo,
        }
      );
      if (!response.ok) {
        throw new Error(`네트워크 오류: ${response.status}`);
      }
      const data = await response.json();
      setAnlsRslts(data);
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [reqNo]);

  // 분석결과 리스트에 출력할 정보만 묶기
  const AnalysisResults = Object.keys(anlsRslts)
    .filter((key) => key == "anlsRslt")
    .map((key) => anlsRslts[key])
    .map((result) => result.split("|"));

  //목록으로 돌아가기
  const handleBackButtonClick = (event) => {
    event.preventDefault();
    console.log("목록으로 돌아가기 클릭");
    navigate("/requirements/RequirementList");
  };

  // 이메일로 분석결과 전송
  const handleEmailButtonClick = async () => {
    setEmailSending(true);
    try {
      const response = await fetch(`${LocalHostInfoContext.aianalysis}/api/email/send`, {
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
        alert("분석 결과가 없습니다.");
      } else if (result == 2) {
        console.log("이메일 전송 성공:", result);
        alert("이메일 전송 완료");
        fetchRequests();
      } else if (result == 1) {
        alert("이메일 전송에 실패했습니다.");
      } else if (result == 0) {
        alert("이메일 전송 이력이 있습니다.\n재전송은 불가합니다.");
      }
    } catch (error) {
      console.log("이메일 전송 오류: ", error);
      alert(`이메일 전송 오류: ${error.message}`);
    } finally {
      setEmailSending(false);
    }
  };

  // 만족도 조사 화면으로 이동
  const handleGetSrvy = async () => {
    navigate(`/aiRequest/UserGetSrvy/${memberInfo.email}/1`);
  };

  if (loading) return <div className="loading_smj">Loading...</div>;
  if (error) return <div className="error_smj">Error: {error}</div>;
  if (Object.keys(anlsRslts).length === 0)
    return <div className="no-data_smj">No data found.</div>;
  if (memberInfo.loading)
    return <div className="loading_memberInfo_smj">loading MemberInfo</div>;
  // 로그인 여부 확인
  if (!memberInfo.email) {
    alert("로그인 이후 이용해 주세요");
    navigate(`/lgn/lgn`);
  }
  return (
    <div className="container_smj">
      <h2 className="title_smj">분석 결과 상세 페이지</h2>
      <div className="details_smj">
        <p>
          <strong>요청 번호: </strong>
          <span id="rqst_no">{anlsRslts.reqNo}</span>
        </p>
        <p>
          <strong>사용자 이메일: </strong>
          <span id="email">{anlsRslts.email}</span>
        </p>
        <p>
          <strong>분석 완료 날짜: </strong>
          <span id="anls_rslt_ymd">{anlsRslts.anlsRsltYmd}</span>
        </p>
        {memberInfo.grade == 3 && (
          <>
            <p>
              <strong>메일 전송 여부: </strong>
              <span id="eml_trsm_yn">
                {anlsRslts.emlTrsmYn ? "예" : "아니오"}
              </span>
            </p>
            <p>
              <strong>메일 전송 시간: </strong>
              <span id="eml_trsm_ymd">{anlsRslts.emlTrsmYmd ?? "없음"}</span>
            </p>
          </>
        )}
      </div>
      <h3 className="results-title_smj">분석 결과</h3>
      <table className="results-table_smj">
        <thead>
          <tr>
            <th>항목</th>
            <th>신뢰도(%)</th>
          </tr>
        </thead>
        <tbody>
          {AnalysisResults.map((results) => {
            return results.map((result) => {
              const [label, confidence] = result.split(": ");
              return (
                <tr key={result}>
                  <td>{label}</td>
                  <td>{confidence}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
      <div className="buttons_smj">
        <button
          id="backButton"
          className="button_smj"
          onClick={handleBackButtonClick}
        >
          목록으로 돌아가기
        </button>
        {memberInfo.grade == 1 && (
          <button
            id="surveyButton"
            className="button_smj"
            onClick={handleGetSrvy}
          >
            만족도 조사
          </button>
        )}
        {emailSending == false && memberInfo.grade == 3 && (
          <button
            id="emailButton"
            className="button_smj"
            onClick={handleEmailButtonClick}
          >
            이메일로 결과 전송
          </button>
        )}
        {emailSending == true && memberInfo.grade == 3 && (
          <button id="emailButton_sending" className="button_smj" disabled>
            전송 중...
          </button>
        )}
      </div>
    </div>
  );
};

export default AnlsRsltsDetail;
