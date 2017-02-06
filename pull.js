/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1dd34eb35c12265debf8"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(1)(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!*******************************!*\
  !*** ./~/pulljs/lib/index.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _SETTINGS = {};\nvar defaultStyle = void 0;\nvar defaultHTML = void 0;\nvar _defaults = {\n  distThreshold: 60,\n  distMax: 80,\n  distReload: 50,\n  bodyOffset: 20,\n  mainElement: 'body',\n  triggerElement: 'body',\n  ptrElement: '.ptr',\n  classPrefix: 'ptr--',\n  cssProp: 'min-height',\n  containerClassName: '',\n  boxClassName: '',\n  contentClassName: '',\n  textClassName: '',\n  instructionsPullToRefresh: 'Pull down to refresh',\n  instructionsReleaseToRefresh: 'Release to refresh',\n  instructionsRefreshing: 'Refreshing',\n  refreshTimeout: 500,\n  onInit: function onInit() {},\n  onRefresh: function onRefresh() {\n    return location.reload();\n  },\n  resistanceFunction: function resistanceFunction(t) {\n    return Math.min(1, t / 2.5);\n  }\n};\n\nvar pullStartY = null;\nvar pullMoveY = null;\nvar dist = 0;\nvar distResisted = 0;\n\nvar _state = 'pending';\nvar _setup = false;\nvar _enable = false;\nvar _timeout = void 0;\n\nfunction _update() {\n  var _SETTINGS2 = _SETTINGS,\n      classPrefix = _SETTINGS2.classPrefix,\n      ptrElement = _SETTINGS2.ptrElement,\n      instructionsRefreshing = _SETTINGS2.instructionsRefreshing,\n      instructionsPullToRefresh = _SETTINGS2.instructionsPullToRefresh,\n      instructionsReleaseToRefresh = _SETTINGS2.instructionsReleaseToRefresh;\n\n\n  var textEl = ptrElement.querySelector('.' + classPrefix + 'text');\n\n  if (_state === 'releasing') {\n    textEl.innerHTML = instructionsReleaseToRefresh;\n  }\n\n  if (_state === 'pulling' || _state === 'pending') {\n    textEl.innerHTML = instructionsPullToRefresh;\n  }\n\n  if (_state === 'refreshing') {\n    textEl.innerHTML = instructionsRefreshing;\n  }\n}\n\nfunction _setupEvents() {\n  function onReset() {\n    var _SETTINGS3 = _SETTINGS,\n        cssProp = _SETTINGS3.cssProp,\n        ptrElement = _SETTINGS3.ptrElement,\n        classPrefix = _SETTINGS3.classPrefix;\n\n\n    ptrElement.classList.remove(classPrefix + 'refresh');\n    ptrElement.style[cssProp] = '0px';\n\n    _state = 'pending';\n  }\n\n  function _onTouchStart(e) {\n    var _SETTINGS4 = _SETTINGS,\n        triggerElement = _SETTINGS4.triggerElement;\n\n\n    if (!window.scrollY) {\n      pullStartY = e.touches[0].screenY;\n    }\n\n    if (_state !== 'pending') {\n      return;\n    }\n\n    clearTimeout(_timeout);\n\n    _enable = triggerElement.contains(e.target);\n    _state = 'pending';\n    _update();\n  }\n\n  function _onTouchMove(e) {\n    var _SETTINGS5 = _SETTINGS,\n        ptrElement = _SETTINGS5.ptrElement,\n        resistanceFunction = _SETTINGS5.resistanceFunction,\n        distMax = _SETTINGS5.distMax,\n        distThreshold = _SETTINGS5.distThreshold,\n        cssProp = _SETTINGS5.cssProp,\n        classPrefix = _SETTINGS5.classPrefix;\n\n\n    if (!pullStartY) {\n      if (!window.scrollY) {\n        pullStartY = e.touches[0].screenY;\n      }\n    } else {\n      pullMoveY = e.touches[0].screenY;\n    }\n\n    if (!_enable || _state === 'refreshing') {\n      if (!window.scrollY && pullStartY < pullMoveY) {\n        e.preventDefault();\n      }\n\n      return;\n    }\n\n    if (_state === 'pending') {\n      ptrElement.classList.add(classPrefix + 'pull');\n      _state = 'pulling';\n      _update();\n    }\n\n    if (pullStartY && pullMoveY) {\n      dist = pullMoveY - pullStartY;\n    }\n\n    if (dist > 0) {\n      e.preventDefault();\n\n      ptrElement.style[cssProp] = distResisted + 'px';\n\n      distResisted = resistanceFunction(dist / distThreshold) * Math.min(distMax, dist);\n\n      if (_state === 'pulling' && distResisted > distThreshold) {\n        ptrElement.classList.add(classPrefix + 'release');\n        _state = 'releasing';\n        _update();\n      }\n\n      if (_state === 'releasing' && distResisted < distThreshold) {\n        ptrElement.classList.remove(classPrefix + 'release');\n        _state = 'pulling';\n        _update();\n      }\n    }\n  }\n\n  function _onTouchEnd() {\n    var _SETTINGS6 = _SETTINGS,\n        ptrElement = _SETTINGS6.ptrElement,\n        onRefresh = _SETTINGS6.onRefresh,\n        refreshTimeout = _SETTINGS6.refreshTimeout,\n        distThreshold = _SETTINGS6.distThreshold,\n        distReload = _SETTINGS6.distReload,\n        cssProp = _SETTINGS6.cssProp,\n        classPrefix = _SETTINGS6.classPrefix;\n\n\n    if (_state === 'releasing' && distResisted > distThreshold) {\n      _state = 'refreshing';\n\n      ptrElement.style[cssProp] = distReload + 'px';\n      ptrElement.classList.add(classPrefix + 'refresh');\n\n      _timeout = setTimeout(function () {\n        var retval = onRefresh(onReset);\n\n        if (retval && typeof retval.then === 'function') {\n          retval.then(function () {\n            return onReset();\n          });\n        }\n\n        if (!retval && !onRefresh.length) {\n          onReset();\n        }\n      }, refreshTimeout);\n    } else {\n      if (_state === 'refreshing') {\n        return;\n      }\n\n      ptrElement.style[cssProp] = '0px';\n\n      _state = 'pending';\n    }\n\n    _update();\n\n    ptrElement.classList.remove(classPrefix + 'release');\n    ptrElement.classList.remove(classPrefix + 'pull');\n\n    pullStartY = pullMoveY = null;\n    dist = distResisted = 0;\n  }\n\n  window.addEventListener('touchend', _onTouchEnd);\n  window.addEventListener('touchstart', _onTouchStart);\n  window.addEventListener('touchmove', _onTouchMove, { passive: false });\n\n  // Store event handlers to use for teardown later\n  return {\n    onTouchStart: _onTouchStart,\n    onTouchMove: _onTouchMove,\n    onTouchEnd: _onTouchEnd\n  };\n}\n\nfunction _run() {\n  var _SETTINGS7 = _SETTINGS,\n      mainElement = _SETTINGS7.mainElement,\n      classPrefix = _SETTINGS7.classPrefix,\n      onInit = _SETTINGS7.onInit,\n      containerClassName = _SETTINGS7.containerClassName;\n\n\n  if (!_SETTINGS.ptrElement) {\n    var ptr = document.createElement('div');\n    if (mainElement !== document.body) {\n      mainElement.parentNode.insertBefore(ptr, mainElement);\n    } else {\n      document.body.insertBefore(ptr, document.body.firstChild);\n    }\n\n    ptr.classList.add(classPrefix + 'ptr');\n    if (containerClassName !== '') {\n      ptr.classList.add('' + containerClassName);\n    }\n    ptr.innerHTML = defaultHTML;\n    _SETTINGS.ptrElement = ptr;\n  }\n\n  var styleEl = document.createElement('style');\n\n  styleEl.textContent = defaultStyle;\n\n  // document.head.appendChild(styleEl);\n\n  document.head.insertBefore(styleEl, document.head.firstChild);\n\n  if (typeof onInit === 'function') {\n    onInit(_SETTINGS);\n  }\n\n  return {\n    styleNode: styleEl,\n    ptrElement: _SETTINGS.ptrElement\n  };\n}\n\nvar updateElement = function updateElement() {\n  defaultStyle = '\\n    .' + _SETTINGS.classPrefix + 'ptr {\\n      background: #E0E0E0;\\n      pointer-events: none;\\n      font-size: 0.85em;\\n      font-weight: bold;\\n      top: 0;\\n      height: 0;\\n      transition: height 0.3s, min-height 0.3s;\\n      text-align: center;\\n      width: 100%;\\n      overflow: hidden;\\n      display: flex;\\n      align-items: flex-end;\\n      align-content: stretch;\\n    }\\n    .' + _SETTINGS.classPrefix + 'box {\\n      padding: 10px;\\n      flex-basis: 100%;\\n    }\\n    .' + _SETTINGS.classPrefix + 'pull {\\n      transition: none;\\n    }\\n    .' + _SETTINGS.classPrefix + 'release .' + _SETTINGS.classPrefix + 'icon {\\n      transform: rotate(180deg);\\n    }\\n  ';\n\n  defaultHTML = '\\n    <div class=\"' + _SETTINGS.classPrefix + 'box' + (_SETTINGS.boxClassName ? ' ' + _SETTINGS.boxClassName : '') + '\">\\n      <div class=\"' + _SETTINGS.classPrefix + 'content' + (_SETTINGS.contentClassName ? ' ' + _SETTINGS.contentClassName : '') + '\">\\n        <div class=\"' + _SETTINGS.classPrefix + 'text' + (_SETTINGS.textClassName ? ' ' + _SETTINGS.textClassName : '') + '\"></div>\\n      </div>\\n    </div>\\n  ';\n};\n\nvar Pull = {\n  init: function init() {\n    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    var handlers = void 0;\n    Object.keys(_defaults).forEach(function (key) {\n      _SETTINGS[key] = options[key] || _defaults[key];\n    });\n\n    if (typeof _SETTINGS.mainElement === 'string') {\n      _SETTINGS.mainElement = document.querySelector(_SETTINGS.mainElement);\n    }\n\n    if (typeof _SETTINGS.ptrElement === 'string') {\n      _SETTINGS.ptrElement = document.querySelector(_SETTINGS.ptrElement);\n    }\n\n    if (typeof _SETTINGS.triggerElement === 'string') {\n      _SETTINGS.triggerElement = document.querySelector(_SETTINGS.triggerElement);\n    }\n\n    updateElement();\n\n    if (!_setup) {\n      handlers = _setupEvents();\n      _setup = true;\n    }\n\n    var _run2 = _run(),\n        styleNode = _run2.styleNode,\n        ptrElement = _run2.ptrElement;\n\n    return {\n      destroy: function destroy() {\n        // Teardown event listeners\n        window.removeEventListener('touchstart', handlers.onTouchStart);\n        window.removeEventListener('touchend', handlers.onTouchEnd);\n        window.removeEventListener('touchmove', handlers.onTouchMove);\n\n        // Remove ptr element and style tag\n        styleNode.parentNode.removeChild(styleNode);\n        ptrElement.parentNode.removeChild(ptrElement);\n\n        // Enable setupEvents to run again\n        _setup = false;\n\n        // null object references\n        handlers = null;\n        styleNode = null;\n        ptrElement = null;\n        _SETTINGS = {};\n      }\n    };\n  }\n};\n\nmodule.exports = Pull;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL34vcHVsbGpzL2xpYi9pbmRleC5qcz8zZDMzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIF9TRVRUSU5HUyA9IHt9O1xudmFyIGRlZmF1bHRTdHlsZSA9IHZvaWQgMDtcbnZhciBkZWZhdWx0SFRNTCA9IHZvaWQgMDtcbnZhciBfZGVmYXVsdHMgPSB7XG4gIGRpc3RUaHJlc2hvbGQ6IDYwLFxuICBkaXN0TWF4OiA4MCxcbiAgZGlzdFJlbG9hZDogNTAsXG4gIGJvZHlPZmZzZXQ6IDIwLFxuICBtYWluRWxlbWVudDogJ2JvZHknLFxuICB0cmlnZ2VyRWxlbWVudDogJ2JvZHknLFxuICBwdHJFbGVtZW50OiAnLnB0cicsXG4gIGNsYXNzUHJlZml4OiAncHRyLS0nLFxuICBjc3NQcm9wOiAnbWluLWhlaWdodCcsXG4gIGNvbnRhaW5lckNsYXNzTmFtZTogJycsXG4gIGJveENsYXNzTmFtZTogJycsXG4gIGNvbnRlbnRDbGFzc05hbWU6ICcnLFxuICB0ZXh0Q2xhc3NOYW1lOiAnJyxcbiAgaW5zdHJ1Y3Rpb25zUHVsbFRvUmVmcmVzaDogJ1B1bGwgZG93biB0byByZWZyZXNoJyxcbiAgaW5zdHJ1Y3Rpb25zUmVsZWFzZVRvUmVmcmVzaDogJ1JlbGVhc2UgdG8gcmVmcmVzaCcsXG4gIGluc3RydWN0aW9uc1JlZnJlc2hpbmc6ICdSZWZyZXNoaW5nJyxcbiAgcmVmcmVzaFRpbWVvdXQ6IDUwMCxcbiAgb25Jbml0OiBmdW5jdGlvbiBvbkluaXQoKSB7fSxcbiAgb25SZWZyZXNoOiBmdW5jdGlvbiBvblJlZnJlc2goKSB7XG4gICAgcmV0dXJuIGxvY2F0aW9uLnJlbG9hZCgpO1xuICB9LFxuICByZXNpc3RhbmNlRnVuY3Rpb246IGZ1bmN0aW9uIHJlc2lzdGFuY2VGdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgubWluKDEsIHQgLyAyLjUpO1xuICB9XG59O1xuXG52YXIgcHVsbFN0YXJ0WSA9IG51bGw7XG52YXIgcHVsbE1vdmVZID0gbnVsbDtcbnZhciBkaXN0ID0gMDtcbnZhciBkaXN0UmVzaXN0ZWQgPSAwO1xuXG52YXIgX3N0YXRlID0gJ3BlbmRpbmcnO1xudmFyIF9zZXR1cCA9IGZhbHNlO1xudmFyIF9lbmFibGUgPSBmYWxzZTtcbnZhciBfdGltZW91dCA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3VwZGF0ZSgpIHtcbiAgdmFyIF9TRVRUSU5HUzIgPSBfU0VUVElOR1MsXG4gICAgICBjbGFzc1ByZWZpeCA9IF9TRVRUSU5HUzIuY2xhc3NQcmVmaXgsXG4gICAgICBwdHJFbGVtZW50ID0gX1NFVFRJTkdTMi5wdHJFbGVtZW50LFxuICAgICAgaW5zdHJ1Y3Rpb25zUmVmcmVzaGluZyA9IF9TRVRUSU5HUzIuaW5zdHJ1Y3Rpb25zUmVmcmVzaGluZyxcbiAgICAgIGluc3RydWN0aW9uc1B1bGxUb1JlZnJlc2ggPSBfU0VUVElOR1MyLmluc3RydWN0aW9uc1B1bGxUb1JlZnJlc2gsXG4gICAgICBpbnN0cnVjdGlvbnNSZWxlYXNlVG9SZWZyZXNoID0gX1NFVFRJTkdTMi5pbnN0cnVjdGlvbnNSZWxlYXNlVG9SZWZyZXNoO1xuXG5cbiAgdmFyIHRleHRFbCA9IHB0ckVsZW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBjbGFzc1ByZWZpeCArICd0ZXh0Jyk7XG5cbiAgaWYgKF9zdGF0ZSA9PT0gJ3JlbGVhc2luZycpIHtcbiAgICB0ZXh0RWwuaW5uZXJIVE1MID0gaW5zdHJ1Y3Rpb25zUmVsZWFzZVRvUmVmcmVzaDtcbiAgfVxuXG4gIGlmIChfc3RhdGUgPT09ICdwdWxsaW5nJyB8fCBfc3RhdGUgPT09ICdwZW5kaW5nJykge1xuICAgIHRleHRFbC5pbm5lckhUTUwgPSBpbnN0cnVjdGlvbnNQdWxsVG9SZWZyZXNoO1xuICB9XG5cbiAgaWYgKF9zdGF0ZSA9PT0gJ3JlZnJlc2hpbmcnKSB7XG4gICAgdGV4dEVsLmlubmVySFRNTCA9IGluc3RydWN0aW9uc1JlZnJlc2hpbmc7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldHVwRXZlbnRzKCkge1xuICBmdW5jdGlvbiBvblJlc2V0KCkge1xuICAgIHZhciBfU0VUVElOR1MzID0gX1NFVFRJTkdTLFxuICAgICAgICBjc3NQcm9wID0gX1NFVFRJTkdTMy5jc3NQcm9wLFxuICAgICAgICBwdHJFbGVtZW50ID0gX1NFVFRJTkdTMy5wdHJFbGVtZW50LFxuICAgICAgICBjbGFzc1ByZWZpeCA9IF9TRVRUSU5HUzMuY2xhc3NQcmVmaXg7XG5cblxuICAgIHB0ckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc1ByZWZpeCArICdyZWZyZXNoJyk7XG4gICAgcHRyRWxlbWVudC5zdHlsZVtjc3NQcm9wXSA9ICcwcHgnO1xuXG4gICAgX3N0YXRlID0gJ3BlbmRpbmcnO1xuICB9XG5cbiAgZnVuY3Rpb24gX29uVG91Y2hTdGFydChlKSB7XG4gICAgdmFyIF9TRVRUSU5HUzQgPSBfU0VUVElOR1MsXG4gICAgICAgIHRyaWdnZXJFbGVtZW50ID0gX1NFVFRJTkdTNC50cmlnZ2VyRWxlbWVudDtcblxuXG4gICAgaWYgKCF3aW5kb3cuc2Nyb2xsWSkge1xuICAgICAgcHVsbFN0YXJ0WSA9IGUudG91Y2hlc1swXS5zY3JlZW5ZO1xuICAgIH1cblxuICAgIGlmIChfc3RhdGUgIT09ICdwZW5kaW5nJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChfdGltZW91dCk7XG5cbiAgICBfZW5hYmxlID0gdHJpZ2dlckVsZW1lbnQuY29udGFpbnMoZS50YXJnZXQpO1xuICAgIF9zdGF0ZSA9ICdwZW5kaW5nJztcbiAgICBfdXBkYXRlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfb25Ub3VjaE1vdmUoZSkge1xuICAgIHZhciBfU0VUVElOR1M1ID0gX1NFVFRJTkdTLFxuICAgICAgICBwdHJFbGVtZW50ID0gX1NFVFRJTkdTNS5wdHJFbGVtZW50LFxuICAgICAgICByZXNpc3RhbmNlRnVuY3Rpb24gPSBfU0VUVElOR1M1LnJlc2lzdGFuY2VGdW5jdGlvbixcbiAgICAgICAgZGlzdE1heCA9IF9TRVRUSU5HUzUuZGlzdE1heCxcbiAgICAgICAgZGlzdFRocmVzaG9sZCA9IF9TRVRUSU5HUzUuZGlzdFRocmVzaG9sZCxcbiAgICAgICAgY3NzUHJvcCA9IF9TRVRUSU5HUzUuY3NzUHJvcCxcbiAgICAgICAgY2xhc3NQcmVmaXggPSBfU0VUVElOR1M1LmNsYXNzUHJlZml4O1xuXG5cbiAgICBpZiAoIXB1bGxTdGFydFkpIHtcbiAgICAgIGlmICghd2luZG93LnNjcm9sbFkpIHtcbiAgICAgICAgcHVsbFN0YXJ0WSA9IGUudG91Y2hlc1swXS5zY3JlZW5ZO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwdWxsTW92ZVkgPSBlLnRvdWNoZXNbMF0uc2NyZWVuWTtcbiAgICB9XG5cbiAgICBpZiAoIV9lbmFibGUgfHwgX3N0YXRlID09PSAncmVmcmVzaGluZycpIHtcbiAgICAgIGlmICghd2luZG93LnNjcm9sbFkgJiYgcHVsbFN0YXJ0WSA8IHB1bGxNb3ZlWSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoX3N0YXRlID09PSAncGVuZGluZycpIHtcbiAgICAgIHB0ckVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc1ByZWZpeCArICdwdWxsJyk7XG4gICAgICBfc3RhdGUgPSAncHVsbGluZyc7XG4gICAgICBfdXBkYXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHB1bGxTdGFydFkgJiYgcHVsbE1vdmVZKSB7XG4gICAgICBkaXN0ID0gcHVsbE1vdmVZIC0gcHVsbFN0YXJ0WTtcbiAgICB9XG5cbiAgICBpZiAoZGlzdCA+IDApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgcHRyRWxlbWVudC5zdHlsZVtjc3NQcm9wXSA9IGRpc3RSZXNpc3RlZCArICdweCc7XG5cbiAgICAgIGRpc3RSZXNpc3RlZCA9IHJlc2lzdGFuY2VGdW5jdGlvbihkaXN0IC8gZGlzdFRocmVzaG9sZCkgKiBNYXRoLm1pbihkaXN0TWF4LCBkaXN0KTtcblxuICAgICAgaWYgKF9zdGF0ZSA9PT0gJ3B1bGxpbmcnICYmIGRpc3RSZXNpc3RlZCA+IGRpc3RUaHJlc2hvbGQpIHtcbiAgICAgICAgcHRyRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzUHJlZml4ICsgJ3JlbGVhc2UnKTtcbiAgICAgICAgX3N0YXRlID0gJ3JlbGVhc2luZyc7XG4gICAgICAgIF91cGRhdGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9zdGF0ZSA9PT0gJ3JlbGVhc2luZycgJiYgZGlzdFJlc2lzdGVkIDwgZGlzdFRocmVzaG9sZCkge1xuICAgICAgICBwdHJFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NQcmVmaXggKyAncmVsZWFzZScpO1xuICAgICAgICBfc3RhdGUgPSAncHVsbGluZyc7XG4gICAgICAgIF91cGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfb25Ub3VjaEVuZCgpIHtcbiAgICB2YXIgX1NFVFRJTkdTNiA9IF9TRVRUSU5HUyxcbiAgICAgICAgcHRyRWxlbWVudCA9IF9TRVRUSU5HUzYucHRyRWxlbWVudCxcbiAgICAgICAgb25SZWZyZXNoID0gX1NFVFRJTkdTNi5vblJlZnJlc2gsXG4gICAgICAgIHJlZnJlc2hUaW1lb3V0ID0gX1NFVFRJTkdTNi5yZWZyZXNoVGltZW91dCxcbiAgICAgICAgZGlzdFRocmVzaG9sZCA9IF9TRVRUSU5HUzYuZGlzdFRocmVzaG9sZCxcbiAgICAgICAgZGlzdFJlbG9hZCA9IF9TRVRUSU5HUzYuZGlzdFJlbG9hZCxcbiAgICAgICAgY3NzUHJvcCA9IF9TRVRUSU5HUzYuY3NzUHJvcCxcbiAgICAgICAgY2xhc3NQcmVmaXggPSBfU0VUVElOR1M2LmNsYXNzUHJlZml4O1xuXG5cbiAgICBpZiAoX3N0YXRlID09PSAncmVsZWFzaW5nJyAmJiBkaXN0UmVzaXN0ZWQgPiBkaXN0VGhyZXNob2xkKSB7XG4gICAgICBfc3RhdGUgPSAncmVmcmVzaGluZyc7XG5cbiAgICAgIHB0ckVsZW1lbnQuc3R5bGVbY3NzUHJvcF0gPSBkaXN0UmVsb2FkICsgJ3B4JztcbiAgICAgIHB0ckVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc1ByZWZpeCArICdyZWZyZXNoJyk7XG5cbiAgICAgIF90aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXR2YWwgPSBvblJlZnJlc2gob25SZXNldCk7XG5cbiAgICAgICAgaWYgKHJldHZhbCAmJiB0eXBlb2YgcmV0dmFsLnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR2YWwudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gb25SZXNldCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXR2YWwgJiYgIW9uUmVmcmVzaC5sZW5ndGgpIHtcbiAgICAgICAgICBvblJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHJlZnJlc2hUaW1lb3V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKF9zdGF0ZSA9PT0gJ3JlZnJlc2hpbmcnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcHRyRWxlbWVudC5zdHlsZVtjc3NQcm9wXSA9ICcwcHgnO1xuXG4gICAgICBfc3RhdGUgPSAncGVuZGluZyc7XG4gICAgfVxuXG4gICAgX3VwZGF0ZSgpO1xuXG4gICAgcHRyRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzUHJlZml4ICsgJ3JlbGVhc2UnKTtcbiAgICBwdHJFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NQcmVmaXggKyAncHVsbCcpO1xuXG4gICAgcHVsbFN0YXJ0WSA9IHB1bGxNb3ZlWSA9IG51bGw7XG4gICAgZGlzdCA9IGRpc3RSZXNpc3RlZCA9IDA7XG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBfb25Ub3VjaEVuZCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgX29uVG91Y2hTdGFydCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBfb25Ub3VjaE1vdmUsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG5cbiAgLy8gU3RvcmUgZXZlbnQgaGFuZGxlcnMgdG8gdXNlIGZvciB0ZWFyZG93biBsYXRlclxuICByZXR1cm4ge1xuICAgIG9uVG91Y2hTdGFydDogX29uVG91Y2hTdGFydCxcbiAgICBvblRvdWNoTW92ZTogX29uVG91Y2hNb3ZlLFxuICAgIG9uVG91Y2hFbmQ6IF9vblRvdWNoRW5kXG4gIH07XG59XG5cbmZ1bmN0aW9uIF9ydW4oKSB7XG4gIHZhciBfU0VUVElOR1M3ID0gX1NFVFRJTkdTLFxuICAgICAgbWFpbkVsZW1lbnQgPSBfU0VUVElOR1M3Lm1haW5FbGVtZW50LFxuICAgICAgY2xhc3NQcmVmaXggPSBfU0VUVElOR1M3LmNsYXNzUHJlZml4LFxuICAgICAgb25Jbml0ID0gX1NFVFRJTkdTNy5vbkluaXQsXG4gICAgICBjb250YWluZXJDbGFzc05hbWUgPSBfU0VUVElOR1M3LmNvbnRhaW5lckNsYXNzTmFtZTtcblxuXG4gIGlmICghX1NFVFRJTkdTLnB0ckVsZW1lbnQpIHtcbiAgICB2YXIgcHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKG1haW5FbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBtYWluRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwdHIsIG1haW5FbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUocHRyLCBkb2N1bWVudC5ib2R5LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHB0ci5jbGFzc0xpc3QuYWRkKGNsYXNzUHJlZml4ICsgJ3B0cicpO1xuICAgIGlmIChjb250YWluZXJDbGFzc05hbWUgIT09ICcnKSB7XG4gICAgICBwdHIuY2xhc3NMaXN0LmFkZCgnJyArIGNvbnRhaW5lckNsYXNzTmFtZSk7XG4gICAgfVxuICAgIHB0ci5pbm5lckhUTUwgPSBkZWZhdWx0SFRNTDtcbiAgICBfU0VUVElOR1MucHRyRWxlbWVudCA9IHB0cjtcbiAgfVxuXG4gIHZhciBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICBzdHlsZUVsLnRleHRDb250ZW50ID0gZGVmYXVsdFN0eWxlO1xuXG4gIC8vIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XG5cbiAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbCwgZG9jdW1lbnQuaGVhZC5maXJzdENoaWxkKTtcblxuICBpZiAodHlwZW9mIG9uSW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9uSW5pdChfU0VUVElOR1MpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdHlsZU5vZGU6IHN0eWxlRWwsXG4gICAgcHRyRWxlbWVudDogX1NFVFRJTkdTLnB0ckVsZW1lbnRcbiAgfTtcbn1cblxudmFyIHVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbiB1cGRhdGVFbGVtZW50KCkge1xuICBkZWZhdWx0U3R5bGUgPSAnXFxuICAgIC4nICsgX1NFVFRJTkdTLmNsYXNzUHJlZml4ICsgJ3B0ciB7XFxuICAgICAgYmFja2dyb3VuZDogI0UwRTBFMDtcXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gICAgICBmb250LXNpemU6IDAuODVlbTtcXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcXG4gICAgICB0b3A6IDA7XFxuICAgICAgaGVpZ2h0OiAwO1xcbiAgICAgIHRyYW5zaXRpb246IGhlaWdodCAwLjNzLCBtaW4taGVpZ2h0IDAuM3M7XFxuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XFxuICAgICAgZGlzcGxheTogZmxleDtcXG4gICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XFxuICAgICAgYWxpZ24tY29udGVudDogc3RyZXRjaDtcXG4gICAgfVxcbiAgICAuJyArIF9TRVRUSU5HUy5jbGFzc1ByZWZpeCArICdib3gge1xcbiAgICAgIHBhZGRpbmc6IDEwcHg7XFxuICAgICAgZmxleC1iYXNpczogMTAwJTtcXG4gICAgfVxcbiAgICAuJyArIF9TRVRUSU5HUy5jbGFzc1ByZWZpeCArICdwdWxsIHtcXG4gICAgICB0cmFuc2l0aW9uOiBub25lO1xcbiAgICB9XFxuICAgIC4nICsgX1NFVFRJTkdTLmNsYXNzUHJlZml4ICsgJ3JlbGVhc2UgLicgKyBfU0VUVElOR1MuY2xhc3NQcmVmaXggKyAnaWNvbiB7XFxuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcXG4gICAgfVxcbiAgJztcblxuICBkZWZhdWx0SFRNTCA9ICdcXG4gICAgPGRpdiBjbGFzcz1cIicgKyBfU0VUVElOR1MuY2xhc3NQcmVmaXggKyAnYm94JyArIChfU0VUVElOR1MuYm94Q2xhc3NOYW1lID8gJyAnICsgX1NFVFRJTkdTLmJveENsYXNzTmFtZSA6ICcnKSArICdcIj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiJyArIF9TRVRUSU5HUy5jbGFzc1ByZWZpeCArICdjb250ZW50JyArIChfU0VUVElOR1MuY29udGVudENsYXNzTmFtZSA/ICcgJyArIF9TRVRUSU5HUy5jb250ZW50Q2xhc3NOYW1lIDogJycpICsgJ1wiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cIicgKyBfU0VUVElOR1MuY2xhc3NQcmVmaXggKyAndGV4dCcgKyAoX1NFVFRJTkdTLnRleHRDbGFzc05hbWUgPyAnICcgKyBfU0VUVElOR1MudGV4dENsYXNzTmFtZSA6ICcnKSArICdcIj48L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAnO1xufTtcblxudmFyIFB1bGwgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gICAgdmFyIGhhbmRsZXJzID0gdm9pZCAwO1xuICAgIE9iamVjdC5rZXlzKF9kZWZhdWx0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBfU0VUVElOR1Nba2V5XSA9IG9wdGlvbnNba2V5XSB8fCBfZGVmYXVsdHNba2V5XTtcbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgX1NFVFRJTkdTLm1haW5FbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgX1NFVFRJTkdTLm1haW5FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfU0VUVElOR1MubWFpbkVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgX1NFVFRJTkdTLnB0ckVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBfU0VUVElOR1MucHRyRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoX1NFVFRJTkdTLnB0ckVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgX1NFVFRJTkdTLnRyaWdnZXJFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgX1NFVFRJTkdTLnRyaWdnZXJFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfU0VUVElOR1MudHJpZ2dlckVsZW1lbnQpO1xuICAgIH1cblxuICAgIHVwZGF0ZUVsZW1lbnQoKTtcblxuICAgIGlmICghX3NldHVwKSB7XG4gICAgICBoYW5kbGVycyA9IF9zZXR1cEV2ZW50cygpO1xuICAgICAgX3NldHVwID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgX3J1bjIgPSBfcnVuKCksXG4gICAgICAgIHN0eWxlTm9kZSA9IF9ydW4yLnN0eWxlTm9kZSxcbiAgICAgICAgcHRyRWxlbWVudCA9IF9ydW4yLnB0ckVsZW1lbnQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgLy8gVGVhcmRvd24gZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgaGFuZGxlcnMub25Ub3VjaFN0YXJ0KTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgaGFuZGxlcnMub25Ub3VjaEVuZCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBoYW5kbGVycy5vblRvdWNoTW92ZSk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHB0ciBlbGVtZW50IGFuZCBzdHlsZSB0YWdcbiAgICAgICAgc3R5bGVOb2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICAgICAgcHRyRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHB0ckVsZW1lbnQpO1xuXG4gICAgICAgIC8vIEVuYWJsZSBzZXR1cEV2ZW50cyB0byBydW4gYWdhaW5cbiAgICAgICAgX3NldHVwID0gZmFsc2U7XG5cbiAgICAgICAgLy8gbnVsbCBvYmplY3QgcmVmZXJlbmNlc1xuICAgICAgICBoYW5kbGVycyA9IG51bGw7XG4gICAgICAgIHN0eWxlTm9kZSA9IG51bGw7XG4gICAgICAgIHB0ckVsZW1lbnQgPSBudWxsO1xuICAgICAgICBfU0VUVElOR1MgPSB7fTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFB1bGw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3B1bGxqcy9saWIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _pulljs = __webpack_require__(/*! pulljs */ 0);\n\nvar _pulljs2 = _interopRequireDefault(_pulljs);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n_pulljs2.default.init({\n  // mainElement: '',\n  instructionsPullToRefresh: 'Pull to Refresh',\n  instructionsReleaseToRefresh: 'Release to Refresh',\n  instructionsRefreshing: 'Refreshing',\n  onRefresh: function onRefresh() {\n    alert('hello pulljs');\n  }\n});//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9pbmRleC5qcz8xNjg3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQdWxsIGZyb20gJ3B1bGxqcyc7XG5cblB1bGwuaW5pdCh7XG4gIC8vIG1haW5FbGVtZW50OiAnJyxcbiAgaW5zdHJ1Y3Rpb25zUHVsbFRvUmVmcmVzaDogJ1B1bGwgdG8gUmVmcmVzaCcsXG4gIGluc3RydWN0aW9uc1JlbGVhc2VUb1JlZnJlc2g6ICdSZWxlYXNlIHRvIFJlZnJlc2gnLFxuICBpbnN0cnVjdGlvbnNSZWZyZXNoaW5nOiAnUmVmcmVzaGluZycsXG4gIG9uUmVmcmVzaDogZnVuY3Rpb24oKSB7YWxlcnQoJ2hlbGxvIHB1bGxqcycpfVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gaW5kZXguanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBTEEiLCJzb3VyY2VSb290IjoiIn0=");

/***/ })
/******/ ]);