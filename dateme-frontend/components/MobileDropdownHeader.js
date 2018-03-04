import classNames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Text from "./Text";
import { Portal } from "react-portal";
import { Link } from "../routes";
import ProfileMenu from "./ProfileMenu";

class MobileDropdownHeader extends React.Component {
  render() {
    const { isOpen, setOpen, isProbablyLoggedIn } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <div onClick={() => this.props.setOpen(false)} className="MenuContainer">
        <ul
          className={classNames("menu", {
            "menu--expanded": isOpen,
            "menu--closed": !isOpen
          })}
        >
          {isProbablyLoggedIn && (
            <li>
              <Link route="/notifications">
                <a>
                  <ProfileMenu isMobile />
                  <Text type="footerlink">Notifications</Text>
                </a>
              </Link>
            </li>
          )}
          {isProbablyLoggedIn && (
            <li>
              <Link route="/page/edit">
                <a>
                  <Text type="footerlink">Edit page</Text>
                </a>
              </Link>
            </li>
          )}
          {isProbablyLoggedIn && (
            <li>
              <Link route="/applications">
                <a>
                  <Text type="footerlink">Review applications</Text>
                </a>
              </Link>
            </li>
          )}
          {!isProbablyLoggedIn && (
            <li>
              <Link route="/login">
                <a>
                  <Text type="footerlink">Login</Text>
                </a>
              </Link>
            </li>
          )}
          {!isProbablyLoggedIn && (
            <li>
              <Link route="/sign-up/verify">
                <a>
                  <Text type="footerlink">Sign up</Text>
                </a>
              </Link>
            </li>
          )}
        </ul>

        <style jsx>{`
          .MenuContainer {
            background-color: #f9f9f9;
          }

          ul {
            margin: 0;
            padding: 0;
            list-style: none;
            overflow: hidden;
            background-color: #fff;
          }

          li a {
            display: flex;
            align-items: center;
            height: 58px;
            padding: 0 20px;
            border-right: 1px solid #f4f4f4;
            text-decoration: none;
          }

          li a:hover {
            background-color: #f4f4f4;
          }

          .menu {
            background-color: #f9f9f9;
          }
        `}</style>
      </div>
    );
  }
}

export default MobileDropdownHeader;
