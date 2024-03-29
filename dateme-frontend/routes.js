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
  .add({
    name: "notifications",
    pattern: "/notifications",
    page: "Notifications"
  })
  .add({
    name: "DateEventListPicker",
    pattern: "/dates",
    page: "DateEventList"
  })
  .add({
    name: "DateEventList",
    pattern: "/dates/:id",
    page: "DateEventList"
  })
  .add({
    name: "DateEventApplicationListPicker",
    pattern: "/dates/:dateEventId/pick-someone",
    page: "DateEventApplicationList"
  })
  .add({
    name: "DateEventApplicationList",
    pattern: "/dates/:dateEventId/pick-someone/:id",
    page: "DateEventApplicationList"
  })
  .add({
    name: "DateEventApplicationRedirector",
    pattern: "/de/:id",
    page: "DateEventApplicationRedirector"
  })
  .add({
    name: "DateEventRedirector",
    pattern: "/d/:id",
    page: "DateEventRedirector"
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
    name: "/matches",
    pattern: "/matches",
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
    name: "UpdateDateEventApplication",
    pattern: "/asked-out/:id",
    page: "UpdateDateEventApplication"
  })
  .add({
    name: "ProfileNotFound",
    pattern: "/page-not-found",
    page: "ProfileNotFound"
  })
  .add({
    name: "Home",
    pattern: "/home",
    page: "index"
  })
  .add({
    name: "LoggedInUserRedirector",
    pattern: "/welcome",
    page: "LoggedInUserRedirector"
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
  })
  .add({
    name: "ShowDateEvent",
    pattern: "/:profileId/:slug",
    page: "ShowDateEvent"
  })
  .add({
    name: "CreateDateEventApplication",
    pattern: "/:profileId/:slug/apply",
    page: "CreateDateEventApplication"
  });

module.exports = routes;
