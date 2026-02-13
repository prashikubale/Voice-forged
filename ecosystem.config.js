// ============================================================
// PM2 Ecosystem Config — Production Process Manager
// ============================================================
// Usage:
//   pm2 start ecosystem.config.js             — start
//   pm2 start ecosystem.config.js --env prod  — start in production
//   pm2 logs voiceforge-api                   — view logs
//   pm2 monit                                 — real-time dashboard
//   pm2 restart voiceforge-api                — restart
//   pm2 stop voiceforge-api                   — stop
//   pm2 delete voiceforge-api                 — remove from PM2
// ============================================================

module.exports = {
    apps: [
        {
            name: 'voiceforge-api',
            script: 'server.js',
            cwd: './backend',
            instances: 'max',           // use all available CPU cores
            exec_mode: 'cluster',       // cluster mode for multi-core
            max_memory_restart: '512M', // restart if memory exceeds 512MB

            // Environment variables for different environments
            env: {
                NODE_ENV: 'development',
                PORT: 3001,
            },
            env_prod: {
                NODE_ENV: 'production',
                PORT: 3001,
            },

            // Logging
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            error_file: './logs/error.log',
            out_file: './logs/out.log',
            merge_logs: true,                   // merge logs from all instances
            log_type: 'json',

            // Auto restart policies
            autorestart: true,
            watch: false,                       // don't watch files in production
            max_restarts: 10,                   // max restarts before giving up
            min_uptime: '10s',                  // min uptime to consider "started"
            restart_delay: 4000,                // wait 4s between restarts

            // Graceful shutdown
            kill_timeout: 15000,                // match server SHUTDOWN_TIMEOUT_MS
            listen_timeout: 10000,              // time to wait for app to listen
            shutdown_with_message: true,

            // Health monitoring
            exp_backoff_restart_delay: 1000,     // exponential restart delay
        },
    ],
};
