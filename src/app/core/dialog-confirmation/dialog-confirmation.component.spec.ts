import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogConfirmationComponent } from './dialog-confirmation.component';

describe('DialogConfirmationComponent', () => {
  let component: DialogConfirmationComponent;
  let fixture: ComponentFixture<DialogConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogConfirmationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
