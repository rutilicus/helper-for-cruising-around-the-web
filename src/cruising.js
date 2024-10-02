let pageIndex = 0;

let tabData = [];

function openNewTabPage() {
  browser.runtime.sendMessage({ method: "openContentTab", url: tabData[pageIndex].url });
}

function setCruisingPage(selectData) {
  document.title = `${document.title}:${selectData.presetName}`
  pageIndex = 0;
  tabData = selectData.items;
  const selectElem = document.getElementById("currentPage");
  for (let i in tabData) {
    const optionElem = document.createElement("option");
    optionElem.value = i;
    optionElem.textContent = tabData[i].name;
    selectElem.appendChild(optionElem);
  }
  if (tabData.length != 0) {
    openNewTabPage();
  }
}

function setPrevPage() {
  if (pageIndex > 0) {
    pageIndex--;
    openNewTabPage();
    document.getElementById("currentPage").value = pageIndex;
  }
}

function setNextPage() {
  if (pageIndex < tabData.length - 1) {
    pageIndex++;
    openNewTabPage();
    document.getElementById("currentPage").value = pageIndex;
  }
}

function onSelectChange(event) {
  pageIndex = event.target.value;
  openNewTabPage();
}

function onRecieveMessage(message) {
  switch (message.method) {
    case "openNextTab":
      setNextPage();
      break;
  }
}

document.getElementById("prevBtn").addEventListener("click", setPrevPage);
document.getElementById("nextBtn").addEventListener("click", setNextPage);
document.getElementById("currentPage").addEventListener("change", onSelectChange);
browser.runtime.onMessage.addListener(onRecieveMessage);
