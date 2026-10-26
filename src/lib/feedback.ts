// Public responder links only. Never expose a receiving address, credentials,
// edit links, or prefilled user content in the feedback configuration.
export function feedbackFormUrl(value: string): string {
  if (!value.trim()) return '';
  try {
    const url = new URL(value.trim());
    if (
      url.origin !== 'https://docs.google.com' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !/^\/forms\/d\/e\/[A-Za-z0-9_-]{20,}\/viewform$/.test(url.pathname)
    )
      throw new Error();
    return url.href;
  } catch {
    throw new Error(
      'Feedback must use a public Google Forms responder URL without query strings or fragments.',
    );
  }
}
