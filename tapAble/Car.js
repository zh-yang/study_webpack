const { SyncHook } = require('./index')


const hook = new SyncHook(['arg1', 'arg2', 'arg3'])


hook.tap('event1', (...rest) => {
    console.log('event1', ...rest);
})
hook.tap('event2', (...rest) => {
    console.log('event2', ...rest);
})


hook.call(1,2)

