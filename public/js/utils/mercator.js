
// https://github.com/DenisCarriere/global-mercator/blob/master/index.js
var originShift = 2 * Math.PI * 6378137 / 2.0
var d2r = Math.PI / 180

export function latitude(lat) {
  if (lat == null) throw new Error("lat is required");

  // Latitudes cannot extends beyond +/-90 degrees
  if (lat > 90 || lat < -90) {
    lat = lat % 180;
    if (lat > 90) lat = -180 + lat;
    if (lat < -90) lat = 180 + lat;
    if (lat === 0) lat = 0;
  }
  return lat;
}

/**
 * Modifies a Longitude to fit within +/-180 degrees.
 *
 * @param {number} lng longitude to modify
 * @returns {number} modified longitude
 * @example
 * globalMercator.longitude(190)
 * //= -170
 */
export function longitude(lng) {
  if (lng == null) throw new Error("lng is required");

  // lngitudes cannot extends beyond +/-90 degrees
  if (lng > 180 || lng < -180) {
    lng = lng % 360;
    if (lng > 180) lng = -360 + lng;
    if (lng < -180) lng = 360 + lng;
    if (lng === 0) lng = 0;
  }
  return lng;
}

export function validateLngLat(lnglat, validate) {
  if (validate === false) return lnglat;

  var lng = longitude(lnglat[0]);
  var lat = latitude(lnglat[1]);

  // Global Mercator does not support latitudes within 85 to 90 degrees
  if (lat > 85) lat = 85;
  if (lat < -85) lat = -85;
  return [lng, lat];
}


export function lngLatToMeters(
  lnglat,
  validate,
  accuracy = { enable: true, decimal: 1 }
) {
  lnglat = validateLngLat(lnglat, validate);
  var lng = lnglat[0];
  var lat = lnglat[1];
  var x = (lng * originShift) / 180.0;
  var y =
    Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
  y = (y * originShift) / 180.0;
  if (accuracy.enable) {
    x = Number(x.toFixed(accuracy.decimal));
    y = Number(y.toFixed(accuracy.decimal));
  }
  return [x, y];
}

export function pointToTileFraction(lnglat, zoom, validate) {
  lnglat = validateLngLat(lnglat, validate)
  var z = zoom;
  var lon = longitude(lnglat[0]);
  var lat = latitude(lnglat[1]);
  var sin = Math.sin(lat * d2r);
  var z2 = Math.pow(2, z);
  var x = z2 * (lon / 360 + 0.5);
  var y = z2 * (0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI);
  return validateTile([x, y, z], validate);
}

export function pointToTile(lnglat, zoom, validate) {
  var tile = pointToTileFraction(lnglat, zoom, validate);
  tile[0] = Math.floor(tile[0]);
  tile[1] = Math.floor(tile[1]);
  return tile;
}
