const { db, log, disconnect, processError } = require('./common')

async function main() {
    await (async () => {
        let data = await db.user.findRaw
    })()
    // let currentId
    // await (async () => {
    //     let userModel = { name: Date.now().toString(16) }
    //     let data = await db.user.create({
    //         data: {
    //             name: userModel.name
    //         }
    //     })
    //     currentId = data.id
    //     console.log(JSON.stringify(data))
    // })()

    // await (async () => {
    //     // currentId = 100
    //     let data = await db.user.update({
    //         where: {
    //             id: currentId || 0
    //         },
    //         data: {
    //             count: {
    //                 increment: 1
    //             }
    //         }
    //     })
    //     console.log(JSON.stringify(data))
    // })()

    // await (async () => {
    //     let currentId = 10
    //     let data = await db.user.delete({
    //         where: {
    //             id: currentId || 0,
    //         },
    //     })
    //     console.log(JSON.stringify(data))
    // })()

    // await (async () => {
    // let data = await db.user.findFirst({ take: -1 })
    // let data = await Promise.all([0].map(item => db.user.upsert({
    //     where: {
    //         id: 23
    //     },
    //     create: {
    //         id: 23,
    //         name: Date.now().toString(16)
    //     },
    //     update: {
    //         count: {
    //             increment: 1
    //         }
    //     }
    // })))
    // let data
    // try {
    //     data = await db.user.create({ data: { id: 23, name: Date.now.toString(16) } })
    // } catch (error) {
    //     processError(error)
    //     console.error(`error: ${error?.message}`)
    //     data = error?.message
    // }
    // console.log(`${JSON.stringify(data)}`)
    // })()

    // await db.$transaction(async (tx) => {
    //     await tx.user.update({
    //         where: { id: 1 },
    //         data: {
    //             count: { increment: 1 }
    //         }
    //     })
    //     await tx.user.findUnique({ where: { id: 120 } })
    // })

    // await (async () => {
    //     let currentId = 120

    //     await db.user.update({
    //         where: {
    //             id: 12
    //         },
    //         data: {
    //             count: {
    //                 increment: 1
    //             }
    //         }
    //     })
    //     let data = await db.user.findUniqueOrThrow({
    //         where: {
    //             id: currentId || 0,
    //         },
    //         select: {
    //             id: true,
    //             // count: true,
    //             // name: true,
    //         }
    //     })
    //     console.log(JSON.stringify(data))
    // })()

    // await (async () => {
    //     let data = await db.user.findMany({})
    //     console.log(JSON.stringify(data))
    // })()

}


main().then(async data => {
    disconnect().catch(error => { log(error?.message, 'error') })
    log(`disconnected: ${JSON.stringify(data)}`)
}).catch(error => {
    disconnect().catch(error => { log(error?.message, 'error') });
    log(`Error: ${error?.message}`, 'warn')
})