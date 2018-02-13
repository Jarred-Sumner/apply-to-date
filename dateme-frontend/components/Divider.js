export default ({ color = "#00E2AA", width = "72px", height = "2px" }) => (
  <div className="Divider">
    <style jsx>{`
      .Divider {
        content: "";
        display: block;
        width: ${width};
        height: ${height};
        background-color: ${color};
        border-radius: 2.5px;
      }
    `}</style>
  </div>
);
