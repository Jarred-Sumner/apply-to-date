export default props => {
  if (typeof window !== "undefined") {
    const TwitterSection = require("./TwitterViewer/TwitterSection").default;
    return <TwitterSection {...props} />;
  } else {
    return null;
  }
};
