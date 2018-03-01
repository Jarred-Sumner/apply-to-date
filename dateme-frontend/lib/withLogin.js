import cookies from "next-cookies";
import { setCurrentUser, setUserAgent } from "../redux/store";

export default Component => {
  const originalGetInitialProps = Component.getInitialProps;

  Component.getInitialProps = ctx => {
    const { currentUserId } = cookies(ctx);
    const { store, query, req } = ctx;

    if (currentUserId) {
      store.dispatch(setCurrentUser(currentUserId));
    }

    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    store.dispatch(setUserAgent(userAgent));

    if (originalGetInitialProps) {
      return originalGetInitialProps(ctx);
    } else {
      return { currentUserId };
    }
  };

  return Component;
};
