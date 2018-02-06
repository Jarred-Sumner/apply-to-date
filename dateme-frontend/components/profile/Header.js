import Brand from "../Brand";

export default ({ profile }) => {
  return (
    <header>
      <Brand />

      <style jsx>{`
        header {
          padding: 24px 40px;
          display: flex;
          border-bottom: 1px solid #e8e8e8;
        }
      `}</style>
    </header>
  );
};
