import mongoose from "mongoose";
import { Booking, type BookingStatus } from "../models/Booking";
import { Customer } from "../models/Customer";
import { Mechanic } from "../models/Mechanic";
import { Service } from "../models/Service";
import { Notification } from "../models/Notification";
import { AuditLog } from "../models/AuditLog";

export const transitions:Record<BookingStatus,BookingStatus[]> = {
 PENDING:["ASSIGNED","CANCELLED"], ASSIGNED:["MECHANIC_ON_THE_WAY","CANCELLED"],
 MECHANIC_ON_THE_WAY:["IN_PROGRESS","CANCELLED"], IN_PROGRESS:["COMPLETED","CANCELLED"],
 COMPLETED:[], CANCELLED:[]
};


function id(prefix:string,n:number){
    return `${prefix}-${String(n).padStart(5,"0")}`
    ;}


export async function createBooking(input:any,userId:string,emit?:(event:string,data:any)=>void){


 const customer=await Customer.findById(input.customerId);
 
 const service=await Service.findById(input.serviceId);

 if(!customer) 
    throw Object.assign(new Error("Customer not found"),{status:404,code:"CUSTOMER_NOT_FOUND"});


 if(!service || !service.isActive) 
    throw Object.assign(new Error("Service not found or inactive"),{status:404,code:"SERVICE_NOT_FOUND"});


 let mechanic=null;


 if(input.mechanicId){
    mechanic=await Mechanic.findById(input.mechanicId);

    if(!mechanic) throw Object.assign(new Error("Mechanic not found"),{status:404,code:"MECHANIC_NOT_FOUND"});
}
 const count=await Booking.estimatedDocumentCount();


 const booking=await Booking.create({
  bookingId:id("BK",100000+count+1),
  
  customer:customer._id,service:service._id,mechanic:mechanic?._id??null,

  status:mechanic?"ASSIGNED":"PENDING",amount:input.amount??service.basePrice,scheduledAt:input.scheduledAt,

  vehicle:{...input.vehicle,registrationNumber:input.vehicle.registrationNumber.toUpperCase()},pickupAddress:input.pickupAddress,

  location:input.location,notes:input.notes??""
 });
 if(mechanic){
    await Mechanic.findByIdAndUpdate(mechanic._id,{status:"BUSY",currentBooking:booking._id});
}
 await Customer.findByIdAndUpdate(customer._id,{$inc:{totalBookings:1}});

 await Notification.create({type:"BOOKING_CREATED",title:"New booking created",

    message:`Booking ${booking.bookingId} has been created.`,booking:booking._id});


 await AuditLog.create({user:userId,action:"BOOKING_CREATED",entity:"Booking",
    entityId:String(booking._id),metadata:{bookingId:booking.bookingId}});


 const populated=await getBooking(String(booking._id));


 emit?.("booking:updated",populated); emit?.("dashboard:updated",{reason:"booking_created"});
 return populated;
}
export async function getBooking(idOrBookingId:string){


 const q=mongoose.isValidObjectId(idOrBookingId)?{_id:idOrBookingId}:{bookingId:idOrBookingId};


 return Booking.findOne(q).
 select("-__v").
 populate("customer","customerId name email phone city").
 populate("service","name category basePrice estimatedDuration").
 populate("mechanic","mechanicId name status rating specializations location").
 lean();


}
export async function listBookings(q:any){
 const filter:any={};
 if(q.status) filter.status=q.status;
 
 if(q.mechanic)
     filter.mechanic=q.mechanic; 
    
 if(q.service) filter.service=q.service;


 if(q.dateFrom||q.dateTo){filter.scheduledAt={}; 
 
 if(q.dateFrom)filter.scheduledAt.$gte=q.dateFrom; if(q.dateTo)filter.scheduledAt.$lte=q.dateTo;}
 

 if (q.search) {
  const rx = new RegExp(
    q.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i"
  );

  const [customers, mechanics] = await Promise.all([
    Customer.find({
      $or: [
        { name: rx },
        { email: rx },
        { phone: rx }
      ]
    })
      .select("_id")
      .lean(),

    Mechanic.find({
      $or: [
        { name: rx },
        { email: rx },
        { phone: rx }
      ]
    })
      .select("_id")
      .lean()
  ]);

  filter.$or = [
    { bookingId: rx },
    { "vehicle.registrationNumber": rx },
    { customer: { $in: customers.map((x) => x._id) } },
    { mechanic: { $in: mechanics.map((x) => x._id) } }
  ];
}


 const sortAllowed=new Set(["scheduledAt","createdAt","amount","status","bookingId"]); 
 
 const sortBy=sortAllowed.has(q.sortBy)?q.sortBy:"scheduledAt"; const sort:{[key:string]:1|-1}={[sortBy]:q.sortOrder==="asc"?1:-1};


 const [data,total]=await Promise.all([


  Booking.find(filter)
  .sort(sort).skip(q.skip)
  .limit(q.limit).select("-__v")
  .populate("customer","customerId name email").
  populate("service","name category").
  populate("mechanic","mechanicId name status").
  lean(), Booking.countDocuments(filter)
 ]);


 return {data,total};
}
export async function updateBooking(id:string,input:any,userId:string,emit?:(event:string,data:any)=>void){
 const booking=await Booking.findById(id); 
 
 
 if(!booking) 
    
    throw Object.assign(new Error("Booking not found"),{status:404,code:"BOOKING_NOT_FOUND"});


 if(input.mechanicId!==undefined){


  const m=input.mechanicId?await Mechanic.findById(input.mechanicId):null;


  if(input.mechanicId && !m) throw Object.assign(new Error("Mechanic not found"),{status:404,code:"MECHANIC_NOT_FOUND"});


  booking.mechanic=m?._id??null; 
  
  if(m){m.status="BUSY";m.currentBooking=booking._id;await m.save();}
 }
 Object.assign(booking,
    {...(input.scheduledAt?{scheduledAt:input.scheduledAt}:
        {}),...(input.amount!==undefined?{amount:input.amount}:{}

        ),...(input.pickupAddress?{pickupAddress:input.pickupAddress}:{}

        ),...(input.notes!==undefined?{notes:input.notes}: {})});


 await booking.save(); const result=await getBooking(id);


 await AuditLog.create({user:userId,action:"BOOKING_UPDATED",entity:"Booking",entityId:id,metadata:{fields:Object.keys(input)}});


 emit?.("booking:updated",result); return result;
}
export async function updateStatus(id:string,status:BookingStatus,userId:string,emit?:(event:string,data:any)=>void){


 const session=await mongoose.startSession(); session.startTransaction();
 try{
  const booking=await Booking.findById(id)
  .session(session); 
  
  
  if(!booking)
    
    throw Object.assign(new Error("Booking not found"),{status:404,code:"BOOKING_NOT_FOUND"});


  if(!transitions[booking.status].includes(status))
     throw Object.assign(new Error(`Invalid status transition: ${booking.status} -> ${status}`),{status:422,code:"INVALID_STATUS_TRANSITION"});


  const now=new Date(); booking.status=status;
  if(status==="IN_PROGRESS") booking.startedAt=now;
  if(status==="COMPLETED") booking.completedAt=now;
  if(status==="CANCELLED") booking.cancelledAt=now;


  await booking.save({session});

  if(booking.mechanic){
   if(status==="COMPLETED"||status==="CANCELLED") 
    await Mechanic.findByIdAndUpdate(booking.mechanic,{status:"AVAILABLE",currentBooking:null,lastBooking:booking._id,...(status==="COMPLETED"?{$inc:{jobsCompleted:1}}:{})},{session});


   else if(status==="MECHANIC_ON_THE_WAY") await Mechanic.findByIdAndUpdate(booking.mechanic,{status:"ON_THE_WAY"},{session});


   else if(status==="IN_PROGRESS") await Mechanic.findByIdAndUpdate(booking.mechanic,{status:"BUSY"},{session});
  }


  if(status==="COMPLETED") await Customer.findByIdAndUpdate(booking.customer,{$inc:{totalSpent:booking.amount}},{session});


  const type=status==="COMPLETED"?"BOOKING_COMPLETED":status==="CANCELLED"?"BOOKING_CANCELLED":status==="MECHANIC_ON_THE_WAY"?"MECHANIC_ON_THE_WAY":"BOOKING_ASSIGNED";


  await Notification.create([{type,title:`Booking ${status.replaceAll("_"," ").toLowerCase()}`
    ,message:`${booking.bookingId} is now ${status.replaceAll("_"," ").toLowerCase()}.`,booking:booking._id}],{session});


  await AuditLog.create([{user:userId,action:"BOOKING_STATUS_CHANGED",entity:"Booking",entityId:id,metadata:{from:transitions,status}}],{session});


  await session.commitTransaction();


  const result=await getBooking(id); 
  emit?.("booking:updated",result); 
  emit?.("dashboard:updated",{reason:"booking_status_changed"});
   emit?.("notification:new",await Notification.findOne({booking:booking._id})
   .sort({createdAt:-1}).lean()); 
   
   
   if(booking.mechanic)
    
    
    emit?.("mechanic:updated",{mechanicId:String(booking.mechanic),status});
  return result;
 }catch(e){await session.abortTransaction();throw e}finally{await session.endSession();}
}
