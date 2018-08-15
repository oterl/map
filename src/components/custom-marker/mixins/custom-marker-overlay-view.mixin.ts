type Constructor<T> = new(...args: any[]) => T;

export function CustomMarkerOverlayView<
    TClass extends Constructor<google.maps.OverlayView>
>(OverlayView: TClass) {
    return class extends OverlayView {
        _draggable: boolean;
        _htmlElement: HTMLElement;
        _map: google.maps.Map;
        _position: google.maps.LatLng;
        _zIndex: string;
        _dragOrigin: MouseEvent;
        _mouseLeaveMapListener: google.maps.MapsEventListener;
        _mouseDownListerer: google.maps.MapsEventListener;
        _mouseUpListener: google.maps.MapsEventListener;
        _moveHandler: google.maps.MapsEventListener;

        get mapElement(): Element {
            const map = this._map;
            return map instanceof google.maps.Map && map.getDiv();
        }

        /**
         * @param args First ramameter is HTMLElement, second is
         * { lat: number, lng: number } or google.maps.LatLng, third is draggable
         */
        constructor(...args: any[]) {
            super();

            this._htmlElement = args[0];
            this._draggable = args[2] || false;

            const position = args[1];
            this._position = position instanceof google.maps.LatLng
                ? position
                : new google.maps.LatLng(+position.lat, +position.lng);
        }

        onAdd(): void {
            this.getPanes().overlayMouseTarget.appendChild(this._htmlElement);
            this._htmlElement.style.position = 'absolute';
        }

        draw(): void {
            this.setPosition(this._position);
            this.setZIndex(this._zIndex);
            this.setVisible(true);
        }

        onRemove(): void {
            google.maps.event.clearInstanceListeners(this._htmlElement);

            if (this._draggable) {
                this._mouseLeaveMapListener.remove();
            }

            if (this._htmlElement.parentElement) {
                this._htmlElement.parentElement.removeChild(this._htmlElement);
            }
        }

        getPosition() {
            return this._position;
        }

        setMap(map: google.maps.Map) {
            this._map = map;
            super.setMap(map);

            if (this._map && this._draggable) {
                this._initDraggable();
            }
        }

        setPosition = (position: google.maps.LatLng) => {
            this._position = position;
            const projection = this.getProjection();

            if (projection) {
                let posPixel = projection.fromLatLngToDivPixel(this._position);
                this._htmlElement.style.left = Math.round(posPixel.x) + 'px';
                this._htmlElement.style.top = Math.round(posPixel.y) + 'px';
            }
        }

        setZIndex(zIndex: string): void {
            zIndex && (this._zIndex = zIndex);
            this._htmlElement.style.zIndex = this._zIndex;
        }

        setVisible(visible: boolean) {
            this._htmlElement.style.display = visible ? 'inline-block' : 'none';
        }

        setDraggable(draggable: boolean) {
            if (this._draggable === draggable) {
                return;
            }

            this._draggable = draggable;

            if (draggable) {
                this._initDraggable();
                return;
            }

            this._disposeDragEvents();
        }

        getDraggable() {
            return this._draggable;
        }

        _disposeDragEvents() {
            if (this._mouseDownListerer) {
                this._mouseDownListerer.remove();
            }

            if (this._mouseUpListener) {
                this._mouseUpListener.remove();
            }

            if (this._moveHandler) {
                this._moveHandler.remove();
            }
        }

        _initDraggable() {
            const addDomListener = google.maps.event.addDomListener;

            this._htmlElement.draggable = true;

            this._mouseLeaveMapListener = addDomListener(
                this.mapElement,
                'mouseleave',
                () => this._dragOrigin && this._onDragEnd()
            );

            // TODO: check if we can use event as parameter
            this._mouseDownListerer = addDomListener(
                this._htmlElement,
                'mousedown',
                (event: MouseEvent) => {
                    this._map.set('draggable', false);
                    this._dragOrigin = event;

                    this._moveHandler = addDomListener(
                        this.mapElement,
                        'mousemove',
                        (event: MouseEvent) => {
                            const origin = this._dragOrigin;

                            if (!origin) {
                                return;
                            }

                            const leftOffset = origin.clientX - event.clientX;
                            const topOffset = origin.clientY - event.clientY;
                            const currentPositionPx = this.getProjection()
                                .fromLatLngToDivPixel(this._position);

                            const nextLatLng = this.getProjection()
                                .fromDivPixelToLatLng(
                                    new google.maps.Point(
                                        Math.round(currentPositionPx.x - leftOffset),
                                        Math.round(currentPositionPx.y - topOffset)
                                    )
                                );

                            this._dragOrigin = event;
                            this._position = nextLatLng;
                            this.draw();
                        }
                    );
                }
            );

            this._mouseUpListener = addDomListener(
                this._htmlElement,
                'mouseup',
                () => this._dragOrigin && this._onDragEnd()
            );
        }

        _onDragEnd() {
            this._map.set('draggable', true);
            this._dragOrigin = null;
            this._moveHandler.remove();
            google.maps.event.trigger(
                this,
                'dragend',
                this._position
            );
        }
    };
}