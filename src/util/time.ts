// 日期格式化
// export function formatTime(time: any, pattern: any) {
//   if (arguments.length === 0 || !time) {
//     return null
//   }
//   const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
//   let date
//   if (typeof time === 'object') {
//     date = time
//   } else {
//     if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
//       time = parseInt(time)
//     } else if (typeof time === 'string') {
//       time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
//     }
//     if ((typeof time === 'number') && (time.toString().length === 10)) {
//       time = time * 1000
//     }
//     date = new Date(time)
//   }
//   const formatObj: any = {
//     y: date.getFullYear(),
//     m: date.getMonth() + 1,
//     d: date.getDate(),
//     h: date.getHours(),
//     i: date.getMinutes(),
//     s: date.getSeconds(),
//     a: date.getDay()
//   }
//   return format.replace(/{([ymdhisa])+}/g, (result: any, key: any) => {
//     let value = formatObj[key]
//     // Note: getDay() returns 0 on Sunday
//     if (key === 'a') {
//       return ['日', '一', '二', '三', '四', '五', '六'][value]
//     }
//     if (result.length > 0 && value < 10) {
//       value = '0' + value
//     }
//     return value || 0
//   });
// }

export function durationFormater(duration: number) {
  if (duration < 60) {
    return duration.toString();
  }
  let minute = Math.floor(duration / 60);
  let second = duration % 60;
  if (minute < 60) {
    return minute + ":" + second.toString().padStart(2, '0');
  }
  let hour = Math.floor(minute / 60);
  minute = minute % 60;

  return hour + ":" + minute.toString().padStart(2, '0') + ":" + second.toString().padStart(2, '0');
}
