type Constructor<T> = new(...args: any[]) => T;

export function CustomMarkerOverlayView<
    TClass extends Constructor<google.maps.OverlayView>
>(OverlayView: TClass) {
    return class extends OverlayView {
        private htmlEl: HTMLElement;
        private position: google.maps.LatLng;
        private zIndex: string;
        private visible: boolean = true;

        /**
         * @param args First ramameter is HTMLElement, second is
         *             { lat: number, lng: number } or google.maps.LatLng
         */
        constructor(...args: any[]) {
            super();

            this.htmlEl = args[0];

            const position = args[1];
            this.position = position instanceof google.maps.LatLng
                ? position
                : new google.maps.LatLng(+position.lat, +position.lng);
        }

        onAdd(): void {
            this.getPanes().overlayMouseTarget.appendChild(this.htmlEl);

            // Required for correct display inside google maps container
            this.htmlEl.style.position = 'absolute';
        }

        draw(): void {
            this.setPosition(this.position);
            this.setZIndex(this.zIndex);
            this.setVisible(true);
        }

        onRemove(): void {
            const panes = this.getPanes();

            if (panes) {
                panes.overlayMouseTarget.removeChild(this.htmlEl);
            }

            if (this.htmlEl.parentElement) {
                this.htmlEl.parentElement.removeChild(this.htmlEl);
            }
        }

        getPosition() {
            return this.position;
        }

        setPosition = (position: google.maps.LatLng) => {
            const projection = this.getProjection();

            if (projection) {
                let posPixel = projection.fromLatLngToDivPixel(this.position);
                let x = Math.round(posPixel.x - (this.htmlEl.offsetWidth / 2));
                let y = Math.round(posPixel.y - this.htmlEl.offsetHeight / 2);
                this.htmlEl.style.left = x + 'px';
                this.htmlEl.style.top = y + 'px';
            }
        }

        setZIndex(zIndex: string): void {
            zIndex && (this.zIndex = zIndex);
            this.htmlEl.style.zIndex = this.zIndex;
        }

        setVisible(visible: boolean) {
            this.visible = visible;
            this.htmlEl.style.display = visible ? 'inline-block' : 'none';
        }

        // TODO: implement custom marker dragging
        getDraggable() {
            return false;
        }
    };
}