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

SingleMap.init = function (divId, options) {
  //sezione options
  SingleMap.options.jsonUrl = options.jsonUrl ? options.jsonUrl : null;
  SingleMap.options.pointColor = options.pointColor ? options.pointColor : [0, 0, 255];
  SingleMap.options.fillColor = options.fillColor ? options.fillColor : [0, 255, 0];
  SingleMap.options.circleWidth = options.circleWidth ? options.circleWidth : 2;
  SingleMap.options.circleRadius = options.circleRadius ? options.circleRadius : 7;
  SingleMap.options.tooltipProperty = options.tooltipProperty ? options.tooltipProperty : 7;

  if (options.featureTemplate) {
    SingleMap.options.featureTemplate = options.featureTemplate;
  }

  var elem = document.querySelector('#' + divId);
  elem.innerHTML = `<div id="sl-map" class="sl-map sl-box"></div>
  <div id="sl-tools" class="sl-tools sl-box">
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



