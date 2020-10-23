class EditFeaturedContentPopOutWidget extends EditLayout {
  constructor() {

    super();

    this.topModal = window.top.$('.modal');

    this.revealMethodSelectDropDown = $('.form-field-featured-content-pop-out-type .select-wrapper select');
    this.revealMethodSections = $('.reveal-method-options [class*=\'-reveal-section\']');
    this.buttonRevealMethodSection = $('.reveal-method-options .button-reveal-section');
    this.autoRevealMethodSection = $('.reveal-method-options .auto-reveal-section');
    this.ctaRevealMethodSection = $('.reveal-method-options .cta-reveal-section');

    this.popOutPosition = this.topModal.find('.form-field-featured-content-pop-out-position select');
    this.modalConfig = this.topModal.find('.form-modal-config');
    this.containerWidth = this.topModal.find('.form-field-container-width');

    this.bgEffect = this.topModal.find('.form-field-bg-effect');
    this.bgEffectOverlayConfig = this.topModal.find('.bg-effect-overlay');

    this.autoRevealType = this.topModal.find('.form-field-auto-reveal-type');
    this.autoRevealTimer = this.topModal.find('.form-field-auto-reveal-timer');
    this.autoRevealDelay = this.topModal.find('.auto-reveal-delay-config');
    this.autoRevealDisableMobile = this.topModal.find('.form-field-auto-reveal-disable-mobile > input:checkbox');
    this.autoRevealMobileConfig = this.topModal.find('.auto-reveal-mobile-config');
    this.autoRevealCookieExp = this.topModal.find('.form-field-cookie-exp');

    this.displayModalConfig();
    this.displayBgEffectOverlayConfig();
    this.displayAutoRevealDelayConfig();
    this.displayCookieExp();
    this.displayRevealMethod();

    this.toggleModalConfigHandler();
    this.toggleBgEffectConfigHandler();
    this.toggleAutoRevealDelayHandler();
    this.toggleAutoRevealTimerHandler();
    this.toggleRevealMethodHandler();
    this.toggleAautoRevealMobileConfigHandler();
  }

  isModal() {
    return this.popOutPosition.find('option:selected').val() === 'modal';
  }

  isOverlayBgEffect() {
    return this.bgEffect.find('input:checked').val() === 'overlay';
  }

  isDelayedAutoReveal() {
    return this.autoRevealType.find('option:selected').val() === 'delayed';
  }

  isCookieTimer() {
    return this.autoRevealTimer.find('option:selected').val() === 'cookie';
  }

  displayModalConfig() {
    if(this.isModal()) {
      this.modalConfig.show();
      this.containerWidth.hide();
     } else {
      this.modalConfig.hide();
      this.containerWidth.show();
    }
  }

  displayBgEffectOverlayConfig() {
    this.isOverlayBgEffect() ? this.bgEffectOverlayConfig.show() : this.bgEffectOverlayConfig.hide();
  }

  displayAutoRevealDelayConfig() {
    this.isDelayedAutoReveal() ? this.autoRevealDelay.show() : this.autoRevealDelay.hide();
  }

  displayCookieExp() {
    this.isCookieTimer() ? this.autoRevealCookieExp.show() : this.autoRevealCookieExp.hide();
  }

  displayRevealMethod() {
    this.revealMethodSections.hide();
    switch(this.revealMethodSelectDropDown.val()) {
      case "auto":
        this.autoRevealMethodSection.show();
        break;
      case "cta":
        this.ctaRevealMethodSection.show();
        break;
      default:
        this.buttonRevealMethodSection.show();
    }
  }

  animateShow(selector) {
    selector
      .slideDown()
      .css('display', 'none')
      .fadeIn({ duration: 150, queue: false });
  }

  animateHide(selector) {
    selector
      .fadeOut({ duration: 150, queue: false })
      .slideUp();
  }

  toggleModalConfigHandler() {
    $(this.popOutPosition).change((e) => {
      if(this.isModal()) {
        this.animateShow(this.modalConfig)
        this.containerWidth.hide();
      } else {
        this.animateHide(this.modalConfig);
        this.containerWidth.show();
      }
    });
  }

  toggleBgEffectConfigHandler() {
    $(this.bgEffect).change((e) => {
      this.isOverlayBgEffect() ?
        this.animateShow(this.bgEffectOverlayConfig) :
        this.animateHide(this.bgEffectOverlayConfig);
    });
  }

  toggleAutoRevealDelayHandler() {
    $(this.autoRevealType).find('select').change((e) => {
      this.isDelayedAutoReveal() ?
        this.animateShow(this.autoRevealDelay) :
        this.animateHide(this.autoRevealDelay);
    });
  }

  toggleAutoRevealTimerHandler() {
    $(this.autoRevealTimer).find('select').change((e) => {
      this.isCookieTimer() ?
        this.animateShow(this.autoRevealCookieExp) :
        this.animateHide(this.autoRevealCookieExp);
    });
  }

  toggleRevealMethodHandler() {
    this.revealMethodSelectDropDown.change(() => {
      this.displayRevealMethod();
    });
  }

  toggleAutoRevealMobileConfig() {
    this.autoRevealMobileConfig.toggle(!this.autoRevealDisableMobile.is(':checked'));
  }

  toggleAautoRevealMobileConfigHandler() {
    this.toggleAutoRevealMobileConfig();

    this.autoRevealDisableMobile.change(() => {
      this.toggleAutoRevealMobileConfig();
    });
  }

  selectLayoutTag(){
    return 'select-row-count';
  }

  layoutTag(){
    return 'row';
  }

  layoutTitle(){
    return 'Row';
  }

  layoutClasses(){
    return [
      "one two three four five six",
      "two three four five six",
      "three four five six",
      "four five six",
      "five six",
      "six"
    ];
  }
}

new EditFeaturedContentPopOutWidget();

let selectors = {
  primary: '.form-field-bg-image input:text',
  uploadAndCropButton: '.row-bg-image .cloudinary-upload-crop',
  maxHeight: '.row-bg-image .form-field-cropping-height input[type="number"]',
  maxWidth: '.row-bg-image .form-field-cropping-width input[type="number"]',
  hasMaxWidthMaxHeight: true,
  croppingStyleSelector: `.form-field-cropping-style input:checked`
}

new G5ImageEditor(selectors, function(){
  this.renderThumbs();
});
