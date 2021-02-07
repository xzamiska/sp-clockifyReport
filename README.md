# sp-clockifyReport

Steps:
1. Generate datailed CSV monthly report on clockify.
2. Set fields in conf.json file
3. run `npm i` command
4. run `node .` command
5. Your report is generated in output folder


# conf.json
input_date_format field is mandatory. You have to set same date format as you have on clockify. 
You can find it on https://clockify.me/user/settings in section "Date Format"

Other fields are optional. But fields like name, project, invoice_number are also recommended.