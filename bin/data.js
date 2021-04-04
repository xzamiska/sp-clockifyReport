const fs = require('fs');
const csv = require('csvtojson');
const moment = require('moment');

const getData = async () => {

    let data = await resolveCsvData();
    let conf = getConf();

    data = data.map(d => {
        return {
            date: stringToDate(d[conf.column.date || 'Start Date'], conf.input_date_format),
            task: d[conf.column.task || 'Tags'],
            description: d[conf.column.description || 'Description'],
            start_time: timeFormat(d[conf.column.start_time || 'Start Time']),
            end_time: timeFormat(d[conf.column.end_time || 'End Time'])
        }
    }).sort((a, b) => {
        let compareDate = a.date - b.date;
        let compareTime = a.start_time - b.start_time;
        return compareDate || compareTime;
    });

    return data;
}

const getConf = () => {
    let rawdata = fs.readFileSync('conf.json');
    let conf = JSON.parse(rawdata);
    if (!conf.input_date_format)
        throw mandatoryFieldErrMsg('input_date_format');
        
    return conf;
}

const findCsvFile = () => {
    let extension = '.csv';
    let files = fs.readdirSync('.');
    files =  files.filter(file => file.match(new RegExp(`.*\.(${extension})`, 'ig')));
    if(!files.length)
        throw 'CSV file does not exist! Copy .csv file into root directory!';
    else if (files.length > 1)
        throw 'Too many .csv files in root folder!';
    return files[0];
}

const resolveCsvData = async () => {
    let fileName = findCsvFile();
    const converter = csv()
        .fromFile(fileName)
        .then((json) => {
            return json;
        })

    return await converter;
}

const timeFormat = (time) => {
    return toDate(time);
}

const toDate = (timeString) => {
    let value = moment();
    value.set('hour', timeString.substr(0, timeString.indexOf(":")));
    value.set('minute', timeString.substr(timeString.indexOf(":") + 1));
    value.set('second', 0);
    const offset = value.utcOffset();
    value.add(offset, 'minutes');
    return value.toDate();
}

const stringToDate = (_date, _format) => {
    let delimeter = _date.includes('/') ? '/' : '.';
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(delimeter);
    let dateItems = _date.split(delimeter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    let day = parseInt(dateItems[dayIndex]);
    month -= 1;
    day += 1;
    let formatedDate = new Date(dateItems[yearIndex], month, day);
    return formatedDate;
}

const mandatoryFieldErrMsg = (field) => {
    return `${field} is mandatory field in configuration file!`
} 

module.exports = {
    getData,
    getConf
}
