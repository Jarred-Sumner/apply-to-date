import classNames from "classnames";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Portal } from "react-portal";
import Text from "./Text";
import Link from "next/link";

export default class BurgerIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleClick() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setOpen = isOpen => {
    this.setState({ isOpen });
  };

  render() {
    // const { checked, onChange, children, ...otherProps } = this.props;

    const { isOpen } = this.state;

    return (
      <div
        className="HamburgerContainer"
        onClick={() => this.setOpen(!this.state.isOpen)}
      >
        <div className={isOpen ? "nav-icon open" : "nav-icon"}>
          <span />
          <span />
          <span />
        </div>

        <style jsx global>{`
          @media (min-width: 460px) {
            .nav-icon {
              display: none;
            }
          }
          .nav-icon {
            width: 33px;
            height: 23px;
            position: relative;
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
            -webkit-transition: 0.5s ease-in-out;
            -moz-transition: 0.5s ease-in-out;
            -o-transition: 0.5s ease-in-out;
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
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
            -webkit-transition: 0.25s ease-in-out;
            -moz-transition: 0.25s ease-in-out;
            -o-transition: 0.25s ease-in-out;
            transition: 0.25s ease-in-out;
          }

          .nav-icon {
          }

          .nav-icon span:nth-child(1) {
            top: 0px;
            -webkit-transform-origin: left center;
            -moz-transform-origin: left center;
            -o-transform-origin: left center;
            transform-origin: left center;
          }

          .nav-icon span:nth-child(2) {
            top: 9px;
            -webkit-transform-origin: left center;
            -moz-transform-origin: left center;
            -o-transform-origin: left center;
            transform-origin: left center;
          }

          .nav-icon span:nth-child(3) {
            top: 18px;
            -webkit-transform-origin: left center;
            -moz-transform-origin: left center;
            -o-transform-origin: left center;
            transform-origin: left center;
          }

          .nav-icon.open span:nth-child(1) {
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            top: -1px;
            left: 4px;
          }

          .nav-icon.open span:nth-child(2) {
            width: 0%;
            opacity: 0;
          }

          .nav-icon.open span:nth-child(3) {
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            top: 22px;
            left: 4px;
          }
        `}</style>
      </div>
    );
  }
}
