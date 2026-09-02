import { Booking } from "../models/Booking";
import { Mechanic } from "../models/Mechanic";
import { Customer } from "../models/Customer";
export async function dashboard(range:"7d"|"30d"|"90d"="30d"){



 const days=Number(range.replace("d","")); const from=new Date(Date.now()-days*86400000);


 const [summary,status,service,recent,active,overTime,revenue]=await Promise.all([



  Booking.aggregate([{ $facet:{


   totalBookings:[{$count:"v"}], periodBookings:[{$match:{createdAt:{$gte:from}}},{$count:"v"}],



   completedBookings:[{$match:{status:"COMPLETED"}},{$count:"v"}],pendingBookings:[{$match:{status:"PENDING"}},{$count:"v"}],


   cancelledBookings:[{$match:{status:"CANCELLED"}},{$count:"v"}], revenue:[{$match:{status:"COMPLETED"}},{$group:{_id:null,v:{$sum:"$amount"}}}],

   
 todayBookings: [
  {
    $match: {
      scheduledAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(24, 0, 0, 0))
      }
    }
  },
  {
    $count: "v"
  }
]
  }}]),


  Booking.aggregate([{$match:{createdAt:{$gte:from}}},{$group:{_id:"$status",count:{$sum:1}}},{$sort:{count:-1}}]),


  Booking.aggregate([{$match:{createdAt:{$gte:from}}},
    {$lookup:{from:"services",localField:"service",foreignField:"_id",as:"s"}},
    {$unwind:"$s"},{$group:{_id:"$s.name",count:{$sum:1},revenue:{$sum:"$amount"}}},
    {$sort:{count:-1}}]),



  Booking.find().sort({createdAt:-1}).
  limit(10).select("bookingId status amount scheduledAt vehicle customer mechanic").
  populate("customer","name").populate("mechanic","name").lean(),



  Mechanic.find({status:{$in:["AVAILABLE","BUSY","ON_THE_WAY"]}}).
  sort({updatedAt:-1}).limit(20).select("mechanicId name status rating location currentBooking").lean(),



  Booking.aggregate
  ([{$match:{createdAt:{$gte:from}}},
    {$group:{_id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
    count:{$sum:1}}},{$sort:{_id:1}}]),



  Booking.aggregate
  ([{$match:{createdAt:{$gte:from},
    status:"COMPLETED"}},{$group:
        {_id:{$dateToString:{format:"%Y-%m-%d",date:"$createdAt"}},
        revenue:{$sum:"$amount"}}},{$sort:{_id:1}}])
 ]);



 const s=summary[0]??{}; const val=(x:any,k:string)=>x[k]?.[0]?.v??0;


 const newCustomers=await Customer.countDocuments({createdAt:{$gte:from}});


 return {summary:{totalBookings:val(s,"totalBookings")
    ,todayBookings:val(s,"todayBookings"),completedBookings:val(s,"completedBookings")
    ,pendingBookings:val(s,"pendingBookings"),cancelledBookings:val(s,"cancelledBookings"

    ),totalRevenue:val(s,"revenue"),
    activeMechanics:await Mechanic.countDocuments({status:{$in:["AVAILABLE","BUSY","ON_THE_WAY"]}}),
    newCustomers},bookingsOverTime:overTime,revenueOverTime:revenue,bookingStatusBreakdown:status,
    serviceBreakdown:service,recentBookings:recent,activeMechanics:active};

    
}
