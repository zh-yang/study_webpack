const CALL_DELEGATE = function(...args) {
    this.call = this._createCall('sync');
    return this.call(...args);
}

class Hook {
    constructor(args = [], name) {
        this._args = args;
        this.name = name;
        this.taps = []; //注册内容
        this.interceptors = []; //拦截器
        this._call = CALL_DELEGATE;
        this.call = CALL_DELEGATE;
        this._x = undefined; //存放tap注册函数

        this.compile = this.compile; // 动态编译方法;
        this.tap = this.tap; // 注册方法
    }

    compile(options) {
        throw new Error('Abstract: should be overridden');
    }

    tap(options, fn) {
        this._tap('sync', options, fn);
    }

    _tap(type, options, fn) {
        if(typeof options === 'string') {
            options = {
                name: options.trim()
            }
        } else if (typeof options !== 'object' && options === null) {
            throw new Error('Invalid tap options')
        }
        
        if(typeof options.name !== 'string' || options.name === '') {
            throw new Error('Missing name for tap')
        }
        // 合并参数
        options = Object.assign({type, fn}, options);
        this._insert(options);
    }
    _resetCompilation() {
        this.call = this._call;
    }
    _insert(item) {
        this._resetCompilation();
        this.taps.push(item);
    }
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            args: this._args,
            type: type
        });
    }
}

module.exports = Hook;
