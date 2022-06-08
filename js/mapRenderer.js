class MapRenderer {
    mapSource = null;

    mapRootObj = null;
    canvasObj = null;
    canvasContext = null;

    currentMapData = null;


    static LEGEND_TEXT = "You are closest to";


    constructor(mapRootObj, mapSource) {
        this.mapRootObj = mapRootObj;

        this.mapSource = mapSource;
    }

    createMap(mapData) {
        this.currentMapData = mapData;

        if(this.canvasObj != null) {
            this.canvasObj.remove();
        }
        this.canvasObj = document.createElement("canvas");

        this.canvasObj.width = mapData.width;
        this.canvasObj.height = mapData.height;

        this.mapRootObj.appendChild(this.canvasObj);

        
        this.canvasContext = this.canvasObj.getContext("2d");

        this.drawMap(mapData.width, mapData.height);
        this.recolorMap();

        if(this.currentMapData.marksEnabled) {
            this.createLocationMarks();
        }
        if(this.currentMapData.legendEnabled) {
            this.createLegend();
        }
    }

    createEmptyMap() {
        this.createMap(MapData.createEmpty());
        this.recolorEmptyMap();
        this.canvasContext.font = "20px Segoe UI";
        this.canvasContext.fillStyle = "#404040";
        this.canvasContext.fillText("Configure and click create to generate a new map!", 8, this.canvasObj.height - 6);
    }

    drawMap(width, height) {
        let matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix()
        let path = new Path2D();
        let transformation = matrix.scaleNonUniform(width / this.mapSource.pathWidth, height / this.mapSource.pathHeight);

        path.addPath(new Path2D(this.mapSource.path), transformation);
        this.canvasContext.fill(path);




        /*let img = new Image();
        img.addEventListener("load", (event) => {
            this.canvasContext.drawImage(img, 0, 0);
            this.imageData = this.canvasContext.getImageData(0, 0, this.canvasObj.width, this.canvasObj.height);
            this.recolorMap();
        });
        img.src = "baseMap.svg";*/
        
        
        
        /*this.image = new Image();


        var xml = new XMLSerializer().serializeToString(document.getElementById("input_svg"));
        var svg64 = btoa(xml);
        var b64Start = 'data:image/svg+xml;base64,';

        // prepend a "header"
        var image64 = b64Start + svg64;
        console.log(image64);

        // set it as the source of the image element
        this.image.onload = (event) => {
            // draw the image onto the canvas
            this.canvasContext.drawImage(this.image, 0, 0);
            this.recolorMap();
        }
        this.image.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJpbnB1dF9zdmciPgogICAgICAgICAgICA8cGF0aCBkPSJNIDUwLDUwIEggMTAwIiBzdHJva2U9ImdyZWVuIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gNTAsNTAgTCAxMDAsMTAwIiBzdHJva2U9InJlZCIvPgogICAgICAgICAgICA8cGF0aCBkPSJNIDUwLDUwIFYgMTAwIiBzdHJva2U9InllbGxvdyIvPgogICAgICAgICAgCiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMjUwLDUwIGggMTAwIiBzdHJva2U9ImdyZWVuIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMjUwLDUwIGwgMTAwLDEwMCIgc3Ryb2tlPSJyZWQiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAyNTAsNTAgdiAxMDAiIHN0cm9rZT0ieWVsbG93Ii8+CiAgICAgICAgICA8L3N2Zz4=";
        */
        
        
        
        
        //this.canvasContext.drawImage(document.getElementById("input_svg"), 0, 0);
    
    }

    recolorMap() {
        if(this.currentMapData.locations.length < 2) {
            return;
        }

        let imageData = this.canvasContext.getImageData(0, 0, this.canvasObj.width, this.canvasObj.height);

        for(let y = 0; y < imageData.height; y++) {
            for(let x = 0; x < imageData.width; x++) {
                let redIndex = (y * imageData.width + x) * 4;
                
                if(imageData.data[redIndex + 3] > 0) {
                    let newColor = this.recolor(x, y, imageData.data, redIndex);

                    imageData.data[redIndex] = newColor.r;
                    imageData.data[redIndex + 1] = newColor.g;
                    imageData.data[redIndex + 2] = newColor.b;
                    imageData.data[redIndex + 3] = newColor.a;
                }
            }
        }

        this.canvasContext.putImageData(imageData, 0, 0);
    }

    recolor(x, y, data, index) {
        /*return {
            r: ((y / 5 % 2 == 0) ? 200 : data[index]),
            g: (((y * y * y + x) % (x * y % 5 + 5) == 0) ? 200 : data[index + 1]),
            b: ((x / 5 % 2 == 0) ? 200 : data[index + 2]),
            a: data[index + 3]
        };*/
        /*let isInCenter = Math.abs(x - this.canvasObj.width / 2) < 2 && Math.abs(y - this.canvasObj.height / 2) < 2;
        return {
            r: isInCenter ? 255 : data[index],
            g: isInCenter ? 0 : data[index + 1],
            b: isInCenter ? 0 : data[index + 2],
            a: isInCenter ? 255 : data[index + 3],
        };*/

        
        
        /*let coordinates = this.toCoordinates(x, y);
        let isOnLongLine = (this.radToDeg(Math.abs(coordinates.longitude)) + 1) % 30 <= 2;
        let isOnLatLine = (this.radToDeg(Math.abs(coordinates.latitude)) + 1) % 15 <= 2;

        let pLat = 0;
        let pLong = 0;
        
        let isOnPoint = Math.abs(coordinates.latitude - pLat) <= 0.02 && Math.abs(coordinates.longitude - pLong) <= 0.02;

        return {
            r: isOnLongLine ? 120 : data[index],
            g: isOnLatLine ? 120 : data[index + 1],
            b: isOnPoint ? 255 : data[index + 2],
            a: (isOnLongLine || isOnLatLine) ? 255 : data[index + 3],
        };*/


        
        /*let coordinates = this.toCoordinates(x, y);
        let position = this.toPosition(coordinates.longitude, coordinates.latitude);

        return {
            r: Math.abs(position.y) <= 330 ? 120 : data[index],
            g: 0,
            b: 0,
            a: data[index + 3],
        };*/

        
        
        let coordinates = this.toCoordinates(x, y);
        //let isOnPoint = (Math.abs(coordinates.latitude - pLatA) <= 0.02 && Math.abs(coordinates.longitude - pLongA) <= 0.02) || (Math.abs(coordinates.latitude - pLatB) <= 0.02 && Math.abs(coordinates.longitude - pLongB) <= 0.02);
        
        let closestLocationIndex = -1;
        let closestLocationDistance = Number.MAX_VALUE;
        for(let c = 0; c < this.currentMapData.locations.length; c++) {
            let distance = this.getDistance(coordinates.longitude, coordinates.latitude, this.degToRad(this.currentMapData.locations[c].longitude), this.degToRad(this.currentMapData.locations[c].latitude));
            if(distance <= closestLocationDistance) {
                closestLocationIndex = c;
                closestLocationDistance = distance;
            }
        }

        if(closestLocationIndex >= 0) {
            return {
                r: this.currentMapData.locations[closestLocationIndex].color.r,
                g: this.currentMapData.locations[closestLocationIndex].color.g,
                b: this.currentMapData.locations[closestLocationIndex].color.b,
                a: data[index + 3],
            };
        } else {
            return {
                r: 0,
                g: 0,
                b: 0,
                a: data[index + 3],
            }
        }
    }

    recolorEmptyMap() {
        let imageData = this.canvasContext.getImageData(0, 0, this.canvasObj.width, this.canvasObj.height);

        let pattern = (x, y) => {return (Math.floor((x + y) / 20)) % 2;};

        for(let y = 0; y < imageData.height; y++) {
            for(let x = 0; x < imageData.width; x++) {
                let redIndex = (y * imageData.width + x) * 4;
                if(imageData.data[redIndex + 3] > 0) {
                    imageData.data[redIndex] = pattern(x, y) ? 180 : 220;
                    imageData.data[redIndex + 1] = pattern(x, y) ? 180 : 220;
                    imageData.data[redIndex + 2] = pattern(x, y) ? 180 : 220;
                }
            }
        }

        this.canvasContext.putImageData(imageData, 0, 0);
    }

    createLocationMarks() {
        for(let c = 0; c < this.currentMapData.locations.length; c++) {
            this.createLocationMark(
                this.toPosition(this.degToRad(this.currentMapData.locations[c].longitude), this.degToRad(this.currentMapData.locations[c].latitude)),
                this.currentMapData.locations[c].color,
                this.currentMapData.markSize,
                true
            );            
        }
    }

    createLegend() {
        if(this.currentMapData.locations.length < 2) {
            return;
        }

        let padding = (this.canvasObj.width <= this.canvasObj.height ? this.canvasObj.width : this.canvasObj.height) * 0.015;
        let lineHeight = this.getLocationMarkRadius(this.currentMapData.legendSize) * 2 * 1.1;
        let legendHeight = lineHeight * this.currentMapData.locations.length;
        let xOrigin = padding;
        let yOrigin = this.canvasObj.height - padding - legendHeight;

        let fontSize = lineHeight * 0.7;

        this.canvasContext.font = fontSize + "px Segoe UI";

        for(let c = 0; c < this.currentMapData.locations.length; c++) {
            this.createLocationMark(
                {
                    x: xOrigin + lineHeight / 2,
                    y: yOrigin + c * lineHeight + lineHeight / 2
                },
                this.currentMapData.locations[c].color,
                this.currentMapData.legendSize,
                false
            );

            this.canvasContext.fillStyle = "#000000";
            this.canvasContext.fillText(this.currentMapData.locations[c].name, xOrigin + lineHeight, yOrigin + c * lineHeight + lineHeight / 2 + fontSize * 0.36);
        }

        this.canvasContext.font = (fontSize * 1.1) + "px Segoe UI";
        this.canvasContext.fillText(MapRenderer.LEGEND_TEXT, xOrigin, yOrigin - lineHeight / 2 + (fontSize * 1.1) * 0.36);
    }

    createLocationMark(position, color, size, drawWhiteOutline) {
        let radius = this.getLocationMarkRadius(size);
        let colorString = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";;

        if(drawWhiteOutline) {
            this.canvasContext.fillStyle = "#FFFFFF";
            this.canvasContext.beginPath();
            this.canvasContext.arc(position.x, position.y, radius, 0, this.degToRad(360), false);
            this.canvasContext.fill();
        }
        
        this.canvasContext.fillStyle = "#000000";
        this.canvasContext.beginPath();
        this.canvasContext.arc(position.x, position.y, radius * 0.8, 0, this.degToRad(360), false);
        this.canvasContext.fill();

        this.canvasContext.fillStyle = colorString;
        this.canvasContext.beginPath();
        this.canvasContext.arc(position.x, position.y, radius * 0.6, 0, this.degToRad(360), false);
        this.canvasContext.fill();
    }

    getLocationMarkRadius(size) {
        return (this.canvasObj.width <= this.canvasObj.height ? this.canvasObj.width : this.canvasObj.height) * 0.015 * (size / 5 + 0.5);
    }



    

    /*
        Mercator projection calculation
    */
    toCoordinates(x, y) {
        let longitude = (x / this.canvasObj.width - 0.5) * 2 * Math.PI + this.mapSource.centerLongitude;
        let latitude = Math.asin(Math.tanh((this.mapValue(y / this.canvasObj.height, 0, 1, this.mapSource.yCoverageN, this.mapSource.yCoverageS) - 0.5) * -2 * Math.PI));

        return {longitude: longitude, latitude: latitude};
    }
    
    toPosition(longitude, latitude) {
        let x = ((longitude - this.mapSource.centerLongitude) * 0.5 / Math.PI + 0.5) * this.canvasObj.width;
        let y = this.mapValue(Math.atanh(Math.sin(latitude)) * -0.5 / Math.PI + 0.5, this.mapSource.yCoverageN, this.mapSource.yCoverageS, 0, 1) * this.canvasObj.height;

        return {x: x, y: y};
    }

    getDistance(longitudeA, latitudeA, longitudeB, latitudeB) {     //Adapted from: https://stackoverflow.com/a/365853
        var earthRadiusKm = 6371;

        var dLat = latitudeB - latitudeA;
        var dLon = longitudeB - longitudeA;

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latitudeA) * Math.cos(latitudeB);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }




    /*
        Output
    */
    getApproximateFileSize() {
        return (this.canvasObj.toDataURL().length - 22) * 6 / 8;
    }

    downloadMap() {
        MapRenderer.downloadData(this.canvasObj.toDataURL(), "png");
    }

    static downloadData(data, fileType) {
        var a = document.createElement("a");
        a.href = data;
        a.download = "MapCloserTo." + fileType;
        a.click();
    }




    /*
        Helpers
    */
    radToDeg(rad) {
        return rad * 180 / Math.PI;
    }

    degToRad(deg) {
        return deg * Math.PI / 180;
    }

    mapValue(val, lowSource, highSource, lowTarget, highTarget) {
        return (val - lowSource) / (highSource - lowSource) * (highTarget - lowTarget) + lowTarget;
    }
}