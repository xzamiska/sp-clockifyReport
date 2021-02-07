# sp-clockifyReport

Node.js is required!!!

Steps:
1. Generate datailed CSV monthly report on clockify (https://clockify.me/reports/detailed)
2. Copy this file in to root directory of app. (Only one csv file should be there!)
3. Set fields in conf.json file
4. Run `npm i` command
5. Run `node .` command
6. Your report is generated in output folder


# conf.json
input_date_format field is mandatory. You have to set same date format as you have on clockify. 
You can find it on https://clockify.me/user/settings in section "Date Format"

Other fields are optional. But fields like name, project, invoice_number are also recommended.