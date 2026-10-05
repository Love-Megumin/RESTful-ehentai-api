# 三平台部署

核心为cloud-functions/backend.py，Vercel/Gunicorn与EdgeOne两入口共用。
详情缓存使用站点域名稳定键，游标按关键词/站点/用户隔离并共享。图片列表只返回
稳定的大图页面URL；真正读图时逐页解析和转码，避免一次并行抓20页超过网桥窗口。
解析失败整页明确报错，不过滤失败页而改变页码；虚拟章列表同键合并。

VPS：Python3.14 venv安装requirements，加载从 `.env.example` 复制的 `.env`，
`gunicorn -c gunicorn.conf.py index:app`。Vercel使用根index.py及Python3.12；EdgeOne
Python云函数根/catch-all薄入口，核心位于同产物目录。PUBLIC_URL支持路径前缀。

CACHE_DB在VPS设为共享持久路径，Serverless留空；可选REDIS_URL跨实例共享成品/
元数据/游标/租约。协调故障503，Redis使用noeviction。默认2worker×2thread，冷图
单worker1/全局2，内存64MiB/worker、磁盘内容512MiB，TTL/容量淘汰、90秒所有者租约。
SQLite原子提交，实际文件系统占用还含WAL/空闲页。

下载20MiB、解码3200万像素、响应4MiB；代理裁剪校验，width/w、quality/q统一，
LVGL>PNG>JPEG，透明白底、LVGL宽高≤2047。公共图24h，Cookie内容private,no-store，
错误no-store；CDN鉴权跳过读写、图片页url及所有规格参与缓存键。
Nginx转发127.0.0.1:3007，传Host与代理头，读超时25秒。
诊断 `/health/runtime`、X-Cache、尺寸头。实际云平台/Linux/真机验收另行记录。
