let openTabInfoList = [];

function onSendHeader(details) {
  const tabInfo = openTabInfoList.find((tabInfo) => tabInfo.contantTabId == details.tabId);
  if (tabInfo && tabInfo.ua != "") {
    for (const header of details.requestHeaders) {
      if (header.name.toLowerCase() === "user-agent") {
        header.value = tabInfo.ua;
      }
    }
  }
  return {requestHeaders: details.requestHeaders};
}

function handleRemoved(tabId, removeInfo) {
  for (let i in openTabInfoList) {
    if (openTabInfoList[i].baseTabId == tabId) {
      openTabInfoList.splice(i, 1);
      break;
    }
    if (openTabInfoList[i].contantTabId == tabId) {
      browser.tabs.sendMessage(openTabInfoList[i].baseTabId, {method: "openNextTab"});
      break;
    }
  }
}

function recieveMessage(message, sender, sendResponse) {
  switch (message.method) {
    case "addTabInfo":
      openTabInfoList.push({baseTabId: message.tabId, contantTabId: 0, ua: message.ua});
      break;
    case "openContentTab":
      const openTabInfo = openTabInfoList.find((tabInfo) => tabInfo.baseTabId == sender.tab.id);
      const removeTabId = openTabInfo.contantTabId;
      browser.tabs.create({
        url: message.url,
      }).then((tab) => {
        openTabInfo.contantTabId = tab.id
        if (removeTabId != 0) {  
          browser.tabs.remove(removeTabId);
        }
      });
      break;
  }
}

browser.webRequest.onBeforeSendHeaders.addListener(
  onSendHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);
browser.tabs.onRemoved.addListener(handleRemoved);
browser.runtime.onMessage.addListener(recieveMessage);
