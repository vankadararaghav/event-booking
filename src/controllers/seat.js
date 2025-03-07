const { raceConditionUpdate, getByIdOrFail } = require('../lib/race-condition-update')

async function booking(params){
   const seat = await getByIdOrFail(params.id);
   if(seat.status === 'BOOKED'){
    throw new Error('seat is already booked')
   }
   try{
      seat.user_id = params.user_id
      seat.status = "BOOKED"
      const item = raceConditionUpdate(params.id, seat)
      return {
        success: true,
        message: "seat is booked successfully",
        data: {
           item
        }
      }
   }
   catch(e){
      if(e.message === 'The conditional request failed'){
        return {
          status: false,
          message: 'This seat is already booked'
        }
      }

   }
}

module.exports = {
    booking
}