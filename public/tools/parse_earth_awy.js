const { lngLatToMeters } = require("./mercator.js");
const fs = require("fs");
const readline = require("readline");
const points = require("./earth_fix.json");

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

// Read the file and print its contents.
const filename = process.argv[2];

const dict = {};
let i = 0;
let count = 0;
const edges = [];

async function processLineByLine() {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    i++;
    // Each line in input.txt will be successively available here as `line`.
    // console.log(`Line from file: ${line}`);
    let data = line.split(/ +/);
    if (data[0] === "") {
      data = data.slice(1);
    }
    // console.log(data);
    if (data.length === 11 && i > 2) {
      count++;
      if (points.hasOwnProperty(data[0]) && points.hasOwnProperty(data[3])) {
        // console.log(data);
        const [
          startId,
          startRegionCodeICAO,
          startType,
          endId,
          endRegionCodeICAO,
          endType,
          dir,
          high,
          base,
          top,
          name,
        ] = data;
        const result =  [
          startId,
          startRegionCodeICAO,
          +startType,
          endId,
          endRegionCodeICAO,
          +endType,
          dir,
          +high,
          +base,
          +top,
          name,
        ]
        edges.push(result);
      }
    }
  }

  console.log(JSON.stringify(edges));
}

processLineByLine();
// console.log(points);
