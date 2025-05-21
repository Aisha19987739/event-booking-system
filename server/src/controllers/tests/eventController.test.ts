import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../app';
import User from '../../models/userModel';
import Category, { ICategory } from '../../models/Category';
import Event from '../../models/Event';
import connectDB from '../../config/db';
jest.setTimeout(60000); // ⏱️ 30 ثانية


describe('Event API Endpoints', () => {
  let token: string;
  let organizerId: string;
  let categoryId: string;
  let eventId: string;

  beforeAll(async () => { 
    await connectDB();
    // تأكد من أن الاتصال بقاعدة البيانات مفتوح
     if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});

    const organizer = await User.create({
      name: 'Organizer Test User',
      username: 'Aisha',
      email: 'organizer@example.com',
      password: 'password123',
      role: 'organizer',
    });
    organizerId = organizer._id.toString();

    const category = await Category.create({ name: 'Music' }) as ICategory;
    categoryId = category._id.toString();

    token = jwt.sign(
      { userId: organizerId, role: 'organizer' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
  });

  it('POST /api/events - ينشئ فعالية جديدة', async () => {
    const newEvent = {
      title: 'Concert Night',
      description: 'An amazing night of live music.',
      date: '2025-06-01T20:00:00.000Z',
      location: 'Downtown Arena',
      price: 50,
      capacity: 500,
      totalTickets: 100,
      category: categoryId,
    };

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send(newEvent);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('event');
    expect(res.body.event.title).toBe('Concert Night');
    expect(res.body.event.organizer).toBe(organizerId);
    expect(res.body.event.category).toBe(categoryId);
    eventId = res.body._id || res.body.event._id;
  });

  describe('GET, PUT, DELETE event by ID', () => {
    console.log('eventId:', eventId)
    it('GET /api/events/:id - يسترجع فعالية معينة', async () => {
      const res = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      console.log('GET by ID response:', res.body);
      expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
expect(res.body._id).toBe(eventId);

    });

it('PUT /api/events/:id - يعدل فعالية موجودة', async () => {
        console.log('eventId:', eventId)

  const res = await request(app)
    .put(`/api/events/${eventId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Updated Concert Night',
      description: 'Updated description',
      date: '2025-06-02T20:00:00.000Z',
      location: 'Updated Arena',
      price: 60,
      capacity: 600,
      category: categoryId,
     
    });

  console.log('PUT response:', res.body);
  console.log('PUT status:', res.statusCode);
console.log('PUT body:', JSON.stringify(res.body, null, 2));


  expect(res.statusCode).toBe(200);
  expect(res.body.event.title).toBe('Updated Concert Night');
});

it('GET /api/events - يسترجع جميع الفعاليات', async () => {
  const res = await request(app).get('/api/events');

  console.log('GET all events response:', res.body);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.events)).toBe(true);
  expect(res.body.events.length).toBeGreaterThan(0);
});



    it('DELETE /api/events/:id - يحذف فعالية', async () => {
        console.log('eventId:', eventId)
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Event deleted successfully');
    });
  });

 
}  );
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
