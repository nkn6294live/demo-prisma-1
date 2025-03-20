// convert to ESModule
const { PrismaClient } = require('@prisma/client');
let db = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

function log(content, level = 'info') {
    console.log(`[${level}] ${content}`)
}

db.$on("query", e => {
    // log(`prisma:event.query: ${JSON.stringify(e)}`)
    // log(`prisma:event.query:query: ${e.query}`)
    log(`prisma:query:params: ${e.params}`)
    // log(`prisma:query:duration: ${e.duration}ms`)
});

async function disconnect() {
    return db.$disconnect()
}

module.exports = {
    db,
    log,
    disconnect,
}