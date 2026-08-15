// @ts-check
import yargs from 'yargs'
import os from 'os'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
import fs from 'fs'
import Stream, { Readable } from 'stream'

// ==========================================
// 👑 CONFIGURACIÓN DE TENGAN KIRA 👑
// ==========================================

// قناة تنغن كيرا الرسمية
const TENGAN_CHANNEL = {
    jid: '120363422169387032@newsletter',
    name: '『 مـمـلـكـة تـنـغـن 👑 』',
    link: 'https://whatsapp.com/channel/0029VbCCD2NGU3BLhu7ceH2e'
}

// معلومات البوت
const BOT_INFO = {
    name: '⚔️ 𝐓𝐄𝐍𝐆𝐀𝐍 𝐊𝐈𝐑𝐀 𝐁𝐎𝐓 ⚔️',
    owner: 'تنغن كيرا',
    version: '2.1.0'
}

// إعدادات القناة للرسائل
const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: TENGAN_CHANNEL.jid,
            newsletterName: TENGAN_CHANNEL.name,
            serverMessageId: -1
        },
        externalAdReply: {
            title: BOT_INFO.name,
            body: '👑 انقر هنا لدخول مملكة تنغن 👑',
            thumbnailUrl: 'https://i.postimg.cc/MT6zn6h6/file-00000000ba7071f4add6485aafa69167.png',
            sourceUrl: TENGAN_CHANNEL.link,
            mediaType: 1,
            renderLargerThumbnail: true
        }
    }
}

// ==========================================
// 📚 الدوال الأساسية
// ==========================================

/** 
 * @param {ImportMeta | string} pathURL 
 * @param {boolean?} rmPrefix if value is `'true'`, it will remove `'file://'` prefix, if windows it will automatically false
 */
const __filename = function filename(pathURL = import.meta, rmPrefix = os.platform() !== 'win32') {
    const path = /** @type {ImportMeta} */ (pathURL).url || /** @type {String} */ (pathURL)
    return rmPrefix ?
        /file:\/\/\//.test(path) ?
            fileURLToPath(path) :
            path : /file:\/\/\//.test(path) ?
            path : pathToFileURL(path).href
}

/** @param {ImportMeta | string} pathURL */
const __dirname = function dirname(pathURL) {
    const dir = __filename(pathURL, true)
    const regex = /\/$/
    return regex.test(dir) ?
        dir : fs.existsSync(dir) &&
            fs.statSync(dir).isDirectory() ?
            dir.replace(regex, '') :
            path.dirname(dir)
}

/** @param {ImportMeta | string} dir */
const __require = function require(dir = import.meta) {
    const path = /** @type {ImportMeta} */ (dir).url || /** @type {String} */ (dir)
    return createRequire(path)
}

/** @param {string} file */
const checkFileExists = (file) => fs.promises.access(file, fs.constants.F_OK).then(() => true).catch(() => false)

/** @type {(name: string, path: string, query: { [Key: string]: any }, apikeyqueryname: string) => string} */
const API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

/** @type {ReturnType<yargs.Argv['parse']>} */
const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
const prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

/**
 * @param {Readable} stream 
 * @param {string} file 
 * @returns {Promise<void>}
 */
const saveStreamToFile = (stream, file) => new Promise((resolve, reject) => {
    const writable = stream.pipe(fs.createWriteStream(file))
    writable.once('finish', () => {
        resolve()
        writable.destroy()
    })
    writable.once('error', () => {
        reject()
        writable.destroy()
    })
})

const kDestroyed = Symbol('kDestroyed');
const kIsReadable = Symbol('kIsReadable');

const isReadableNodeStream = (obj, strict = false) => {
    return !!(
        obj &&
        typeof obj.pipe === 'function' &&
        typeof obj.on === 'function' &&
        (
            !strict ||
            (typeof obj.pause === 'function' && typeof obj.resume === 'function')
        ) &&
        (!obj._writableState || obj._readableState?.readable !== false) &&
        (!obj._writableState || obj._readableState)
    );
}

const isNodeStream = (obj) => {
    return (
        obj &&
        (
            obj._readableState ||
            obj._writableState ||
            (typeof obj.write === 'function' && typeof obj.on === 'function') ||
            (typeof obj.pipe === 'function' && typeof obj.on === 'function')
        )
    );
}

const isDestroyed = (stream) => {
    if (!isNodeStream(stream)) return null;
    const wState = stream._writableState;
    const rState = stream._readableState;
    const state = wState || rState;
    return !!(stream.destroyed || stream[kDestroyed] || state?.destroyed);
}

const isReadableFinished = (stream, strict) => {
    if (!isReadableNodeStream(stream)) return null;
    const rState = stream._readableState;
    if (rState?.errored) return false;
    if (typeof rState?.endEmitted !== 'boolean') return null;
    return !!(
        rState.endEmitted ||
        (strict === false && rState.ended === true && rState.length === 0)
    );
}

const isReadableStream = (stream) => {
    if (typeof Stream.isReadable === 'function') return Stream.isReadable(stream)
    if (stream && stream[kIsReadable] != null) return stream[kIsReadable];
    if (typeof stream?.readable !== 'boolean') return null;
    if (isDestroyed(stream)) return false;
    return (
        isReadableNodeStream(stream) &&
        !!stream.readable &&
        !isReadableFinished(stream)
    ) || stream instanceof fs.ReadStream || stream instanceof Readable;
}

// ==========================================
// 🎯 تصدير كل شيء
// ==========================================

export default {
    // الدوال الأساسية
    __filename,
    __dirname,
    __require,
    checkFileExists,
    API,
    saveStreamToFile,
    isReadableStream,
    opts,
    prefix,
    
    // 👑 معلومات تنغن كيرا
    TENGAN_CHANNEL,
    BOT_INFO,
    channelInfo
}