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
    // const datas = await prisma.user.createMany({
    //     data: [
    //         { name: 'Bob', email: 'bob@prisma.io' },
    //         { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
    //         { name: 'Yewande', email: 'yewande@prisma.io' },
    //         { name: 'Angelique', email: 'angelique@prisma.io' },
    //     ],
    //     skipDuplicates: true, // Skip 'Bobo'
    // })

    // const datas = await prisma.user.findMany({
    //     where: {
    //         name: {
    //             not: null
    //         },
    //         email: {
    //             contains: 'bob',
    //             startsWith: 'b',
    //         }
    //     },
    //     orderBy: [
    //         { id: 'asc'},
    //         { name: 'asc' },
    //         { email: 'desc' },
    //     ]
    // })

    // let user = await prisma.user.findUnique({ where: { id: 16 } })

    // let post = await prisma.post.create({
    //     data: {
    //         title: 'Post 1',
    //         author: {
    //             connect: user
    //         }
    //     }
    // })
    // let post = await prisma.post.findUnique({ where: { id: 1 } })

    // let category = await prisma.category.create({
    //     data: {
    //         name: 'Common'
    //     }
    // })
    // let category = await prisma.category.findUnique({ where: { id: 1 } })
    // post = await prisma.post.update({
    //     where: {
    //         id: post.id
    //     },
    //     data: {
    //         categories: {
    //             connect: [
    //                 { id: category.id }
    //             ]
    //         }
    //     }
    // })
    // let datas = post;

    // let tag = await prisma.tag.create({
    //     data: {
    //         name: 'C'
    //     }
    // });
    // let tag = await prisma.tag.findUnique({ where: { id: 1 } })
    // let datas = await prisma.post.update({
    //     where: {
    //         id: post.id
    //     },
    //     data: {
    //         tags: {
    //             // delete: {
    //             //     postId_tagId: {
    //             //         tagId: 1,
    //             //         postId: 1
    //             //     }
    //             // },
    //             // create: {
    //             //     tagId: 1
    //             // },
    //             connectOrCreate: {
    //                 where: {
    //                     postId_tagId: {
    //                         tagId: 1,
    //                         postId: 1
    //                     }
    //                 },
    //                 create: {
    //                     tagId: 1
    //                 }
    //             }
    //         }
    //     }
    // })
    let datas = null;

    // datas = await prisma.user.aggregate({
    //     _count: {
    //         id: true
    //     },
    //     _avg: {
    //         id: true
    //     }
    // })
    // datas = datas?._count.id
    // datas = await prisma.post.groupBy({
    //     by:['authorId'],
    //     _max: {
    //         id: true
    //     }
    // })


    const regexMapping = /^_prisma_mapping\((?<mapping>[-|.\w]+)\)$/ // '_prisma_mapping(|uId|uName|postId|title)' as _prismaMapping
    let processMappingItem = d => {
        let mappings = [];
        let mappingField = 'f0';
        if (typeof (d[mappingField]) === 'string') {
            let r = regexMapping.exec(d[mappingField])
            if (r != null) {
                mappings = r.groups['mapping'].split('|') || mappings;
                delete d[mappingField]
            }
        }
        mappings.forEach((fieldName, index) => {
            let ref = `f${index}`
            d[fieldName] = d[ref]
            delete d[ref]
        })
        return d;
    }
    let processMappingItemMidleware = d => {
        let mappings = [];
        let mappingField = 'f0';
        let { prisma__type, prisma__value } = d[mappingField] || {};
        if (prisma__type == null && prisma__value == null) {
            return d;
        }
        if (prisma__type === 'string') {
            let r = regexMapping.exec(prisma__value)
            if (r != null) {
                mappings = r.groups['mapping'].split('|') || mappings;
                delete d[mappingField]
            }
        }
        mappings.forEach((fieldName, index) => {
            let ref = `f${index}`
            if (ref != mappingField) {
                d[fieldName] = d[ref]
            }
            delete d[ref]
        })
        return d;
    }

    // prisma.$use(async (params, next) => {
    //     let result = await next(params);
    //     // console.log(`MIDDLEWARE: ${JSON.stringify(params)}`)
    //     if (params.model == undefined && params.action == 'queryRaw') {
    //         let firstArgs = params.args[0]?.[0];
    //         if (typeof (firstArgs) === 'string' && firstArgs.toLowerCase().startsWith('call ')) {
    //             if (Array.isArray(result)) {
    //                 result = result.map(d => processMappingItemMidleware(d));
    //             } else {
    //                 result = processMappingItemMidleware(result);
    //             }
    //         }
    //     }
    //     return result;
    // })

    prisma = prisma.$extends({
        query: {
            async $queryRaw({ query, args }) {
                if (args.strings.length > 0 && args.strings[0]?.toLowerCase()?.startsWith('call')) {
                    let result = await query(args);
                    return Array.isArray(result) ? result.map(d => processMappingItemMidleware(d)) : processMappingItemMidleware(result);
                }
                return query(args);
            }
        }
    })

    // datas = await prisma.user.findMany();
    // datas = await prisma.$queryRaw`SELECT u.*, p.id as postId, p.title FROM user u JOIN post p ON u.id = p.authorId`
    let pUID = 16;
    datas = await prisma.$queryRaw`call usp_test_2(${pUID})`
    return datas;

}




main().then(data => {
    prisma.$disconnect()
    console.log(`disconnected: ${JSON.stringify(data)}`)
}).catch(error => {
    prisma.$disconnect();
    console.warn(`Error: ${error?.message}.`)
})