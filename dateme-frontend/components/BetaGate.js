export default ({ children }) => {
  if (process.env.NODE_ENV === "production") {
    return null;
  } else {
    return children;
  }
};
