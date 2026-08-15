// 🍁 ملف: UltraDB.js - نظام قاعدة البيانات - ISAGI TENGEN BOT

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMOJI = '🍁';

class UltraDB {
    #path;
    #gsPath;
    #saveTimer = null;
    #gsSaveTimer = null;

    constructor() {
        this.#path   = path.join(__dirname, 'database.json');
        this.#gsPath = path.join(__dirname, 'settings.json');

        // ✅ إنشاء المجلد إذا لم يكن موجوداً
        const dir = path.dirname(this.#path);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        // ✅ تحميل البيانات
        this.data = this.#load();

        // ✅ تحميل global._gs من الملف
        global._gs = this.#loadGs();

        // ✅ حفظ تلقائي كل 30 ثانية
        setInterval(() => this.#saveGs(), 30000);

        // ✅ حفظ عند الخروج
        process.on('exit', () => {
            this.#save();
            this.#saveGs();
        });

        // ✅ حفظ عند SIGINT
        process.on('SIGINT', () => {
            this.#save();
            this.#saveGs();
            process.exit(0);
        });

        return this.#createProxy();
    }

    // 🍁 تحميل قاعدة البيانات الرئيسية
    #load() {
        try {
            if (existsSync(this.#path)) {
                const raw = readFileSync(this.#path, 'utf-8').trim();
                if (raw && raw.startsWith('{')) {
                    const parsed = JSON.parse(raw);
                    if (!parsed.groups) parsed.groups = {};
                    if (!parsed.users)  parsed.users  = {};
                    if (!parsed.extraOwners) parsed.extraOwners = [];
                    return parsed;
                }
            }
        } catch (e) {
            console.error(`${EMOJI} [UltraDB] خطأ في قراءة JSON:`, e.message);
            try { writeFileSync(this.#path, '{"groups":{},"users":{},"extraOwners":[]}'); } catch {}
        }
        return { groups: {}, users: {}, extraOwners: [] };
    }

    // 🍁 تحميل إعدادات البوت
    #loadGs() {
        try {
            if (existsSync(this.#gsPath)) {
                const raw = readFileSync(this.#gsPath, 'utf-8').trim();
                if (raw && raw.startsWith('{')) return JSON.parse(raw);
            }
        } catch (e) {
            console.error(`${EMOJI} [UltraDB] خطأ في قراءة الإعدادات:`, e.message);
            try { writeFileSync(this.#gsPath, '{}'); } catch {}
        }
        return {};
    }

    // 🍁 حفظ قاعدة البيانات الرئيسية
    #save() {
        if (this.#saveTimer) clearTimeout(this.#saveTimer);
        this.#saveTimer = setTimeout(() => {
            try { 
                writeFileSync(this.#path, JSON.stringify(this.data, null, 2)); 
            } catch (e) {
                console.error(`${EMOJI} [UltraDB] فشل حفظ قاعدة البيانات:`, e.message);
            }
            this.#saveTimer = null;
        }, 50);
    }

    // 🍁 حفظ إعدادات البوت
    #saveGs() {
        if (this.#gsSaveTimer) clearTimeout(this.#gsSaveTimer);
        this.#gsSaveTimer = setTimeout(() => {
            try {
                if (global._gs) {
                    writeFileSync(this.#gsPath, JSON.stringify(global._gs, null, 2));
                }
            } catch (e) {
                console.error(`${EMOJI} [UltraDB] فشل حفظ الإعدادات:`, e.message);
            }
            this.#gsSaveTimer = null;
        }, 50);
    }

    // 🍁 حفظ فوري للإعدادات
    saveGsSync() {
        try {
            if (global._gs) {
                writeFileSync(this.#gsPath, JSON.stringify(global._gs, null, 2));
            }
        } catch (e) {
            console.error(`${EMOJI} [UltraDB] فشل حفظ الإعدادات الفوري:`, e.message);
        }
    }

    // 🍁 التحقق من صحة الـ ID
    #isValidId(id) {
        return id && !id.includes('@newsletter') && id.includes('@') && id !== 'undefined';
    }

    // 🍁 إنشاء Proxy للتعامل مع البيانات
    #createProxy() {
        const self = this;
        return new Proxy(this.data, {
            get(target, prop) {
                // ✅ التعامل مع groups
                if (prop === 'groups') {
                    return new Proxy(target.groups, {
                        get(groupTarget, groupId) {
                            if (!self.#isValidId(groupId)) return undefined;
                            if (!groupTarget[groupId]) groupTarget[groupId] = {};
                            return new Proxy(groupTarget[groupId], {
                                set(obj, key, val) {
                                    if (val === false || val === null || val === undefined) {
                                        delete obj[key];
                                    } else {
                                        obj[key] = val;
                                    }
                                    self.#save();
                                    return true;
                                },
                                get(obj, key) { return obj[key]; },
                                deleteProperty(obj, key) { delete obj[key]; self.#save(); return true; }
                            });
                        },
                        set(groupTarget, groupId, val) {
                            if (self.#isValidId(groupId)) groupTarget[groupId] = val || {};
                            self.#save();
                            return true;
                        }
                    });
                }

                // ✅ التعامل مع users
                if (prop === 'users') {
                    return new Proxy(target.users, {
                        get(usersTarget, userId) {
                            if (!userId || userId === 'undefined') return undefined;
                            if (!usersTarget[userId]) usersTarget[userId] = {};
                            return new Proxy(usersTarget[userId], {
                                set(obj, key, val) {
                                    if (val === false || val === null || val === undefined) {
                                        delete obj[key];
                                    } else {
                                        obj[key] = val;
                                    }
                                    self.#save();
                                    return true;
                                },
                                get(obj, key) { return obj[key]; },
                                deleteProperty(obj, key) { delete obj[key]; self.#save(); return true; }
                            });
                        },
                        set(usersTarget, userId, val) {
                            if (userId && userId !== 'undefined') usersTarget[userId] = val || {};
                            self.#save();
                            return true;
                        }
                    });
                }

                // ✅ التعامل مع extraOwners (المطورين الإضافيين)
                if (prop === 'extraOwners') {
                    return target.extraOwners || [];
                }

                // ✅ حفظ إعدادات البوت
                if (prop === '_gs') {
                    return global._gs;
                }

                return target[prop];
            },

            // ✅ التعيين
            set(target, prop, val) {
                if (prop === '_gs') {
                    global._gs = val;
                    self.#saveGs();
                    return true;
                }
                if (val === false || val === null || val === undefined) {
                    delete target[prop];
                } else {
                    target[prop] = val;
                }
                self.#save();
                return true;
            },

            // ✅ الحذف
            deleteProperty(target, prop) {
                if (prop === '_gs') {
                    global._gs = {};
                    self.#saveGs();
                    return true;
                }
                delete target[prop];
                self.#save();
                return true;
            }
        });
    }

    // 🍁 دوال مساعدة للمطورين الإضافيين
    addExtraOwner(owner) {
        if (!owner.jid && !owner.lid) return false;
        // التحقق من عدم التكرار
        const exists = this.data.extraOwners.some(o => 
            o.jid === owner.jid || o.lid === owner.lid
        );
        if (exists) return false;
        this.data.extraOwners.push(owner);
        this.#save();
        return true;
    }

    removeExtraOwner(jid) {
        const initialLength = this.data.extraOwners.length;
        this.data.extraOwners = this.data.extraOwners.filter(o => 
            o.jid !== jid && o.lid !== jid
        );
        if (this.data.extraOwners.length < initialLength) {
            this.#save();
            return true;
        }
        return false;
    }

    getExtraOwners() {
        return this.data.extraOwners || [];
    }
}

export default UltraDB;