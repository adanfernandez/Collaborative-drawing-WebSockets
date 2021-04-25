import { Component,OnInit,  ViewChild,  ElementRef,  HostListener,  AfterViewInit} from "@angular/core";
import { fromEvent, combineLatest } from "rxjs";
import { filter, tap, concatMap, mergeMap, takeUntil } from "rxjs/operators";
import { Direction } from "./model/direction";
import { DistanceConfig } from "./model/distanceConfig";




@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  name = "Angular";
  cx;
  canvas = { width: 500, height: 500 };
  currentLocation = { x: 200, y: 200 };
  preDirection: string;

  locationList = [];

  @ViewChild("myCanvas", { static: false }) myCanvas: ElementRef;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

    const mouseDown$ = fromEvent(this.myCanvas.nativeElement, "mousedown");
    const mouseMove$ = fromEvent(this.myCanvas.nativeElement, "mousemove");
    const mouseUp$ = fromEvent(this.myCanvas.nativeElement, "mouseup");

    mouseDown$.pipe(concatMap(down => mouseMove$.pipe(takeUntil(mouseUp$))));

    const mouseDraw$ = mouseDown$.pipe(
      tap((e: MouseEvent) => {
        this.cx.moveTo(e.offsetX, e.offsetY);
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );

    mouseDraw$.subscribe((e: MouseEvent) => this.draw(e.offsetX, e.offsetY));
  }

  draw(offsetX, offsetY) {
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }


  excuteAutoDraw() {
    const direction = this.getDirection();

      const distance = DistanceConfig[direction];
      const newLocation = { ...this.currentLocation };
      newLocation.x = newLocation.x + distance.x;
      newLocation.y = newLocation.y + distance.y;

      if (this.isNewPath(newLocation)) {
        this.cx.moveTo(this.currentLocation.x, this.currentLocation.y);
        this.cx.lineTo(newLocation.x, newLocation.y);
        this.cx.stroke();

        this.currentLocation = newLocation;
        this.locationList.push(newLocation);
      }

  }

  isNewPath(newLoc: { x: number; y: number }) {
    const idx = this.locationList.findIndex(
      oldLoc => oldLoc.x === newLoc.x && oldLoc.y == newLoc.y
    );
    return idx == -1;
  }

  getDirection() {
    const idx = Math.floor(Math.random() * 4);
    return Direction[idx];
  }

}
