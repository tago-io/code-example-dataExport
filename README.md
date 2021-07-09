In this article, we’ll learn how to run a script **outside** TagoIO to export all your data from one, or several devices, to a CSV.

By following all the steps in this article, you’ll end up with:

* NODE.JS setup in your machine;
* An understanding of the Data Output limit;
* Code to run in your machine to get data from your devices;
* An exported CSV file with your data.

![image](https://user-images.githubusercontent.com/5141631/125105407-ce9c0a80-e0b4-11eb-92f5-e9b5d3dba66b.png)

# 1. Understanding the process
You may have already noticed that this script needs to run outside of TagoIO. The reason for this is that we can't use an analysis here, as:
* Analysis has a Memory Size limit of 5 mb. It would throw an error if you try to get too much data inside your analysis;
* Analysis has a runtime limit of 2 minutes. Exporting data can take more time than that depending on how much data and devices you have.

The code I'll provide is in Node.JS, which is supported by TagoIO. So if you want to, for any reason, run this code inside an analysis, you can do that with very minor adjustments, but keep the limitations of doing that in mind.

For the code that we'll be using, it basically involves only three steps:
* Get your device list, filtering it by tags;
* Get data from each one of your devices, filtering the data by its variable and start/end date;
* Create a CSV structure and store it locally.

It's also a good thing to have in mind that everything available in the TagoIO SDK — which we will be using in the script — is available in the [Restful API](https://docs.tago.io/en/articles/494-restful-api). That means that if you want to write this code in another language, you can do so as long as you are able to perform HTTPs requests.

# 2. Data Output Limit
Since you will be getting data from your TagoIO account, it will be heavy on your data output limit.

The data output limit is only used when you try to get some data from your device. Each data will use 1 data output. This means that if you try to export 100 data, it will result in 100 data output for your account.

You can get additional information in our [documentation](https://docs.tago.io/en/articles/193-data-output-service).

# 3. Setting up Node.JS 
Node.js is a powerful and relatively new programing language developed using JavaScript. It is a non-blocking and event-driven language that has been adopted by several developers and companies to deal with data-intensive real-time applications. You can learn about node.js [here](https://nodejs.org/en/).

Open the [Node.js Installation Guide](https://nodejs.org/en/download/package-manager/) for instructions on how to install NPM and Node.js.

# 4. Setting up the script
Once you have Node.JS and NPM installed on your machine, go ahead and download the export script following these instructions:

* Go to [tago-io/code-example-dataExport (github.com)](https://github.com/tago-io/code-example-dataExport)
* Click on the Code Button and select "**Download as ZIP**"
* Extract the zip file to a folder
* Open your favorite command-line tool like the Windows Command Prompt, PowerShell, Cygwin, Bash or the Git shell (which is installed along with Github for Windows)
* Navigate to the project folder you just downloaded
* Run the command: **npm install**

The first step you need to complete is to configure the **config.json** file inside your folder. You should also have a **config_example.json** file if you want to use it as a reference.

I copied the example and added comments below to help you with the settings:
``` javascript
{
  // Setup your account token below. Create one by acessing your profile at https://admin.tago.io/account.
  "account_token": "Enter your account-token from TagoIO",

  // Fill up the filter for which devices that will be exported.
  "device_filter": {
    "amount": 10000, // amount of devices that the script will access.
    "filter": {
      "tags": [{ "key": "your tag key", "value": "your tag value"}] // tag filter
    }
  },

  // Settings regarding which data will be exported.
  "variable_filter": {
    "variables": ["temperature", "humidity"], // variables you want to export.
    "start_date": "", // start date such as 1 hour, 1 day, 1 month, 1 year.
    "end_date": "", // end date such as 1 hour, 1 day, 1 month, 1 year.
    "timezone": "America/New_York" // Timezone, for list of acceptable timezones see https://momentjs.com/timezone/
  },

// Settings regarding csv settings.
  "csv_format": {
    "date_time": "YYYY/MM/DD HH:mm:ss Z" // Date/Time format in the CSV File. Accepted formats at: https://momentjs.com/docs/#/displaying/format/
  }
}
```

# 5. Running the script
Now that everything is correctly setup, you just need to head back to your terminal and run **npm start**.

Any errors, such as invalid token or invalid parameters, will pop up in your terminal for you to fix. If everything is correct, it should show up like this:
![image](https://user-images.githubusercontent.com/5141631/125105407-ce9c0a80-e0b4-11eb-92f5-e9b5d3dba66b.png)

Feel free to ask any questions below if you need help.
