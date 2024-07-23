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
                fn = new Function(this.args())
                break;
        
            default:
                break;
        }
    }
    init(options) {
        this.options = options;
        this._args = options.args.slice();
    }
    args({before, after}) {
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
}

module.exports = HookCodeFactory;