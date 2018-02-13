import classNames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Text from "./Text";
import Link from "next/link";

export default class BurgerIcon extends React.PureComponent {
  render() {
    const { isOpen, setOpen } = this.props;

    return (
      <div
        className="HamburgerContainer"
        onClick={() => setOpen(!this.props.isOpen)}
      >
        <div className={isOpen ? "nav-icon open" : "nav-icon"}>
          <span />
          <span />
          <span />
        </div>

        <style jsx>{`
          @media (min-width: 460px) {
            .nav-icon {
              display: none;
            }
          }
          .nav-icon {
            width: 33px;
            height: 23px;
            position: relative;
            transform: rotate(0deg);
            transition: 0.5s ease-in-out;
            cursor: pointer;
            top: 0;
            right: 0;
          }

          .nav-icon span {
            display: block;
            position: absolute;
            height: 2px;
            width: 100%;
            background: black;
            border-radius: 9px;
            opacity: 1;
            left: 0;
            transform: rotate(0deg);
            transition: 0.25s ease-in-out;
          }

          .nav-icon {
          }

          .nav-icon span:nth-child(1) {
            top: 0px;
            transform-origin: left center;
          }

          .nav-icon span:nth-child(2) {
            top: 9px;
            transform-origin: left center;
          }

          .nav-icon span:nth-child(3) {
            top: 18px;
            transform-origin: left center;
          }

          .nav-icon.open span:nth-child(1) {
            transform: rotate(45deg);
            top: -1px;
            left: 4px;
          }

          .nav-icon.open span:nth-child(2) {
            width: 0%;
            opacity: 0;
          }

          .nav-icon.open span:nth-child(3) {
            transform: rotate(-45deg);
            top: 22px;
            left: 4px;
          }
        `}</style>
      </div>
    );
  }
}
