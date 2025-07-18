const TARGET_URL = "developer.mozilla.org";

const ACTION_STATE = {
  ON: "ON",
  OFF: "OFF",
};

// 重构：将切换功能抽取为独立函数
async function toggleFocus(tab) {
  const tabUrl = tab.url;

  // check if the tab is a mdn page
  if (tabUrl.includes(TARGET_URL)) {
    // get the current state of the badge
    const preState = await chrome.action.getBadgeText({
      tabId: tab.id,
    });

    const newState =
      preState === ACTION_STATE.ON ? ACTION_STATE.OFF : ACTION_STATE.ON;

    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: newState,
    });

    const isON = newState === ACTION_STATE.ON;

    if (isON) {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["focus.css"],
      });
    } else {
      await chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ["focus.css"],
      });
    }
  }
}

// 初始化
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: ACTION_STATE.OFF,
  });
});

// 点击图标时触发
chrome.action.onClicked.addListener(async (tab) => {
  await toggleFocus(tab);
});

// 监听快捷键命令
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-focus") {
    // 获取当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await toggleFocus(tab);
    }
  }
});
