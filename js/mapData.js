class Location {
    name = null;
    longitude = 0;
    latitude = 0;

    color = null;

    constructor(name, longitude, latitude, color) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.color = color;
    }

    getColorString() {
        return "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ")";
    }
    
    equals(other) {
        return  this.name === other.name &&
                this.longitude === other.longitude &&
                this.latitude === other.latitude &&
                this.color.r === other.color.r &&
                this.color.g === other.color.g &&
                this.color.b === other.color.b
        ;
    }


    static colorFromHex(hexString) {
        return {
            r: parseInt(hexString.substr(0, 2), 16),
            g: parseInt(hexString.substr(2, 2), 16),
            b: parseInt(hexString.substr(4, 2), 16)
        };
    }
}




class MapData {
    locations;

    width;
    height;

    legendEnabled;
    legendSize;
    
    marksEnabled;
    markSize;


    static elements;


    constructor(locations, width, height, legendEnabled, legendSize, marksEnabled, markSize) {
        this.locations = locations;
        this.width = width;
        this.height = height;
        this.legendEnabled = legendEnabled;
        this.legendSize = legendSize;
        this.marksEnabled = marksEnabled;
        this.markSize = markSize;
    }

    static createEmpty() {
        return new MapData([], mapSource.pathWidth, mapSource.pathHeight, true, 5, true, 4);
    }

    static createDefault() {
        let newMapData = MapData.createEmpty();
        //Default map
        newMapData.addLocation(new Location("Sydney", 151.215304, -33.856655, Location.colorFromHex(presetColors[1])));
        newMapData.addLocation(new Location("New York", -74.044617, 40.689313, Location.colorFromHex(presetColors[2])));
        newMapData.addLocation(new Location("London", -0.076068, 51.507688, Location.colorFromHex(presetColors[3])));
        newMapData.addLocation(new Location("Shanghai", 121.810656, 31.147592, Location.colorFromHex(presetColors[4])));
        return newMapData;
    }




    /*
        Map configuration methods
    */
    addLocation(location, applyToUI = true) {
        this.locations.push(location);
        if(applyToUI) {
            this.applyToUI();
        }
    }

    setLocation(index, location, applyToUI = true) {
        this.locations[index] = location;
        if(applyToUI) {
            this.applyToUI();
        }
    }

    removeLocation(index, applyToUI = true) {
        this.locations.splice(index, 1);
        if(applyToUI) {
            this.applyToUI();
        }
    }




