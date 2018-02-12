export default ({ children, isMobile }) => {
  return (
    <div className="Subheader">
      {children}

      <style jsx>{`
        .Subheader {
          background-color: white;
          display: flex;
          align-items: center;
          padding: 10px 40px;
          width: 100%;
          border-bottom: 1px solid #e8e8e8;
        }
      `}</style>
    </div>
  );
};
