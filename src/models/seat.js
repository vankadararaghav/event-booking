const { createModelClass } = require('@growsari/models')

const schema = {
    required: [],
    properties: {
       seat_no: {
          type: 'integer'
       },
       user_id: {
          type: 'string'
       },
       event_id: {
          type: 'string'
       },
       status: {
          type: 'string',
          enum: ["PENDING", "BOOKED"],
          default: "PENDING"
       },
       created_at: {
         type: 'Date'
       },
       updated_at: {
          type: 'Date'
       }
    }
}

const Seat = createModelClass('Mission', SCHEMA)

module.exports = {
    Seat
}