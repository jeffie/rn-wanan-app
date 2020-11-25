const XDate = require('xdate')
const customLabel = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May.',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'],
  dayNames: ['日', '一', '二', '三', '四', '五', '六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天'
}

const weeks = [
  '周日', '周一', '周二', '周三', '周四', '周五', '周六'
]

XDate.locales['en'] = customLabel
XDate.defaultLocale = 'en'

function sameMonth(a, b) {
  return a instanceof XDate && b instanceof XDate &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth()
}

function sameDate(a, b) {
  return a instanceof XDate && b instanceof XDate &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
}

function isGTE(a, b) {
  return b.diffDays(a) > -1
}

function isLTE(a, b) {
  return a.diffDays(b) > -1
}

function fromTo(a, b) {
  const days = []
  let from = +a, to = +b
  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true))
  }
  return days
}

function month(xd) {
  const year = xd.getFullYear(), month = xd.getMonth()
  const days = new Date(year, month + 1, 0).getDate()

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true)
  const lastDay = new XDate(year, month, days, 0, 0, 0, true)

  return fromTo(firstDay, lastDay)
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = XDate.locales[XDate.defaultLocale].dayNamesShort
  const dayShift = firstDayOfWeek % 7
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift))
  }
  return weekDaysNames
}

function page(xd, firstDayOfWeek, showSixWeeks) {
  const days = month(xd)
  let before = [], after = []

  const fdow = ((7 + firstDayOfWeek) % 7) || 7
  const ldow = (fdow + 6) % 7

  firstDayOfWeek = firstDayOfWeek || 0

  const from = days[0].clone()
  const daysBefore = from.getDay()

  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7)
  }

  const to = days[days.length - 1].clone()
  const day = to.getDay()
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7)
  }

  const daysForSixWeeks = (((daysBefore + days.length) / 6) >= 6)

  if (showSixWeeks && !daysForSixWeeks) {
    to.addDays(7)
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0])
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to)
  }

  return before.concat(days.slice(1, days.length - 1), after)
}

function showDate(date, shortMonth) {
  let dateArr = date.split('-')

  let day = parseInt(dateArr[2])
  day = day > 9 ? day : '0' + day

  let month = parseInt(dateArr[1])
  if (shortMonth) {
    month = customLabel.monthNames[month - 1]
  } else {
    month = customLabel.monthNamesShort[month - 1]
  }

  let year = dateArr[0]

  return { year, month, day }
}

function dateTrim(item) {
  let trimDate = item.createTime.replace(new RegExp(/-/gm), '/').replace(/T/g, ' ')
  let date = new Date(trimDate)
  let week = weeks[date.getDay()]
  let hours = date.getHours()
  let day = date.getDate()

  day = day > 9 ? day : '0' + day
  let month = date.getMonth() + 1
  month = month > 9 ? month : '0' + month
  let minutes = date.getMinutes()
  minutes = minutes > 9 ? minutes : '0' + minutes
  item.day = day
  item.month = month
  item.week = week
  item.year = date.getFullYear()

  let timeStr = null
  if (hours > 12) {
    hours -= 12
    timeStr = ' PM'
  } else {
    timeStr = ' AM'
  }
  item.time = hours + ':' + minutes + timeStr

  return item
}

function timeTrim(dateStr) {
  let trimDate = dateStr.replace(new RegExp(/-/gm), '/').replace(/T/g, ' ')
  let date = new Date(trimDate)
  let hours = date.getHours()
  let minutes = date.getMinutes()

  hours = hours > 9 ? hours : '0' + hours
  minutes = minutes > 9 ? minutes : '0' + minutes
  let time = hours + ':' + minutes

  return time
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  page,
  fromTo,
  isLTE,
  isGTE,
  customLabel,
  showDate,
  dateTrim,
  timeTrim
}
