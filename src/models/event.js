const { createModelClass } = require('@growsari/models')

const SCHEMA = {
    required: ["title", "name", "max_capacity"],
    properties: {
      title: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      organizer: {
        type: 'string'
      },
      address: {
        type: 'string'
      },
      max_capacity: {
        type: 'integer'
      },
      starting_seat_no: {
        type: 'integer'
      },
      ending_seat_no:{
         type: 'integer'
      },
      created_at: {
         type: 'Date'
      },
      updated_at:{
         type: 'Date'
      }
    }
}

const Event = createModelClass('Event', SCHEMA)

module.exports = {
    Event
}