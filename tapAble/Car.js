const { SyncHook, AsyncParallelHook } = require('tapable')

class Car {
    constructor() {
        this.hooks = {
            // 加速: 
        }
    }
}

const hook = new SyncHook(['arg1', 'arg2', 'arg3'])

// hook.intercept({
//     register(tapInfo) {
//         console.log(tapInfo);
//         return tapInfo;
//     },
//     call(...rest) {
//         console.log('call', rest);
//     },
//     tap(tap) {
//         console.log('tap', tap);
//     }
// })

hook.tap('event1', (...rest) => {
    console.log('event1', ...rest);
})
hook.tap('event2', (...rest) => {
    console.log('event2', ...rest);
})

// setTimeout(()=>{
//     hook.intercept({
//         register(tapInfo) {
//             console.log(tapInfo);
//             return tapInfo;
//         },
//         call(...rest) {
//             console.log('call', rest);
//         },
//         tap(tap) {
//             console.log('tap', tap);
//         }
//     })
// }, 2000)

// hook.call(1,2)

