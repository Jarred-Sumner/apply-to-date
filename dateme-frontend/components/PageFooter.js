import Brand from "./Brand";
import Text from "./Text";
import Link from "next/link";
import classNames from "classnames";

export default ({ center = false }) => {
  return (
    <div className={classNames("Container", { "Container--centered": center })}>
      <div className="Wrapper">
        <Brand hideText />

        <div className="links">
          <Link href="/contact-us">
            <a>
              <Text type="footerlink">Contact us</Text>
            </a>
          </Link>

          <Link href="/terms-of-service">
            <a>
              <Text type="footerlink">Terms of Service</Text>
            </a>
          </Link>

          <Link href="/privacy-policy">
            <a>
              <Text type="footerlink">Privacy Policy</Text>
            </a>
          </Link>
        </div>

        <div className="copyright">
          <Text size="12px" color="#6F7385">
            © 2018 Ship First Labs, Inc
          </Text>
        </div>
      </div>
      <style jsx>{`
        .Container {
          display: flex;
          margin-left: auto;
          margin-right: auto;
          margin-top: auto;
          width: 100%;
        }

        .Container--centered {
          max-width: 710px;
          justify-content: center;
        }

        .Wrapper {
          padding-top: 28px;
          border-top: 1px solid #f0f2f7;
          margin-bottom: 28px;
          align-items: center;
          display: flex;
          width: 100%;
        }

        a {
          color: #000;
        }

        a:hover {
          text-decoration: underline;
        }

        @media (max-width: 580px) {
          .Wrapper {
            padding-left: 28px;
            padding-right: 28px;
          }
          a:nth-of-type(2),
          a:nth-of-type(3) {
            display: none;
          }
        }

        .copyright {
          margin-left: auto;
        }

        .links {
          display: flex;
          margin-left: 28px;
        }

        .links a {
          margin-right: 14px;
        }
      `}</style>
    </div>
  );
};
