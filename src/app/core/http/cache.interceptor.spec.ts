import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpResponse } from '@angular/common/http';

import { CacheInterceptor } from './cache.interceptor';
import { HttpCacheService } from './http-cache.service';

describe('CacheInterceptor', () => {
  let interceptorOptions: Object | null = {};
  let httpCacheService: HttpCacheService;
  let cacheInterceptor: CacheInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function createInterceptor(_httpCacheService: HttpCacheService) {
    cacheInterceptor = new CacheInterceptor(_httpCacheService).configure(interceptorOptions);
    return cacheInterceptor;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpCacheService,
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: createInterceptor,
          deps: [HttpCacheService],
          multi: true
        }
      ]
    });
  });

  afterEach(() => {
    httpCacheService.cleanCache();
    httpMock.verify();
  });

  describe('with default configuration', () => {
    beforeEach(() => {
      interceptorOptions = null;
    });

    beforeEach(inject([
      HttpClient,
      HttpTestingController,
      HttpCacheService
    ], (_http: HttpClient,
        _httpMock: HttpTestingController,
        _httpCacheService: HttpCacheService) => {

      http = _http;
      httpMock = _httpMock;
      httpCacheService = _httpCacheService;
    }));

    it('should cache the request', () => {
      http.get('/test').subscribe(() => {
        const cachedData = httpCacheService.getCacheData('/test');
        expect(cachedData).toBeDefined();
        expect(cachedData ? cachedData.body : null).toEqual('someData');
      });

      httpMock.expectOne({ url: '/test' }).flush('someData');
    });

    it('should respond from the cache', () => {
      httpCacheService.setCacheData('/test', new HttpResponse({ body: 'cachedData' }));

      http.get('/test').subscribe(response => {
        expect(response).toEqual('cachedData');
      });

      httpMock.expectNone({ url: '/test' });
    });

    it('should not cache the request in case of error', () => {
      // Act
      http.get('/test').subscribe(() => {}, () => {
        // Assert
        expect(httpCacheService.getCacheData('/test')).toBeNull();
      });

      httpMock.expectOne({}).flush(null, {
        status: 404,
        statusText: 'error'
      });
    });
  });

  describe('with update forced configuration', () => {
    beforeEach(() => {
      interceptorOptions = { update: true };
    });

    beforeEach(inject([
      HttpClient,
      HttpTestingController,
      HttpCacheService
    ], (_http: HttpClient,
        _httpMock: HttpTestingController,
        _httpCacheService: HttpCacheService) => {

      http = _http;
      httpMock = _httpMock;
      httpCacheService = _httpCacheService;
    }));

    afterEach(() => {
      httpCacheService.cleanCache();
      httpMock.verify();
    });

    it('should force cache update', () => {
      httpCacheService.setCacheData('/test', new HttpResponse({ body: 'oldCachedData' }));
      cacheInterceptor.configure({ update: true });

      http.get('/test').subscribe(response => {
        expect(response).toEqual('newData');

      });

      httpMock.expectOne({ url: '/test' }).flush('newData');
    });
  });
});
