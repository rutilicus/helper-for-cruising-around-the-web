let readData = [];

browser.storage.local.get("data").then((result) => {
  readData = JSON.parse(result.data || "[]");
  const container = document.getElementById("itemList");

  for (let i in readData) {
    const itemElem = document.createElement("div");
    itemElem.className = "itemChoice";
    itemElem.id = i;
    itemElem.textContent = readData[i].presetName;
    container.appendChild(itemElem);
  }

  const settingElem = document.createElement("div");
  settingElem.className = "itemChoice";
  settingElem.id = "setting";
  settingElem.textContent = "設定ページ";
  container.appendChild(settingElem);
});

document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("itemChoice")) {
    return;
  }

  if (e.target.id == "setting") {
    browser.tabs.create({
      url: "/settings.html"
    });
    return;
  }

  browser.tabs.create({
    url: "/cruising.html",
  }).then((tab) => {
    const selectData = readData[e.target.id];
    browser.runtime.sendMessage({ method: "addTabInfo", tabId: tab.id, ua: selectData.ua }).then(
      (message) => {
        browser.tabs.executeScript({
          code: "setCruisingPage(" + JSON.stringify(readData[e.target.id]) + ");"
        });    
      }
    );
  });
});
