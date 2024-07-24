class HookCodeFactory {
    constructor(config) {
        this.config = config;
        this.options = undefined;
        this._args = undefined;
    }

    // 初始化参数
    setup(instance, options) {
        instance._x = options.taps.map(i => i.fn);
    }

    // 编辑最终需要生成的函数
    create(options) {
        this.init(options);
        let fn;
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    '"use strict";\n' +
                    this.header() +
                    this.contentWithInterceptors({
                        onError: err => `throw ${err};\n`,
                        onResult: result => `return ${result};\n`,
                        resultReturns: true,
                        onDone: () => '',
                        rethrowIfPossible: true
                    })
                )
                break;
        
            default:
                break;
        }
        this.deinit();
        return fn;
    }
    init(options) {
        this.options = options;
        this._args = options.args.slice();
    }
    deinit() {
        this.options = undefined;
        this._args = undefined;
    }
    args({before, after}={}) {
        let allArgs = this._args;
        if(before) {
            allArgs = [before].concat(allArgs);
        }
        if(after) {
            allArgs = allArgs.concat(after);
        }
        if(allArgs.length === 0) {
            return '';
        }else{
            return allArgs.join(',');
        }
    }
    header() {
        let code = '';
        
        code += 'var _context;\n';
        code += 'var _x = this._x;\n';
        return code;
    }
    contentWithInterceptors(options) {
        if(this.options.interceptors?.length) {

        }else{
            return this.content(options);
        }
    }
    callTapsSeries({onDone}) {
        let code = '';
        let current = onDone;
        let length = this.options.taps.length;
        // 没有注册事件则直接返回
        if(length === 0) {
            return onDone();
        }
        // 遍历taps注册的函数，编译生成需要执行的函数
        for (let i = length - 1; i >= 0; i--) {
            const done = current;
            const content = this.callTap(i, {onDone: done});
            current = () => content;
        }
        code += current();
        return code;
    }
    callTap(tapIndex, {onDone}) {
        let code = '';
        // 任何类型都要通过下标先获取内容，生成如 var _fn1 = this._x[1];
        code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
        // 不同类型的调用方法不同，生成调用代码fn1(arg1,arg2,...)
        const tap = this.options.taps[tapIndex];
        switch(tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});\n`;
                break;
                // 其他类型不考虑
            default:
                break;
        }
        if(onDone) {
            code += onDone();
        }
        return code;
    }
    getTapFn(idx) {
        return `_x[${idx}]`;
    }
}

module.exports = HookCodeFactory;