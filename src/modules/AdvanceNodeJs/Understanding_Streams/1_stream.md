[^goToTop]
[Video Link](https://www.youtube.com/watch?v=e5E8HHEYRNI&t=3984s)

[^@1] 
[^@1]:Writable_Streams ➡️
####  Writable_Streams 
 ➡️

##### 

```
buffers are core of the streams.

create a file and write something to that file

```
```ts

// for bench mark

console.time("text")
console.timeEnd("text")
```

```ts
➡️ // Promise Version
const fs = require('node:fs/promises');
/*
Execution time : 8s 💲 
CPU uses : 100% (one core)
memory usage: 50MB
*/
(async() => {
    console.time('writeMany')
    const fileHandle = fs.open("test.txt", "w")
    for(let i = 0 ; i< 1000000; i++){
        await fileHandle.write(`${i}`) // ➡️ output is ordered
    }
    console.timeEnd('writeMany')
})

```

>- 8 seconds to run

```
nodejs is single threaded and it use one core .. if we
want to use multiple core .. we need to use clustering 
and worker thread

```

> ➡️ call back version in node is little bit faster

```ts
➡️ // callback version 🔵
const fs = require('node:fs');
/*
Execution time : 2s 🚀
CPU uses : 100% (one core)
memory usage: 50MB
*/
(async() => {
    console.time('writeMany')
    const fileHandle = fs.open("test.txt", "w", (err, fileDescriptor) => {

        // file descriptor is just an unique number

        // and to write to it

        for(let i = 0 ; i< 1000000; i++){
            /*
            fs.write(fd, `${i}`) // we are gonna omit the callback
            // and change the syntax to use the synchronous version
            */

           fs.writeSync(fd, `${i}`)

           //callback version are lot faster 🚀
           /// fs.write(fd, `${i}`, () => {}) //➡️ output is unordered
        }        
    })


    
    console.timeEnd('writeMany')
})

```
> ⏳ 27:09


> ➡️ converting the string back to buffer and then we are gonna write that



















>- [x] Duplex (stream that has a writable and readable in it self)
>- [x] Transform

---

[^@2] 
[^@2]:Readable_Streams ➡️
####  Readable_Streams 
 ➡️

##### 

```

```
>- [x] CheckBox to Keep Status

---

[^@x] 
[^@x]:TopicName ➡️
####  TopicName 
 ➡️

##### 

```

```
>- [x] CheckBox to Keep Status




[^goToTop]: goToTop