    /*
        UI
    */
    static bindUI(textFieldWidthEID, textFieldHeightEID, switchLegendEnabledEID, rangeLegendSizeEID, switchMarksEnabledEID, rangeMarkSizeEID, tBodyLocationsListEID, textFieldLocNameEID, pickerLocColorEID, textFieldLocLongitudeEID, textFieldLocLatitudeEID, btnCreateMapEID, btnResetEID, btnSetLocationEID, btnDownloadEID, textFileInfoEID, warningMapSizeEID) {
        MapData.elements = {
            textFieldWidthE:        document.getElementById(textFieldWidthEID),
            textFieldHeightE:       document.getElementById(textFieldHeightEID),
            switchLegendEnabledE:   document.getElementById(switchLegendEnabledEID),
            rangeLegendSizeE:       document.getElementById(rangeLegendSizeEID),
            switchMarksEnabledE:    document.getElementById(switchMarksEnabledEID),
            rangeMarkSizeE:         document.getElementById(rangeMarkSizeEID),
            tBodyLocationsListE:    document.getElementById(tBodyLocationsListEID),
            textFieldLocNameE:      document.getElementById(textFieldLocNameEID),
            pickerLocColorE:        document.getElementById(pickerLocColorEID),
            textFieldLocLongitudeE: document.getElementById(textFieldLocLongitudeEID),
            textFieldLocLatitudeE:  document.getElementById(textFieldLocLatitudeEID),

            btnCreateMapE:          document.getElementById(btnCreateMapEID),
            btnResetE:              document.getElementById(btnResetEID),
            btnSetLocationE:        document.getElementById(btnSetLocationEID),

            btnDownloadE:           document.getElementById(btnDownloadEID),
            textFileInfoE:          document.getElementById(textFileInfoEID),

            warningMapSizeE:        document.getElementById(warningMapSizeEID)
        };


        //Set minimum values for width and height inputs
        MapData.elements.textFieldWidthE.min = Math.floor(mapSource.pathWidth / 10);
        MapData.elements.textFieldHeightE.min = Math.floor(mapSource.pathHeight / 10);


        MapData.elements.textFieldWidthE.addEventListener('input', MapData.updateAll);
        MapData.elements.textFieldHeightE.addEventListener('input', MapData.updateAll);
        MapData.elements.switchLegendEnabledE.addEventListener('input', MapData.updateAll);
        MapData.elements.rangeLegendSizeE.addEventListener('input', MapData.updateAll);
        MapData.elements.switchMarksEnabledE.addEventListener('input', MapData.updateAll);
        MapData.elements.rangeMarkSizeE.addEventListener('input', MapData.updateAll);
        MapData.elements.textFieldLocLongitudeE.addEventListener('input', MapData.updateAll);
        MapData.elements.textFieldLocLatitudeE.addEventListener('input', MapData.updateAll);

        MapData.elements.btnSetLocationE.addEventListener('click', () => {
            let location = new Location(
                MapData.elements.textFieldLocNameE.value,
                MapData.elements.textFieldLocLongitudeE.value,
                MapData.elements.textFieldLocLatitudeE.value,
                {
                    r: MapData.elements.pickerLocColorE.jscolor.channel("R"),
                    g: MapData.elements.pickerLocColorE.jscolor.channel("G"),
                    b: MapData.elements.pickerLocColorE.jscolor.channel("B")
                }
            );

            if(MapData.currentLocationEditIndex == -1) {
                mapData.addLocation(location);
            } else {
                mapData.setLocation(MapData.currentLocationEditIndex, location);
                MapData.quitEditMode();
            }
        });

        MapData.elements.btnCreateMapE.addEventListener('click', () => {
            mapRenderer.createMap(mapData);

            setElementEnabled(MapData.elements.btnDownloadE, true);
            MapData.elements.textFileInfoE.innerHTML = "PNG " + mapData.width + " x " + mapData.height + " pixels | ~" + formatSizeString(mapRenderer.getApproximateFileSize());
        });

        MapData.elements.btnResetE.addEventListener('click', () => {
            MapData.resetLocationFields();

            mapData = MapData.createDefault();
            mapData.applyToUI();

            MapData.quitEditMode();
        });


        MapData.elements.btnDownloadE.addEventListener('click', () => {
            mapRenderer.downloadMap();
        });
    }

    updateMapSettings() {
        this.width = MapData.elements.textFieldWidthE.value;
        this.height = MapData.elements.textFieldHeightE.value;
        this.legendEnabled = MapData.elements.switchLegendEnabledE.checked;
        this.legendSize = MapData.elements.rangeLegendSizeE.value;
        this.marksEnabled = MapData.elements.switchMarksEnabledE.checked;
        this.markSize = MapData.elements.rangeMarkSizeE.value;
    }

    static updateAll() {
        mapData.updateMapSettings();
        mapData.updateMapSizeWarning();
        setTimeout(() => {
            mapData.updateControlsEnabled(); //Run this asynchonously after the validity status of the input fields has been updated
        }, 1);
    }

    applyToUI() {
        MapData.elements.textFieldWidthE.value = this.width;
        MapData.elements.textFieldHeightE.value = this.height;
        MapData.elements.switchLegendEnabledE.checked = this.legendEnabled;
        MapData.elements.rangeLegendSizeE.value = this.legendSize;
        MapData.elements.switchMarksEnabledE.checked = this.marksEnabled;
        MapData.elements.rangeMarkSizeE.value = this.markSize;

        MapData.elements.tBodyLocationsListE.innerHTML = "";
        this.locations.forEach((location, index) => {
            MapData.elements.tBodyLocationsListE.innerHTML += MapData.createLocationsListEntry(location, index);
        });

        M.updateTextFields();

        this.updateControlsEnabled();
        this.updateMapSizeWarning();
    }


