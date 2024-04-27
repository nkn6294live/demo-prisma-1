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

async function main() {

    // let group = await prisma.group.upsert({
    //     where: {
    //         id: 1
    //     },
    //     update: {
    //         name: `Group 1`
    //     },
    //     create: {
    //         id: 1,
    //         name: "Group 1"
    //     },
    // })
    // console.log(JSON.stringify(group))

    // let user = await prisma.user.create({
    //     data: {
    //         name: `User ${Date.now()}`,
    //         UserGroup: {
    //             create: {
    //                 groupId: group.id
    //             }
    //         }
    //     },

    // })
    // console.log(JSON.stringify(user))

    try {
        let result = await prisma.user.count({
            where: {
                id: {
                    gte: 6
                }
            }
        })
        console.log(result)
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