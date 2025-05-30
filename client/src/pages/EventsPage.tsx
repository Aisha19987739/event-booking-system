// src/pages/EventsPage.tsx
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box,
  CardActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFilteredEvents } from "../hooks/useFilteredEvents";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading } = useFilteredEvents({
    search,
    location,
    category,
    sortBy,
    order,
    page,
    limit: 6,
  });

  const events = data?.events || [];
  const totalPages = Math.ceil((data?.total || 0) / 6);

  return (
    <Box p={3}>
      {/* الفلاتر */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          label="بحث"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          label="الموقع"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          label="الفئة"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <FormControl>
          <InputLabel>ترتيب حسب</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="createdAt">الأحدث</MenuItem>
            <MenuItem value="price">السعر</MenuItem>
            <MenuItem value="date">التاريخ</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>الترتيب</InputLabel>
          <Select
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="asc">تصاعدي</MenuItem>
            <MenuItem value="desc">تنازلي</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* النتائج */}
      {isLoading ? (
        <Typography>جاري تحميل الفعاليات...</Typography>
      ) : events.length === 0 ? (
        <Typography>لا توجد فعاليات حالياً</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {events.map((event: any) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="160"
                    image={
                      event.imageUrl ||
                      "https://event-image1.b-cdn.net/fallbacks/no-image.jpg"
                    }
                    alt={event.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {event.description?.slice(0, 80) || "لا يوجد وصف"}...
                    </Typography>
                    <Typography variant="body2">📍 {event.location}</Typography>
                    <Typography variant="body2">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    {event.price !== undefined && (
                      <Typography variant="body2">
                        💵 السعر: {event.price} ريال
                      </Typography>
                    )}
                    <Typography variant="body2">
                      👥 السعة: {event.capacity} شخص
                    </Typography>
                  </CardContent>

                  {/* إضافة أزرار التفاصيل والحجز */}
                  <CardActions>
                    <Button onClick={() => navigate(`/events/${event._id}`)}>
                      التفاصيل
                    </Button>

                    <Button
                      component={Link}
                      to={`/events/${event._id}/booking`}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      حجز
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* التصفح */}
          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default EventsPage;
