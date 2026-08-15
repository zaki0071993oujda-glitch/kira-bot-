// 🍁 keep_alive.js - نظام منع نوم/تعليق/توقف السيرفر - ISAGI TENGEN BOT

const EMOJI = '🍁';
const BOT_NAME = '┆𝑰𝑺𝑨𝑮𝑰 ⊰🍁⊱𝑻𝑬𝑵𝑮𝑬𝑵 𝑩𝑶𝑻┆';

/**
 * 🍁 1) Event-loop Watchdog
 */
const startHeartbeat = (options = {}) => {
    let lastTick = Date.now();
    const TICK_MS = options.tickMs || 5000;
    const STALL_THRESHOLD_MS = options.stallThreshold || 20000;

    setInterval(() => {
        const now = Date.now();
        const gap = now - lastTick;
        if (gap > STALL_THRESHOLD_MS) {
            console.warn(`${EMOJI} [Watchdog] الـ event loop كان متأخر ${gap}ms`);
        }
        lastTick = now;
    }, TICK_MS).unref?.();
};

/**
 * 🍁 2) Connection Watchdog
 */
const startConnectionWatchdog = (client, options = {}) => {
    const checkEveryMs = options.checkEveryMs || 15000;
    const maxDisconnectedMs = options.maxDisconnectedMs || 90000;
    let disconnectedSince = null;
    let reconnectAttempts = 0;

    setInterval(async () => {
        try {
            const sock = client?.sock;
            const isOpen = sock?.user && sock?.ws?.readyState === 1;

            if (!isOpen) {
                if (!disconnectedSince) {
                    disconnectedSince = Date.now();
                    reconnectAttempts = 0;
                }
                const downFor = Date.now() - disconnectedSince;

                if (downFor > maxDisconnectedMs) {
                    reconnectAttempts++;
                    console.warn(
                        `${EMOJI} [Watchdog] الاتصال مقطوع من ${Math.round(downFor / 1000)}s - ` +
                        `محاولة #${reconnectAttempts}`
                    );
                    disconnectedSince = Date.now();

                    try {
                        if (typeof client.start === 'function') {
                            await client.start();
                        } else if (typeof client.reconnect === 'function') {
                            await client.reconnect();
                        }
                    } catch (e) {
                        console.warn(`${EMOJI} [Watchdog] فشل إعادة الاتصال:`, e?.message);
                    }
                }
            } else {
                if (disconnectedSince) {
                    console.log(`${EMOJI} [Watchdog] ✅ الاتصال عاد`);
                }
                disconnectedSince = null;
                reconnectAttempts = 0;
            }
        } catch (e) {
            // تجاهل
        }
    }, checkEveryMs).unref?.();
};

/**
 * 🍁 3) Memory Guard
 */
const startMemoryGuard = (options = {}) => {
    const checkEveryMs = options.checkEveryMs || 60000;
    const maxHeapMB = options.maxHeapMB || 700;

    setInterval(() => {
        try {
            const used = process.memoryUsage();
            const heapMB = Math.round(used.heapUsed / 1024 / 1024);

            if (heapMB > maxHeapMB) {
                console.warn(`${EMOJI} [MemoryGuard] ⚠️ استهلاك الميموري ${heapMB}MB`);

                if (global._gs) {
                    for (const chatId of Object.keys(global._gs)) {
                        const g = global._gs[chatId];
                        if (g.warnings) {
                            for (const k of Object.keys(g.warnings)) {
                                if (g.warnings[k] === 0) delete g.warnings[k];
                            }
                        }
                    }
                }

                if (typeof global.gc === 'function') {
                    global.gc();
                    console.log(`${EMOJI} [MemoryGuard] ✅ تم تشغيل garbage collection`);
                }
            }
        } catch (e) {
            // تجاهل
        }
    }, checkEveryMs).unref?.();
};

/**
 * 🍁 4) Idle Prevention
 */
const startInternalPing = (options = {}) => {
    const everyMs = options.everyMs || 240000;

    setInterval(() => {
        try {
            const ts = new Date().toISOString();
            process.stdout.write('');
            global._lastPing = ts;
            
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            if (hours > 0 && hours % 1 === 0) {
                console.log(`${EMOJI} [Ping] البوت شغال منذ ${hours} ساعة`);
            }
        } catch (e) {
            // تجاهل
        }
    }, everyMs).unref?.();
};

/**
 * 🍁 5) Health Check Server - تم إصلاح الخطأ
 */
const startHealthServer = (options = {}) => {
    const port = options.port || process.env.PORT || 3000;
    
    try {
        // ✅ استخدام import() داخل دالة async
        const startServer = async () => {
            try {
                const http = await import('http');
                const server = http.createServer((req, res) => {
                    if (req.url === '/health' || req.url === '/') {
                        const uptime = process.uptime();
                        const hours = Math.floor(uptime / 3600);
                        const mins = Math.floor((uptime % 3600) / 60);
                        
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({
                            status: 'online',
                            bot: BOT_NAME,
                            uptime: `${hours}h ${mins}m`,
                            timestamp: new Date().toISOString()
                        }, null, 2));
                    } else {
                        res.writeHead(404);
                        res.end('Not Found');
                    }
                });
                
                server.listen(port, () => {
                    console.log(`${EMOJI} [Health] 🩺 Health server on port ${port}`);
                });
                
                return server;
            } catch (e) {
                console.log(`${EMOJI} [Health] ⚠️ فشل تشغيل health server:`, e.message);
                return null;
            }
        };
        
        // ✅ تشغيل الدالة مباشرة
        startServer();
        
    } catch (e) {
        console.log(`${EMOJI} [Health] ⚠️ فشل تشغيل health server:`, e.message);
        return null;
    }
};

/**
 * 🍁 الدالة الرئيسية
 */
export const keepServerAlive = (client, options = {}) => {
    console.log(`${EMOJI} [KeepAlive] 🛡️ تفعيل نظام منع النوم/التعليق/التوقف...`);

    startHeartbeat(options.heartbeat);
    startConnectionWatchdog(client, options.connection);
    startMemoryGuard(options.memory);
    startInternalPing(options.ping);

    if (options.healthServer !== false) {
        setTimeout(() => {
            startHealthServer(options.healthServer);
        }, 5000);
    }

    console.log(`${EMOJI} [KeepAlive] ✅ النظام شغال - السيرفر محمي`);
};

export default keepServerAlive;