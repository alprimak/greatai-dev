import 'piccolore';
import { k as decodeKey } from './chunks/astro/server_C_E68hk9.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C812cMNm.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/alprimak/Projects/greatai-dev/","cacheDir":"file:///home/alprimak/Projects/greatai-dev/node_modules/.astro/","outDir":"file:///home/alprimak/Projects/greatai-dev/dist/","srcDir":"file:///home/alprimak/Projects/greatai-dev/src/","publicDir":"file:///home/alprimak/Projects/greatai-dev/public/","buildClientDir":"file:///home/alprimak/Projects/greatai-dev/dist/client/","buildServerDir":"file:///home/alprimak/Projects/greatai-dev/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"projects/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects","isIndex":false,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/reactions/[slug]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/reactions\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"reactions","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/api/reactions/[slug].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://greatai.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/alprimak/Projects/greatai-dev/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/home/alprimak/Projects/greatai-dev/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["/home/alprimak/Projects/greatai-dev/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["/home/alprimak/Projects/greatai-dev/src/pages/projects.astro",{"propagation":"none","containsHead":true}],["/home/alprimak/Projects/greatai-dev/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/alprimak/Projects/greatai-dev/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/reactions/[slug]@_@ts":"pages/api/reactions/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"pages/blog/_---slug_.astro.mjs","\u0000@astro-page:src/pages/projects@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CeDczmdF.mjs","/home/alprimak/Projects/greatai-dev/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BcJjwiQu.mjs","/home/alprimak/Projects/greatai-dev/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/home/alprimak/Projects/greatai-dev/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_D9soWMan.mjs","/home/alprimak/Projects/greatai-dev/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DkYCJXP-.js","/home/alprimak/Projects/greatai-dev/src/components/Reactions.astro?astro&type=script&index=0&lang.ts":"_astro/Reactions.astro_astro_type_script_index_0_lang.BoIET_Wq.js","/home/alprimak/Projects/greatai-dev/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.C06vs49o.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/alprimak/Projects/greatai-dev/src/pages/index.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const s=document.querySelectorAll(\".category-pill\"),a=document.querySelectorAll(\".posts-list li\");s.forEach(e=>{e.addEventListener(\"click\",()=>{s.forEach(t=>t.classList.remove(\"active\")),e.classList.add(\"active\");const o=e.getAttribute(\"data-category\"),c=e.getAttribute(\"data-tags\")?.split(\",\").filter(Boolean)||[];a.forEach(t=>{const l=t.getAttribute(\"data-tags\")?.split(\",\").filter(Boolean)||[];if(o===\"all\")t.style.display=\"\";else{const i=c.some(n=>l.includes(n));t.style.display=i?\"\":\"none\"}})})})});"],["/home/alprimak/Projects/greatai-dev/src/components/Reactions.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"astro:page-load\",()=>{document.querySelectorAll(\".reactions\").forEach(s=>{const o=s.getAttribute(\"data-slug\");if(!o)return;const t=s.querySelector(\".like-btn\"),i=s.querySelector(\".dislike-btn\"),l=s.querySelector(\".like-count\"),d=`reaction:${o}`,n=localStorage.getItem(d);n===\"like\"?t.classList.add(\"voted\"):n===\"dislike\"&&i.classList.add(\"voted\"),fetch(`/api/reactions/${o}`).then(e=>e.json()).then(e=>{l.textContent=e.likes?.toString()??\"0\"}).catch(()=>{l.textContent=\"0\"});const r=async e=>{if(n)return;const c=e===\"like\"?t:i;c.disabled=!0;try{const a=await fetch(`/api/reactions/${o}`,{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({type:e})});if(a.ok&&(localStorage.setItem(d,e),c.classList.add(\"voted\"),t.disabled=!0,i.disabled=!0,e===\"like\")){const u=await a.json();u.likes!==void 0&&(l.textContent=u.likes.toString())}}catch(a){console.error(\"Failed to submit reaction:\",a),c.disabled=!1}};t.addEventListener(\"click\",()=>r(\"like\")),i.addEventListener(\"click\",()=>r(\"dislike\")),n&&(t.disabled=!0,i.disabled=!0)})});"],["/home/alprimak/Projects/greatai-dev/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts","var f=\"@vercel/analytics\",l=\"1.6.1\",w=()=>{window.va||(window.va=function(...r){(window.vaq=window.vaq||[]).push(r)})};function d(){return typeof window<\"u\"}function u(){try{const e=\"production\"}catch{}return\"production\"}function v(e=\"auto\"){if(e===\"auto\"){window.vam=u();return}window.vam=e}function m(){return(d()?window.vam:u())||\"production\"}function c(){return m()===\"development\"}function b(e,r){if(!e||!r)return e;let n=e;try{const t=Object.entries(r);for(const[a,i]of t)if(!Array.isArray(i)){const o=s(i);o.test(n)&&(n=n.replace(o,`/[${a}]`))}for(const[a,i]of t)if(Array.isArray(i)){const o=s(i.join(\"/\"));o.test(n)&&(n=n.replace(o,`/[...${a}]`))}return n}catch{return e}}function s(e){return new RegExp(`/${h(e)}(?=[/?#]|$)`)}function h(e){return e.replace(/[.*+?^${}()|[\\]\\\\]/g,\"\\\\$&\")}function y(e){return e.scriptSrc?e.scriptSrc:c()?\"https://va.vercel-scripts.com/v1/script.debug.js\":e.basePath?`${e.basePath}/insights/script.js`:\"/_vercel/insights/script.js\"}function g(e={debug:!0}){var r;if(!d())return;v(e.mode),w(),e.beforeSend&&((r=window.va)==null||r.call(window,\"beforeSend\",e.beforeSend));const n=y(e);if(document.head.querySelector(`script[src*=\"${n}\"]`))return;const t=document.createElement(\"script\");t.src=n,t.defer=!0,t.dataset.sdkn=f+(e.framework?`/${e.framework}`:\"\"),t.dataset.sdkv=l,e.disableAutoTrack&&(t.dataset.disableAutoTrack=\"1\"),e.endpoint?t.dataset.endpoint=e.endpoint:e.basePath&&(t.dataset.endpoint=`${e.basePath}/insights`),e.dsn&&(t.dataset.dsn=e.dsn),t.onerror=()=>{const a=c()?\"Please check if any ad blockers are enabled and try again.\":\"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.\";console.log(`[Vercel Web Analytics] Failed to load script from ${n}. ${a}`)},c()&&e.debug===!1&&(t.dataset.debug=\"false\"),document.head.appendChild(t)}function p({route:e,path:r}){var n;(n=window.va)==null||n.call(window,\"pageview\",{route:e,path:r})}function k(){try{return}catch{}}customElements.define(\"vercel-analytics\",class extends HTMLElement{constructor(){super();try{const r=JSON.parse(this.dataset.props??\"{}\"),n=JSON.parse(this.dataset.params??\"{}\");g({...r,disableAutoTrack:!0,framework:\"astro\",basePath:k(),beforeSend:window.webAnalyticsBeforeSend});const t=this.dataset.pathname;p({route:b(t??\"\",n),path:t})}catch(r){throw new Error(`Failed to parse WebAnalytics properties: ${r}`)}}});"]],"assets":["/_astro/blog-placeholder-1.Bx0Zcyzv.jpg","/_astro/_slug_.fUn9mpYj.css","/_astro/_slug_.BTgtDMgm.css","/_astro/index.Dw1FUJPW.css","/favicon.svg","/llms.txt","/logo.svg","/robots.txt","/fonts/atkinson-bold.woff","/fonts/atkinson-regular.woff","/logos/askturret-grid.svg","/logos/askturret.svg","/about/index.html","/blog/index.html","/projects/index.html","/rss.xml","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"ZW63/M722O2KdPHfeAKebftCGOHohg0k6zgDxNsgh5M="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
