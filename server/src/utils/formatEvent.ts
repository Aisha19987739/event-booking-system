const cdnBaseUrl = 'https://event-image1.b-cdn.net';

export function formatEventsWithImageUrl(events: any[]) {
  return events.map(event => ({
    ...event,
    imageUrl: event.image ? `${cdnBaseUrl}/${event.image}` : null,
  }));
}
