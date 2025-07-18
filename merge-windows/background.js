/**
 * 合并所有窗口到当前窗口
 */
async function mergeAllWindows() {
  try {
    // 获取所有窗口
    const windows = await chrome.windows.getAll({ populate: true });

    if (windows.length <= 1) {
      return; // 只有一个窗口时不需要合并
    }

    // 获取当前窗口
    const currentWindow = await chrome.windows.getCurrent();

    // 遍历所有窗口
    for (const window of windows) {
      // 跳过当前窗口
      if (window.id === currentWindow.id) {
        continue;
      }

      // 获取窗口中的所有标签页
      for (const tab of window.tabs) {
        // 将标签页移动到当前窗口
        await chrome.tabs.move(tab.id, {
          windowId: currentWindow.id,
          index: -1, // 添加到末尾
        });
      }
    }

    // 聚焦当前窗口
    await chrome.windows.update(currentWindow.id, { focused: true });
  } catch (error) {
    console.error("合并窗口时发生错误:", error);
  }
}

// 点击图标时触发
chrome.action.onClicked.addListener(async () => {
  await mergeAllWindows();
});

// 监听快捷键命令
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "merge-windows") {
    await mergeAllWindows();
  }
});
