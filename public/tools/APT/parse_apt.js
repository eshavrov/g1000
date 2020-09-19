const { lngLatToMeters } = require("../mercator.js");
const fs = require("fs");
const readline = require("readline");
const points = require("../earth_fix.json");

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
let countNZ = 0;
const edges = [];

let currentAir = null;
const airports = [];
let way = null;

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
    if (i <= 2) continue;
    // Each line in input.txt will be successively available here as `line`.
    // console.log(`Line from file: ${line}`);
    let data = line.split(/ +/);
    if (data[0] === "") {
      data = data.slice(1);
    }

    const type = data[0];
    switch (type) {
      case "1": {
        const [_, id, , , icao_code, ..._city] = data;
        const city = _city.join(" ");
        way = {
          points: [],
        };

        currentAir = { id, city, icao_code, figures: [] };
        count++;

        break;
      }
      case "1302": {
        const [_, name, ..._value] = data;
        const value = _value.join(" ");
        currentAir[name] = value;
        if (
          [
            "datum_lat",
            "datum_lon",
            "transition_alt",
            "transition_level",
          ].includes(name)
        ) {
          currentAir[name] = +value;
        }

        break;
      }
      case "110": {
        const [, , , , ..._name] = data;
        const name = _name.join(" ");
        way.name = name;
        break;
      }
      case "120":
      case "130": {
        const [, ..._name] = data;
        const name = _name.join(" ");
        way.name = name;
        break;
      }
      case "111": {
        const [_, lat, lng] = data;
        if (way) {
          const [x, y] = lngLatToMeters([+lng, +lat]);
          way.points.push([x, y]);
        }
        break;
      }
      case "113": {
        const [_, lat, lng] = data;
        if (way) {
          const [x, y] = lngLatToMeters([+lng, +lat]);
          way.points.push([x, y]);
          way.loop = true;
          currentAir.figures.push(way);
          way = { points: [] };
        }
        break;
      }
      case "112": {
        const [_, lat, lng, lat2, lng2] = data;
        if (way) {
          const [x, y] = lngLatToMeters([+lng, +lat]);
          const [x2, y2] = lngLatToMeters([+lng2, +lat2]);

          way.points.push([x, y, x2, y2]);
        }
        break;
      }
      case "114": {
        const [_, lat, lng] = data;
        if (way) {
          const [x, y] = lngLatToMeters([+lng, +lat]);
          way.points.push([x, y]);
          way.loop = true;
          currentAir.figures.push(way);
          way = { points: [] };
        }
        break;
      }
      case "1302": {
        break;
      }
    }

    if (data[1] === "region_code" && data[2] === "NZ") {
      countNZ++;
    }

    if (data.length === 0 && currentAir) {
      if (currentAir.region_code === "NZ") {
        airports.push(currentAir);
      }
    }

    // console.log(data);
  }

  console.log(JSON.stringify(airports));
}

processLineByLine();
// console.log(points);
