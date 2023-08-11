
/**
 * Formats a number n into a string with two digits
 * 
 * @function
 * @param {Number} n - The number to format
 * @return {String} - The formatted number
 */
 const formatTwoDigits = (n) => {
    return n < 10 ? '0' + n : n; //condition ? expression1 : expression2; if condition then expression1 else expression2
}


/**
* Prints a debug messages
* 
* @function
* @param {String} type - The type, element of {"INFO", "ERROR"}
* @param {String} message - The message to be printed
*/
module.exports.debug = function(type, message) {
   var currentdate = new Date(); 
   var hours = formatTwoDigits(currentdate.getHours());
   var minutes = formatTwoDigits(currentdate.getMinutes());
   var seconds = formatTwoDigits(currentdate.getSeconds());

   var color = "\x1b[36m%s\x1b[0m"

   let output = `${hours}:${minutes}:${seconds} `;

   if (type == "INFO") {
       output += "[*] "
   } else if (type == "ERROR") {
       output += "[ERROR] "
       color = "\x1b[31m"
   }

   output += message

   console.log(color, output)
}

module.exports.getStationID = async function(name) {
    // Den Inhalt der CSV-Datei holen
    const data = fs.readFileSync("./stopname_stopid_output.csv", "utf-8");
    //const data = await response.text();

    // Zeilenweise zerlegen
    const lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) { // Beginn bei 1, um die Kopfzeile zu überspringen
        const [stopID, stopName] = lines[i].split(',');

        if (stopName && stopName.trim() === name.trim()) {
            return stopID;
        }
    }

    // Wenn nichts gefunden wurde
    return null;
}