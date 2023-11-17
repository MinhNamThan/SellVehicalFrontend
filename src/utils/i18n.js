import Vue from "vue";
import VueI18n from "vue-i18n";
import "./Objects";
import { getI18nKey } from "@/utils/routerUtil";

import enMessage from "@/lang/en.json";
import viMessage from "@/lang/vi.json";
const messages = {
  VN: viMessage,
  US: enMessage,
};

function initI18n(locale, fallback) {
  Vue.use(VueI18n);
  let i18nOptions = {
    locale,
    fallbackLocale: fallback,
    silentFallbackWarn: true,
    messages,
  };
  return new VueI18n(i18nOptions);
}

function generateI18n(lang, routes, valueKey) {
  routes.forEach((route) => {
    let keys = getI18nKey(route.fullPath).split(".");
    let value =
      valueKey === "path"
        ? route[valueKey]
            .split("/")
            .filter((item) => !item.startsWith(":") && item != "")
            .join(".")
        : route[valueKey];
    lang.assignProps(keys, value);
    if (route.children) {
      generateI18n(lang, route.children, valueKey);
    }
  });
  return lang;
}

function formatFullPath(routes, parentPath = "") {
  routes.forEach((route) => {
    let isFullPath = route.path.substring(0, 1) === "/";
    route.fullPath = isFullPath
      ? route.path
      : parentPath === "/"
      ? parentPath + route.path
      : parentPath + "/" + route.path;
    if (route.children) {
      formatFullPath(route.children, route.fullPath);
    }
  });
}

function mergeI18nFromRoutes(i18n, routes) {
  formatFullPath(routes);
  const CN = generateI18n(new Object(), routes, "name");
  const US = generateI18n(new Object(), routes, "path");
  i18n.mergeLocaleMessage("CN", CN);
  i18n.mergeLocaleMessage("US", US);
}

export { initI18n, mergeI18nFromRoutes, formatFullPath };
