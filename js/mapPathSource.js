let mapSource = {
    pathWidth: 1010,
    pathHeight: 666,

    //centerLatitude: 0.738824261746,           //~42.3°N
    centerLongitude: 0.190940032459,            //~10.9°E

    //mapMaxLatitude: 1.45970008106,            //~83.6°N
    //mapMinLatitude: -1.01407793896,           //~58.1°S

    yCoverageN: 0.04,                           //North boundary of the map compared to a typical (almost full) projection; percent   -> |   full: N 0%-----------------100% S
    yCoverageS: 0.704,                          //South boundary                                                                         |   this: N   4%----------70%       S
                                                //This is a very COARSE SIMPLIFICATION; it is acceptable as high precision is not required in this application
};