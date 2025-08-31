import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MuscleHeatmapComponent } from './muscle-heatmap.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('MuscleHeatmapComponent', () => {
  let component: MuscleHeatmapComponent;
  let fixture: ComponentFixture<MuscleHeatmapComponent>;
  let httpTestingController: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleHeatmapComponent, HttpClientTestingModule],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuscleHeatmapComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load SVG content on ngOnInit', () => {
    const mockSvg = '<svg><rect id="Quadrizeps"></rect></svg>';
    component.ngOnInit();

    const req = httpTestingController.expectOne('assets/muscle-heatmap.svg');
    expect(req.request.method).toEqual('GET');
    req.flush(mockSvg);

    fixture.detectChanges(); // Trigger change detection after SVG is loaded

    expect(component.svgContent).toEqual(mockSvg);
    // Check if the SVG element is set after timeout
    setTimeout(() => {
      expect(component['svgElement']).not.toBeNull();
    }, 0);
  });

  it('should apply heatmap colors based on trainedMuscleGroups', (done) => {
    const mockSvg = '<svg><rect id="Quadrizeps"></rect><rect id="Brust"></rect></svg>';
    component.trainedMuscleGroups = [{ name: 'Quadrizeps', intensity: 0.8 }];

    component.ngOnInit();
    const req = httpTestingController.expectOne('assets/muscle-heatmap.svg');
    req.flush(mockSvg);

    fixture.detectChanges();

    setTimeout(() => {
      const quadrizepsRect = component['svgElement']?.querySelector('#Quadrizeps') as HTMLElement;
      const brustRect = component['svgElement']?.querySelector('#Brust') as HTMLElement;

      expect(quadrizepsRect.style.fill).not.toEqual('#ccc'); // Should be colored
      expect(brustRect.style.fill).toEqual('#ccc'); // Should remain default

      // Test with different intensity
      component.trainedMuscleGroups = [{ name: 'Quadrizeps', intensity: 0.2 }];
      component.ngOnChanges({
        trainedMuscleGroups: {
          currentValue: component.trainedMuscleGroups,
          previousValue: [{ name: 'Quadrizeps', intensity: 0.8 }],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      fixture.detectChanges();

      setTimeout(() => {
        expect(quadrizepsRect.style.fill).not.toEqual('#ccc'); // Should be colored differently
        done();
      }, 0);
    }, 0);
  });

  it('should reset colors to default before applying new ones', (done) => {
    const mockSvg = '<svg><rect id="Quadrizeps"></rect><rect id="Brust"></rect></svg>';
    component.trainedMuscleGroups = [{ name: 'Quadrizeps', intensity: 0.8 }];

    component.ngOnInit();
    const req = httpTestingController.expectOne('assets/muscle-heatmap.svg');
    req.flush(mockSvg);
    fixture.detectChanges();

    setTimeout(() => {
      const quadrizepsRect = component['svgElement']?.querySelector('#Quadrizeps') as HTMLElement;
      const brustRect = component['svgElement']?.querySelector('#Brust') as HTMLElement;

      expect(quadrizepsRect.style.fill).toEqual('#ccc'); // Quadrizeps should be reset to default
      expect(brustRect.style.fill).not.toEqual('#ccc'); // Brust should be colored
      done();
    }, 0);
  });
});