const routes = require("next-routes")();

routes
  .add({
    name: "profile",
    pattern: "/profiles/:id",
    page: "profile"
  })
  .add({
    name: "index",
    pattern: "/",
    page: "index"
  })
  .add({
    name: "EnterApplication",
    pattern: "/profiles/:id/apply",
    page: "EnterApplication"
  });

module.exports = routes;
