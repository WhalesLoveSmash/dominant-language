// List of writing systems with character ranges and directions
const SCRIPTS = [
  {
    name: "Latin",
    ranges: [[65, 91], [97, 123]],
    direction: "ltr"
  },
  {
    name: "Arabic",
    ranges: [[1536, 1792]],
    direction: "rtl"
  },
  {
    name: "Cyrillic", // Russian
    ranges: [[1024, 1279]],
    direction: "ltr"
  },
  {
    name: "Hiragana", // Japanese
    ranges: [[12352, 12448]],
    direction: "ttb"
  }
];

// Given a character code, return the script it belongs to
function characterScript(code) {
  for (let script of SCRIPTS) {
    for (let [from, to] of script.ranges) {
      if (code >= from && code < to) {
        return script;
      }
    }
  }
  return null;
}

// Get all writing directions used in the text
function getDirections(text) {
  let result = [];
  for (let char of text) {
    let script = characterScript(char.codePointAt(0));
    if (script !== null) {
      result.push(script.direction);
    }
  }
  return result;
}

// Count how many characters per direction
function countDirections(directions) {
  let counts = {};
  for (let dir of directions) {
    counts[dir] = (counts[dir] || 0) + 1;
  }
  return counts;
}

// Main logic: returns the dominant direction of a string
function getDominantDirection(text) {
  let directions = getDirections(text);
  let counts = countDirections(directions);
  let dominant = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b, [null, 0]);
  return dominant[0];
}

// Count characters by language (script name)
function countLanguages(text) {
  let counts = {};
  let total = 0;

  for (let char of text) {
    let script = characterScript(char.codePointAt(0));
    if (script) {
      counts[script.name] = (counts[script.name] || 0) + 1;
      total++;
    }
  }

  return { counts, total };
}

// Convert language counts to percentages
function getLanguagePercentages(text) {
  const { counts, total } = countLanguages(text);
  let percentages = {};
  for (let lang in counts) {
    percentages[lang] = (counts[lang] / total) * 100;
  }
  return percentages;
}