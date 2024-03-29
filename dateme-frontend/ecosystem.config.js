module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: "frontend",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production",
        NODE_SRC: "./",
        PORT: "3001"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "root",
      host: "165.227.58.224",
      ref: "origin/master",
      repo: "git@github.com:Jarred-Sumner/dateme.git",
      path: "/root/applytodate",
      "post-deploy": "cd ./dateme-frontend && yarn install && yarn postdeploy",
      env: {
        NODE_ENV: "production"
      }
    }
  }
};
