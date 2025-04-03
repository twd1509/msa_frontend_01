import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="icon-section">
        <div className="icon-wrapper">
          <div className="icon">
            <img src="" alt="Icon 1" />
          </div>
          <div className="icon">
            <img src="" alt="Icon 2" />
          </div>
          <div className="icon">
            <img src="" alt="Icon 3" />
          </div>
          <div className="icon">
            <img src="" alt="Icon 4" />
          </div>
          <div className="icon">
            <img src="" alt="Icon 5" />
          </div>
        </div>
      </div>
      <div className="text-section">
        <div className="use-cases">
          <div className="use-cases-title">Use cases</div>
        </div>
        <div className="ui-design">UI design</div>
        <div className="ui-design">UX design</div>
        <div className="ui-design">Wireframing</div>
        <div className="ui-design">Diagramming</div>
        <div className="ui-design">Brainstorming</div>
        <div className="ui-design">Online whiteboard</div>
        <div className="ui-design">Team collaboration</div>
      </div>
      <div className="text-section">
        <div className="use-cases">
          <div className="use-cases-title">Explore</div>
        </div>
        <div className="ui-design">Design</div>
        <div className="ui-design">Prototyping</div>
        <div className="ui-design">Development features</div>
        <div className="ui-design">Design systems</div>
        <div className="ui-design">Collaboration features</div>
        <div className="ui-design">Design process</div>
        <div className="ui-design">FigJam</div>
      </div>
      <div className="text-section">
        <div className="use-cases">
          <div className="use-cases-title">Resources</div>
        </div>
        <div className="ui-design">Blog</div>
        <div className="ui-design">Best practices</div>
        <div className="ui-design">Colors</div>
        <div className="ui-design">Color wheel</div>
        <div className="ui-design">Support</div>
        <div className="ui-design">Developers</div>
        <div className="ui-design">Resource library</div>
      </div>
    </div>
  );
};

export default Footer;
