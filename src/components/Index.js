import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../css/index.css";
import { LocalHostInfoContext } from "./LocalHostInfoContext";

const Home = () => {
  const [lctrRprsAdmin, setLctrRprsAdmin] = useState([]);
  const [lctrRprsGeneral, setLctrRprsGeneral] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ntcs, setNtc] = useState([]);
  let i = 1;

  useEffect(() => {
    fetch(`${LocalHostInfoContext.common}/api/ntc/main`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setNtc(res);
      });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div className="container2">
        <div className="title-container2">
          <div className="title-main2">AI 영상분석</div>
          <div className="subtitle-main">Subtitle</div>
        </div>
      </div>

      <div className="container3">
        <div className="title-container">
          <div className="title">공지사항</div>
        </div>
        <table className="board">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>등록일</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {ntcs.length > 0 ? (
              ntcs.map((item) => (
                <tr key={item.no}>
                  <td>{item.ntcYn == "Y" ? "공지" : i++}</td>
                  <td>
                    <Link to={`/ntc/NtcDtl?no=${item.no}`}>{item.title}</Link>
                  </td>
                  <td>{item.regDt}</td>
                  <td>{item.mbrVo.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="no-data"
                  style={{ textAlign: "center" }}
                >
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
