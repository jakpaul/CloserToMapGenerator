//These variables must be global!
let mapRenderer = null;
let mapData = null;

let presetColors = [
    "000000",                              //Black
    "00A6B8", "00B94B", "FFC815", "F40040", //Primary colors
    "094D92", "43A3D7", "62DF8C", "F75C03"  //Secondary colors
];

window.addEventListener("load", () => {
    M.AutoInit();

    //Change the default theme for all buttons
    document.querySelectorAll(".btn").forEach((element) => {
        if(!element.classList.contains("btn_light")) {
            element.classList.add("blue");
            element.classList.add("darken-2");
        }
    });
    
    MapData.bindUI(
                    "config_input_width",
                    "config_input_height",
                    "config_switch_legend_enabled",
                    "config_range_legend_size",
                    "config_switch_marks_enabled",
                    "config_range_mark_size",
                    "config_list_locations_root",
                    "config_input_location_name",
                    "config_input_color",
                    "config_input_location_longitude",
                    "config_input_location_latitude",
                    "btn_create_map",
                    "btn_reset",
                    "btn_set_location",
                    "btn_download_map",
                    "file_info",
                    "config_size_warning"
    );

    mapData = MapData.loadFromStorage();
    mapData.applyToUI();

    MapData.elements.pickerLocColorE.jscolor.fromString(presetColors[1]);
    

    mapRenderer = new MapRenderer(document.getElementById("map_root"), mapSource);
    mapRenderer.createEmptyMap();


    openHelpOnInitialRun();
});

window.addEventListener("beforeunload", () => {
    mapData.saveToStorage();
});

jscolor.presets.default = {
    position: "right",
    palette: presetColors,
    hideOnPaletteClick: true
};

document.addEventListener("wheel", function(event){
    if(document.activeElement.type === "number"){
        document.activeElement.blur();
    }
});



function openHelpOnInitialRun() {
    if(!localStorage.getItem("helpShown")) {
        localStorage.setItem("helpShown", "true");

        M.Modal.getInstance(document.getElementById("modal_help")).open();
    }
}




/*
    Helpers
*/
function setElementEnabled(element, enabled) {
    if(enabled) {
        element.classList.remove("disabled");
    } else {
        element.classList.add("disabled");
    }
}

function formatSizeString(size) {
    if(size < 1000) {
        return size + "B";
    } else if(size < 1000000) {
        return roundToNthDigit(size / 1000, 1) + "KB";
    } else {
        return roundToNthDigit(size / 1000000, 1) + "MB";
    }
}

function roundToNthDigit(value, digit) {
    return Math.round(value * Math.pow(10, digit)) / Math.pow(10, digit);
}





/*
    Input validation
*/
function numberInputIsValid(element, checkEmptiness) {
    return element.validity.valid && (!checkEmptiness || (element.value != null && element.value != ""));
}