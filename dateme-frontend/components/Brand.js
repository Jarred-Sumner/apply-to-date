import Link from "next/link";

export default () => {
  return (
    <div>
      <Link href="/">
        <a className="Brand">
          <img src="/static/brand@2x.png" />
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
