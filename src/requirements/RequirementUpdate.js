import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocalHostInfoContext } from "../components/LocalHostInfoContext";

const RequirementUpdate = () => {
  const { reqNo } = useParams();
  const navigate = useNavigate();

  // 요청 사항 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    memId: "",
    fileTitle: "",
    file: null,
    existingFile: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${LocalHostInfoContext.aianalysis}/api/getUpdateForm?reqNo=${reqNo}`
        );
        if (!response.ok) {
          throw new Error(`데이터 불러오기 실패: ${response.status}`);
        }
        const data = await response.json();

        setFormData({
          reqNo: reqNo || "",
          title: data[0].title || "",
          content: data[0].content || "",
          memId: data[0].memId || "",
          fileTitle: data[0].fileTitle || "",
          file: null,
          existingFile: data[0].fileTitle || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reqNo]);

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
      file: e.target.files[0], // 선택한 파일 저장
    }));
  };

  // ✅ 수정 요청 함수 (FormData 방식 적용)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("reqNo", formData.reqNo || reqNo);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("memId", formData.memId);
      formDataToSend.append("status", formData.status);

      // ✅ 파일 제목 유지 (업로드하지 않으면 기존 파일 유지)
      if (formData.file) {
        formDataToSend.append("file", formData.file); // 새로운 파일 업로드
      }
      formDataToSend.append(
        "fileTitle",
        formData.file ? formData.file.name : formData.existingFile
      );

      const response = await fetch(
        `${LocalHostInfoContext.aianalysis}/api/updateRequirement`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error(`수정 실패: ${response.status}`);
      }

      alert("수정이 완료되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("에러 발생:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-form_jsh">
      <h2>요청사항 수정</h2>
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

        <label>
          회원 ID:
          <input type="text" name="memId" value={formData.memId} disabled />
        </label>

        <label>
          파일 제목:
          <input
            type="text"
            name="fileTitle"
            value={formData.fileTitle}
            onChange={handleChange}
            readOnly
          />
        </label>

        {/* ✅ 기존 파일 표시 */}
        {formData.existingFile && (
          <div>
            <p>
              현재 업로드된 파일:
              <a
                href={`${LocalHostInfoContext.aianalysis}/api/uploads/${formData.existingFile}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formData.existingFile}
              </a>
            </p>
          </div>
        )}

        <label>
          파일 업로드:
          <input type="file" name="file" onChange={handleFileChange} />
        </label>

        <button type="submit" className="submit-btn_jsh">
          수정 완료
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

export default RequirementUpdate;
