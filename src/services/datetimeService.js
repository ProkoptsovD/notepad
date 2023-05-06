export class DatetimeService {
  /**
   * @param {{
   *  locale: string;
   *  dateStyle: 'full' | 'long' | 'medium' | 'short';
   *  timeStyle: 'full' | 'long' | 'medium' | 'short';
   * }} config
   */
  constructor({ locale = 'en-US', dateStyle = 'full', timeStyle = 'medium' } = {}) {
    this.locale = locale;
    this.dateStyle = dateStyle;
    this.timeStyle = timeStyle;
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
      dateStyle: options?.dateStyle ?? this.dateStyle,
      timeStyle: options?.timeStyle ?? this.timeStyle
    }).format(date);
  }
}

export const datetimeService = new DatetimeService({
  locale: 'en-US',
  dateStyle: 'full',
  timeStyle: 'medium'
});
