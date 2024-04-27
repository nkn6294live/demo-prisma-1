function enqueue(queueName, value) {
    console.log(`queueName: ${queueName} : value : ${value}`)
}

let e = enqueue.bind({}, "queueName1")
e("1", "2");