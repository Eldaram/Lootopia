"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/hunts";
exports.ids = ["pages/api/hunts"];
exports.modules = {

/***/ "(api-node)/./knexfile.js":
/*!*********************!*\
  !*** ./knexfile.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)({\n    path: \"../.env.local\"\n});\nmodule.exports = {\n    development: {\n        client: \"pg\",\n        debug: true,\n        connection: process.env.DB__CONNECTION,\n        migrations: {\n            directory: \"./db/migrations\",\n            stub: \"./db/migration.stub\",\n            loadExtensions: [\n                \".js\"\n            ]\n        },\n        seeds: {\n            directory: \"./db/seeds\",\n            stub: \"./db/seed.stub\",\n            loadExtensions: [\n                \".js\"\n            ]\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2tuZXhmaWxlLmpzIiwibWFwcGluZ3MiOiI7QUFBQUEsb0RBQXdCLENBQUM7SUFBRUUsTUFBTTtBQUFnQjtBQUVqREMsT0FBT0MsT0FBTyxHQUFHO0lBQ2ZDLGFBQWE7UUFDWEMsUUFBUTtRQUNSQyxPQUFPO1FBQ1BDLFlBQVlDLFFBQVFDLEdBQUcsQ0FBQ0MsY0FBYztRQUN0Q0MsWUFBWTtZQUNWQyxXQUFXO1lBQ1hDLE1BQU07WUFDTkMsZ0JBQWdCO2dCQUFDO2FBQU07UUFDekI7UUFDQUMsT0FBTztZQUNMSCxXQUFXO1lBQ1hDLE1BQU07WUFDTkMsZ0JBQWdCO2dCQUFDO2FBQU07UUFDekI7SUFDRjtBQUNGIiwic291cmNlcyI6WyJDOlxcZ2l0XFxMb290b3BpYVxcTG9vdG9waWFcXGJhY2tlbmRcXGtuZXhmaWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJkb3RlbnZcIikuY29uZmlnKHsgcGF0aDogXCIuLi8uZW52LmxvY2FsXCIgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZXZlbG9wbWVudDoge1xuICAgIGNsaWVudDogXCJwZ1wiLFxuICAgIGRlYnVnOiB0cnVlLFxuICAgIGNvbm5lY3Rpb246IHByb2Nlc3MuZW52LkRCX19DT05ORUNUSU9OLFxuICAgIG1pZ3JhdGlvbnM6IHtcbiAgICAgIGRpcmVjdG9yeTogXCIuL2RiL21pZ3JhdGlvbnNcIixcbiAgICAgIHN0dWI6IFwiLi9kYi9taWdyYXRpb24uc3R1YlwiLFxuICAgICAgbG9hZEV4dGVuc2lvbnM6IFtcIi5qc1wiXSxcbiAgICB9LFxuICAgIHNlZWRzOiB7XG4gICAgICBkaXJlY3Rvcnk6IFwiLi9kYi9zZWVkc1wiLFxuICAgICAgc3R1YjogXCIuL2RiL3NlZWQuc3R1YlwiLFxuICAgICAgbG9hZEV4dGVuc2lvbnM6IFtcIi5qc1wiXSxcbiAgICB9LFxuICB9LFxufTtcbiJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwicGF0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZXZlbG9wbWVudCIsImNsaWVudCIsImRlYnVnIiwiY29ubmVjdGlvbiIsInByb2Nlc3MiLCJlbnYiLCJEQl9fQ09OTkVDVElPTiIsIm1pZ3JhdGlvbnMiLCJkaXJlY3RvcnkiLCJzdHViIiwibG9hZEV4dGVuc2lvbnMiLCJzZWVkcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./knexfile.js\n");

/***/ }),

