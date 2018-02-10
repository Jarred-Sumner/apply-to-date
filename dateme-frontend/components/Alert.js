import Alert from "react-s-alert";
import _ from "lodash";

export const handleApiError = error => {
  console.error(error);

  if (error.response) {
    if (!_.isEmpty(error.response.body.message)) {
      if (typeof error.response.body.message === "string") {
        Alert.error(error.response.body.message);
      } else {
        Alert.error(_.first(error.response.body.message));
      }

      return;
    }
  }

  Alert.error(
    "Something went wrong. Please re-enter your information and try again"
  );
};

export const AlertHost = ({}) => {
  return (
    <React.Fragment>
      <Alert stack={{ limit: 3 }} />
      <style jsx global>{`
        .s-alert-box,
        .s-alert-box * {
          box-sizing: border-box;
        }

        .s-alert-box {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          display: flex;
          color: #fff;
          border-radius: 4px;
          font-size: 14px;
          height: 47px;
          max-width: 100%;
          transition: top 0.4s, bottom 0.4s;
        }

        .s-alert-box-inner {
          padding: 14px 22px;
          font-weight: 500;
          font-family: "Open Sans", sans-serif;
          line-height: 19px;
        }

        .s-alert-box.s-alert-show {
          pointer-events: auto;
        }

        .s-alert-box a {
          color: inherit;
          opacity: 0.7;
          font-weight: 500;
        }

        .s-alert-box a:hover,
        .s-alert-box a:focus {
          opacity: 1;
        }

        .s-alert-box p {
          margin: 0;
        }

        .s-alert-box.s-alert-show,
        .s-alert-box.s-alert-visible {
          pointer-events: auto;
        }

        .s-alert-close {
          margin-left: auto;
          align-items: center;
          display: flex;
          height: 47px;
          width: 30px;
          overflow: hidden;
          cursor: pointer;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .s-alert-close:after {
          background-image: url("/static/alert-close.png");
          background-size: 9px 9px;
          margin-left: auto;
          margin-right: 14px;
          margin-top: auto;
          margin-bottom: auto;
          align-items: center;
          align-self: center;
          content: "";
          transition: transform 0.15s linear;
          height: 9px;
          width: 9px;
          display: block;
        }

        .s-alert-close:hover,
        .s-alert-close:focus {
          outline: none;
        }

        /* positions */

        .s-alert-bottom-left {
          top: auto;
          right: auto;
          bottom: 30px;
          left: 30px;
        }
        .s-alert-top-left {
          top: 30px;
          right: auto;
          bottom: auto;
          left: 30px;
        }
        .s-alert-top-right {
          top: 30px;
          right: 30px;
          bottom: auto;
          left: auto;
        }
        .s-alert-bottom-right {
          /*default*/
          top: auto;
          right: 30px;
          bottom: 30px;
          left: auto;
        }
        .s-alert-bottom {
          width: 100%;
          max-width: 100%;
          bottom: 0;
          left: 0;
          right: 0;
          top: auto;
        }
        .s-alert-top {
          width: 100%;
          max-width: 100%;
          top: 0;
          left: 0;
          right: 0;
          bottom: auto;
        }

        /* conditions */

        .s-alert-info {
          background: #3b55e6;
          color: #fff;
        }
        .s-alert-success {
          background: #4be1ab;
          color: #fff;
        }
        .s-alert-warning {
          background: #dfbf39;
          color: #fff;
        }
        .s-alert-error {
          background: #fe5339;
          color: #fff;
        }

        [class^="s-alert-effect-"].s-alert-hide,
        [class*=" s-alert-effect-"].s-alert-hide {
          -webkit-animation-direction: reverse;
          animation-direction: reverse;
        }

        /* height measurement helper */
        .s-alert-box-height {
          visibility: hidden;
          position: fixed;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Alert;
