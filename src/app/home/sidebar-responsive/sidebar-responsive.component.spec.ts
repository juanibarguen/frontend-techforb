import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarResponsiveComponent } from './sidebar-responsive.component';

describe('SidebarResponsiveComponent', () => {
  let component: SidebarResponsiveComponent;
  let fixture: ComponentFixture<SidebarResponsiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarResponsiveComponent]
    });
    fixture = TestBed.createComponent(SidebarResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
