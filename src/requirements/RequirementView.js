import { MemberInfoContext } from "../components/MemberInfoContext"; // 쿠키 정보가 들어있는 MemberInfoContext 임포트
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";

const RequirementView = () => {
  const memberInfo = useContext(MemberInfoContext); //쿠키 정보를 js객체 형태로 변수에 담기 { email:"문자열 값", grade: 숫자 값 } )
  const { reqNo } = useParams();
  const navigate = useNavigate();

  const [requestData, setRequestData] = useState({
    title: "",
    content: "",
    memId: "",
    status: "",
    fileTitle: "",
    fileName: "",
    regDt: "",
  });

  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${LocalHostInfoContext.aianalysis}/api/getRequirementDetail?reqNo=${reqNo}`
        );

        if (!response.ok) {
          throw new Error(`데이터 불러오기 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log("받은 데이터:", data);

        const requestData = Array.isArray(data) ? data[0] : data;
        setRequestData(requestData);

        // 이미지 URL 갱신 (캐시 방지를 위해 timestamp 추가)
        if (requestData.fileTitle) {
          setImageUrl(
            `${LocalHostInfoContext.aianalysis}/uploads/${
              requestData.fileTitle
            }?timestamp=${new Date().getTime()}`
          );
        }
      } catch (err) {
        console.error("데이터 불러오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [reqNo]);

  useEffect(() => {
    if (requestData.fileTitle) {
      setImageUrl(
        `${LocalHostInfoContext.aianalysis}/uploads/${
          requestData.fileTitle
        }?timestamp=${new Date().getTime()}`
      );
    }
  }, [requestData.fileTitle]); // fileTitle이 변경될 때마다 이미지 갱신

  if (loading) return <p className="loading-text">로딩 중...</p>;
  if (error) return <p className="error-text">오류 발생: {error}</p>;
  if (!requestData || Object.keys(requestData).length === 0)
    return <p className="no-data-text">데이터를 찾을 수 없습니다.</p>;

  return (
    <div className="requirement-view-container">
      <h2 className="requirement-title">요청사항 상세 보기</h2>

      <table className="table_jsh">
        <tbody>
          <tr>
            <th>제목</th>
            <td>{requestData.title}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>{requestData.content}</td>
          </tr>
          <tr>
            <th>회원 ID</th>
            <td>{requestData.memId}</td>
          </tr>
          <tr>
            <th>상태</th>
            <td>{requestData.status}</td>
          </tr>
          <tr>
            <th>등록 날짜</th>
            <td>{requestData.regDt}</td>
          </tr>
          <tr>
            <th>첨부 파일</th>
            <td>
              {requestData.fileTitle ? (
                <>
                  {/* ✅ 다운로드 링크 */}
                  <a
                    href={`${LocalHostInfoContext.aianalysis}/api/uploads/${requestData.fileTitle}`}
                    download
                    className="file-link"
                    target="_blank"
                  >
                    {requestData.fileTitle}
                  </a>
                  <br />

                  {/* ✅ 캐싱 방지를 위한 timestamp 추가 */}
                  <img
                    src={`${LocalHostInfoContext.aianalysis}/api/uploads/${
                      requestData.fileTitle
                    }?timestamp=${new Date().getTime()}`}
                    alt="첨부 이미지"
                    className="file-preview"
                  />
                </>
              ) : (
                "첨부 파일 없음"
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
        <button
          onClick={() => navigate(`/requirements/RequirementList`)}
          className="button_jsh"
        >
          목록
        </button>
        {memberInfo.grade === 3 && (
          <button
            onClick={() => navigate(`/requirements/RequirementUpdate/${reqNo}`)}
            className="submit-btn_jsh"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
};

export default RequirementView;
