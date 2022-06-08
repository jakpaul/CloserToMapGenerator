# CloserToMapGenerator
This generator creates a world map on which any point is colored according to one of a set of given locations it is closest to.

You can find it here: [CloserToMapGenerator](https://jakpaul.github.io/CloserToMapGenerator/)

Example output:
![alt text](https://github.com/jakpaul/CloserToMapGenerator/blob/f8f014f21201ab88ba840cbdef031bbc3bee22f5/ExampleMap.png "Example output map")

## About this project
The [Mercator projection](https://en.wikipedia.org/wiki/Mercator_projection) is commonly applied to create world maps, transferring the spherical geometry of the earth onto a two-dimensional plane in the process. While preserving direction and size relations on local scales, projecting the entire globe results in distortion of sizes and distances, particularly in the polar regions. This tool aims to visualize the disadvantages of the Mercator projection by displaying the distances between locations on a custom Mercator world map.

Any point on the map created by this tool is colored according to a certain location (among those that are given) which it is closest to.
This tool is not perfectly accurate, as the underlying calculations rely a bit on estimation, but generates some good visualizations. 

## Usage

### Configuration
Set the map configuration in the _Map Settings_ tab on the left as desired.
Here you may choose whether you would like to have the locations marked on the map and listed in a legend in the bottom left of the map.
You may also change the size of legend and marks. Also enter width and height of the final map (in pixels) as required.
Keep in mind that a higher resolution results in longer computation times and may lag your browser.
    
### Adding locations
In the _Locations_ tab add locations to be displayed on the map by entering a name, a color and coordinates in decimal degrees.
E.g. _40.748460_ instead of _40°44'54.456''N_
Then confirm, and the location will be listed in the table above. Hover over entries to edit or remove them.
Provide at least two locations.

After clicking _Create_ to run the generator you can download the map as a PNG with transparent background on the top right.
Try it out with the default configuration!

## License
The source of the generator is licensed under the GNU General Public License v3.0. See the [LICENSE file](https://github.com/jakpaul/CloserToMapGenerator/blob/cf58a4d66c2f890124bce8ddc6306d318e5ea1f8/LICENSE) for details.
