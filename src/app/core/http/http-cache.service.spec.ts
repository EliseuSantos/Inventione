import { TestBed, inject } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

import { HttpCacheService, HttpCacheEntry } from './http-cache.service';

const cachePersistenceKey = 'httpCache';

describe('HttpCacheService', () => {
  let httpCacheService: HttpCacheService;
  let response: HttpResponse<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCacheService]
    });


    window.sessionStorage.removeItem(cachePersistenceKey);
    window.localStorage.removeItem(cachePersistenceKey);
  });

  beforeEach(inject([HttpCacheService], (_httpCacheService: HttpCacheService) => {
    httpCacheService = _httpCacheService;

    response = new HttpResponse({ body: 'data' });
  }));

  afterEach(() => {
    httpCacheService.cleanCache();
  });

  describe('setCacheData', () => {
    it('should set cache data', () => {

      httpCacheService.setCacheData('/popo', response);


      expect(httpCacheService.getCacheData('/popo')).toEqual(response);
    });

    it('should replace existing data', () => {

      const newResponse = new HttpResponse({ body: 'new data' });


      httpCacheService.setCacheData('/popo', response);
      httpCacheService.setCacheData('/popo', newResponse);


      expect(httpCacheService.getCacheData('/popo')).toEqual(newResponse);
    });

    it('should set cache date correctly', () => {

      const date = new Date(123);
      httpCacheService.setCacheData('/popo', response, date);
      httpCacheService.setCacheData('/hoho', response);


      expect((<HttpCacheEntry>httpCacheService.getHttpCacheEntry('/popo')).lastUpdated).toBe(date);
      expect((<HttpCacheEntry>httpCacheService.getHttpCacheEntry('/hoho')).lastUpdated).not.toBe(date);
    });
  });

  describe('getCacheData', () => {
    it('should return null if no cache', () => {
      expect(httpCacheService.getCacheData('/hoho')).toBe(null);
    });

    it('should return cached data if exists', () => {

      httpCacheService.setCacheData('/hoho', response);


      expect(httpCacheService.getCacheData('/hoho')).toEqual(response);
    });

    it('should return cached data with url parameters if exists', () => {

      httpCacheService.setCacheData('/hoho?pif=paf', response);


      expect(httpCacheService.getCacheData('/hoho?pif=paf')).toEqual(response);
    });
  });

  describe('getHttpCacheEntry', () => {
    it('should return null if no cache', () => {
      expect(httpCacheService.getHttpCacheEntry('/hoho')).toBe(null);
    });

    it('should return cached data date  if exists', () => {

      const date = new Date(123);


      httpCacheService.setCacheData('/hoho', response, date);
      const entry = httpCacheService.getHttpCacheEntry('/hoho');


      expect(entry).not.toBeNull();
      expect((<HttpCacheEntry>entry).lastUpdated).toEqual(date);
      expect((<HttpCacheEntry>entry).data).toEqual(response);
    });
  });

  describe('clearCacheData', () => {
    it('should clear existing cache data', () => {

      httpCacheService.setCacheData('/hoho', response);
      expect(httpCacheService.getCacheData('/hoho')).toEqual(response);


      httpCacheService.clearCache('/hoho');
      expect(httpCacheService.getCacheData('/hoho')).toBe(null);
    });

    it('should do nothing if no cache exists', () => {
      expect(httpCacheService.getCacheData('/lolo')).toBe(null);
      httpCacheService.clearCache('/hoho');
      expect(httpCacheService.getCacheData('/lolo')).toBe(null);
    });
  });

  describe('cleanCache', () => {
    it('should clear all cache if no date is specified', () => {

      httpCacheService.setCacheData('/hoho', response);
      httpCacheService.setCacheData('/popo', response);
      expect(httpCacheService.getCacheData('/hoho')).toBe(response);
      expect(httpCacheService.getCacheData('/popo')).toBe(response);


      httpCacheService.cleanCache();
      expect(httpCacheService.getCacheData('/hoho')).toBe(null);
      expect(httpCacheService.getCacheData('/popo')).toBe(null);
    });

    it('should clear existing since specified date', () => {

      httpCacheService.setCacheData('/hoho', response);
      expect(httpCacheService.getCacheData('/hoho')).toBe(response);


      httpCacheService.cleanCache(new Date());
      expect(httpCacheService.getCacheData('/hoho')).toBe(null);
    });

    it('should not affect cache entries newer than specified date', () => {

      httpCacheService.setCacheData('/hoho', response);
      expect(httpCacheService.getCacheData('/hoho')).toBe(response);


      const date = new Date();
      httpCacheService.setCacheData('/lolo', response, new Date(date.getTime() + 10));
      httpCacheService.cleanCache(date);


      expect(httpCacheService.getCacheData('/hoho')).toBe(null);
      expect(httpCacheService.getCacheData('/lolo')).toBe(response);
    });
  });

  describe('setPersistence', () => {
    beforeEach(() => {
      httpCacheService.setPersistence();
      httpCacheService.cleanCache = jasmine.createSpy('cleanCache');
    });

    it('should clear previous cache data when persistence value change', () => {
      httpCacheService.setPersistence('local');
      expect(httpCacheService.cleanCache).toHaveBeenCalledWith();
    });

    it('should persist cache to local storage', () => {
      expect(localStorage.getItem(cachePersistenceKey)).toBeNull();

      httpCacheService.setPersistence('local');
      httpCacheService.setCacheData('/hoho', response);

      expect(localStorage.getItem(cachePersistenceKey)).not.toBeNull();
    });

    it('should persist cache to session storage', () => {
      expect(sessionStorage.getItem(cachePersistenceKey)).toBeNull();

      httpCacheService.setPersistence('session');
      httpCacheService.setCacheData('/hoho', response);

      expect(sessionStorage.getItem(cachePersistenceKey)).not.toBeNull();
    });
  });
});
