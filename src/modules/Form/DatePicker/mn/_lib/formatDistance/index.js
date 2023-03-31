/* eslint-disable */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatDistance;
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'секундээс бага',
    other: '{{count}} секундээс бага'
  },
  xSeconds: {
    one: '1 секунд',
    other: '{{count}} секунд'
  },
  halfAMinute: 'хагас минут',
  lessThanXMinutes: {
    one: 'минутаас бага',
    other: '{{count}} минутаас бага'
  },
  xMinutes: {
    one: '1 минут',
    other: '{{count}} минут'
  },
  aboutXHours: {
    one: '1 цаг орчим',
    other: '{{count}} цаг орчим'
  },
  xHours: {
    one: '1 цаг',
    other: '{{count}} цаг'
  },
  xDays: {
    one: '1 өдөр',
    other: '{{count}} өдөр'
  },
  aboutXMonths: {
    one: '1 сар орчим',
    other: '{{count}} сар орчим'
  },
  xMonths: {
    one: '1 сар',
    other: '{{count}} сар'
  },
  aboutXYears: {
    one: '1 жил орчим',
    other: '{{count}} жил орчим'
  },
  xYears: {
    one: '1 жил',
    other: '{{count}} жил'
  },
  overXYears: {
    one: '1 жил гаруй',
    other: '{{count}} жил гаруй'
  },
  almostXYears: {
    one: '1 жил орчим',
    other: '{{count}} жил орчим'
  }
};

function formatDistance(token, count, options) {
  options = options || {};
  var result;

  if (typeof formatDistanceLocale[token] === 'string') {
    result = formatDistanceLocale[token];
  } else if (count === 1) {
    result = formatDistanceLocale[token].one;
  } else {
    result = formatDistanceLocale[token].other.replace('{{count}}', count);
  }

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return result + '-д';
    } else {
      return result + ' өмнө';
    }
  }

  return result;
}

module.exports = exports.default;