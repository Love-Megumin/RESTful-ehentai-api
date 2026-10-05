module.exports = {
  apps : [{
    name: 'eh-api-service',
    script: 'gunicorn',
    args: '-c gunicorn.conf.py index:app',
    interpreter: 'none',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '512M',
    env: { CACHE_DB: './data/cache.sqlite3', CACHE_NAMESPACE: 'ehentai' },
    autorestart: true,
  }]
};
