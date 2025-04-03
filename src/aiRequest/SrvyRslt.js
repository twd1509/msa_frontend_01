import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom"; // ✅ 리디렉트 기능 추가
import { MemberInfoContext } from "../components/MemberInfoContext"; // ✅ 로그인 정보 가져오기
import "../aiRequest/css/reqStyle.css";

const SrvyRslt = () => {
  const navigate = useNavigate();
  const memberInfo = useContext(MemberInfoContext); // ✅ 로그인한 사용자 정보 가져오기
  const location = useLocation();

  // URL에서 groupNo 가져오기 (이메일은 로그인 정보에서 가져옴)
  const params = new URLSearchParams(location.search);
  const groupNo = params.get("groupNo") || "";
  const email = params.get("email") || "";
  const [surveyResults, setSurveyResults] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost:9193/api/SrvyRslt?groupNo=${groupNo}&memId=${email}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("📊 개인 만족도 조사 응답 API 응답 데이터:", data);

        if (data.length > 0) {
          setSurveyResults(data);
        } else {
          console.warn("⚠️ 만족도 조사 데이터가 없습니다.");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching survey results:", error);
      });
  }, [groupNo, memberInfo, navigate]); // ✅ 의존성 배열 업데이트

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
    <div className="aiR-container">
      <h1>📊 개인 만족도 조사 결과</h1>
      {surveyResults.length === 0 ? (
        <p>⚠️ 만족도 조사 데이터가 없습니다.</p>
      ) : (
        <form>
          {surveyResults.map((result, index) => (
            <div className="question" key={index}>
              <label>{result.srvyCn}</label>

              {/* 객관식 응답 표시 */}
              {result.chcRslt && (
                <div className="satisfaction-options">
                  <div>
                    <input
                      type="radio"
                      id={`satisfaction-${index}`}
                      name={`satisfaction-${index}`}
                      value={result.chcRslt || ""}
                      disabled
                      checked
                    />
                    <label htmlFor={`satisfaction-${index}`}>
                      {result.chcRslt}
                    </label>
                  </div>
                </div>
              )}

              {/* 단답형 응답 표시 */}
              {result.textRslt && (
                <div className="text-responses">
                  <h4>단답형 응답:</h4>
                  <p>📝 {result.textRslt}</p>
                </div>
              )}
            </div>
          ))}
          <div className="submit-section">
            <button type="button" onClick={() => window.history.back()}>
              뒤로가기
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SrvyRslt;
