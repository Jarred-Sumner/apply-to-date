const routes = require("next-routes")();

routes
  .add({
    name: "index",
    pattern: "/",
    page: "index"
  })
  .add({
    name: "create-account",
    pattern: "/sign-up/:provider/:id",
    page: "CreateAccount"
  })
  .add({
    name: "sign-up",
    pattern: "/sign-up",
    page: "VerifyAccount"
  })
  .add({
    name: "sign-in",
    pattern: "/login",
    page: "Login"
  })
  .add({
    name: "profile",
    pattern: "/:id",
    page: "profile"
  })
  .add({
    name: "EnterApplication",
    pattern: "/:id/apply",
    page: "EnterApplication"
  });

module.exports = routes;
