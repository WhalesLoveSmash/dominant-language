// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("input");
  const outputDiv = document.getElementById("output");

  inputBox.addEventListener("input", () => {
    const text = inputBox.value.trim();

    if (text === "") {
      outputDiv.innerHTML = `Dominant Direction: <em>waiting for input...</em>`;
      document.getElementById("language-bars").innerHTML = ""; // Clear bars
      return;
    }

    const direction = getDominantDirection(text);
    outputDiv.textContent = `Dominant Direction: ${direction}`;

    const percentages = getLanguagePercentages(text);
    renderLanguageBars(percentages);
  });

  // 🔘 Handle character button clicks to insert random characters
  document.querySelectorAll(".char-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scriptName = btn.getAttribute("data-lang");
      insertRandomCharFromScript(scriptName);
    });
  });
});

// 🔤 Detect script info for a character
function characterScript(code) {
  for (let script of SCRIPTS) {
    for (let [from, to] of script.ranges) {
      if (code >= from && code < to) return script;
    }
  }
  return null;
}

// 🔎 Get writing directions of each character
function getDirections(text) {
  let result = [];
  for (let char of text) {
    let script = characterScript(char.codePointAt(0));
    if (script) result.push(script.direction);
  }
  return result;
}

// 📊 Count how many characters belong to each direction
function countDirections(directions) {
  let counts = {};
  for (let dir of directions) {
    counts[dir] = (counts[dir] || 0) + 1;
  }
  return counts;
}

// 🏁 Determine the dominant direction
function getDominantDirection(text) {
  let directions = getDirections(text);
  let counts = countDirections(directions);
  let dominant = Object.entries(counts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  return dominant[0];
}

// 📈 Count how many characters belong to each language
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

// 📊 Calculate what % of characters are each language
function getLanguagePercentages(text) {
  const { counts, total } = countLanguages(text);
  let percentages = {};
  for (let lang in counts) {
    percentages[lang] = (counts[lang] / total) * 100;
  }
  return percentages;
}

// 📊 Render percentage bars
function renderLanguageBars(percentages) {
  const container = document.getElementById("language-bars");
  container.innerHTML = ""; // Clear old bars

  for (const [language, percent] of Object.entries(percentages)) {
    const barWrapper = document.createElement("div");
    barWrapper.style.marginBottom = "0.5rem";

    const label = document.createElement("span");
    label.textContent = `${language}: `;

    const bar = document.createElement("div");
    bar.style.display = "inline-block";
    bar.style.height = "1rem";
    bar.style.width = `${percent}%`;
    bar.style.backgroundColor = "#4a90e2";
    bar.style.borderRadius = "4px";
    bar.style.marginLeft = "0.5rem";

    const percentLabel = document.createElement("span");
    percentLabel.textContent = ` ${percent.toFixed(1)}%`;
    percentLabel.style.marginLeft = "0.3rem";

    barWrapper.appendChild(label);
    barWrapper.appendChild(bar);
    barWrapper.appendChild(percentLabel);
    container.appendChild(barWrapper);
  }
}

// 🔣 Insert a random character from selected script
function insertRandomCharFromScript(scriptName) {
  const script = SCRIPTS.find((s) => s.name === scriptName);
  if (!script) return;

  const [start, end] = script.ranges[Math.floor(Math.random() * script.ranges.length)];
  const randomCode = getRandomInt(start, end);
  const randomChar = String.fromCodePoint(randomCode);

  const inputBox = document.getElementById("input");
  const startPos = inputBox.selectionStart;
  const endPos = inputBox.selectionEnd;
  const before = inputBox.value.substring(0, startPos);
  const after = inputBox.value.substring(endPos);
  inputBox.value = before + randomChar + after;

  inputBox.selectionStart = inputBox.selectionEnd = startPos + 1;
  inputBox.dispatchEvent(new Event("input"));
}

// 🔧 Utility: Get random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}