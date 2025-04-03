import React, { useEffect, useState, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";
import { MemberInfoContext } from "./MemberInfoContext";
import { LocalHostInfoContext } from "./LocalHostInfoContext";

const Header = () => {
  const memberInfo = useContext(MemberInfoContext);

  const [menus, setMenu] = useState([]);
  let i = 1;

  useEffect(() => {
    fetch(`${LocalHostInfoContext.common}/api/menu/header`, {
      method: "GET",
      credentials: "include", // 쿠키를 포함하도록 설정
    })
      .then((res) => res.json())
      .then((res) => {
        setMenu(res);
      });
  }, []);

  const logout = () => {
    fetch(`${LocalHostInfoContext.common}/api/mbr/logout`, {
      method: "POST",
      credentials: "include", // 쿠키를 포함하도록 설정
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }).then((res) => {
      console.log(res);
      document.cookie = "JSESSIONID=; Path=/; Max-Age=0";
      window.location.href = "/";
    });
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 1.00)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0",
      }}
    >
      <div className="header-container">
        <div className="icon-container">
          <Link to="/">
            <div className="icon">
              <img
                src="/img/logo.png"
                style={{ width: "90px", height: "90px", padding: "5" }}
                alt="icon"
              />
            </div>
          </Link>
        </div>
        <div
          style={{
            flexDirection: "row",
            columnGap: "8px",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            flex: "1 1 0%",
            padding: "0",
          }}
        >
          {memberInfo.grade > 2 && (
            <Fragment>
              <div className="menu-button">
                <div className="text">
                  <a href="/menu/MenuIndex">메뉴관리</a>
                </div>
              </div>

              <div className="menu-button">
                <div className="text">
                  <a href="/mbr/MbrIndex">회원관리</a>
                </div>
              </div>
            </Fragment>
          )}

          {menus.map((item) => (
            <div className="menu-button">
              <div className="text" key={item.no}>
                <a href={`${item.menuLnkg}`}>{item.menuNm}</a>
              </div>
            </div>
          ))}
        </div>

        {memberInfo.email ? (
          <div className="button-container">
            <div className="button-register">
              <div className="text text-register">
                <Link to={`/mbr/MbrJoin/${memberInfo.email}`}>마이페이지</Link>
              </div>
            </div>
            <div className="button-signin">
              <div className="text">
                <a href="#" onClick={logout}>
                  로그아웃
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="button-container">
            <div className="button-signin">
              <div className="text">
                <Link to="./lgn/lgn">로그인</Link>
              </div>
            </div>
            <div className="button-register">
              <div className="text text-register">
                <Link to="/mbr/MbrJoin">회원가입</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
