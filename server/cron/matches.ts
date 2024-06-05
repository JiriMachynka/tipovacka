import { defineCronHandler } from '#nuxt/cron';

// EURO 2024 - 0 15,18,21 * * *
export default defineCronHandler(() => '*/2 * * * *', () => {
  console.log('This cron job will run every 2 minutes');
});