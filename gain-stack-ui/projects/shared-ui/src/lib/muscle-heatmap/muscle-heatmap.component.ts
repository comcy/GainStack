import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-muscle-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muscle-heatmap.component.html',
  styleUrl: './muscle-heatmap.component.scss'
})
export class MuscleHeatmapComponent implements OnInit, OnChanges {
  @Input() trainedMuscleGroups: { name: string; intensity: number }[] = [];
  svgContent: SafeHtml | null = null;

  private svgElement: SVGElement | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadSvg();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trainedMuscleGroups'] && this.svgElement) {
      this.applyHeatmapColors();
    }
  }

  private loadSvg(): void {
    this.http.get('assets/muscle-heatmap.svg', { responseType: 'text' }).subscribe({
      next: (svgText) => {
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgText);
        // Give Angular a moment to render the SVG before accessing it
        setTimeout(() => {
          const svgContainer = document.querySelector('.muscle-heatmap-container');
          if (svgContainer) {
            this.svgElement = svgContainer.querySelector('svg');
            this.applyHeatmapColors();
          }
        }, 0);
      },
      error: (err) => {
        console.error('Error loading SVG:', err);
      }
    });
  }

  private applyHeatmapColors(): void {
    if (!this.svgElement) {
      return;
    }

    // Reset all muscle groups to default color first
    const allRects = this.svgElement.querySelectorAll('rect');
    allRects.forEach(rect => {
      rect.style.fill = '#ccc'; // Default grey
    });

    this.trainedMuscleGroups.forEach(group => {
      const muscleElement = this.svgElement?.querySelector(`#${group.name}`);
      if (muscleElement) {
        // Apply color based on intensity (0-1 range for simplicity, adjust as needed)
        const color = this.getColorForIntensity(group.intensity);
        (muscleElement as HTMLElement).style.fill = color;
      }
    });
  }

  // Simple color scale: blue (0) to red (1)
  private getColorForIntensity(intensity: number): string {
    // Ensure intensity is between 0 and 1
    intensity = Math.max(0, Math.min(1, intensity));

    const hue = (1 - intensity) * 240; // 240 (blue) to 0 (red)
    return `hsl(${hue}, 100%, 50%)`;
  }
}