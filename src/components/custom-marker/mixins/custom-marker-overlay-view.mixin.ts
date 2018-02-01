type Constructor<T> = new(...args: any[]) => T;

export function CustomMarkerOverlayView<
    TClass extends Constructor<google.maps.OverlayView>
>(OverlayView: TClass) {
    return class extends OverlayView {
        private htmlEl: HTMLElement;
        private position: any;
        private zIndex: string;
        private visible: boolean = true;

        constructor(...args: any[]) {
            super();

            this.htmlEl = args[0];
            this.position = args[1];
        }

        onAdd(): void {
            this.getPanes().overlayMouseTarget.appendChild(this.htmlEl);

            // required for correct display inside google maps container
            this.htmlEl.style.position = 'absolute';
        }

        draw(): void {
            this.setPosition(this.position);
            this.setZIndex(this.zIndex);
            this.setVisible(this.visible);
        }

        onRemove(): void {
            //
        }

        getPosition() {
            return this.position;
        }

        setPosition = (position?: any) => {
            this.htmlEl.style.visibility = 'hidden';

            if (position.constructor.name === 'Array') {
                this.position = new google.maps.LatLng(position[0], position[1]);
            } else if (typeof position === 'string') {
                let geocoder = new google.maps.Geocoder();

                geocoder.geocode({ address: position }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        console.log('setting custom marker position from address', position);
                        this.setPosition(results[0].geometry.location);
                    } else {
                        console.log('Error in custom marker geo coding, position');
                    }
                });
            } else if (position && typeof position.lng === 'function') {
                this.position = position;
            }

            const projection = this.getProjection();

            if (projection && typeof this.position.lng === 'function') {
                let positionOnMap = () => {
                    let posPixel = projection.fromLatLngToDivPixel(this.position);
                    let x = Math.round(posPixel.x - (this.htmlEl.offsetWidth / 2));
                    let y = Math.round(posPixel.y - this.htmlEl.offsetHeight / 2);
                    this.htmlEl.style.left = x + 'px';
                    this.htmlEl.style.top = y + 'px';
                    this.htmlEl.style.visibility = 'visible';
                };

                if (this.htmlEl.offsetWidth && this.htmlEl.offsetHeight) {
                    positionOnMap();
                } else {
                    setTimeout(() => positionOnMap());
                }
            }
        }

        setZIndex(zIndex: string): void {
            zIndex && (this.zIndex = zIndex); /* jshint ignore:line */
            this.htmlEl.style.zIndex = this.zIndex;
        }

        setVisible(visible: boolean) {
            this.htmlEl.style.display = visible ? 'inline-block' : 'none';
            this.visible = visible;
        }
    };
}