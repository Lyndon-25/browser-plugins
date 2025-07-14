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

/**
 * 检查URL是否需要处理
 * @param {string} url - 需要检查的URL
 * @returns {object} - 返回是否需要处理及是否需要添加seo参数
 */
function isTargetUrl(url) {
  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(urlObj.search);
  
  // 首先检查是否是目标网站
  const isTargetSite = (
    urlObj.hostname.includes("trip.com") ||
    urlObj.hostname.includes("ctrip.com")
  );

  if (!isTargetSite) {
    return { needProcess: false };
  }

  // 检查是否是详情页
  const isDetailPage = urlObj.pathname.includes('detail');
  if (!isDetailPage) {
    return { needProcess: false };
  }

  // 检查是否是vacation-rentals详情页
  const isVacationRentalsDetail = urlObj.pathname.includes('vacation-rentals/detail');
  
  // 获取当前URL的所有参数
  const currentParams = Array.from(searchParams.entries());
  
  // 对于vacation-rentals详情页的特殊处理
  if (isVacationRentalsDetail) {
    const seoParam = currentParams.find(([key, value]) => key === 'seo' && value === '0');
    
    // 如果没有seo=0参数，需要添加
    if (!seoParam) {
      return { needProcess: true, needSeoParam: true };
    }
    
    // 如果有seo=0但不在第一位，需要重排
    if (currentParams[0][0] !== 'seo') {
      return { needProcess: true, keepExistingSeo: true };
    }
  }

  // 检查其他参数顺序
  let lastPriorityIndex = -1;
  const startIndex = isVacationRentalsDetail && currentParams[0][0] === 'seo' ? 1 : 0;
  
  for (const [key, _] of currentParams.slice(startIndex)) {
    const currentIndex = PRIORITY_PARAMS.indexOf(key);
    if (currentIndex !== -1) {  // 如果是优先参数
      if (currentIndex < lastPriorityIndex) {  // 顺序不对
        return { 
          needProcess: true, 
          needSeoParam: isVacationRentalsDetail && !searchParams.get('seo'),
          keepExistingSeo: isVacationRentalsDetail && searchParams.get('seo') === '0'
        };
      }
      lastPriorityIndex = currentIndex;
    }
  }

  return { needProcess: false };
}

/**
 * 重新排序URL参数
 * 1. 对于vacation-rentals详情页，确保seo=0在第一位
 * 2. 按照优先级列表排序重要参数
 * 3. 保留其他非优先参数
 * @param {string} url - 需要重排序参数的URL
 * @param {object} options - 配置选项
 * @returns {string} - 重排序后的URL
 */
function reorderUrlParams(url, { needSeoParam, keepExistingSeo }) {
  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(urlObj.search);
  const paramEntries = Array.from(searchParams.entries());

  // 将参数分为优先和非优先两组
  const priorityParams = [];
  const otherParams = [];

  paramEntries.forEach(([key, value]) => {
    // 如果是要保留的seo参数，跳过，后面会放在第一位
    if (keepExistingSeo && key === 'seo' && value === '0') {
      return;
    }
    
    if (PRIORITY_PARAMS.includes(key)) {
      priorityParams.push([key, value]);
    } else if (key !== 'seo') {  // 排除其他seo参数
      otherParams.push([key, value]);
    }
  });

  // 按照优先级列表的顺序排序优先参数
  priorityParams.sort((a, b) => {
    return PRIORITY_PARAMS.indexOf(a[0]) - PRIORITY_PARAMS.indexOf(b[0]);
  });

  // 构建新的URL
  const newSearchParams = new URLSearchParams();
  
  // 处理seo参数
  if (needSeoParam || keepExistingSeo) {
    newSearchParams.append('seo', '0');
  }
  
  // 然后添加其他参数
  [...priorityParams, ...otherParams].forEach(([key, value]) => {
    newSearchParams.append(key, value);
  });

  urlObj.search = newSearchParams.toString();
  return urlObj.toString();
}

// 监听页面导航完成事件
chrome.webNavigation.onCompleted.addListener((details) => {
  // details.frameId === 0 表示这是主框架的导航事件
  // 主框架是整个页面的顶层框架，不包含iframe等子框架
  if (details.frameId === 0) {
    const result = isTargetUrl(details.url);
    if (result.needProcess) {
      const newUrl = reorderUrlParams(details.url, result);
      if (newUrl !== details.url) {
        chrome.tabs.update(details.tabId, { url: newUrl });
      }
    }
  }
});
