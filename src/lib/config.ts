export const config = {
  name: 'Bingo Card Kit',
  filePrefix: 'bingo-card-kit',
  contactEmail: import.meta.env?.PUBLIC_CONTACT_EMAIL || '',
  feedbackFormUrl: import.meta.env?.PUBLIC_FEEDBACK_FORM_URL || '',
  ads: { enabled: false, publisherId: '' },
};
export { track } from './analytics';
