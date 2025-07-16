

function delay(time){
    return new Promise((resolve)=>setTimeout(resolve, time))
}
console.log("promise lecture")

delay(3200).then(()=>console.log("after 3 sec"))
console.log("end");


function divide(num1, num2){
    return new Promise((resolve, reject)=>{
        if(num2===0){
            reject("cannot divide")
        }else(
            resolve(num1/num2)
        )
    })
}


divide(5, 0).then(result=>console.log(result)).catch(err=>console.log(err))
