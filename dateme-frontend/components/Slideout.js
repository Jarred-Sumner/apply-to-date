import { slide as Menu } from "react-burger-menu";
import BurgerMenu from "react-burger-menu";
import classNames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Portal } from "react-portal";
import Text from "./Text";
import {Link} from "../routes";
import ReactSlideout from "slideout";

export default class Slideout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: "reveal",
      side: "right"
    };
  }

  componentDidMount() {
    this.slideout = new ReactSlideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
  }

  render() {
    const { checked, onChange, children, ...otherProps } = this.props;

    return (
      <div className="HamburgerContainer">
        <Portal>
          <Menu outerContainerId="PageRoot" right>
            <Link route="/login">
              <a className="hamburgerlink">
                <Text type="hamburgerlink">Login</Text>
              </a>
            </Link>

            <Link route="/sign-up">
              <a className="hamburgerlink">
                <Text type="hamburgerlink">Sign Up</Text>
              </a>
            </Link>

            <Link route="/contact-us">
              <a className="hamburgerlink">
                <Text type="hamburgerlink">Contact</Text>
              </a>
            </Link>
          </Menu>
        </Portal>

        <style jsx global>{`
          @media (min-width: 460px) {
            .bm-burger-button {
              display: none;
            }
          }
          .slideout-menu {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 0;
            width: 256px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            display: none;
            background-color: white;
          }

          .slideout-panel {
            height: 100vh;
            background-color: #00bcd4;
            position: relative;
            z-index: 1;
          }

          .slideout-open,
          .slideout-open body,
          .slideout-open .slideout-panel {
            overflow: hidden;
          }

          .slideout-open .slideout-menu {
            display: block;
          }
        `}</style>
      </div>
    );
  }
}
