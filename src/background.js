let openTabInfoList = [];

function onRecievedHeader(details) {
  if (openTabInfoList.find((tabInfo) => tabInfo.tabId == details.tabId)) {
    if (details.responseHeaders) {
      return {responseHeaders: details.responseHeaders.filter(
        header => header.name.toLowerCase() != "x-frame-options" 
                  && header.name.toLowerCase() != "content-security-policy")
      };
    }
  }
}

function onSendHeader(details) {
  const tabInfo = openTabInfoList.find((tabInfo) => tabInfo.tabId == details.tabId);
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
  openTabInfoList = openTabInfoList.filter((tabInfo) => tabInfo.tabId != tabId);
}

function recieveMessage(message, sender, sendResponse) {
  switch (message.method) {
    case "addTabInfo":
      openTabInfoList.push({tabId: message.tabId, ua: message.ua});
      break;
  }
}

browser.webRequest.onHeadersReceived.addListener(
  onRecievedHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "responseHeaders"]
);
browser.webRequest.onBeforeSendHeaders.addListener(
  onSendHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);
browser.tabs.onRemoved.addListener(handleRemoved);
browser.runtime.onMessage.addListener(recieveMessage);
