const { lngLatToMeters } = require("../mercator.js");
const fs = require("fs");
const readline = require("readline");

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

// Read the file and print its contents.
const filename = process.argv[2];

let i = 0;
const dict = {};

const v = (value) => {
  if (value) {
    const dir = value.slice(-1);
    if ("WENS".includes(dir)) {
      const result =
        ((dir === "S" || dir === "W" ? -1 : 1) * value.slice(0, -1)) / 10000;

      return result;
    }
    return +value;
  }

  return value;
};

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

    let data = line.split(/ +/);
    if (data[0] === "") {
      data = data.slice(1);
    }

    if (data[0] === "99") break;

    // console.log(`Line from file: ${line}`);

    const [id, index, _lat, _lng, type, _arcLat, _arcLng, arcRadius] = data;
    if (id == null) continue;
    // console.log(data);

    const lat = v(_lat);
    const lng = v(_lng);

    const arcLat = v(_arcLat);
    const arcLng = v(_arcLng);

    if (!dict.hasOwnProperty(id)) {
      dict[id] = {
        points: [],
      };
    }

    const [x, y] = lngLatToMeters([lng, lat]);
    const [x2, y2] =
      arcLng != null && arcLat != null
        ? lngLatToMeters([arcLng, arcLat])
        : [null, null];

    const result = [type, x, y, x2, y2, v(arcRadius) * 1852].filter(
      (v) => v || v === 0
    );

    dict[id].points.push(result);
  }
  console.log(JSON.stringify(dict));
}

processLineByLine();
