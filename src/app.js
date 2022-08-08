// import Feature from 'ol/Feature';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector'
// import Map from 'ol/Map';
// import Point from 'ol/geom/Point';
// import View from 'ol/View';
// import GeoJSON from 'ol/format/GeoJSON';
// import {
//   Circle as CircleStyle,
//   Fill,
//   Stroke,
//   Style,
//   Text,
// } from 'ol/style';
// import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
// import { boundingExtent } from 'ol/extent';

// const circleStyle = new Style({
//   fill: new Fill({
//     radius: 14,
//     color: '#eeeeee',
//   }),
// });


var SingleMap = {}
SingleMap.options = {}




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
    let tooltip = feature.getProperties()[SingleMap.tooltipProperty];
    SingleMap.showMapTooltip(coordinate, tooltip);
  };

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
}



setTimeout(() => {
  layer = SingleMap.map.getLayers().item(1);
  SingleMap.features = layer.getSource().getFeatures();
  SingleMap.filteredFeatures = SingleMap.features;
  SingleMap.showFeatures()
}, 2000);



SingleMap.showFeatures = function () {
  var html = '';
  SingleMap.filteredFeatures.forEach(element => {
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
  var elem = document.querySelector('#sl-info');
  elem.innerHTML = html;
};


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





SingleMap.init = function (divId, options) {

  //sezione options
  SingleMap.options.jsonUrl = options.jsonUrl ? options.jsonUrl : null;
  SingleMap.options.pointColor = options.pointColor ? options.pointColor : [0, 0, 255];
  SingleMap.options.fillColor = options.fillColor ? options.fillColor : [0, 255, 0];
  SingleMap.options.circleWidth = options.circleWidth ? options.circleWidth : 2;
  SingleMap.options.circleRadius = options.circleRadius ? options.circleRadius : 7;
  SingleMap.options.tooltipProperty = options.tooltipProperty ? options.tooltipProperty : 7;

  var elem = document.querySelector('#' + divId);
  elem.innerHTML = `<div id="sl-map" class="sl-map"></div>
  <div id="sl-tools" class="sl-info">
    <input type="search" id="sl-search" class="sl-input">
    <button onclick="SingleMap.search();" class="sl-btn">Ricerca</button>
  </div>
  <div id="sl-tooltip" class="sl-map-tooltip">
  <span id="sl-tooltip-title" class="sl-map-tooltip-title"></span>
  </div>
  <div id="sl-info" class="sl-info">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>`;
  SingleMap.InitMap();

};


SingleMap.show = function (elem) {
  elem.style.display = 'block';
};

SingleMap.hide = function (elem) {
  elem.style.display = 'none';
};

SingleMap.toggle = function (elem) {
  if (window.getComputedStyle(elem).display === 'block') {
    hide(elem);
    return;
  }
  show(elem);
};