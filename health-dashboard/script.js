const STORAGE_KEY = "health_dashboard_records_v1";
const GOALS = {
  steps: 10000,
  water: 2000,
  sleep: 8,
  weight: 65,
};

const $ = (id) => document.getElementById(id);
const today = new Date().toISOString().slice(0, 10);
$("today").textContent = `日期：${today}`;

function readRecords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function latestRecord(records) {
  return records.find((r) => r.date === today) || records[0] || {
    steps: 0,
    water: 0,
    sleep: 0,
    weight: 0,
  };
}

function renderOverview(record) {
  $("stepsValue").textContent = Number(record.steps || 0).toLocaleString();
  $("waterValue").textContent = Number(record.water || 0).toLocaleString();
  $("sleepValue").textContent = record.sleep || 0;
  $("weightValue").textContent = record.weight || 0;
}

function renderGoals(record) {
  const items = [
    ["步数", "steps"],
    ["饮水", "water"],
    ["睡眠", "sleep"],
  ];
  const html = items.map(([label, key]) => {
    const current = Number(record[key] || 0);
    const target = GOALS[key];
    const pct = Math.min(Math.round((current / target) * 100), 100);
    return `
      <li class="goal-item">
        <div>${label}: ${current} / ${target} (${pct}%)</div>
        <div class="progress"><span style="width:${pct}%"></span></div>
      </li>`;
  }).join("");

  const weightDiff = record.weight ? (Number(record.weight) - GOALS.weight).toFixed(1) : "-";
  $("goalsList").innerHTML = html + `<li class="goal-item">体重目标差值：${weightDiff} kg</li>`;
}

function renderHistory(records) {
  const rows = records.slice(0, 7).map((r) => `
    <tr>
      <td>${r.date}</td>
      <td>${r.steps}</td>
      <td>${r.water}</td>
      <td>${r.sleep}</td>
      <td>${r.weight}</td>
    </tr>
  `).join("");
  $("historyBody").innerHTML = rows || '<tr><td colspan="5">暂无记录</td></tr>';
}

function refresh() {
  const records = readRecords().sort((a, b) => b.date.localeCompare(a.date));
  const current = latestRecord(records);
  renderOverview(current);
  renderGoals(current);
  renderHistory(records);
}

$("healthForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const record = {
    date: today,
    steps: Number($("steps").value),
    water: Number($("water").value),
    sleep: Number($("sleep").value),
    weight: Number($("weight").value),
  };

  const records = readRecords().filter((r) => r.date !== today);
  records.push(record);
  writeRecords(records);
  refresh();
  e.target.reset();
});

refresh();
