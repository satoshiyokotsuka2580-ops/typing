import { onRequestGet as __api_rankings_js_onRequestGet } from "C:\\Users\\sy2674\\Desktop\\desktop_python\\typing\\functions\\api\\rankings.js"
import { onRequestPost as __api_rankings_js_onRequestPost } from "C:\\Users\\sy2674\\Desktop\\desktop_python\\typing\\functions\\api\\rankings.js"

export const routes = [
    {
      routePath: "/api/rankings",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_rankings_js_onRequestGet],
    },
  {
      routePath: "/api/rankings",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_rankings_js_onRequestPost],
    },
  ]