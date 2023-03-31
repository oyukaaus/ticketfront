/* eslint-disable */
export const getFlatTreeData = (source, parentId = null) => {
    // Assuming object's unique identifier is 'key'.
    // Not fully tested with nested data.
    let array = [];
    for (const node of source) {
        const object = { ...node };
        object.parent = parentId;
        array = [...array, object];
        if (object.children?.length) {
            const children = getFlatTreeData(object.children, object.key);
            array = [...array, ...children];
        }
        delete object.children;
    }
    return array;
};

export const getLastOrderNumber = (array, key = 'ordering') => {
    let highestOrderNumber = 0;
    for (const item of array) {
        if (item[key] && item[key] > highestOrderNumber) {
            highestOrderNumber = item[key];
        }
    }
    return highestOrderNumber;
};

export const strTimeToMinutes = (time) => {
    let minutes = 0;
    if (time && typeof time === 'string' && time.length === 5) {
        const stringHour = time.substring(0, 2);
        const stringMinute = time.substring(3, 5);
        if (/^\d+$/.test(stringHour)) {
            minutes = Number(stringHour) * 60;
        }
        if (/^\d+$/.test(stringMinute)) {
            minutes += Number(stringMinute);
        }
    }
    return minutes;
};

export const dateFormat = (dateObj) => {
    if (dateObj) {
        let year = dateObj.getFullYear(),
            month = dateObj.getMonth() + 1,
            date = dateObj.getDate();

        return year + "-" + ("00" + month).slice(-2) + "-" + ("00" + date).slice(-2);
    } else {
        return null;
    }
};

export const timeDateFormat = (date) => {
    var month = "00" + (date.getMonth() + 1);
    var day = "00" + date.getDate();
    var hours = "00" + date.getHours();
    var minutes = "00" + date.getMinutes();
    var seconds = "00" + date.getSeconds();
    var dateValue = date.getFullYear() + '.' + month.slice(-2) + '.' + day.slice(-2) + " " + hours.slice(-2) + ':' + minutes.slice(-2) + ":" + seconds.slice(-2);
    return dateValue;
};


export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const isValidDate = (str) => {
    var m = str.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
    return (m) ? new Date(m[1], m[2] - 1, m[3]) : null;
};

export const priceFormat = (price) => {
    if (price) {
        let splitNumbers = price.toString().split(".");
        if (splitNumbers.length === 2) {
            if (splitNumbers[1] == '00') { // unneccary zero should be hidden
                return splitNumbers[0].replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1\'');
            } else {
                return parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1\'');
            }
        } else {
            return splitNumbers[0].replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1\'');
        }
    } else {
        return 0;
    }
};

export const genderFormat = (genderCode = null, t = {}) => {
    if (genderCode) {
        if (genderCode.toUpperCase() == 'M') {
            return t('common.genderMale')
        } else if (genderCode.toUpperCase() == 'F') {
            return t('common.genderFemale')
        } else {
            return '-';
        }
    } else {
        return '-';
    }
}

export const numberFormat = (number) => {
    if (number) {
        return Number.parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return 0;
    }
};

export const numberReverseFormat = (str, find, replace) => {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const floatFormat = (floatNumber, digit = 2) => {
    if (floatNumber) {
        let splitNumbers = floatNumber.toString().split(".");

        if (splitNumbers.length === 2) {
            return floatNumber.toFixed(digit);
        } else {
            return splitNumbers[0];
        }
    } else {
        return 0;
    }
};

export const isFloat = (number) => {
    if (typeof parseInt(number) === 'number') {
        if (number % 1 === 0) {
            // int
            return false;
        } else {
            // float
            return true;
        }
    } else {
        // not number
        return false;
    }
};

export const isValidURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
};

export const linkify = (inputText) => {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" style="color: white;">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" style="color: white;">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" style="color: white;">$1</a>');

    return replacedText;
};

export const queryUrl = (url) => {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
};

export const htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

