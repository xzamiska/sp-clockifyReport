#!/usr/bin/env node

// imports
const fs = require('fs');
const wp = require('./workbook-provider');

// constants
const output_path = 'output';

fs.existsSync(output_path) || fs.mkdirSync(output_path);
wp.getWorkbook()
    .then(wb => {
        wb.xlsx.writeFile(`${output_path}/${wb.worksheets[0].name}.xlsx`);
        console.log("Done!");
    })
    .catch(err => {
        console.error(err);
    });
