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

    SingleMap.map.on("click", function (evt) {
        SingleMap.lastMouseClickPixel = evt.pixel;
        this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            SingleMap.filterSingleFeature(feature);
        });
    });

    SingleMap.goToLonLat = function (lon, lat, zoom) {
        if (!zoom) {
            zoom = 16;
        }
        let point = new ol.geom.Point([lon, lat]);
        if (lon < 180) {
            point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
        } else {
            point = [lon, lat];
        }
        SingleMap.map.setView(
            new ol.View({
                center: point,
                zoom: zoom,
            })
        );
    };

    // let addFeatureFlashToMap = function (feature) {
    //     let featureOl = LamMap.convertGeoJsonFeatureToOl(payload.feature);
    //     featureOl = LamMap.transform3857(featureOl, featureOl.srid);
    //     LamMapInfo.addFeatureFlashToMap(featureOl);
    //     setTimeout(function () {
    //         LamMapInfo.clearLayerFlash();
    //     }, 800);
    // };

    // let addFeatureFlashToMap = function (feature) {
    //     return LamMap.addFeatureToMap(feature, feature.srid, vectorFlash);
    // };
    // let clearLayerFlash = function () {
    //     vectorFlash.getSource().clear(true);
    // };


    SingleMap.transformGeometrySrid = function (geometryOl, sridSource, sridDest) {
        return geometryOl.transform("EPSG:" + sridSource, "EPSG:" + sridDest);
    };

    SingleMap.ZoomAndFlashFeature = function (id) {
        let featureZoom = SingleMap.features.filter(element => {
            return element.id = id;
        })
        featureZoom = featureZoom[0];
        if (!featureZoom) return;

        //coordinata centrale
        var coordinates = featureZoom.getGeometry().getCoordinates();
        if (coordinates[0][0]) {
            SingleMap.goToLonLat(coordinates[0][0], coordinates[0][1]);
        } else {
            SingleMap.goToLonLat(coordinates[0], coordinates[1]);
        }

        //LamMapInfo.addFeatureFlashToMap(featureOl);
        //setTimeout(function () {
        //    LamMapInfo.clearLayerFlash();
        //}, 800);
    }




    //Caricamento delle feature tool
    setTimeout(() => {
        layer = SingleMap.map.getLayers().item(1);
        SingleMap.features = layer.getSource().getFeatures();
        SingleMap.filteredFeatures = SingleMap.features;
        SingleMap.showFeatures()
    }, 2000);

}