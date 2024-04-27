// convert to ESModule
const { PrismaClient } = require('@prisma/client');
let prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

prisma.$on("query", e => {
    // console.log(`prisma:event.query: ${JSON.stringify(e)}`)
    // console.log(`prisma:event.query:query: ${e.query}`)
    console.log(`prisma:query:params: ${e.params}`)
    // console.log(`prisma:query:duration: ${e.duration}ms`)
});

const { QueueDataModel } = require('./queue_data_model')

async function main() {
    let queueDataModel = new QueueDataModel(prisma, prisma);
    try {
        // let result = await prisma.user.count({
        //     where: {
        //         id: {
        //             gt: 7,
        //         },
        //     },
        //     skip: 1, take: 10
        // })
        // console.log(result)
        // result = await prisma.user.findFirst({
        //     where: {
        //         id: 0
        //     }
        // })
        // console.log(result);
        let queueName = "testQueue1"
        await queueDataModel.enqueues(queueName, [{ value: 1 }, { value: 2 }])
        // await queueDataModel.clean(queueName)
        let length = await queueDataModel.length(queueName)
        console.log(length);
        let isEmpty = await queueDataModel.isEmpty(queueName);
        console.log(isEmpty)
    } catch (error) {
        console.warn(error?.message)
    }
}

main().then(data => {
    prisma.$disconnect()
    console.log(`disconnected: ${JSON.stringify(data)}`)
}).catch(error => {
    prisma.$disconnect();
    console.warn(`Error: ${error?.message}.`)
})