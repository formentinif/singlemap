
SingleMap.hideMapTooltip = function () {
    SingleMap.mapTooltip.setPosition(undefined);
    return false;
};

SingleMap.showMapTooltip = function (coordinates, title) {
    if (!title) {
        SingleMap.hideMapTooltip();
        return;
    }
    //let labelPoint = LamMap.getLabelPoint(coordinates);
    let toolTip = document.querySelector("#sl-tooltip");
    let tooltipTitle = document.querySelector("#sl-tooltip-title");
    SingleMap.show(toolTip);
    tooltipTitle.innerHTML = title;
    SingleMap.mapTooltip.setPosition(coordinates);
};

SingleMap.mouseHoverMapTooltip = function () {
    if (!SingleMap.lastMousePixel) return;
    let featureFound = null;
    SingleMap.map.forEachFeatureAtPixel(SingleMap.lastMousePixel, function (feature, layer) {
        featureFound = feature.clone();
    });
    if (!featureFound) {
        SingleMap.hideMapTooltip();
    } else {
        SingleMap.showInfoFeatureTooltipAtPixel(featureFound, SingleMap.lastMousePixel);
    }
};

SingleMap.showInfoFeatureTooltipAtPixel = function (feature, pixel) {
    let coordinate = SingleMap.map.getCoordinateFromPixel(pixel);
    let tooltip = feature.getProperties()[SingleMap.options.tooltipProperty];
    SingleMap.showMapTooltip(coordinate, tooltip);
};