// controllers/complaintController.ts
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Complaint from "../models/Complaint";
import { handleError } from "../utils/errorHandler";
import Event from "../models/Event";

// إنشاء شكوى جديدة (Users فقط)
export const createComplaint = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string };
    const { event, message } = req.body;

    if (!message) {
      res.status(400).json({ message: "Message is required" });
      return;
    }
    const existingEvent = await Event.findById(event);
    if (!existingEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const complaint = new Complaint({
      user: user.userId,
      event,
      message,
      status: "pending",
    });

    await complaint.save();

    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (error) {
    handleError(res, error, "Failed to create complaint");
  }
};

// جلب شكاوى المستخدم (Users فقط)
export const getUserComplaints = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as JwtPayload & { userId: string };
    const complaints = await Complaint.find({ user: user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(complaints);
  } catch (error) {
    handleError(res, error, "Failed to get user complaints");
  }
};

// جلب كل الشكاوى (Admins فقط)
export const getAllComplaints = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "email name")
      .populate({
        path: "event",
        select: "title date category",
        populate: {
          path: "category",
          select: "name",
        },
      })

      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    handleError(res, error, "Failed to get all complaints");
  }
};

// الرد على شكوى (Admins فقط)
export const respondToComplaint = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { complaintId } = req.params;
    const { responseMessage, status } = req.body;

    if (!responseMessage || !status) {
      res
        .status(400)
        .json({ message: "Response message and status are required" });
      return;
    }

    // تحديث الشكوى مع الرد والحالة الجديدة
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { responseMessage, status },
      { new: true }
    );

    if (!complaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    res.status(200).json({ message: "Complaint responded", complaint });
  } catch (error) {
    handleError(res, error, "Failed to respond to complaint");
  }
};
