function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

async function delayedGreet(name) {
    await delay(2000)
    console.log(name);
}

delayedGreet("hiiiii")