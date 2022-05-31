/**
 * @function calculateAspectRatioFit
  * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
  * images to fit into a certain area.
  *
  * @param {Number} srcWidth width of source image
  * @param {Number} srcHeight height of source image
  * @param {Number} maxWidth maximum available width
  * @param {Number} maxHeight maximum available height
  * @output {Object} { width, height }
  */
export const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {

  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

/**
 * @function 
  * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
  * images to fit into a certain area.
  *
  * @param {length} srcWidth width of source image
  * @param {length} srcHeight height of source image
  * @param {ratio} given aspect ratio (forex: 16/10 
  * @param {Number} maxHeight maximum available height
  * @output {Object} { width, height }
  */

// export const newSizeParams = (srcWidth, srcHeight, maxWidth, maxHeight, ratio) => {
//   const { width, height} = calculateAspectRatioFit()
//   var ratio = (16/10);
//   var height = getHeight(300,ratio);
//   var width = getWidth(height,ratio);
// }
export const getHeight = (length, ratio) => {
  var height = ((length) / (Math.sqrt((Math.pow(ratio, 2) + 1))));
  return Math.round(height);
}

export const getWidth = (length, ratio) => {
  var width = ((length) / (Math.sqrt((1) / (Math.pow(ratio, 2) + 1))));
  return Math.round(width);
}