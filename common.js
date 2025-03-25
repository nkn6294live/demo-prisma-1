// convert to ESModule
const { PrismaClient } = require('@prisma/client');
const { PrismaClientUnknownRequestError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError } = require('@prisma/client/runtime/library');
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

function processError(error) {
    if (error == null) {
        return
    }
    // let { name, cause, stack, message } = error || {}
    if (error instanceof PrismaClientKnownRequestError) {
        let { clientVersion, code, meta, message, name, cause, stack } = error
        // Code: 
        // [Common] P1000 -> P1017
        // [Client] P2000 -> P2037
        // [Migrate] P3000 -> P3022
        // [Pull] P4000 -> P4002
        // [Accelerate] P6000 -> P6010, P5011
    } else if (error instanceof PrismaClientUnknownRequestError) {
        let { clientVersion, message, name, cause, stack } = error
    } else if (error instanceof PrismaClientRustPanicError) {
        let { clientVersion, message, name, cause, stack } = error
    } else if (error instanceof PrismaClientInitializationError) {
        let { clientVersion, errorCode, message, name, cause, stack } = error
    } else if (error instanceof PrismaClientValidationError) {
        let { clientVersion, message, name, cause, stack } = error
    }
    else {
        // Other error
    }
}

module.exports = {
    db,
    log,
    disconnect,
    processError,
}