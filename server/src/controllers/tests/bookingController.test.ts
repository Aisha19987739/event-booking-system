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
jest.setTimeout(60000); // ⏱️ 60 ثانية

beforeAll(async () => {
  await connectDB();

  // 🧹 تنظيف المستخدمين السابقين
  await User.deleteMany({ email: { $in: ['user@test.com', 'organizer@test.com', 'admin@test.com'] } });


  // 🔐 تسجيل المستخدم
  const resRegisterUser = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    username: 'TestUser',
    email: 'user@test.com',
    password: '123456',
    role: 'user',
  });
  expect(resRegisterUser.statusCode).toBe(201);

  const resLoginUser = await request(app).post('/api/auth/login').send({
    email: 'user@test.com',
    password: '123456',
  });
  expect(resLoginUser.statusCode).toBe(200);
  tokenUser = resLoginUser.body.token;
  console.log('User Token:', tokenUser);

  // 🔐 تسجيل المنظم
  const resRegisterOrganizer = await request(app).post('/api/auth/register').send({
    name: 'Test Organizer',
    username: 'TestOrganizer',
    email: 'organizer@test.com',
    password: '123456',
    role: 'organizer',
  });
  expect(resRegisterOrganizer.statusCode).toBe(201);

  const resLoginOrganizer = await request(app).post('/api/auth/login').send({
    email: 'organizer@test.com',
    password: '123456',
  });
  expect(resLoginOrganizer.statusCode).toBe(200);
  tokenOrganizer = resLoginOrganizer.body.token;
  console.log('Organizer Token:', tokenOrganizer);

  // 🔐 تسجيل الأدمن
  const resRegisterAdmin = await request(app).post('/api/auth/register').send({
    name: 'Test Admin',
    username: 'TestAdmin',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
  });
  expect(resRegisterAdmin.statusCode).toBe(201);

  const resLoginAdmin = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: '123456',
  });
  expect(resLoginAdmin.statusCode).toBe(200);
  tokenAdmin = resLoginAdmin.body.token;
  console.log('Admin Token:', tokenAdmin);




  // إنشاء فئة جديدة
  const categoryRes = await request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${tokenAdmin}`) // تأكد من أنك تستخدم توكن أدمن أو من يملك صلاحية إنشاء فئات
    .send({ name: 'Test Category' });

  categoryId = categoryRes.body.category._id;
  // 🗓️ إنشاء حدث مستقبلي
  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // بعد 30 يوم

  const resEvent = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${tokenOrganizer}`)
    .send({
      title: 'حفلة موسيقية',
      description: 'حفلة موسيقية رائعة',
      date: futureDate,
      category: categoryId,
      location: 'القاهرة',
      totalTickets: 100,
      price: 50,
      capacity: 100,
    });
  
  expect(resEvent.statusCode).toBe(201);
  eventId = resEvent.body.event._id;
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    console.error('❌ Error during test teardown:', err);
  }
});
describe('Booking Endpoints Integration Test', () => {
  let bookingId: string;

  test('User can create a booking for the event', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ eventId, ticketCount: 2 });

    expect(res.statusCode).toBe(201);
    expect(res.body.booking).toBeDefined();
    expect(res.body.booking.event).toBe(eventId);
    expect(res.body.booking.ticketCount).toBe(2);

    bookingId = res.body.booking._id;
  });

  test('User can get their bookings', async () => {
    const res = await request(app)
      .get('/api/bookings/user')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings.find((b: any) => b._id === bookingId)).toBeDefined();
  });

  test('Organizer can get bookings on their events', async () => {
    const res = await request(app)
      .get('/api/bookings/organizer')
      .set('Authorization', `Bearer ${tokenOrganizer}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings.some((b: any) => b.event === eventId)).toBe(true);
  });

  test('Organizer can update booking status', async () => {
  // 1. إنشاء حدث جديد بالمنظم
  const eventRes = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${tokenOrganizer}`)
    .send({
      title: 'Test Event for Booking Status Update',
      description: 'Event for testing booking status update',
      date: '2099-12-31T00:00:00.000Z', // تاريخ مستقبلي
      location: 'Test Location',
      ticketCount: 100,
      price: 50,
     capacity: 100,
      category: categoryId, 
      totalTickets: 100,
     // عدل حسب الفئة الموجودة في الداتا
    });
    console.log('Event creation response:', eventRes.body);


  expect(eventRes.statusCode).toBe(201);
  const eventId = eventRes.body.event._id;

  // 2. المستخدم العادي يحجز تذكرة على الحدث الذي أنشأه المنظم
  const resBooking = await request(app)
    .post('/api/bookings')
    .set('Authorization', `Bearer ${tokenUser}`)
    .send({ eventId, ticketCount: 1 });
  

  expect(resBooking.statusCode).toBe(201);
  const bookingId = resBooking.body.booking._id;

  // 3. المنظم يحدث حالة الحجز إلى 'approved'
 const resUpdate = await request(app)
      .patch(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${tokenOrganizer}`)
      .send({ status: 'confirmed' });

    expect(resUpdate.statusCode).toBe(200);
    expect(resUpdate.body.booking.status).toBe('confirmed');
});


  test('User can update ticket count of their booking', async () => {
    // إنشاء حجز جديد
    const resBooking = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ eventId, ticketCount: 1 });

    expect(resBooking.statusCode).toBe(201);
    const tempBookingId = resBooking.body.booking._id;

    const res = await request(app)
      .patch(`/api/bookings/${tempBookingId}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ ticketCount: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.booking.ticketCount).toBe(3);
  });
   

  test('User can delete/cancel their booking', async () => {
    // إنشاء حجز جديد
    const resBooking = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ eventId, ticketCount: 1 });

    expect(resBooking.statusCode).toBe(201);
    const tempBookingId = resBooking.body.booking._id;

    const res = await request(app)
      .delete(`/api/bookings/${tempBookingId}`)
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message.toLowerCase()).toMatch(/deleted|cancelled/);
  });

  test('Organizer cannot book their own event', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenOrganizer}`)
      .send({ eventId, ticketCount: 1 });

    expect(res.statusCode).toBe(403); // أو الكود المناسب من منطقك
  });

  test('User cannot book an event in the past', async () => {
    const pastEventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${tokenOrganizer}`)
      .send({
        title: 'حدث منتهي',
        description: 'اختبار حدث قديم',
        date: '2020-01-01T00:00:00Z',
        category: categoryId,
        location: 'الزمن الماضي',
        totalTickets: 100,
        price: 10,
        capacity: 100,
      });

    expect(pastEventRes.statusCode).toBe(201);
    const pastEventId = pastEventRes.body.event._id;

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ eventId: pastEventId, ticketCount: 1 });

    expect(res.statusCode).toBe(400); // أو حسب منطق التحقق عندك



  });
  
});
