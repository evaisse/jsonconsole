var os = require('os');
var path = require('path');
var util = require('util');
var isOriginal = true;
var hostname = os.hostname();
var options = {
    callee: 5,
    root: null,
    name: null,
    localDate: true,
    v: 0,
};

function RawValue(o) { 
    this.raw = o; 
};

function formatLocalDate(date) {
    var now = date ? date : new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = (n, width, z) => {
            width = width || 2;
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + '.' + pad(now.getMilliseconds(), 3) + dif + pad(tzo / 60) + ':' + pad(tzo % 60);
}

const levels = {
    "*": 0,
    "trace": 10,
    "debug": 20,
    "log": 20,
    "info": 30,
    "warn": 40,
    "error": 50,
    "fatal": 60,
};

const levelNames = {
    10: "TRACE",
    20: "DEBUG",
    30: "INFO",
    40: "WARN",
    50: "ERROR",
    60: "FATAL"
};


/**
 * Gather some caller info 3 stack levels up.
 * See <http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi>.
 */
function getCaller3Info(limit) {
    if (this === undefined) {
        // Cannot access caller info in 'strict' mode.
        return;
    }
    limit = limit || options.callee;
    var obj = {};
    var saveLimit = Error.stackTraceLimit;
    var savePrepare = Error.prepareStackTrace;
    Error.stackTraceLimit = limit;

    Error.prepareStackTrace = function(_, stack) {
        var caller = stack[limit - 1];
        obj.file = caller.getFileName().replace(options.root + "/", '');
        obj.line = caller.getLineNumber();
        var func = caller.getFunctionName();
        if (func)
            obj.func = func;
    };
    Error.captureStackTrace(this, getCaller3Info);
    this.stack;

    Error.stackTraceLimit = saveLimit;
    Error.prepareStackTrace = savePrepare;
    return obj;
}


/**
 * Write JSON log line to stderr & stdout
 * 
 * @param  {Stream} src stderr or stdout
 * @param  {String} lvl a given string level by calling console.{level}()
 * @param  {Object} obj Any object that will be filtered 
 * @return {Boolean} false if logging has aborted
 */
function write(src, lvl, obj) {

    var stack = null;
    var lvlInt = levels[lvl];
    var msg;

    if (   typeof process.env.LOG_LEVEL == "string" 
        && levels[process.env.LOG_LEVEL.toLowerCase()] > lvlInt) {
        return false;
    }

    if (lvlInt >= 40) {
        stack = (obj instanceof Error) ? obj.stack : new Error().stack;
    }


    if (obj instanceof RawValue) {
        msg = util.inspect(obj.raw);
    } else if (typeof obj == "string") {
        msg = obj;
    } else {
        msg = util.inspect(obj);
    }

    var log = {
        name: options.name,
        hostname,
        pid: process.pid,
        level: lvlInt,
        msg: msg,
        time: options.localDate ? formatLocalDate() : new Date().toISOString(),
        src: getCaller3Info(),        
        levelName: levelNames[lvlInt],
    };

    if (obj instanceof RawValue) {
        log.raw = obj.raw;
    }

    stack = stack && options.root ? stack.replace(new RegExp(options.root, 'g'), '{root}') : stack;
    
    if (stack) {
        log.stack = stack;
    }

    log.v = options.v;
    log.src.r = options.root;

    return src.write(JSON.stringify(log) + os.EOL);
};


const originalConsoleFunctions = {
    log: console.log,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
};

/**
 * Replace global console api
 */
function replace() {

    if (!isOriginal) return;
    else isOriginal = false;

    function replaceWith(fn) {
        return function() {
            /* eslint prefer-rest-params:0 */
            // todo: once node v4 support dropped, use rest parameter instead
            fn.apply(logger, Array.from(arguments));
        };
    }

    ['log', 'debug', 'info', 'warn', 'error'].forEach((lvl) => {
        console[lvl] = function() {
            Array.prototype.slice.call(arguments).forEach((arg) => {
                write(lvl == "error" ? process.stderr : process.stdout, lvl, arg);
            });
        };
    });

}

/**
 * Restore original console api
 */
function restore() {
    if (isOriginal) return;
    else isOriginal = true;
    ['log', 'debug', 'info', 'warn', 'error'].forEach((item) => {
        console[item] = originalConsoleFunctions[item];
    });
}



/**
 * Setup
 * @param  {[type]} userOptions [description]
 * @return {[type]}             [description]
 */
function setup(userOptions) {

    Object.assign(options, userOptions);

    /*
        Try to automatically grab the app name from the root directory
     */  
    if (!options.root) {
        try {
            var p = require(path.dirname(process.mainModule.filename) + '/package.json');
            options.root = path.dirname(process.mainModule.filename);
            options.name = p.name;
        } catch (e) {
            options.root = null;    
        }
    }

    if (options.root && !options.name) {
        try {
            var p = require(options.root + '/package.json');
            options.name = p.name;
        } catch (e) {
        }
    }

    options.name = options.name || ".";
    replace();
    return restore;
}


setup.RawValue = RawValue;
module.exports = setup;