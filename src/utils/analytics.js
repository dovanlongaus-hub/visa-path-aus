// ─── GA4 Event Tracking Helpers ──────────────────────────────

export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
};

export const trackConsultationClick = () => trackEvent('consultation_click', { value: 149 });
export const trackEOIComplete = (points) => trackEvent('eoi_complete', { points });
export const trackUpgradeClick = (plan) => trackEvent('upgrade_click', { plan });
export const trackBlogRead = (slug) => trackEvent('blog_read', { slug });

// ─── Facebook Pixel Helpers ────────────────────────────────────

export const fbTrack = (event, params = {}) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', event, params);
  }
};

export const fbTrackConsultation = () => fbTrack('InitiateCheckout', { value: 149, currency: 'AUD' });
export const fbTrackEOIComplete = () => fbTrack('CompleteRegistration');
export const fbTrackUpgrade = (plan, price) => fbTrack('Purchase', { value: price, currency: 'AUD' });
