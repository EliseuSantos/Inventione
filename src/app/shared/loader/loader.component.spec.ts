import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [LoaderComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not be visible by default', () => {

    const element = fixture.nativeElement;
    const div = element.querySelectorAll('div')[0];


    expect(div.getAttribute('hidden')).not.toBeNull();
  });

  it('should be visible when app is loading', () => {

    const element = fixture.nativeElement;
    const div = element.querySelectorAll('div')[0];


    fixture.componentInstance.isLoading = true;
    fixture.detectChanges();


    expect(div.getAttribute('hidden')).toBeNull();
  });

  it('should not display a message by default', () => {

    const element = fixture.nativeElement;
    const span = element.querySelectorAll('span')[0];


    expect(span.innerText).toBe('');
  });

  it('should display specified message', () => {

    const element = fixture.nativeElement;
    const span = element.querySelectorAll('span')[0];


    fixture.componentInstance.message = 'testing';
    fixture.detectChanges();


    expect(span.innerText).toBe('testing');
  });
});
