const { Event } = require('../models/event')
const { Seat } = require('../models/seat')

async function create(params){
   const { max_capacity, starting_seat_no, ending_seat_no } = params
   if(ending_seat_no-starting_seat_no+1 !== max_capacity){
      throw new Error("seating numbers does not match with max_capacity")
   }
   const event = await Event.create(params);
   for(let i=starting_seat_no; i<=ending_seat_no;i++){
      const booking = {
        seat_no: i,
        event_id: event.id,
      }
      await Seat.create(booking)
   }
   return {
     status: "success",
     message: "Event created successfully"
   }
}

async function update(params){
   const record = await Event.params(params);
   return {
     status: "success",
     message: "successfully updated",
     data: {
        event: record
     }
   }
}

module.exports = {
    create,
    update
}