import { MemberInfoContext } from "../components/MemberInfoContext"; // 쿠키 정보가 들어있는 MemberInfoContext 임포트
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";

const RequirementCreate = () => {
  const memberInfo = useContext(MemberInfoContext); //쿠키 정보를 js객체 형태로 변수에 담기 { email:"문자열 값", grade: 숫자 값 } )
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate()

  // 요청 사항 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    videoUrl: "",
    memId: memberInfo.email || "",
    fileTitle: "",
    file: null, // 파일 추가
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ 파일 선택 핸들러
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  // 등록 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "requirement",
        new Blob([JSON.stringify(formData)], { type: "application/json" })
      );

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const response = await fetch(
        `${LocalHostInfoContext.aianalysis}/api/createRequirement`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error(`등록 실패: ${response.status}`);
      }

      alert("새로운 요청이 등록되었습니다.");
      navigate(`/requirements/RequirementList`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-form_jsh">
      <h2>새 요청 등록</h2>
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>오류 발생: {error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          제목:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          내용:
          <input
            type="text"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </label>

        <input type="hidden" name="memId" value={memberInfo.email} required />

        <label>
          파일 업로드:
          <input type="file" name="file" onChange={handleFileChange} />
        </label>

        <button type="submit" className="submit-btn_jsh">
          등록 완료
        </button>
        <button
          type="button"
          className="cancel-btn_jsh"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default RequirementCreate;