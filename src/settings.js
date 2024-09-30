const fileVersion = 1;

function removeContent() {
  const parent = document.getElementById("content");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function upItem(id) {
  const targetNode = document.getElementById(id);
  if (targetNode) {
    const items = document.getElementById("itemArray").children;
    const index = Array.from(items).indexOf(targetNode);
    if (index != 0) {
      items[index - 1].before(items[index]);
    }
  }
}

function downItem(id) {
  const targetNode = document.getElementById(id);
  if (targetNode) {
    const items = document.getElementById("itemArray").children;
    const index = Array.from(items).indexOf(targetNode);
    if (index != items.length - 1) {
      items[index + 1].after(items[index]);
    }
  }
}

function deleteItem(id) {
  if (document.getElementsByClassName("item").length > 1) {
    document.getElementById(id).remove();
  }
}

function addItemRow() {
  let maxId = 0;
  const itemRows = document.getElementsByClassName("item");
  for (let i = 0; i < itemRows.length; i++) {
    maxId = Math.max(maxId, parseInt(itemRows[i].id, 10));
  }

  document.getElementById("itemArray").appendChild(
    createItemRow("", "", maxId + 1)
  );
}

function createItemRow(itemName, url, id) {
  const itemRowElem = document.createElement("div");
  itemRowElem.className = "item";
  itemRowElem.id = id;
  const nameDivElem = document.createElement("div");
  nameDivElem.className = "labelInput";
  itemRowElem.appendChild(nameDivElem);
  const nameLabelElem = document.createElement("label");
  nameLabelElem.for = "itemName";
  nameLabelElem.textContent = "表示項目名:";
  nameDivElem.appendChild(nameLabelElem);
  const nameInputElem = document.createElement("input");
  nameInputElem.type = "text";
  nameInputElem.name = "itemName";
  nameInputElem.value = itemName;
  nameDivElem.appendChild(nameInputElem);
  const urlDivElem = document.createElement("div");
  urlDivElem.className = "labelInput";
  itemRowElem.appendChild(urlDivElem);
  const urlLabelElem = document.createElement("label");
  urlLabelElem.for = "url";
  urlLabelElem.textContent = "URL:";
  urlDivElem.appendChild(urlLabelElem);
  const urlInputElem = document.createElement("input");
  urlInputElem.type = "url";
  urlInputElem.name = "url";
  urlInputElem.value = url;
  urlDivElem.appendChild(urlInputElem);

  const btnRowElem = document.createElement("div");
  btnRowElem.className = "btnRow";
  itemRowElem.appendChild(btnRowElem);
  const upBtn = document.createElement("button");
  upBtn.type = "button";
  upBtn.textContent = "↑";
  upBtn.addEventListener("click", () => upItem(id));
  btnRowElem.appendChild(upBtn);
  const downBtn = document.createElement("button");
  downBtn.type = "button";
  downBtn.textContent = "↓"
  downBtn.addEventListener("click", () => downItem(id));
  btnRowElem.appendChild(downBtn);
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete"
  deleteBtn.addEventListener("click", () => deleteItem(id));
  btnRowElem.appendChild(deleteBtn);

  return itemRowElem;
}

function setItemPage(origPresetName, ua, itemArr) {
  removeContent();

  const parent = document.getElementById("content");
  const origPresetNameElem = document.createElement("div");
  origPresetNameElem.id = "origPresetName";
  origPresetNameElem.className = "origPresetName";
  origPresetNameElem.textContent = origPresetName;
  parent.appendChild(origPresetNameElem);

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.textContent = "設定保存";
  saveBtn.addEventListener("click", () => savePreset());
  parent.appendChild(saveBtn);

  const presetDivElem = document.createElement("div");
  presetDivElem.className = "labelInput";
  parent.appendChild(presetDivElem);
  const presetNameLabelElem = document.createElement("label");
  presetNameLabelElem.for = "presetName";
  presetNameLabelElem.textContent = "設定名:";
  presetDivElem.appendChild(presetNameLabelElem);
  const presetNameInputElem = document.createElement("input");
  presetNameInputElem.type = "text";
  presetNameInputElem.name = "presetName";
  presetNameInputElem.id = "presetName";
  presetNameInputElem.value = origPresetName;
  presetDivElem.appendChild(presetNameInputElem);

  const uaDivElem = document.createElement("div");
  uaDivElem.className = "labelInput";
  parent.appendChild(uaDivElem);
  const uaLabelElem = document.createElement("label");
  uaLabelElem.for = "ua";
  uaLabelElem.textContent = "UA:";
  uaDivElem.appendChild(uaLabelElem);
  const uaInputElem = document.createElement("input");
  uaInputElem.type = "text";
  uaInputElem.name = "ua";
  uaInputElem.id = "ua";
  uaInputElem.value = ua;
  uaDivElem.appendChild(uaInputElem);

  const itemArrayElem = document.createElement("div");
  itemArrayElem.id = "itemArray";
  itemArrayElem.className = "itemArray";
  parent.appendChild(itemArrayElem);

  for (let i in itemArr) {
    itemArrayElem.appendChild(itemArr[i]);
  }

  const addItemBtn = document.createElement("button");
  addItemBtn.type = "button";
  addItemBtn.textContent = "項目追加";
  addItemBtn.addEventListener("click", () => addItemRow());
  parent.appendChild(addItemBtn);
}

function setNewItemPage() {
  const itemArr = [createItemRow("", "", 1)];

  setItemPage("", "", itemArr);
}

function savePreset() {
  const presetName = document.getElementById("presetName").value;
  if (presetName == "") {
    window.alert("設定名を入力してください");
  } else {
    // ファイルバージョンを設定
    browser.storage.local.set({version: fileVersion});

    browser.storage.local.get("data").then((result) => {
      const dataArray = JSON.parse(result.data || "[]");
      const currentPresetData = new Object();
      currentPresetData.presetName = presetName;
      currentPresetData.ua = document.getElementById("ua").value;
      currentPresetData.items = [];
      const itemElems = document.querySelectorAll(".item");
      for (let i = 0; i < itemElems.length; i++) {
        const itemData = new Object();
        itemData.name = itemElems[i].querySelector("input[name=itemName]").value;
        itemData.url = itemElems[i].querySelector("input[name=url]").value;
        currentPresetData.items.push(itemData);
      }
      const origPresetName = document.getElementById("origPresetName").textContent;
      const dataIndex = dataArray.findIndex((data) => data.presetName == origPresetName);
      if (dataIndex != -1) {
        dataArray[dataIndex] = currentPresetData;
      } else {
        dataArray.push(currentPresetData);
      }
      browser.storage.local.set({data: JSON.stringify(dataArray)});

      // 保存したら戻る
      removeContent();
    });
  }
}

function savePresetList() {
  // ファイルバージョンを設定
  browser.storage.local.set({version: fileVersion});

  const dataArray = [];
  const itemElems = document.querySelectorAll(".presetData");
  for (let i = 0; i < itemElems.length; i++) {
    dataArray.push(JSON.parse(itemElems[i].textContent));
  }
  browser.storage.local.set({data: JSON.stringify(dataArray)});

  // 保存したら戻る
  removeContent();
}

function setEditListPage() {
  removeContent();

  browser.storage.local.get("data").then((result) => {
    const parent = document.getElementById("content");

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "設定保存";
    saveBtn.addEventListener("click", () => savePresetList());
    parent.appendChild(saveBtn);
  
    const itemArrayElem = document.createElement("div");
    itemArrayElem.id = "itemArray";
    itemArrayElem.className = "itemArray";
    parent.appendChild(itemArrayElem);

    const dataArray = JSON.parse(result.data || "[]");

    for (let i in dataArray) {
      const itemRowElem = document.createElement("div");
      itemRowElem.className = "item";
      itemRowElem.id = dataArray[i].presetName;
      const presetDataElem = document.createElement("div");
      presetDataElem.id = "presetData";
      presetDataElem.className = "presetData";
      presetDataElem.textContent = JSON.stringify(dataArray[i]);
      itemRowElem.appendChild(presetDataElem);
      const nameDivElem = document.createElement("div");
      nameDivElem.textContent = dataArray[i].presetName;
      itemRowElem.appendChild(nameDivElem);
      const btnRowElem = document.createElement("div");
      btnRowElem.className = "btnRow";
      itemRowElem.appendChild(btnRowElem);
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.textContent = "編集";
      editBtn.addEventListener(
        "click",
        () => setItemPage(dataArray[i].presetName,
                          dataArray[i].ua,
                          dataArray[i].items.map((item, index) =>
                                                 createItemRow(item.name, item.url, index + 1))));
      btnRowElem.appendChild(editBtn);
      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.textContent = "↑";
      upBtn.addEventListener("click", () => upItem(dataArray[i].presetName));
      btnRowElem.appendChild(upBtn);
      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.textContent = "↓"
      downBtn.addEventListener("click", () => downItem(dataArray[i].presetName));
      btnRowElem.appendChild(downBtn);
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Delete"
      deleteBtn.addEventListener("click", () => deleteItem(dataArray[i].presetName));
      btnRowElem.appendChild(deleteBtn);

      itemArrayElem.appendChild(itemRowElem);
    }
  })
}

function exportJson() {
  browser.storage.local.get().then((result) => {
    const current = new Date();
    const a = document.createElement('a');
    const exportData = new Object();
    exportData.version = result.version ? result.version : fileVersion;
    exportData.data = result.data ? JSON.parse(result.data) : [];
    a.href = URL.createObjectURL(new Blob([JSON.stringify(exportData)],
                                          { type: "application/json"}));
    a.download = current.getFullYear().toString() + current.getMonth() + current.getDate()
                 + current.getHours() + current.getMinutes() + current.getSeconds()
                 + "helper-for-cruising-around-the-web.json"
    a.click();
  });
}

function importJson() {
  document.getElementById("importFile").click();

  // インポートしたら戻る
  removeContent();
}

async function importFileLoad(event) {
  const [file] = event.target.files;

  if (file) {
    const readData = JSON.parse(await file.text());
    const saveData = new Object();
    saveData.version = readData.version ? readData.version : fileVersion;
    saveData.data = readData.data ? JSON.stringify(readData.data) : "[]";
    browser.storage.local.set(saveData);
  }
}

document.getElementById("newBtn").addEventListener("click", setNewItemPage);
document.getElementById("editBtn").addEventListener("click", setEditListPage);
document.getElementById("exportBtn").addEventListener("click", exportJson);
document.getElementById("importBtn").addEventListener("click", importJson);
document.getElementById("importFile").addEventListener("change", importFileLoad);
