import Link from "next/link";

export default ({ hideText = false }) => {
  return (
    <div>
      <Link href="/">
        <a className="Brand">
          <img
            src={
              hideText ? "/static/brand-no-text@2x.png" : "/static/brand@2x.png"
            }
          />
        </a>
      </Link>
      <style jsx>{`
        img {
          height: 43px;
        }
        a {
          height: 43px;
          display: block;
        }
      `}</style>
    </div>
  );
};
