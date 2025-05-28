
import Event from '../models/Event';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

import { Request, Response } from 'express';

import { uploadImageToBunny } from '../middleware/uploadMiddleware';

import axios from "axios";


 export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, location, price, capacity, category } = req.body;
    const organizer = (req as any).user?.userId;

    if (!title || !date || !category) {
      res.status(400).json({ message: "الرجاء ملء الحقول المطلوبة (العنوان، التاريخ، الفئة)" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "معرف الفئة (category) غير صالح" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(organizer)) {
      res.status(400).json({ message: "معرف المنظم (organizer) غير صالح" });
      return;
    }

    let imageUrl = "";

     if (req.file) {
      try {
        console.log("⏳ Starting image upload...");
        imageUrl = await uploadImageToBunny(req.file);
        console.log("🖼️ Image uploaded successfully:", imageUrl);
      } catch (uploadError: any) {
        console.error("❌ فشل رفع الصورة إلى BunnyCDN:", uploadError.message);
        res.status(500).json({ message: "فشل رفع الصورة إلى BunnyCDN", error: uploadError.message });
        return;
      }
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      price,
      capacity,
      category,
      organizer,
      image: imageUrl,
    });

    await newEvent.save();

    res.status(201).json({ message: "تم إنشاء الحدث بنجاح", event: newEvent });
  } catch (error: any) {
    console.error("❌ خطأ أثناء إنشاء الحدث:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الحدث", error: error.message });
  }
};


 // تأكد من أنك استوردته في الأعلى

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: 'Invalid Event ID' });
      return;
    }

    const event = await Event.findById(eventId).populate('organizer', 'name email');

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};




export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      location,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const filters: any = {};

    if (search && typeof search === 'string') {
      filters.title = { $regex: search, $options: 'i' };
    }

    if (category && typeof category === 'string' && mongoose.Types.ObjectId.isValid(category)) {
  filters.category = category;
}


    if (location && typeof location === 'string') {
      filters.location = { $regex: location, $options: 'i' };
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const sort: any = {
      [sortBy as string]: order === 'asc' ? 1 : -1,
    };

    const totalEvents = await Event.countDocuments(filters);

    const events = await Event.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate('organizer', 'name email')
      .populate('category', 'name');

    res.status(200).json({
      total: totalEvents,
      page: pageNumber,
      limit: pageSize,
      events,
    });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getEventWithBookings = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { userId: string; role: string };

  if (!user || !user.userId || !user.role) {
     res.status(401).json({ message: 'Unauthorized' });
      return
  }

  const { userId, role } = user;
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId)
      .populate('organizer', 'name email _id')
      .populate({
        path: 'bookings',
        populate: { path: 'user', select: 'name email' }
      });

    if (!event) {
       res.status(404).json({ message: 'Event not found' });
       return
    }

    if (role !== 'organizer' || event.organizer._id.toString() !== userId) {
       res.status(403).json({ message: 'Access denied: insufficient role' });
       return
       
    }

     res.status(200).json({ event });
     return
       
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'Server error' });
     return
  }
};


export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, price, capacity, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ message: "معرف الحدث غير صالح" });
      return;
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
       res.status(400).json({ message: "معرف الفئة غير صالح" });

    }

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
       res.status(404).json({ message: "الحدث غير موجود" });
      return;
    }

    let imageUrl = existingEvent.image;

    if (req.file) {
      // ✅ حذف الصورة القديمة من BunnyCDN إذا كانت موجودة
      if (existingEvent.image && existingEvent.image.startsWith(process.env.BUNNY_CDN_BASE_URL!)) {
        const oldFilePath = existingEvent.image.replace(`${process.env.BUNNY_CDN_BASE_URL}/`, '');
        try {
          await axios.delete(
            `https://${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_NAME}/${oldFilePath}`,
            {
              headers: {
                AccessKey: process.env.BUNNY_STORAGE_PASSWORD!,
              },
            }
          );
          console.log("✅ تم حذف الصورة القديمة من BunnyCDN");
        } catch (deleteErr: any) {
          console.warn("⚠️ لم يتم حذف الصورة القديمة من BunnyCDN:", deleteErr.message);
        }
      }

      // ✅ رفع الصورة الجديدة
      const file = req.file;
      const filePath = `events/${Date.now()}-${file.originalname}`;
      const uploadUrl = `https://${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_NAME}/${filePath}`;

      await axios.put(uploadUrl, file.buffer, {
        headers: {
          AccessKey: process.env.BUNNY_STORAGE_PASSWORD!,
          "Content-Type": file.mimetype,
        },
      });

      imageUrl = `${process.env.BUNNY_CDN_BASE_URL}/${filePath}`;
    }

    // ✅ تحديث الحقول
    existingEvent.title = title || existingEvent.title;
    existingEvent.description = description || existingEvent.description;
    existingEvent.date = date || existingEvent.date;
    existingEvent.location = location || existingEvent.location;
    existingEvent.price = price ?? existingEvent.price;
    existingEvent.capacity = capacity ?? existingEvent.capacity;
    existingEvent.category = category || existingEvent.category;
    existingEvent.image = imageUrl;

    await existingEvent.save();

    res.status(200).json({ message: "تم تحديث الحدث بنجاح", event: existingEvent });
  } catch (error: any) {
    console.error("❌ خطأ أثناء تحديث الحدث:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث الحدث", error: error.message });
  }
};



export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload & { userId: string; role: string };
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: 'معرف الحدث غير صالح' });
    return;
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'الحدث غير موجود' });
      return;
    }

    if (user.role !== 'organizer' || event.organizer.toString() !== user.userId) {
      res.status(403).json({ message: 'غير مصرح لك بحذف هذا الحدث' });
      return;
    }

    if (event.bookings && event.bookings.length > 0) {
      res.status(400).json({ message: 'لا يمكن حذف حدث يحتوي على حجوزات' });
      return;
    }

    // ✅ حذف صورة الحدث من BunnyCDN إذا كانت موجودة
    if (event.image && event.image.startsWith(process.env.BUNNY_CDN_BASE_URL!)) {
      const filePath = event.image.replace(`${process.env.BUNNY_CDN_BASE_URL}/`, '');
      try {
        await axios.delete(
          `https://${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_NAME}/${filePath}`,
          {
            headers: {
              AccessKey: process.env.BUNNY_STORAGE_PASSWORD!,
            },
          }
        );
        console.log('✅ تم حذف الصورة من BunnyCDN');
      } catch (deleteErr: any) {
        console.warn('⚠️ لم يتم حذف الصورة من BunnyCDN:', deleteErr.message);
      }
    }

    // ✅ حذف الحدث من قاعدة البيانات
    await event.deleteOne();

    res.status(200).json({ message: 'تم حذف الحدث بنجاح' });
  } catch (error: any) {
    console.error('❌ خطأ أثناء حذف الحدث:', error.message);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الحدث', error: error.message });
  }
};