    updateControlsEnabled() {
        setElementEnabled(MapData.elements.btnCreateMapE,
                                                            numberInputIsValid(MapData.elements.textFieldWidthE, true) &&
                                                            numberInputIsValid(MapData.elements.textFieldHeightE, true) &&
                                                            this.locations.length > 1
        );
        setElementEnabled(MapData.elements.btnSetLocationE, 
                                                            numberInputIsValid(MapData.elements.textFieldLocLongitudeE, true) &&
                                                            numberInputIsValid(MapData.elements.textFieldLocLatitudeE, true)
        );


        setElementEnabled(MapData.elements.rangeLegendSizeE, 
            this.legendEnabled
        );

        setElementEnabled(MapData.elements.rangeMarkSizeE, 
            this.marksEnabled
        );
    }


    updateMapSizeWarning() {
        let sizeIsOptimal = Math.abs((this.width / this.height) - (mapSource.pathWidth / mapSource.pathHeight)) < 0.35 || !numberInputIsValid(MapData.elements.textFieldWidthE, true) || !numberInputIsValid(MapData.elements.textFieldHeightE, true);
        MapData.elements.warningMapSizeE.style.visibility = sizeIsOptimal ? "hidden" : "visible";
    }




    /*
        Locations list
    */
    static currentLocationEditIndex = -1;

    static createLocationsListEntry(location, index) {
        return `
            <tr>
                <td><div class="color_dot" style="background-color: rgb(` + location.color.r + `, ` + location.color.g + `, ` + location.color.b + `);"></div></td>
                <td>` + location.name + `</td>
                <td>` + location.longitude + `°</td>
                <td>` + location.latitude + `°</td>
                <td class="td_btns right-align">
                    <a class="btn icon_btn btn_light grey lighten-2 waves-effect waves-light" onclick="mapData.toggleLocationsListEntryEditMode(this, ` + index + `);"><i class="material-icons left">edit</i></a>
                    <a class="btn icon_btn btn_light grey lighten-2 waves-effect waves-light" onclick="mapData.removeLocation(` + index + `); MapData.quitEditMode();"><i class="material-icons left">delete</i></a>
                </td>
            </tr>
        `;
    }

    toggleLocationsListEntryEditMode(buttonE, index) {
        MapData.showEditLocationButton(buttonE);
        
        if(MapData.currentLocationEditIndex == index) {
            MapData.currentLocationEditIndex = -1;
        } else {
            MapData.elements.textFieldLocNameE.value = mapData.locations[index].name;
            MapData.elements.pickerLocColorE.jscolor.fromRGBA(mapData.locations[index].color.r, mapData.locations[index].color.g, mapData.locations[index].color.b, 255);
            MapData.elements.textFieldLocLongitudeE.value = mapData.locations[index].longitude;
            MapData.elements.textFieldLocLatitudeE.value = mapData.locations[index].latitude;

            this.updateControlsEnabled();

            M.updateTextFields();
            MapData.currentLocationEditIndex = index;
        }
    }

    static showEditLocationButton(buttonE) {
        let editButtonElements = document.querySelectorAll(".td_btns .icon_btn");
        editButtonElements.forEach(currentBtnE => {
            if(currentBtnE == buttonE) {
                currentBtnE.classList.toggle("active");
            } else {
                currentBtnE.classList.remove("active");
            }
        });
    }

    static quitEditMode() {
        MapData.showEditLocationButton(null);   //Hide all edit buttons
        MapData.currentLocationEditIndex = -1;
    }

    static resetLocationFields() {
        MapData.elements.textFieldLocNameE.value = "";
        MapData.elements.pickerLocColorE.jscolor.fromString(presetColors[1]);
        MapData.elements.textFieldLocLongitudeE.value = "";
        MapData.elements.textFieldLocLatitudeE.value = "";

        M.updateTextFields();
    }




    /*
        Configuration saving/restoring
    */
    static loadFromStorage() {
        let data = JSON.parse(localStorage.getItem("mapDataSave"));
        if(!data) {
            return this.createDefault();
        }

        return Object.assign(new MapData(), data);
    }

    saveToStorage() {
        localStorage.setItem("mapDataSave", JSON.stringify(this));
    }





    equals(other) {
        return  this.locations === other.locations &&
                this.width === other.width &&
                this.height === other.height &&
                this.legendEnabled === other.legendEnabled &&
                this.legendSize === other.legendSize &&
                this.marksEnabled === other.marksEnabled &&
                this.markSize === other.markSize
        ;
    }
}