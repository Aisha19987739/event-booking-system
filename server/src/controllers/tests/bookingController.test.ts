import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import connectDB from '../../config/db';
import User from '../../models/userModel';
import Category from '../../models/Category';

let tokenUser: string;
let tokenOrganizer: string;
let tokenAdmin: string;
let eventId: string;
let categoryId: string;
jest.setTimeout(60000); // ⏱️ 30 ثانية


beforeAll(async () => {
  await connectDB();
 

  // 🧹 تنظيف المستخدمين المكررون
  await User.deleteMany({ email: { $in: ['user@test.com', 'organizer@test.com', 'admin@test.com'] } });

  // 🔐 تسجيل المستخدم
  const resRegisterUser = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    username: 'TestUser',
    email: 'user@test.com',
    password: '123456',
    role: 'user',
  });
  console.log('✅ Register User Response:', resRegisterUser.body);
  const resLoginUser = await request(app).post('/api/auth/login').send({
    email: 'user@test.com',
    password: '123456',
  });
  console.log('✅ Login User Response:', resLoginUser.body);
  tokenUser = resLoginUser.body.token;

  // 🔐 تسجيل المنظم
  const resRegisterOrganizer = await request(app).post('/api/auth/register').send({
    name: 'Test Organizer',
    username: 'TestOrganizer',
    email: 'organizer@test.com',
    password: '123456',
    role: 'organizer',
  });
  console.log('✅ Register Organizer Response:', resRegisterOrganizer.body);
  const resLoginOrganizer = await request(app).post('/api/auth/login').send({
    email: 'organizer@test.com',
    password: '123456',
  });
  console.log('✅ Login Organizer Response:', resLoginOrganizer.body);
  tokenOrganizer = resLoginOrganizer.body.token;

  // 🔐 تسجيل الأدمن
  const resRegisterAdmin = await request(app).post('/api/auth/register').send({
    name: 'Test Admin',
    username: 'TestAdmin',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
  });
  console.log('✅ Register Admin Response:', resRegisterAdmin.body);
  const resLoginAdmin = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: '123456',
  });
  console.log('✅ Login Admin Response:', resLoginAdmin.body);
  tokenAdmin = resLoginAdmin.body.token;

  // إنشاء فئة جديدة
  const category = await Category.create({ name: 'موسيقى' });
  categoryId = category._id.toString();

  // 🎫 إنشاء حدث بواسطة المنظم مع معرف الفئة
  const resEvent = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${tokenOrganizer}`)
    .send({
      title: 'حفلة موسيقية',
      description: 'حفلة موسيقية رائعة',
      date: '2025-12-31T18:00:00Z',
      category: categoryId,
      location: 'القاهرة',
      totalTickets: 100,
      price: 50,
      capacity: 100,
    
    });

  console.log('✅ Create Event Response:', resEvent.body);
  expect(resEvent.statusCode).toBe(201);
  eventId = resEvent.body.event._id;
});
afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    // إضافة مهلة بسيطة للتأكد من تفريغ الموارد
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    console.error('❌ Error during test teardown:', err);
  }
});


describe('Booking Endpoints Integration Test', () => {
  test('User can create a booking for the event', async () => {
   const res = await request(app)
  .post('/api/bookings')  // ✅ المسار الصحيح لإنشاء الحجز
  .set('Authorization', `Bearer ${tokenUser}`)
  .send({ eventId, ticketCount: 2 });  // أرسل eventId في body


    console.log('✅ Booking Response:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toBeDefined();
    expect(res.body.booking.event).toBe(eventId);
    expect(res.body.booking.ticketCount).toBe(2);
  });
});
