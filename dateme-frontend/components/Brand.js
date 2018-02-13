import Link from "next/link";

export default ({ hideText = false }) => {
  const src = hideText
    ? "/static/brand-no-text@2x.png"
    : "/static/brand@2x.png";
  return (
    <div key={src}>
      <Link href="/">
        <a className="Brand">
          <img src={src} />
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

        @media (max-width: 460px) {
          img {
            height: 33px;
          }

          a {
            height: 33px;
          }
        }
      `}</style>
    </div>
  );
};
