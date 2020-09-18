const { lngLatToMeters } = require("./mercator.js");
const fs = require("fs");
const readline = require("readline");

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

// Read the file and print its contents.
const filename = process.argv[2];

const dict = {};
let i = 0;

async function processLineByLine() {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    // console.log(`Line from file: ${line}`);
    let data = line.split(/ +/);
    if (data[0] === "") {
      data = data.slice(1);
    }

    if (data.length === 6) {
      i++;
      const [lat, lng, id, idAirportTerminal, regionCodeICAO, type] = data;

      if (regionCodeICAO == "NZ" && idAirportTerminal=="ENRT") {
        const [x, y] = lngLatToMeters([+lng, +lat]);
        const typeName =
          String.fromCharCode(+type & 0xff) +
          String.fromCharCode((+type >> 8) & 0xff) +
          String.fromCharCode((+type >> 16) & 0xff);

        const result = [
          x,
          y,
          +lat,
          +lng,
          id,
          idAirportTerminal,
          regionCodeICAO,
          +type,
          typeName,
        ];
        dict[id] = result;

        // console.log(result);
      }
    }
  }

  console.log(JSON.stringify(dict));
}

processLineByLine();
