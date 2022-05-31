import _ from 'lodash'

/**
   * @functionName formatBytes
   * convert bytes to KB, MB and GB
   *
   * @param bytes
   * @param decimals
   * @output size in appropiate type: 1.205 KB
   * @usage
              const size = formatBytes(bytes,decimals)
   */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
   * @functionName getBase64ImageSize
   * get the base64 converted image size in bytes.
   *
   * @param dataURL
   * @output size in bytes
   * @usage
              const size = getBase64ImageSize(dataURL)
   */
export const getBase64ImageSize = (dataURL) => {
  const base64String = _.split(dataURL, 'base64,', 2)
  const length = base64String[1].length
  const fileSizeInByte = _.ceil(length / 4) * 3 - 2
  return fileSizeInByte
}

/**
   * @functionName getRandomInt
   * generate Integer between 0 and max
   *
   * @param max
   * @output 0 < int < max
   * @usage
              const id = getRandomInt(100)
   */
export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};