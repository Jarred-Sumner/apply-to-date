const routes = require("next-routes")();

routes
  .add("index", "/")
  .add({
    name: "shuffle",
    pattern: "/shuffle",
    page: "Shuffle"
  })
  .add({
    name: "matchmake",
    pattern: "/matchmake",
    page: "Matchmake"
  })
  .add("CreateAccount", "/sign-up")
  .add({
    name: "create-account",
    pattern: "/sign-up/:provider/:id",
    page: "CreateAccount"
  })
  .add({
    name: "/sign-up/verify",
    pattern: "/sign-up/verify",
    page: "VerifyAccount"
  })
  .add({
    name: "Login",
    pattern: "/login",
    page: "Login"
  })
  .add({
    name: "reset-password",
    pattern: "/reset-password/:id",
    page: "ResetPassword"
  })
  .add({
    name: "forgot-password",
    pattern: "/forgot-password",
    page: "ForgotPassword"
  })
  .add({
    name: "PrivacyPolicy",
    pattern: "/privacy-policy",
    page: "PrivacyPolicy"
  })
  .add({
    name: "TermsOfService",
    pattern: "/terms-of-service",
    page: "TermsOfService"
  })
  .add({
    name: "/applications",
    pattern: "/applications",
    page: "ReviewApplication"
  })
  .add({
    name: "/applications/liked",
    pattern: "/applications/liked",
    page: "LikedApplications"
  })
  .add({
    name: "/applications/passed",
    pattern: "/applications/passed",
    page: "PassedApplications"
  })
  .add({
    name: "/applications/filtered",
    pattern: "/applications/filtered",
    page: "FilteredApplications"
  })
  .add({
    name: "/applications/:id",
    pattern: "/applications/:id",
    page: "ReviewSpecificApplication"
  })
  .add({
    name: "ProfileNotFound",
    pattern: "/page-not-found",
    page: "ProfileNotFound"
  })
  .add({
    name: "profile",
    pattern: "/:id",
    page: "profile"
  })
  .add({
    name: "CreateApplication",
    pattern: "/:id/apply",
    page: "CreateApplication"
  })
  .add({
    name: "/a/:id",
    pattern: "/a/:id",
    page: "UpdateApplication"
  })
  .add({
    name: "EditProfile",
    pattern: "/:id/edit",
    page: "EditProfile"
  });

module.exports = routes;
