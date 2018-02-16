import { slide as Menu } from "react-burger-menu";
import BurgerMenu from "react-burger-menu";
import classNames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Portal } from "react-portal";
import Text from "./Text";
import Link from "next/link";

class MenuWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const sideChanged =
      this.props.children.props.right !== nextProps.children.props.right;

    if (sideChanged) {
      this.setState({ hidden: true });

      setTimeout(() => {
        this.show();
      }, this.props.wait);
    }
  }

  show() {
    this.setState({ hidden: false });
  }

  render() {
    let style;

    if (this.state.hidden) {
      style = { display: "none" };
    }

    return (
      <div style={style} className={this.props.side}>
        {this.props.children}
      </div>
    );
  }
}

export default class Hamburger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: "reveal",
      side: "right"
    };
  }

  render() {
    const { checked, onChange, children, ...otherProps } = this.props;

    return (
      <div className="HamburgerContainer">
        <Portal>
          <Menu outerContainerId="PageRoot" right>
            <Link href="/login">
              <a className="hamburgerlink">
                <Text type="hamburgerlink">Login</Text>
              </a>
            </Link>

            <Link href="/sign-up">
              <a className="hamburgerlink">
                <Text type="hamburgerlink">Sign Up</Text>
              </a>
            </Link>

            <Link href="/contact-us">
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
          .hamburgerlink {
            display: block;
            margin-bottom: 20px;
          }
          Link {
            display: block;
          }

          .HamburgerContainer {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 12px;
            align-items: center;
          }

          /* Position and sizing of burger button */
          .bm-burger-button {
            position: fixed;
            width: 30px;
            height: 24px;
            right: 20px;
            top: 20px;
          }

          /* Color/shape of burger icon bars */
          .bm-burger-bars {
            background: #373a47;
          }

          /* Position and sizing of clickable cross button */
          .bm-cross-button {
            height: 24px;
            width: 24px;
            right: 15px;
            top: 15px;
          }

          /* Color/shape of close button cross */
          .bm-cross {
            background: #3a405b;
          }

          /* General sidebar styles */
          .bm-menu {
            background: #ffffff;
            padding: 2.5em 1.5em 0;
            font-size: 1.15em;
            box-shadow: 6px 7px 21px 0 rgba(221, 231, 243, 0.83);
          }

          /* Morph shape necessary with bubble or elastic */
          .bm-morph-shape {
            fill: #373a47;
          }

          /* Wrapper for item list */
          .bm-item-list {
            color: #b8b7ad;
            padding: 0.8em;
          }

          /* Styling of overlay */
          .bm-overlay {
            background: rgba(0, 0, 0, 0.3);
          }

          .bm-menu-wrap {
            top: 0;
            height: 100vh;
          }
        `}</style>
      </div>
    );
  }
}
