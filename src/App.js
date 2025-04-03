import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import "./css/requirement.css";
// 공통 및 로그인 , 로그아웃 부분
import Index from "./components/Index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Lgn from "./lgn/Lgn";
import NtcIndex from "./ntc/NtcIndex";
import NtcDtl from "./ntc/NtcDtl";
import NtcReg from "./ntc/NtcReg";
import MenuIndex from "./menu/MenuIndex";
import MenuReg from "./menu/MenuReg";
import MbrIndex from "./mbr/MbrIndex";
import MbrJoin from "./mbr/MbrJoin";
import MbrDtl from "./mbr/MbrDtl";
import { MemberInfoContext } from "./components/MemberInfoContext";
import CodeReg from "./commonCode/CodeReg";
import MstCodeIndex from "./commonCode/MstCodeIndex";
import DtlCodeIndex from "./commonCode/DtlCodeIndex";
// 분석 부분
import AnlsRsltsDetail from "./requirements/AnalysisResultDetail";
import RequirementList from "./requirements/RequirementList";
import RequirementUpdate from "./requirements/RequirementUpdate";
import RequirementCreate from "./requirements/RequirementCreate";
import RequirementView from "./requirements/RequirementView";
// 설문조사 부분
import SrvyReg from "./aiRequest/SrvyReg";
import SrvyRslt from "./aiRequest/SrvyRslt";
import SrvyUpdate from "./aiRequest/SrvyUpdate";
import SrvyList from "./aiRequest/SrvyList";
import SrvyResponse from "./aiRequest/SrvyResponse";
import UserGetSrvy from "./aiRequest/UserGetSrvy";
import GetSurveyData from "./aiRequest/GetSurveyData";
import SrvyData from "./aiRequest/SrvyData";

function App() {
  const [memberInfo, setMemberinfo] = useState({
    email: "",
    grade: "",
    loading: true
  });

  useEffect(() => {
    fetch("http://localhost:9191/api/mbr/cookiechk", {
      method: "GET",
      credentials: "include", // 쿠키를 포함하도록 설정
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.email) {
          setMemberinfo((prevState) => ({
            ...prevState,
            email: res.email,
            grade: res.grade,
            loading: false
          }));
        } else {
          setMemberinfo((prevState) => ({
            ...prevState,
            loading: false
          }));

          fetch("http://localhost:9191/api/mbr/logout", {
            method: "POST",
            credentials: "include", // 쿠키를 포함하도록 설정
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          });
        }
      });
  }, []);

  return (
    <div className="App">
      <MemberInfoContext.Provider value={memberInfo}>
        <BrowserRouter>
          <Header element={<Header />} exact />
          <header className="App-header">
            <Routes>
              {/* 로그인 및 공통 부분 */}
              <Route path="/" element={<Index />} exact></Route>
              <Route path="/lgn/Lgn" element={<Lgn />} exact></Route>
              <Route path="/ntc/NtcIndex" element={<NtcIndex />} exact></Route>
              <Route path="/ntc/NtcDtl" element={<NtcDtl />} exact></Route>
              <Route path="/ntc/NtcReg" element={<NtcReg />} exact></Route>
              <Route
                path="/menu/MenuIndex"
                element={<MenuIndex />}
                exact
              ></Route>
              <Route path="/menu/MenuReg" element={<MenuReg />} exact></Route>
              <Route path="/mbr/MbrIndex" element={<MbrIndex />} exact></Route>
              <Route path="/mbr/MbrJoin" element={<MbrJoin />} exact></Route>
              <Route
                path="/mbr/MbrJoin/:Mbremail"
                element={<MbrJoin />}
                exact
              ></Route>
              <Route
                path="/mbr/MbrDtl/:Mbremail"
                element={<MbrDtl />}
                exact
              ></Route>
              <Route
                path="/commonCode/CodeReg"
                element={<CodeReg />}
                exact
              ></Route>
              <Route
                path="/commonCode/MstCodeIndex"
                element={<MstCodeIndex />}
                exact
              ></Route>
              <Route
                path="/commonCode/DtlCodeIndex"
                element={<DtlCodeIndex />}
                exact
              ></Route>
              {/* 분석 리스트, CRUD 부분 */}
              <Route
                path="/requirements/RequirementList"
                element={<RequirementList />}
              />
              <Route
                path="/requirements/RequirementUpdate/:reqNo"
                element={<RequirementUpdate />}
              />
              <Route
                path="/requirements/RequirementCreate"
                element={<RequirementCreate />}
              />
              <Route
                path="/requirements/RequirementView/:reqNo"
                element={<RequirementView />}
              />
              <Route
                path="/requirements/AnlsRsltsDetail/:reqNo"
                element={<AnlsRsltsDetail />}
              />
              {/* 만족도 조사 부분 */}
              <Route
                path="/aiRequest/SrvyReg"
                element={<SrvyReg />}
                exact
              ></Route>
              <Route
                path="/aiRequest/SrvyRslt"
                element={<SrvyRslt />}
                exact
              ></Route>
              <Route
                path="/aiRequest/SrvyUpdate/:email/:groupNo"
                element={<SrvyUpdate />}
                exact
              ></Route>
              <Route
                path="/aiRequest/GetSurveyData/:email/:groupNo"
                element={<GetSurveyData />}
                exact
              ></Route>
              <Route
                path="/aiRequest/SrvyList"
                element={<SrvyList />}
                exact
              ></Route>
              {/* 조사 응답 제출 페이지 */}
              <Route
                path="/aiRequest/SrvyResponse/:email"
                element={<SrvyResponse />}
                exact
              ></Route>
              {/* 조사 페이지 (설문지를 불러와서 보여주는 페이지) */}
              <Route
                path="/aiRequest/UserGetSrvy/:email/:groupNo"
                element={<UserGetSrvy />}
                exact
              ></Route>
              <Route
                path="/aiRequest/SrvyData"
                element={<SrvyData />}
                exact
              ></Route>
            </Routes>
          </header>
          <Footer />
        </BrowserRouter>
      </MemberInfoContext.Provider>
    </div>
  );
}
export default App;
