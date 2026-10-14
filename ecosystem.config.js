module.exports = {
  apps: [
    {
      name: "hmps-ti-web",
      cwd: "/home/ubuntu/hmps-ti/.next/standalone",
      script: "server.js",
      node_args: "--env-file=/home/ubuntu/hmps-ti/.env.production",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },
      max_memory_restart: "400M",
      autorestart: true,
      watch: false,
    },
  ],
};
