  const moment = require('moment-timezone');

function validateDeviceFilter(device_filter) {
  if (typeof device_filter !== "object") throw "Invalid device_filter in the config.json. Make sure it is a valid JSON file";

  const valid_device_keys = ["filter", "amount", "skip", "name"]
  for (const key of Object.keys(device_filter)) {
    if (!valid_device_keys.includes(key)) throw `Invalid ${key} inside device_filter config.json`;
    if (["skip", "amount"].includes(key) && typeof device_filter[key] !== 'number') throw `device_filter.${key} must be a Number inside config.json`;
  }
}


function validateVariableFilter(variable_filter) {
  if (typeof variable_filter !== "object") throw "Invalid variable_filter in the config.json. Make sure it is a valid JSON file";

  const valid_device_keys = ["variables", "start_date", "end_date", "series", "timezone", "values"]
  for (const key of Object.keys(variable_filter)) {
    if (!valid_device_keys.includes(key)) throw `Invalid ${key} inside variable_filter config.json`;
    if (["series", "variables", "values"].includes(key) && !Array.isArray(variable_filter[key])) throw `variable_filter.${key} must be an Array inside config.json`;
    if (["end_date", "end_date"].includes(key) && typeof variable_filter[key] !== 'string') throw `variable_filter.${key} must be a String inside config.json`;
  }
}

function validateCSVFormat(csv_format) {
  if (typeof csv_format !== "object") throw "Invalid csv_format in the config.json. Make sure it is a valid JSON file";

  const valid_device_keys = ["date_time"]
  for (const key of Object.keys(csv_format)) {
    if (!valid_device_keys.includes(key)) throw `Invalid ${key} inside csv_format config.json`;
  }

  if (csv_format.date_time) {
    try {
      moment().format(csv_format.date_time);
    } catch(error) {
      throw error;
    }
  }
}
  /**
   * Validate fields inside the config.json
   * @param config_file configuration json
   */
function validateConfigFile(config_file) {
  if (typeof config_file !== "object") throw "Invalid configuration file. Make sure it is a valid JSON file";

  if (!config_file.account_token) throw "account_token wasn't provided in the config.json";
  if (config_file.account_token.length !== 36) throw "Invalid account_token. It must have 24 characters length";

  if (!config_file.variable_filter) throw "variable_filter wasn't provided in the config.json";
  if (!config_file.device_filter) throw "device_filter wasn't provided in the config.json";
  if (!config_file.csv_format) throw "csv_format filter wasn't provided in the config.json";

  validateCSVFormat(config_file.csv_format);
  validateVariableFilter(config_file.variable_filter);
  validateDeviceFilter(config_file.device_filter);
}

module.exports = validateConfigFile;