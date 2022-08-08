SingleMap.search = function () {
    let searchItem = document.querySelector('#sl-search');
    let searchValue = searchItem.value.toLowerCase();
    let filteredFeatures = [];
    SingleMap.features.forEach(element => {
        let keys = element.getKeys();
        let featureFound = false;
        keys.forEach(key => {
            if (key != "geometry") {
                let propValue = String(element.getProperties()[key]).toLowerCase();
                if (propValue.includes(searchValue))
                    featureFound = true;
            }
        });
        if (featureFound) filteredFeatures.push(element);
    });
    SingleMap.filteredFeatures = filteredFeatures;
    SingleMap.showFeatures();
}
SingleMap.filterSingleFeature = function (feature) {
    SingleMap.filteredFeatures = [feature];
    SingleMap.showFeatures();
}

SingleMap.showFeatures = function () {
    var html = '';
    if (!SingleMap.options.featureTemplate) {
        html = SingleMap.Templates.GetDefaultTemplate(SingleMap.filteredFeatures);
    } else {
        html = SingleMap.Templates.GetCustomTemplate(SingleMap.filteredFeatures, SingleMap.options.featureTemplate);
    }
    var elem = document.querySelector('#sl-info');
    elem.innerHTML = html;
};
SingleMap.Templates = {}

SingleMap.Templates.GetDefaultTemplate = function (features) {
    let html = '';
    features.forEach(element => {
        let keys = element.getKeys();
        html += '<div class="feature">';
        keys.forEach(key => {
            if (key != "geometry") {
                html += `
        <div>${key}: ${element.getProperties()[key]} </div>`;
            }
        });
        html += '</div>';
    });
    return html;
}

SingleMap.Templates.GetCustomTemplate = function (features, template) {
    let html = '';
    features.forEach(element => {
        let keys = element.getKeys();
        let props = element.getProperties();
        let featureTooltip = SingleMap.options.tooltipProperty ? props[SingleMap.options.tooltipProperty] : "";

        html += '<div class="sl-card">';
        html += `<div class="sl-card-title">${featureTooltip}</div>`;
        template.forEach(item => {
            let featureTitle = '';
            let featureContent = '';

            keys.forEach(key => {
                if (key == item.propertyName) {
                    featureTitle = item.propertyTitle;
                    featureContent = props[key];
                }
            });
            if (featureTitle) {
                html += `
                <div><span class="sl-feature-title">${featureTitle}:</span> ${featureContent} </div>
                `;
            }
        });

        let clone = element.clone();
        let geometryLL = clone.getGeometry().transform("EPSG:" + 3857, "EPSG:" + 4326);
        let coordinates = geometryLL.getCoordinates();
        if (geometryLL.getType() !== "Point") {
            coordinates = geometryLL.getInteriorPoint().getCoordinates();
        }
        html += `<div class="sl-card-footer">
                <div class="sl-card-footer-item">
                <a href='#' onclick="SingleMap.ZoomAndFlashFeature('${element.getId()}');return false;">${SingleMapResources.svgMarker}</a>
                </div>
                <div class="sl-card-footer-item">
    
                <a target='_blank' href='https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}&'>
                <i title='Apri in Google' class='lam-feature__icon'>
                ${SingleMapResources.svgGoogle}
                </i></a>
                </div>
                <div class="sl-card-footer-item">
                <a target='_blank' href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coordinates[1]},${coordinates[0]}&'>
                <i title='Apri in Google Street View' class='lam-feature__icon'>
                ${SingleMapResources.svgStreetView}
                </i></a>
                </div>
                </div>`;
        html += '</div>';

    });
    return html;
}
