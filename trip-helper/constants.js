// 优先排序的参数列表
export const PRIORITY_PARAMS = [
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

export const TARGET_DOMAINS = {
  global: "trip.com",
  china: "ctrip.com",
};

export const PAGE_TYPES = {
  detail: "detail",
  vacationRentals: "vacation-rentals",
};

// 目标网站的详情页
export const TARGET_URL_DETAIL_PAGE = "detail";

// 目标网站的度假屋详情页
export const TARGET_URL_VACATION_RENTALS_DETAIL_PAGE = "vacation-rentals";

// 目标网站的度假屋详情页的 SEO 参数配置
export const VACATION_RENTALS_SEO_CONFIG = {
  param: "seo",
  value: "0",
};
