import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://94422d98ad9d1a45657a67d424ea0486@o4511011732193280.ingest.us.sentry.io/4511011735797760",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  enableLogs: true,
});
