let pageIndex = 0;

let tabData = [];

function setCruisingPage(selectData) {
  pageIndex = 0;
  tabData = selectData;
  const selectElem = document.getElementById("currentPage");
  for (let i in tabData) {
    const optionElem = document.createElement("option");
    optionElem.value = i;
    optionElem.textContent = tabData[i].name;
    selectElem.appendChild(optionElem);
  }
  if (tabData.length != 0) {
    document.getElementById("openPage").src = tabData[0].url;
  }
}

function setPrevPage() {
  if (pageIndex > 0) {
    document.getElementById("openPage").src = tabData[--pageIndex].url;
    document.getElementById("currentPage").value = pageIndex;
  }
}

function setNextPage() {
  if (pageIndex < tabData.length - 1) {
    document.getElementById("openPage").src = tabData[++pageIndex].url;
    document.getElementById("currentPage").value = pageIndex;
  }
}

function onSelectChange(event) {
  pageIndex = event.target.value;
  document.getElementById("openPage").src = tabData[pageIndex].url;
}

document.getElementById("prevBtn").addEventListener("click", setPrevPage);
document.getElementById("nextBtn").addEventListener("click", setNextPage);
document.getElementById("currentPage").addEventListener("change", onSelectChange);
