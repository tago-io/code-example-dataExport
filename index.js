const { Device, Account, Utils } = require('@tago-io/sdk');
const fs = require('fs');
const moment = require('moment-timezone');

const validateConfigFile = require('./services/validateConfigFile')

// Check if Configuration file can be loaded.
let configuration;
try {
  configuration = require("./config.json");
} catch (e) {
  console.error("Couldn't load the config.json file. Are you sure the file exists in your script folder?");
  return console.error(e.stack.split('\n')[0]);
}

/**
 * Start the export script.
 */
async function startExport() {
  await validateConfigFile(configuration);

  console.info("Starting the Export Script");
  const account = new Account({ token: configuration.account_token });

  // Get your device list
  const device_filter = { fields: ['id', 'tags', "name"], ...configuration.device_filter };

  const device_list = await account.devices.list(device_filter);
  if (!device_list.length) throw "No devices found for given tags filter";

  // Setup the first line of your CSV File.
  let csv_string_file = [["Device ID", "Device Name", "Time", "Variable", "Value", "Unit"]];

  // Get data and add to csv_string_file variable.
  for (const { id, name } of device_list) {
    console.info(`Collecting data from ${name}[${id}]...`)
    const token = await Utils.getTokenByName(account, id);
    const device = new Device({ token });

    // Get data from your device.
    const data_list = await getDeviceData(device);

    // Add to the csv_string_file
    const csv_data = data_list.map((data) => {
      // Convert ISO to timezone and date_time format.
      const time = moment(data.time).tz(configuration.variable_filter.timezone).format(configuration.csv_format.date_time);

      // Add "" when value has comma on it.
      const value = data.value && String(data.value).includes(',') ? `"${data.value}"` : data.value;

      // return the data in the CSV format based on the headers we defined at line 32.
      return [id, name, time, data.variable, value || "", data.unit || ""];
    });
    csv_string_file = csv_string_file.concat(csv_data);
  }

  // format and store local csv file.
  const final_csv_file = csv_string_file.map((row) => row.join(';')).join('\n');
  await fs.writeFileSync("./exported_data.csv", final_csv_file);
}


/**
 * Get data from your device. Automatically add skip parameter and qty: 10000
 * @param device instance of TagoIO Device
 */
async function getDeviceData(device) {
  let data_list = [];
  while (true) {
    const data = await device.getData({ ...configuration.variable_filter, skip: data_list.length, qty: 10000 });
    if (!data.length) {
        break;
    } 
    data_list = data_list.concat(data);
  }

  return data_list;
}

startExport().then(() => {
  console.info("Your data was exported succesfully. Check your local file exported_data.csv");
}).catch((error) => console.error(error));
