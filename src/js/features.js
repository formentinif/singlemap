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
