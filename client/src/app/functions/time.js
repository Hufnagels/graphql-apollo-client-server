import _ from 'lodash'

/**
 * @functionName formatTimeToCurrentTimeZone
 * the timeZone is checked against the browser current time zone
 * @param {UNIX_timestamp} given UNIX_timestamp
 * @param {UNIX_timezone} given UNIX_timezone
 * @output DateTiem -> 2022. 06. 06. 16:10:17
 */
export const formatTimeToCurrentTimeZone = (UNIX_timestamp, UNIX_timezone) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const modifier = UNIX_timestamp.length === 13 ? 1 : 1000
  //console.log('timeConverter', timezone, UNIX_timestamp.length);
  return new Date(UNIX_timestamp * modifier).toLocaleString(UNIX_timezone, { timeZone: timezone });
}

/**
 * @functionName timeConverter
 * convert timestamp to string
 * @param {UNIX_timestamp} given UNIX_timestamp
 * @output DateTiem -> 06 May 2022 16:10:17
 */
export const timeConverter = (UNIX_timestamp) => {
  const modifier = UNIX_timestamp.length === 13 ? 1 : 1000
  var a = new Date(UNIX_timestamp * modifier);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}