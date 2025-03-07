const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb')
const chunk = require('lodash.chunk')

const {
    IS_OFFLINE,
    STAGE,
    DYNAMODB_ENDPOINT,
    TABLE_NAME
  } = process.env
  
const client = new DynamoDBClient({
    ...(IS_OFFLINE === 'true' && STAGE === 'local' && {
      region: 'local',
      endpoint: DYNAMODB_ENDPOINT || 'http://localhost:8000',
      accessKeyId: 'local',
      secretAccessKey: 'local'
  })
})

const documentClient = DynamoDBDocument.from(client, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true
  }
})

async function raceConditionUpdate(id, data) {
    const now = new Date().toISOString()
    const oldItem = await getByIdOrFail(id)
    const newItem = {
      ...oldItem,
      ...data,
      updated_at: now
    }
    conditionExpression = `updated_at = :${now.updated_at}`

    const putitem = putItem(TABLE_NAME, newItem, conditionExpression)
    await transactWrite([
      putitem
    ])

    return newItem
}

async function transactWrite(items) {
    const chunks = chunk(items, 10)
    for (const transactItems of chunks) {
      await documentClient.transactWrite({ TransactItems: transactItems })
    }
}


function putItem(table, data, conditionExpression = null) {

    const item = {
      Put: {
        TableName: table,
        Item: data
      }
    }
  
    if (conditionExpression) {   // here is the point, updating with checking last updated_at to handle concurrency 
      item.Put.ConditionExpression = conditionExpression
    }
  
    return item
}

function getItem(table, primary, secondary) {
    return { Get: { TableName: table, Key: { primary, secondary } } }
}

async function getByIdOrFail(id) {
    const params = getItem(TABLE_NAME, `${'Seat'}#${id}`, 'Seat')
    const result = await documentClient.get(params.Get)
    if (!result.Item) {
      throw new Error(`Item not found for  entity, result`)
    }
    return result.Item
}

module.exports = {
  raceConditionUpdate,
  getByIdOrFail
}