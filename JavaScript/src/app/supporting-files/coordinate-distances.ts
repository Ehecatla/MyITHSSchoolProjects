/**
 * 
 */
export var CoordinateDistances = {

	/* Convert degrees to radians
	* param degrees
	* return param as radian
	*/
	deg2rad: function(degrees) {
		return Math.PI*degrees/180.0;
	},

	/* Convert radians to degrees
	* param radians
	* return param as degrees
	*/
	rad2deg: function(radians) {
		return 180.0*radians/Math.PI;
	},

	/* Calculate earth radius based on latitude
	* param latitude
	* return earth radius at latitude
	*/
	earthRadius: function(lat) {
		var WGS84_A = 6378137.0, WGS84_B = 6356752.3;
		var an = WGS84_A * WGS84_A * Math.cos(lat),
		bn = WGS84_B * WGS84_B * Math.cos(lat),
		ad = WGS84_A * Math.cos(lat),
		bd = WGS84_B * Math.cos(lat);
		return Math.sqrt((an * an + bn * bn)/(ad * ad + bd * bd));
	},

	/* Calculate coordiantes for box for center coordinates
	* param latitude
	* param longitude
	* param distance from from center to edge in meters
	* return object containing latitude and longitude objects with min and max properties in degrees
	*/
	square: function(latitude, longitude, distance) {
		var lat = this.deg2rad(latitude),
		lon = this.deg2rad(longitude),
		radius = this.earthRadius(lat),
		pradius = radius * Math.cos(lat);

		var latMin = lat - distance/radius,
		latMax = lat + distance/radius,
		lonMin = lon - distance/pradius,
		lonMax = lon + distance/pradius;
		return { latitude: { min: this.rad2deg(latMin), max: this.rad2deg(latMax) }, longitude: { min: this.rad2deg(lonMin), max: this.rad2deg(lonMax) } };
	},

	/* Calculate the maximum sized square with coodinates for a given radius
	* param latitude in degrees
	* param longitude in degrees
	* param radius of circle around point
	* return object containing latitude and longitude objects with min and max properties in degrees
	*/
	squareInCircle: function (latitude, longitude, circleRadius) {
		var halfSide = circleRadius / Math.sqrt(2); // Diagonal = sqrt(s^2 + s^2) or Diagonal = s sqrt(2)
		return this.square(latitude, longitude, halfSide);
	},

	/* calculate distance between 2 set of coordinates
	* param latitude first position 
	* param longitude first position 
	* param latitude second position
	* param longitude second position
	* return distance beetween first and second point in meters
	*/
	distanceBetweenPoints: function(latitude1, longitude1, latitude2, longitude2) {
		var lat1 = this.deg2rad(latitude1), 
		lat2 = this.deg2rad(latitude2),
		deltaLat = this.deg2rad(latitude2 - latitude1),
		deltaLon = this.deg2rad(longitude2-longitude1), 
		radius = this.earthRadius(lat1);

		var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return radius * c;
	}
};
