let myfunc=(res,rej)=>{
    setTimeout(() => {
        console.log("hello")
        res("first")
        rej("htis is rej")
        
    }, 2000);
}
const prom=new Promise(myfunc)
prom.then((values)=>{console.log("this the passed data ",values)}).catch((err)=>{console.log("errror occured!")})
// async function a(){
//     await prom
// }
console.log("this should occur first!")
