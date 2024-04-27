const QueueValueType = {
    _name: 'QueueValueType',
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    OBJECT: 'object',

    OTHER: 'other',

    LIST: 'list',
    HASH: 'hash',
    SET: 'set',
}

const SourceType = {
    _name: 'SourceType',
    SYSTEM: 0,
    USER: 1,
    CLIENT: 2,
    DEVICE: 3,
}

const QueueDataStatus = {
    _name: 'QueueDataStatus',
    ACTIVE: 0,
    IN_ACTIVE: 1,
    DEQUEUE: 2,
}

class QueueDataModel {
    constructor(dbRW, dbRO) {
        this.cName = "QueueDataModel"
        this.dbRW = dbRW;
        this.dbRO = dbRO || this.dbRW

        this.modelRW = this.dbRW?.queueDataModel
        this.modelRO = this.dbRO?.queueDataModel || this.modelRW

        // Lock, insert/remove by batch on localable/single thread service (redis)
    }

    async enqueue(queueName, itemModel, ignoreError = true) {
        if (!this.verifyQueueName(queueName)) {
            if (!ignoreError) {
                throw new Error(`queueName invalid`)
            }
            return null;
        }
        try {
            let { value, valueType = QueueValueType.OBJECT, sourceId, sourceType = SourceType.SYSTEM, sourceInfo } = itemModel || {}
            // sourceType = SourceType.parse?.(sourceType) || sourceType
            value = JSON.parse(JSON.stringify(value));
            let data = await this.modelRW?.create({
                data: {
                    name: queueName,
                    value, valueType,
                    sourceId, sourceType, sourceInfo,
                }
            })
            return data;
        } catch (error) {
            this.log(`enqueue:error:${error?.message}`, true)
            if (!ignoreError) {
                throw error
            }
            return null
        }
    }

    async enqueues(queueName, itemModels, ignoreError = true) {
        if (!this.verifyQueueName(queueName)) {
            if (!ignoreError) {
                throw new Error(`queueName invalid`)
            }
            return null;
        }
        try {
            if (itemModels == null) {
                throw new Error(`Input invalid: null`)
            }
            if (!Array.isArray(itemModels)) {
                itemModels = [itemModels]
            }
            itemModels = itemModels.filter(item => item != null).map(itemModel => {
                let { value, valueType = QueueValueType.OBJECT, sourceId, sourceType = SourceType.SYSTEM, sourceInfo } = itemModel || {}
                // sourceType = SourceType.parse?.(sourceType) || sourceType
                value = JSON.parse(JSON.stringify(value));
                return { name: queueName, value, valueType, sourceId, sourceType, sourceInfo }
            })
            if (itemModels.length > 0) {
                return await this.modelRW?.createMany?.({ data: itemModels })
            }
            return []
        } catch (error) {
            this.log(`enqueues:error:${error?.message}`, true)
            if (!ignoreError) {
                throw error
            }
            return null
        }
    }

    async dequeue(queueName, ignoreError = true) {
        let datas = await this.dequeues(queueName, 1, ignoreError);
        if (datas.length > 0) {
            return datas[0]
        }
        return null;
    }

    async dequeues(queueName, count = 1, ignoreError = true) {
        if (!this.verifyQueueName(queueName)) {
            if (!ignoreError) {
                throw new Error(`queueName invalid`)
            }
            return null;
        }
        if (count <= 0) {
            return null;
        }
        try {
            return await this.dbRW?.$transaction?.(async (client) => {
                let queryId = Date.now();
                await client.$executeRaw`
                    UPDATE queuedatamodel q JOIN 
                    (
                        SELECT q.id FROM queuedatamodel q 
                        WHERE q.name = ${queueName} AND q.status = ${QueueDataStatus.ACTIVE}
                        ORDER BY q.id ASC
                        LIMIT ${count} OFFSET 0
                    ) dataGet ON q.id = dataGet.id
                    SET 
                        q.status = ${QueueDataStatus.DEQUEUE},
                        q.queryId = ${queryId}
                `
                let whereQuery = {
                    status: QueueDataStatus.DEQUEUE,
                    queryId: queryId
                }
                let datas = await client?.queueDataModel?.findMany?.({ where: whereQuery })
                if (datas?.length > 0) {
                    await client?.queueDataModel?.deleteMany?.({ where: whereQuery })
                }
                return datas
            })
        } catch (error) {
            this.log(`dequeues:error:${error?.message}`, true)
            if (!ignoreError) {
                throw error
            }
            return null
        }
    }

    async peek(queueName, ignoreError = true) {
        if (!this.verifyQueueName(queueName)) {
            if (!ignoreError) {
                throw new Error(`queueName invalid`)
            }
            return null;
        }
        try {
            return await this.modelRO?.findFirst?.({
                where: { name: "", status: QueueDataStatus.ACTIVE },
                orderBy: { id: 'asc' },
            })
        } catch (error) {
            this.log(`peek:error:${error?.message}`, true)
            if (!ignoreError) {
                throw error
            }
            return null
        }
    }

    async length(queueName, ignoreError = true) {
        if (!this.verifyQueueName(queueName)) {
            return null;
        }
        try {
            return (await this.modelRO?.count?.({
                where: { name: queueName, status: QueueDataStatus.ACTIVE }
            })) || 0;
        } catch (error) {
            this.log(`length:error:${error?.message}`, true)
            if (!ignoreError) {
                throw error
            }
            return 0;
        }
    }

    async isEmpty(queueName, ignoreError = true) {
        return (await this.length(queueName, ignoreError)) == 0;
    }

    async clean(queueName, ignoreError = true) {
        if (!this.verifyQueueName(queueName)) {
            if (!ignoreError) {
                throw new Error(`queueName invalid`)
            }
            return 0;
        }
        try {
            return (
                await this.modelRW?.deleteMany?.({
                    where: { name: queueName }
                })
            )?.count || 0
        } catch (error) {
            this.log(`clean:error:${error?.message}`, true)
            if (!ignoreError) {
                throw error
            }
            return 0;
        }
    }

    verifyQueueName(queueName) {
        return typeof (queueName) === 'string' && !!queueName
    }

    log(content, isError = false) {
        if (isError) {
            console.error(`${this.cName} ${content}`)
        } else {
            console.log(`${this.cName} ${content}`)
        }
    }
}

// const _default = new QueueDataModel(db, dbRO)

module.exports = {
    QueueValueType,

    QueueDataModel,
    // _default,
}
