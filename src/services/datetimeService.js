export class DatetimeService {
  /**
   * @param {{
   *  locale: string;
   *  options?: {
   *    dateStyle?: 'full' | 'long' | 'medium' | 'short';
   *    timeStyle?: 'full' | 'long' | 'medium' | 'short';
   *  }
   * }} config
   */
  constructor({ locale = 'en-US', options = {} } = {}) {
    this.locale = locale;
    this.options = options;
  }

  /**
   * @param {Date} date
   * @param {{
   *  locale: string;
   *  dateStyle: 'full' | 'long' | 'medium' | 'short';
   *  timeStyle: 'full' | 'long' | 'medium' | 'short';
   * }} options
   * @returns {string}
   */
  format(date, options) {
    return new Intl.DateTimeFormat(options?.locale ?? this.locale, {
      ...this.options,
      ...options
    }).format(date);
  }
}

export const datetimeService = new DatetimeService({ locale: 'en-US' });
