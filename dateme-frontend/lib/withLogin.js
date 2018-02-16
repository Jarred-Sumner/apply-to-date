import cookies from "next-cookies";
import { setCurrentUser } from "../redux/store";

export default Component => {
  const originalGetInitialProps = Component.getInitialProps;

  Component.getInitialProps = ctx => {
    const { currentUserId } = cookies(ctx);
    const { store, query } = ctx;

    if (currentUserId) {
      store.dispatch(setCurrentUser(currentUserId));
    }

    if (originalGetInitialProps) {
      return originalGetInitialProps(ctx);
    }
  };

  return Component;
};
