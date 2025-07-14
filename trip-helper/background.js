// 优先排序的参数列表
const PRIORITY_PARAMS = [
  "locale",
  "h-id",
  "c-in",
  "c-out",
  "c-rooms",
  "d-city",
  "d-type",
  "source-tag",
  "d-time",
  "hotelId",
  "checkIn",
  "checkOut",
  "adult",
  "children",
];

// 检查URL是否匹配目标网站
function isTargetUrl(url) {
  const urlObj = new URL(url);
  return (
    (urlObj.hostname.includes("trip.com") ||
      urlObj.hostname.includes("ctrip.com")) &&
    urlObj.pathname.includes("detail")
  );
}

// 重新排序URL参数
function reorderUrlParams(url) {
  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(urlObj.search);
  const paramEntries = Array.from(searchParams.entries());

  // 将参数分为优先和非优先两组
  const priorityParams = [];
  const otherParams = [];

  paramEntries.forEach(([key, value]) => {
    if (PRIORITY_PARAMS.includes(key)) {
      priorityParams.push([key, value]);
    } else {
      otherParams.push([key, value]);
    }
  });

  // 按照优先级列表的顺序排序优先参数
  priorityParams.sort((a, b) => {
    return PRIORITY_PARAMS.indexOf(a[0]) - PRIORITY_PARAMS.indexOf(b[0]);
  });

  // 构建新的URL
  const newSearchParams = new URLSearchParams();
  [...priorityParams, ...otherParams].forEach(([key, value]) => {
    newSearchParams.append(key, value);
  });

  urlObj.search = newSearchParams.toString();
  return urlObj.toString();
}

// 监听URL变化
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0 && isTargetUrl(details.url)) {
    const newUrl = reorderUrlParams(details.url);
    if (newUrl !== details.url) {
      chrome.tabs.update(details.tabId, { url: newUrl });
    }
  }
});
