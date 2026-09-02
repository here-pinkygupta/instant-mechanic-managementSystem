import type { RequestHandler } from "express";
import { createBooking,getBooking,listBookings,updateBooking,updateStatus } from "../services/booking.service";
import { createBookingSchema,statusSchema,updateBookingSchema } from "../validators/booking.validator";
import { listQuery } from "../validators/query.validator";
import { success,failure } from "../utils/apiResponse";
import { pagination,paginationResult } from "../utils/pagination";
import { Booking } from "../models/Booking";
import { io } from "../sockets/io";


export const list:RequestHandler=async(req,res)=>
    {  
        const q=listQuery.parse(req.query);
        const p=pagination(q.page,q.limit);
        const r=await listBookings({...q,...p});
        return res.status(200).
        json(
            {
                success:true,
                data:r.data,
                message:"Bookings retrieved successfully",
                pagination:paginationResult(p.page,p.limit,r.total)
            })};



export const detail: RequestHandler = async (req, res) => {
  const id = String(req.params.id);

  const b = await getBooking(id);

  if (!b) {
    return failure(
      res,
      "BOOKING_NOT_FOUND",
      "Booking not found",
      404
    );
  }

  return success(res, b, "Booking retrieved successfully");
};


export const create:RequestHandler=async(req,res)=>
    {
        const i=createBookingSchema.parse(req.body);

        const b=await createBooking(i,req.user!.id,(e,d)=>io?.emit(e,d));
        return success(res,b,"Booking created successfully",201)
    };


export const update: RequestHandler = async (req, res) => {
  const id = String(req.params.id);
  const i = updateBookingSchema.parse(req.body);

  const b = await updateBooking(
    id,
    i,
    req.user!.id,
    (e, d) => io?.emit(e, d)
  );

  return success(res, b, "Booking updated successfully");
};
export const status: RequestHandler = async (req, res) => {
  const id = String(req.params.id);
  const i = statusSchema.parse(req.body);

  const b = await updateStatus(
    id,
    i.status,
    req.user!.id,
    (e, d) => io?.emit(e, d)
  );

  return success(res, b, "Booking status updated successfully");
};


export const remove: RequestHandler = async (req, res) => {
  const id = String(req.params.id);

  const b = await getBooking(id);

  if (!b) {
    return failure(
      res,
      "BOOKING_NOT_FOUND",
      "Booking not found",
      404
    );
  }

  if (b.status !== "CANCELLED") {
    return failure(
      res,
      "INVALID_DELETE",
      "Only cancelled bookings can be deleted",
      409
    );
  }

  await Booking.deleteOne({ _id: id });

  return success(res, null, "Booking deleted successfully");
};