const Excel = require('exceljs');
const data = require('./data');

const getWorkbook = async () => {
    let confData = data.getConf();
    let table_start_row = 4;

    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(confData.output_file_name || 'output');

    worksheet.getCell('A1').value = 'Meno:';
    worksheet.getCell('A1').alignment = { horizontal: 'right'};
    worksheet.getCell('B1').value = confData.name;
    worksheet.getCell('C1').value = 'Projekt:';
    worksheet.getCell('C1').alignment = { horizontal: 'right'};
    worksheet.getCell('D1').value = confData.project;
    worksheet.getCell('A2').value = 'Dátum:';
    worksheet.getCell('A2').alignment = { horizontal: 'right'};
    worksheet.getCell('C2').value = 'Príloha k fa. č. ';
    worksheet.getCell('C2').alignment = { horizontal: 'right'};
    worksheet.getCell('D2').value = confData.invoice_number;

    worksheet.getRow(table_start_row).values = [
        'Dátum',
        'Task',
        'Popis',
        'Začiatok',
        'Koniec',
        'Trvanie'
    ];

    worksheet.columns = [
        { key: 'date', width: 11.5, style: { numFmt: confData.output_date_format || 'dd/mm/yyyy'} },
        { key: 'task', width: 14 },
        { key: 'description', width: 37, style: { alignment: { wrapText: true } } },
        { key: 'start_time', width: 9, style: { numFmt: 'h:mm' } },
        { key: 'end_time', width: 8, style: { numFmt: 'h:mm' } },
        { key: 'duration', width: 10, style: { numFmt: 'h:mm' } },
    ];

    worksheet.getRow(table_start_row).font = { bold: true };
    let res = await data.getData();
    worksheet.getCell('B2').value = getInvoiceMonthPeriod(res[0].date);
    res.forEach((e, index) => {
        const rowIndex = index + table_start_row + 1
        worksheet.addRow({
            ...e,
            duration: {
                formula: `IF(E${rowIndex},E${rowIndex}-D${rowIndex},"")`
            }
        })
    });
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber <= table_start_row)
            return;

        const insideColumns = ['A', 'B', 'C', 'D', 'E', 'F']
        insideColumns.forEach((v) => {
            worksheet.getCell(`${v}${rowNumber}`).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            }
        })

    });
    let resultRowNumber = res.length + table_start_row + 3;
    worksheet.getCell(`C${resultRowNumber}`).value = 'Hodiny celkom:';
    worksheet.getCell(`F${resultRowNumber}`).value = { formula: `=SUM(F${table_start_row+1}:F${resultRowNumber-3})`};
    worksheet.getCell(`F${resultRowNumber}`).font = { bold: true};
    worksheet.getCell(`F${resultRowNumber}`).numFmt = '[h]:mm:ss';
    return workbook;
}

const getInvoiceMonthPeriod = (date) => {
    let month = date.getMonth() + 1;
    let days = new Date(date.getFullYear(), month, 0).getDate();
    return `1-${days}.${month}.${date.getFullYear()}`
}

module.exports = {
    getWorkbook
}