const maxUploadSize = 25;
export const isLargerFile = (sizeInByte) => {
    if (sizeInByte && sizeInByte > 1024) {
        let kb = Math.floor(sizeInByte / 1024);
        let byte = sizeInByte - 1024 * kb;
        if (kb > 1024) {
            let mb = Math.floor(kb / 1024);
            if (mb > maxUploadSize) {
                // larger than 25
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false
    }
};


export const isNumberInput = (value) => {
    const re = /^[0-9\b]+$/;
    return value === '' || re.test(value);
};

export const capitalize = string => {
    if (typeof string === 'string' && string.length) {
        return `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`;
    } else {
        return string;
    }
};

export const replaceAnchors = string => {
    if (string && typeof string === 'string') {
        const re = /<a[^>]*>([^<]+)<\/a>/g;
        const href_re = /href="([^"]*)/;
        const absoluteUrlRe = /^https?:\/\/|^\/\//i;
        return string.replace(re, function (stringA) {
            return stringA.replace(href_re, function (stringHref, href) {
                const url = absoluteUrlRe.test(href) ? href : `https://${href}`;
                return `href="${url}" target="_blank" rel="noreferrer noopener"`;
            })
        });
    }
    return '';
};

export const reorderWithDrop = (array, drop, key = 'id') => {
    const cloneDeep = require('lodash/cloneDeep');
    const clone = cloneDeep(array);
    const { itemId, targetId, position } = drop;
    const ordered = [];
    for (const element of clone) {
        if (element[key] === targetId) {
            const item = clone.find(el => el[key] === itemId);
            const target = clone.find(el => el[key] === targetId);
            if (position === 'top') {
                ordered.push(item);
                ordered.push(target);
            } else {
                ordered.push(target);
                ordered.push(item);
            }
        } else if (itemId !== element[key]) {
            ordered.push(element);
        }
    }
    return ordered;
};

export const getDatesBetweenDates = (start, end) => {
    let dates = [];
    const startDate = new Date(start);
    while (startDate <= end) {
        dates = [...dates, getDateByDateObject(new Date(startDate))];
        startDate.setDate(startDate.getDate() + 1)
    }
    return dates
};

export const getDateByDateObject = (dateObject) => {
    let d = new Date(dateObject);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    let date = year + "-" + month + "-" + day;

    return date;
};

export const generateColor = () => {
    let color = "#";
    for (let i = 0; i < 3; i++)
        color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
    return color;
}

export const naturalSort = (a = null, b = null, order = 'asc') => {
    const re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?%?$|^0x[0-9a-f]+$|[0-9]+)/gi;
    const sre = /(^[ ]*|[ ]*$)/g;
    const dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
    const hre = /^0x[0-9a-f]+$/i;
    const ore = /^0/;
    const htmre = /(<([^>]+)>)/ig;

    let x = a.toString().replace(sre, '') || '';
    let y = b.toString().replace(sre, '') || '';

    x = x.replace(htmre, '');
    y = y.replace(htmre, '');
    // chunk/tokenize
    const xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
    const yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
    // numeric, hex or date detection
    const xD = parseInt(x.match(hre), 10) || (xN.length !== 1 && x.match(dre) && Date.parse(x));
    const yD = parseInt(y.match(hre), 10) || xD && y.match(dre) && Date.parse(y) || null;

    // first try and sort Hex codes or Dates
    if (yD) {
        if (xD < yD) {
            return order === 'desc' ? 1 : -1;
        }
        else if (xD > yD) {
            return order === 'desc' ? -1 : 1;
        }
    }

    // natural sorting through split numeric strings and default strings
    for (let cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        let oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc], 10) || xN[cLoc] || 0;
        let oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc], 10) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (Number.isNaN(oFxNcL) !== Number.isNaN(oFyNcL)) {
            return (Number.isNaN(oFxNcL)) ? 1 : -1;
        }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) {
            return order === 'desc' ? 1 : -1;
        }
        if (oFxNcL > oFyNcL) {
            return order === 'desc' ? -1 : 1;
        }
    }
    return 0;
}