export const API_URL = import.meta.env.PROD
  ? 'https://us-central1-serenity-journal.cloudfunctions.net/app'
  : 'http://127.0.0.1:5001/serenity-journal/us-central1/app';
