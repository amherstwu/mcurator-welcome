/**
 * Shared social link icons. Candidate URLs stay in the registry as unverified.
 * Only verified + enabled channels become live hrefs. Handles are never guessed.
 */
(function (global) {
  'use strict';

  var CHANNELS = [
    {
      id: 'instagram',
      candidateUrl: 'https://www.instagram.com/mcurator',
      labelKey: 'lp_entry_social_ig',
      symbol: 'instagram-icon',
      viewBox: '0 0 24 24',
      verification: 'unverified',
      enabled: false,
      webUrl: '',
      appDeepLink: '',
      analyticsEvent: 'social_channel_instagram'
    },
    {
      id: 'x',
      candidateUrl: 'https://x.com/mcurator',
      labelKey: 'lp_entry_social_x',
      symbol: 'x-icon-mono',
      viewBox: '0 0 19 19',
      verification: 'unverified',
      enabled: false,
      webUrl: '',
      appDeepLink: '',
      analyticsEvent: 'social_channel_x'
    },
    {
      id: 'facebook',
      candidateUrl: 'https://www.facebook.com/mcurator',
      labelKey: 'lp_entry_social_fb',
      symbol: 'facebook-icon',
      viewBox: '0 0 24 24',
      verification: 'unverified',
      enabled: false,
      webUrl: '',
      appDeepLink: '',
      analyticsEvent: 'social_channel_facebook'
    },
    {
      id: 'youtube',
      candidateUrl: 'https://www.youtube.com/@mcurator',
      labelKey: 'lp_entry_social_yt',
      symbol: 'youtube-icon',
      viewBox: '0 0 24 24',
      verification: 'unverified',
      enabled: false,
      webUrl: '',
      appDeepLink: '',
      analyticsEvent: 'social_channel_youtube'
    },
    {
      id: 'linkedin',
      candidateUrl: 'https://www.linkedin.com/company/mcurator',
      labelKey: 'lp_entry_social_li',
      symbol: 'linkedin-icon',
      viewBox: '0 0 24 24',
      verification: 'unverified',
      enabled: false,
      webUrl: '',
      appDeepLink: '',
      analyticsEvent: 'social_channel_linkedin'
    }
  ];

  function isActive(channel) {
    return Boolean(
      channel &&
        channel.enabled === true &&
        channel.verification === 'verified' &&
        String(channel.webUrl || '').indexOf('https://') === 0
    );
  }

  function markup(opts) {
    opts = opts || {};
    var tr = opts.tr || function (k) {
      return k;
    };
    var esc = opts.esc || function (s) {
      return String(s == null ? '' : s);
    };
    var listClass = opts.listClass || '';
    var active = CHANNELS.filter(isActive);
    if (!active.length) {
      return '<ul class="entry-social-list' + (listClass ? ' ' + listClass : '') + '" data-social-state="not-configured" data-testid="social-channels-unconfigured"></ul>';
    }
    var html = '<ul class="entry-social-list' + (listClass ? ' ' + listClass : '') + '" data-social-state="verified">';
    active.forEach(function (l) {
      html +=
        '<li><a class="entry-social-link" href="' +
        esc(l.webUrl) +
        '" target="_blank" rel="noopener noreferrer" data-analytics="' +
        esc(l.analyticsEvent) +
        '" aria-label="' +
        esc(tr(l.labelKey)) +
        '"><svg class="entry-social-icon" viewBox="' +
        l.viewBox +
        '" aria-hidden="true"><use href="#' +
        l.symbol +
        '"></use></svg></a></li>';
    });
    html += '</ul>';
    return html;
  }

  function mount(root, opts) {
    if (!root) return;
    var el = typeof root === 'string' ? document.getElementById(root) : root;
    if (!el) return;
    el.innerHTML = markup(opts);
  }

  global.MCSocialIcons = { LINKS: CHANNELS, CHANNELS: CHANNELS, markup: markup, mount: mount, isActive: isActive };
})(typeof window !== 'undefined' ? window : this);
