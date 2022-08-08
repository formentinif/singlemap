SingleMap.InitMap = function () {
    SingleMap.circleStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [255, 255, 255, 0.01],
        }),
        stroke: new ol.style.Stroke({
            color: [255, 255, 255, 0.01],
            width: 1,
        }),
        image: new ol.style.Circle({
            radius: SingleMap.options.circleRadius,
            fill: new ol.style.Fill({
                color: SingleMap.options.fillColor,
            }),
            stroke: new ol.style.Stroke({
                color: SingleMap.options.pointColor,
                width: 2,
            })
        }),
    })

    SingleMap.vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: SingleMap.options.jsonUrl,
            format: new ol.format.GeoJSON(),
        }),
        style: SingleMap.circleStyle
    });

    const raster = new ol.layer.Tile({
        source: new ol.source.OSM(),
    });

    SingleMap.map = new ol.Map({
        layers: [raster, SingleMap.vectorLayer],
        target: 'sl-map',
        view: new ol.View({
            center: [1183579, 5574120],
            zoom: 15,
        }),
    });


    SingleMap.mapTooltip = new ol.Overlay({
        element: document.getElementById("sl-tooltip"),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    SingleMap.map.addOverlay(SingleMap.mapTooltip);



    /*eventi mappa */
    SingleMap.map.on("pointermove", function (evt) {
        SingleMap.hideMapTooltip();
        if (typeof lastTimeoutRequest !== "undefined") {
            clearTimeout(lastTimeoutRequest);
        }
        SingleMap.lastMousePixel = evt.pixel;
        lastTimeoutRequest = setTimeout(SingleMap.mouseHoverMapTooltip, 500);
        var hit = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return true;
        });
        if (hit) {
            this.getTargetElement().style.cursor = 'pointer';
        } else {
            this.getTargetElement().style.cursor = '';
        }
    });

    //Caricamento delle feature tool
    setTimeout(() => {
        layer = SingleMap.map.getLayers().item(1);
        SingleMap.features = layer.getSource().getFeatures();
        SingleMap.filteredFeatures = SingleMap.features;
        SingleMap.showFeatures()
    }, 2000);
}