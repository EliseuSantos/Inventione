import { TestBed, inject } from '@angular/core/testing';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { extract, I18nService } from './i18n.service';

const defaultLanguage = 'en-US';
const supportedLanguages = ['eo', 'en-US', 'pt-BR'];

class MockTranslateService {

  currentLang: string;
  onLangChange = new Subject();

  use(language: string) {
    this.currentLang = language;
    this.onLangChange.next({
      lang: this.currentLang,
      translations: {}
    });
  }

  getBrowserCultureLang() {
    return 'en-US';
  }

  setTranslation(lang: string, translations: Object, shouldMerge?: boolean) { }

}

describe('I18nService', () => {
  let i18nService: I18nService;
  let translateService: TranslateService;
  let onLangChangeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        I18nService,
        { provide: TranslateService, useClass: MockTranslateService },
      ]
    });
  });

  beforeEach(inject([
    I18nService,
    TranslateService
  ], (_i18nService: I18nService,
      _translateService: TranslateService) => {

    i18nService = _i18nService;
    translateService = _translateService;

    onLangChangeSpy = jasmine.createSpy('onLangChangeSpy');
    translateService.onLangChange
      .subscribe((event: LangChangeEvent) => {
        onLangChangeSpy(event.lang);
      });
    spyOn(translateService, 'use').and.callThrough();
  }));

  afterEach(() => {
    localStorage.removeItem('language');
  });

  describe('extract', () => {
    it('should not modify string', () => {
      expect(extract('Hello world !')).toEqual('Hello world !');
    });
  });

  describe('init', () => {
    it('should init with default language', () => {
      i18nService.init(defaultLanguage, supportedLanguages);

      expect(translateService.use).toHaveBeenCalledWith(defaultLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(defaultLanguage);
    });

    it('should init with save language', () => {
      const savedLanguage = 'eo';
      localStorage.setItem('language', savedLanguage);

      i18nService.init(defaultLanguage, supportedLanguages);

      expect(translateService.use).toHaveBeenCalledWith(savedLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(savedLanguage);
    });
  });

  describe('set language', () => {
    it('should change current language', () => {
      const newLanguage = 'eo';
      i18nService.init(defaultLanguage, supportedLanguages);

      i18nService.language = newLanguage;

      expect(translateService.use).toHaveBeenCalledWith(newLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(newLanguage);
    });

    it('should change current language without a region match', () => {
      const newLanguage = 'pt-PT';
      i18nService.init(defaultLanguage, supportedLanguages);

      i18nService.language = newLanguage;

      expect(translateService.use).toHaveBeenCalledWith('pt-BR');
      expect(onLangChangeSpy).toHaveBeenCalledWith('pt-BR');
    });

    it('should change current language to default if unsupported', () => {
      const newLanguage = 'br';
      i18nService.init(defaultLanguage, supportedLanguages);

      i18nService.language = newLanguage;

      expect(translateService.use).toHaveBeenCalledWith(defaultLanguage);
      expect(onLangChangeSpy).toHaveBeenCalledWith(defaultLanguage);
    });
  });

  describe('get language', () => {
    it('should return current language', () => {
      i18nService.init(defaultLanguage, supportedLanguages);

      const currentLanguage = i18nService.language;

      expect(currentLanguage).toEqual(defaultLanguage);
    });
  });

});
