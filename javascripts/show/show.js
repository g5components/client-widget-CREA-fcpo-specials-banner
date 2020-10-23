class FeaturedContentPopOutWidget {
  constructor(configs){
    this.configs = configs;
    this.widget = $(`#${this.configs.widgetId}`);
    this.timerName = 'pop_out_shown';
    this.mobileRevealScrollEventHandler = this.mobileAutoRevealPopOut.bind(this);

    if (this.shouldRenderWidget()) {
      this.initialize();
    }
  }

  shouldRenderWidget() {
    const startDateTZ = moment.tz(`${this.configs.startDate} 00:00`, this.configs.timezone);
    const endDateTZ = moment.tz(`${this.configs.endDate} 23:59`, this.configs.timezone);

    const startDate = new Date(startDateTZ.format());
    const endDate = new Date(endDateTZ.format());
    const now = new Date().getTime();

    var begin = this.isValidDate(startDate) ? startDate.getTime() : now;
    var end = this.isValidDate(endDate) ? endDate.getTime() : now;

    if (now >= begin && now <= end) {
      this.widget.show();
      return true;
    } else {
      this.widget.hide();
      return false;
    }
  }

  isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }

  initialize() {
    this.setBackgroundImage();
    this.setListeners();

    if (this.configs.featuredContentPopOutType === 'auto' && !this.isAutoRevealTimerSet()) {
      this.setAutoReveal();
    }

    if (this.configs.bgColorOpacity !== '100%') {
      const rgb = this.hexToRgb(this.configs.bgColor);
      this.setBgColorOpacity('.featured-content-pop-out-aside', rgb, this.configs.bgColorOpacity);
    }

    if (this.configs.bgEffect === 'overlay') {
      const rgb = this.hexToRgb(this.configs.bgEffectOverlayColor);
      this.setBgColorOpacity('.featured-content-pop-out-overlay', rgb, this.configs.bgEffectOverlayOpacity);
    }

    if (this.configs.bgOverlayColor !== '') {
      const rgb = this.hexToRgb(this.configs.bgOverlayColor);
      this.setBgColorOpacity('.featured-content-pop-out-wrapper-overlay', rgb, this.configs.bgOverlayOpacity);
    }

    this.widget.closest('.content-stripe-widget').addClass('absolute');

  }

  autoRevealPopOut() {
    if(this.widget.not('.action-calls-activated')) {
      this.toggleFeaturedContentPopOut();
      this.setAutoRevealTimer();
    }
  }

  mobileAutoRevealPopOut() {
    if ($(document).scrollTop() > this.pageHeight * (this.configs.autoRevealScrollDistance / 100)) {
      this.autoRevealPopOut();
      document.removeEventListener('scroll', this.mobileRevealScrollEventHandler);
    }
  }

  setAutoReveal() {
    if (this.configs.autoRevealType === 'delayed') {
      if (window.matchMedia(`(max-width: ${this.configs.autoRevealMobileBreakpoint}px)`).matches) {
        if (this.configs.autoRevealDisableMobile === 'false') {
          this.pageHeight = $(document).height();
          document.addEventListener('scroll', this.mobileRevealScrollEventHandler);
        }
      } else {
        setTimeout(() => {
          this.autoRevealPopOut();
        }, this.configs.autoRevealDelay * 1000);
      }
    }
    if (this.configs.autoRevealType === 'exit-intent') {
      setTimeout(() => {
        $(document).on('mouseleave', (e) => {
          if (e.clientY < 0) {
            $(e.currentTarget).off('mouseleave');
            this.autoRevealPopOut();
          }
        });
      }, 2000);
    }
  }

  setListeners() {
    const actionCallClass = !this.configs.customName ? '.featured-content-pop-out' : '.' + this.configs.customNameClass;
    $('.action-calls a' + actionCallClass)
    .on('click', () => {
      this.toggleFeaturedContentPopOut();
      this.widget.addClass('action-calls-activated');
    });
    this.widget
    .on('click', '.reveal-btn, .close-btn, .featured-content-pop-out-overlay', () => {
      this.toggleFeaturedContentPopOut();
    })
    .on('click', '.reveal-btn', () => {
      this.widget.find('.featured-content-pop-out-aside').focus();
    });

    // Find all focusable children
    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    const focusableElements = this.widget.find(focusableElementsString);

    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];

    $(document).on('keydown', (e) => {
      // Close modal when press Esc key
      if (e.keyCode === 27) {
        this.toggleFeaturedContentPopOut();
      }

      // Close modal when press Enter key while focusing the close modal element (X)
      if (e.keyCode === 13 && document.activeElement === this.widget.find('.close-btn')[0]) {
        this.toggleFeaturedContentPopOut();
      }

      // TAB TRAP
      // Check for TAB key press
      if (e.keyCode === 9) {

        // SHIFT + TAB
        if (e.shiftKey) {
          if (document.activeElement === firstTabStop) {
            e.preventDefault();
            lastTabStop.focus();
          }

        // TAB
        } else {
          if (document.activeElement === lastTabStop) {
            e.preventDefault();
            firstTabStop.focus();
          }
        }
      }
      })
  }

  setBgEffect() {
    if (this.configs.bgEffect === 'blur') {
      $('header, #drop-target-main, footer').toggleClass('blur-effect');
    }
  }

  toggleFeaturedContentPopOut() {
    this.widget.find('.featured-content-pop-out-aside, .featured-content-pop-out-overlay').toggleClass('open');
    this.setBgEffect();
    this.setBgScrolling();
  }

  setBackgroundImage() {
    if (this.configs.backgroundImageURL !== '') {
      this.widget.find('.featured-content-pop-out-aside').css('background-image', `url(${this.configs.backgroundImageURL})`);
    }
  }

  setBgColorOpacity(selector, rgb, opacity) {
    this.widget.find(selector)
      .css('background-color',`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`);
  }

  setBgScrolling() {
    if (this.configs.bgScrolling === 'false') {
      $('html').toggleClass('sc-no-scroll');
    }
  }

  hexToRgb(hex) {
    // convert shorthand hex (#abc -> #aabbcc)
    const formatted = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
      return '#' + r + r + g + g + b + b;
    });
    return formatted.substring(1).match(/.{2}/g).map(x => parseInt(x, 16));
  }

  createCookie(name, value, hours) {
    var expires = '';
    var date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();

    document.cookie = name + '=' + value + expires + '; path=/';
  }

  getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  }

  eraseCookie(name) {
    this.createCookie(name,"",-1);
  }

  checkCookie() {
    return this.getCookie(this.timerName) === 'true'
  }

  checkUserSession() {
    return sessionStorage.getItem(this.timerName) === 'true';
  }

  eraseUserSession() {
    localStorage.removeItem(this.timerName);
  }

  setAutoRevealTimer() {
    if (this.configs.autoRevealTimer === 'user-session') {
      sessionStorage.setItem(this.timerName, 'true');
    }
    if (this.configs.autoRevealTimer === 'cookie') {
      this.createCookie(this.timerName, 'true', this.configs.cookieExpiration);
    }
  }

  isAutoRevealTimerSet() {
    if (this.configs.autoRevealTimer === 'user-session') {
      this.eraseCookie(this.timerName);
      return this.checkUserSession();
    }
    if (this.configs.autoRevealTimer === 'cookie') {
      this.eraseUserSession();
      return this.checkCookie();
    }
  }
}

G5.loadWidgetConfigs('.featured-content-pop-out > .config', FeaturedContentPopOutWidget);
