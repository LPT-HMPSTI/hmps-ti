module.exports = {
  apps: [
    {
      name: "hmps-ti-web",
      // Gunakan server standalone hasil build Next.js
      script: ".next/standalone/server.js",
      instances: "max", // atau tentukan angka seperti 1 / 2 sesuai core VPS
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Optimasi memori dan auto-restart jika melebihi batas
      max_memory_restart: "400M",
      autorestart: true,
      watch: false,
    },
  ],
};
