import classNames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Text from "./Text";
import { Portal } from "react-portal";
import Link from "next/link";

export default class MobileDropdownHeader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }
  render() {
    const { isOpen, setOpen } = this.props;

    return (
      <div className="MenuContainer">
        <ul
          className={classNames("menu", {
            "menu--expanded": isOpen,
            "menu--closed": !isOpen
          })}
        >
          <li>
            <Link href="/contact-us">
              <a>
                <Text type="footerlink">Contact us</Text>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/contact-us">
              <a>
                <Text type="footerlink">Contact us</Text>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/contact-us">
              <a>
                <Text type="footerlink">Contact us</Text>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/contact-us">
              <a>
                <Text type="footerlink">Contact us</Text>
              </a>
            </Link>
          </li>
        </ul>

        <style jsx>{`
          .MenuContainer {
            background-color: #f9f9f9;
          }

          .menu--closed {
            max-height: 0;
            transition: background 0.2s ease-out;
          }

          ul {
            margin: 0;
            padding: 0;
            list-style: none;
            overflow: hidden;
            background-color: #fff;
          }

          li a {
            display: block;
            padding: 20px 20px;
            border-right: 1px solid #f4f4f4;
            text-decoration: none;
          }

          li a:hover {
            background-color: #f4f4f4;
          }

          li:hover {
            background-color: red;
          }

          .menu {
            transition: max-height 0.2s ease-out;
            background-color: #f9f9f9;
          }

          @media (min-width: 48em) {
            li {
              float: left;
            }
            li a {
              padding: 20px 30px;
            }
            .menu {
              clear: none;
              float: right;
              max-height: none;
            }
          }
        `}</style>
      </div>
    );
  }
}