/***/ "(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fhunts&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Chunts.js&middlewareConfigBase64=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fhunts&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Chunts.js&middlewareConfigBase64=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages-api/module.compiled */ \"(api-node)/./node_modules/next/dist/server/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(api-node)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api-node)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_hunts_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages\\api\\hunts.js */ \"(api-node)/./pages/api/hunts.js\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_hunts_js__WEBPACK_IMPORTED_MODULE_3__, 'default'));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_hunts_js__WEBPACK_IMPORTED_MODULE_3__, 'config');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/hunts\",\n        pathname: \"/api/hunts\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    userland: _pages_api_hunts_js__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtcm91dGUtbG9hZGVyL2luZGV4LmpzP2tpbmQ9UEFHRVNfQVBJJnBhZ2U9JTJGYXBpJTJGaHVudHMmcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZwYWdlcyU1Q2FwaSU1Q2h1bnRzLmpzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNFO0FBQzFEO0FBQ21EO0FBQ25EO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQyxnREFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMsZ0RBQVE7QUFDcEM7QUFDTyx3QkFBd0IseUdBQW1CO0FBQ2xEO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZXNBUElSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvcGFnZXMtYXBpL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9wYWdlc1xcXFxhcGlcXFxcaHVudHMuanNcIjtcbi8vIFJlLWV4cG9ydCB0aGUgaGFuZGxlciAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgJ2RlZmF1bHQnKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsICdjb25maWcnKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzQVBJUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTX0FQSSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2h1bnRzXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvaHVudHNcIixcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBhcmVuJ3QgdXNlZCBpbiBwcm9kdWN0aW9uLlxuICAgICAgICBidW5kbGVQYXRoOiAnJyxcbiAgICAgICAgZmlsZW5hbWU6ICcnXG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLWFwaS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fhunts&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Chunts.js&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api-node)/./pages/api/hunts.js":
/*!****************************!*\
  !*** ./pages/api/hunts.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _services_db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/db.js */ \"(api-node)/./services/db.js\");\n/* harmony import */ var _services_db_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_services_db_js__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function handler(req, res) {\n    try {\n        if (req.method === \"GET\") {\n            const hunts = await _services_db_js__WEBPACK_IMPORTED_MODULE_0___default()(\"hunts\");\n            return res.status(200).json(hunts);\n        }\n        if (req.method === \"POST\") {\n            const [id] = await _services_db_js__WEBPACK_IMPORTED_MODULE_0___default()(\"hunts\").insert(req.body).returning(\"id\");\n            return res.status(201).json({\n                id\n            });\n        }\n        res.setHeader(\"Allow\", [\n            \"GET\",\n            \"POST\"\n        ]);\n        return res.status(405).end(`Method ${req.method} Not Allowed`);\n    } catch (error) {\n        console.error(\"API error:\", error);\n        res.status(500).json({\n            error: \"Erreur serveur\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL3BhZ2VzL2FwaS9odW50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBc0M7QUFFdkIsZUFBZUMsUUFBUUMsR0FBRyxFQUFFQyxHQUFHO0lBQzVDLElBQUk7UUFDRixJQUFJRCxJQUFJRSxNQUFNLEtBQUssT0FBTztZQUN4QixNQUFNQyxRQUFRLE1BQU1MLHNEQUFFQSxDQUFDO1lBQ3ZCLE9BQU9HLElBQUlHLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUNGO1FBQzlCO1FBRUEsSUFBSUgsSUFBSUUsTUFBTSxLQUFLLFFBQVE7WUFDekIsTUFBTSxDQUFDSSxHQUFHLEdBQUcsTUFBTVIsc0RBQUVBLENBQUMsU0FBU1MsTUFBTSxDQUFDUCxJQUFJUSxJQUFJLEVBQUVDLFNBQVMsQ0FBQztZQUMxRCxPQUFPUixJQUFJRyxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO2dCQUFFQztZQUFHO1FBQ25DO1FBRUFMLElBQUlTLFNBQVMsQ0FBQyxTQUFTO1lBQUM7WUFBTztTQUFPO1FBQ3RDLE9BQU9ULElBQUlHLE1BQU0sQ0FBQyxLQUFLTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUVYLElBQUlFLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDL0QsRUFBRSxPQUFPVSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyxjQUFjQTtRQUM1QlgsSUFBSUcsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFTyxPQUFPO1FBQWlCO0lBQ2pEO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxnaXRcXExvb3RvcGlhXFxMb290b3BpYVxcYmFja2VuZFxccGFnZXNcXGFwaVxcaHVudHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRiIGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9kYi5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIHRyeSB7XG4gICAgaWYgKHJlcS5tZXRob2QgPT09IFwiR0VUXCIpIHtcbiAgICAgIGNvbnN0IGh1bnRzID0gYXdhaXQgZGIoXCJodW50c1wiKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbihodW50cyk7XG4gICAgfVxuXG4gICAgaWYgKHJlcS5tZXRob2QgPT09IFwiUE9TVFwiKSB7XG4gICAgICBjb25zdCBbaWRdID0gYXdhaXQgZGIoXCJodW50c1wiKS5pbnNlcnQocmVxLmJvZHkpLnJldHVybmluZyhcImlkXCIpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAxKS5qc29uKHsgaWQgfSk7XG4gICAgfVxuXG4gICAgcmVzLnNldEhlYWRlcihcIkFsbG93XCIsIFtcIkdFVFwiLCBcIlBPU1RcIl0pO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuZW5kKGBNZXRob2QgJHtyZXEubWV0aG9kfSBOb3QgQWxsb3dlZGApO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJBUEkgZXJyb3I6XCIsIGVycm9yKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycmV1ciBzZXJ2ZXVyXCIgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJkYiIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJodW50cyIsInN0YXR1cyIsImpzb24iLCJpZCIsImluc2VydCIsImJvZHkiLCJyZXR1cm5pbmciLCJzZXRIZWFkZXIiLCJlbmQiLCJlcnJvciIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api-node)/./pages/api/hunts.js\n");

/***/ }),

/***/ "(api-node)/./services/db.js":
/*!************************!*\
  !*** ./services/db.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst knex = __webpack_require__(/*! knex */ \"knex\");\nconst config = __webpack_require__(/*! ../knexfile */ \"(api-node)/./knexfile.js\");\nconst db = knex(config.development);\nmodule.exports = db;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL3NlcnZpY2VzL2RiLmpzIiwibWFwcGluZ3MiOiI7QUFBQSxNQUFNQSxPQUFPQyxtQkFBT0EsQ0FBQyxrQkFBTTtBQUMzQixNQUFNQyxTQUFTRCxtQkFBT0EsQ0FBQyw2Q0FBYTtBQUVwQyxNQUFNRSxLQUFLSCxLQUFLRSxPQUFPRSxXQUFXO0FBRWxDQyxPQUFPQyxPQUFPLEdBQUdIIiwic291cmNlcyI6WyJDOlxcZ2l0XFxMb290b3BpYVxcTG9vdG9waWFcXGJhY2tlbmRcXHNlcnZpY2VzXFxkYi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBrbmV4ID0gcmVxdWlyZShcImtuZXhcIik7XG5jb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4va25leGZpbGVcIik7XG5cbmNvbnN0IGRiID0ga25leChjb25maWcuZGV2ZWxvcG1lbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRiO1xuIl0sIm5hbWVzIjpbImtuZXgiLCJyZXF1aXJlIiwiY29uZmlnIiwiZGIiLCJkZXZlbG9wbWVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api-node)/./services/db.js\n");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "knex":
/*!***********************!*\
  !*** external "knex" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("knex");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fhunts&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Chunts.js&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();