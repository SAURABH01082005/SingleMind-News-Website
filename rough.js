myfunc()
async function myfunc(){
    k=await fetch("./keywords.json").catch(err=>{console.log("there is error in fetching keywords.json file , error is :",err)})
    data=await k.json()
    console.log("the json file  is : ",data)
}