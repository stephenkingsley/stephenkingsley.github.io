!function(t){function e(o){if(i[o])return i[o].exports;var n=i[o]={exports:{},id:o,loaded:!1};return t[o].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var i={};return e.m=t,e.c=i,e.p="./",e(0)}([function(t,e,i){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}var n=i(1),r=i(2),s=o(r),a=new s.default(n.isInBrowser?document.body:null);a.setStateFromDOM(null),a.listenToDOM(),n.isInBrowser&&(window.scrollMonitor=a),t.exports=a},function(t,e){"use strict";e.VISIBILITYCHANGE="visibilityChange",e.ENTERVIEWPORT="enterViewport",e.FULLYENTERVIEWPORT="fullyEnterViewport",e.EXITVIEWPORT="exitViewport",e.PARTIALLYEXITVIEWPORT="partiallyExitViewport",e.LOCATIONCHANGE="locationChange",e.STATECHANGE="stateChange",e.eventTypes=[e.VISIBILITYCHANGE,e.ENTERVIEWPORT,e.FULLYENTERVIEWPORT,e.EXITVIEWPORT,e.PARTIALLYEXITVIEWPORT,e.LOCATIONCHANGE,e.STATECHANGE],e.isOnServer="undefined"==typeof window,e.isInBrowser=!e.isOnServer,e.defaultOffsets={top:0,bottom:0}},function(t,e,i){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var i=0;e.length>i;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}(),s=i(1),a=i(3),c=o(a),l=function(t){var e=void 0;return s.isOnServer&&(e=0),e=t===document.body?window.innerHeight||document.documentElement.clientHeight:t.clientHeight},h=function(t){var e=void 0;return s.isOnServer&&(e=0),e=t===document.body?Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.documentElement.clientHeight):t.scrollHeight},u=function(t){var e=void 0;return s.isOnServer&&(e=0),e=t===document.body?window.pageYOffset||document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop},p=function(){function t(e,i){var o=this;n(this,t);var r=this;this.item=e,this.watchers=[],this.viewportTop=null,this.viewportBottom=null,this.documentHeight=h(e),this.viewportHeight=l(e),this.DOMListener=function(t){o.setStateFromDOM(t),o.updateAndTriggerWatchers(t)},this.eventTypes=s.eventTypes,i&&(this.containerWatcher=i.create(e));var a=void 0,c=void 0,p=function(){if(r.viewportTop=u(e),r.viewportBottom=r.viewportTop+r.viewportHeight,r.documentHeight=h(e),r.documentHeight!==a){for(c=r.watchers.length;c;)c-=1,r.watchers[c].recalculateLocation();a=r.documentHeight}},w=void 0,d=function(){for(w=r.watchers.length;w;)w-=1,r.watchers[w].update();for(w=r.watchers.length;w;)w-=1,r.watchers[w].triggerCallbacks()};this.createCustomContainer=function(){return new t},this.update=function(){p(),d()},this.recalculateLocations=function(){o.documentHeight=0,o.update()},this.destroy=function(){}}return r(t,[{key:"listenToDOM",value:function(){var t=this;s.isInBrowser&&(window.addEventListener?(this.item===document.body?window.addEventListener("scroll",this.DOMListener):this.item.addEventListener("scroll",this.DOMListener),window.addEventListener("resize",this.DOMListener)):(this.item===document.body?window.attachEvent("onscroll",this.DOMListener):this.item.attachEvent("onscroll",this.DOMListener),window.attachEvent("onresize",this.DOMListener)),this.destroy=function(){window.addEventListener?(t.item===document.body?(window.removeEventListener("scroll",t.DOMListener),t.containerWatcher.destroy()):t.item.removeEventListener("scroll",t.DOMListener),window.removeEventListener("resize",t.DOMListener)):(t.item===document.body?(window.detachEvent("onscroll",t.DOMListener),t.containerWatcher.destroy()):t.item.detachEvent("onscroll",t.DOMListener),window.detachEvent("onresize",t.DOMListener))})}},{key:"setStateFromDOM",value:function(t){var e=u(this.item),i=l(this.item),o=h(this.item);this.setState(e,i,o,t)}},{key:"setState",value:function(t,e,i,o){var n=e!==this.viewportHeight||i!==this.contentHeight;if(this.latestEvent=o,this.viewportTop=t,this.viewportHeight=e,this.viewportBottom=t+e,this.contentHeight=i,n)for(var r=this.watchers.length;r;)r-=1,this.watchers[r].recalculateLocation();this.updateAndTriggerWatchers(o)}},{key:"updateAndTriggerWatchers",value:function(t){for(var e=this.watchers.length;e;)e-=1,this.watchers[e].update();for(e=this.watchers.length;e;)e-=1,this.watchers[e].triggerCallbacks(t)}},{key:"createContainer",value:function(e){"string"==typeof e?e=document.querySelector(e):e&&e.length>0&&(e=e[0]);var i=new t(e,this);return i.setStateFromDOM(),i.listenToDOM(),i}},{key:"create",value:function(t,e){"string"==typeof t?t=document.querySelector(t):t&&t.length>0&&(t=t[0]);var i=new c.default(this,t,e);return this.watchers.push(i),i}},{key:"beget",value:function(t,e){return this.create(t,e)}}]),t}();t.exports=p},function(t,e,i){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var n=function(){function t(t,e){for(var i=0;e.length>i;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}(),r=i(1),s=function(){function t(e,i,n){var s=this;o(this,t);var a=this;this.watchItem=i,this.container=e,this.offsets=n?n===+n?{top:n,bottom:n}:{top:n.top||r.defaultOffsets.top,bottom:n.bottom||r.defaultOffsets.bottom}:r.defaultOffsets;for(var c=function(t){return function(e,i){s.on(t,e,i)}},l=0,h=r.eventTypes.length;h>l;l+=1)this[r.eventTypes[l]]=c(r.eventTypes[l]);this.callbacks={};for(var u=0,p=r.eventTypes.length;p>u;u+=1)this.callbacks[r.eventTypes[u]]=[];this.locked=!1;var w=void 0,d=void 0,v=void 0,f=void 0,m=void 0,I=void 0,T=function(t,e){if(0!==t.length)for(m=t.length;m;)m-=1,I=t[m],I.callback.call(a,e,a),I.isOne&&t.splice(m,1)};this.triggerCallbacks=function(t){switch(s.isInViewport&&!w&&T(s.callbacks[r.ENTERVIEWPORT],t),s.isFullyInViewport&&!d&&T(s.callbacks[r.FULLYENTERVIEWPORT],t),s.isAboveViewport!==v&&s.isBelowViewport!==f&&(T(s.callbacks[r.VISIBILITYCHANGE],t),d||s.isFullyInViewport||(T(s.callbacks[r.FULLYENTERVIEWPORT],t),T(s.callbacks[r.PARTIALLYEXITVIEWPORT],t)),w||s.isInViewport||(T(s.callbacks[r.ENTERVIEWPORT],t),T(s.callbacks[r.EXITVIEWPORT],t))),!s.isFullyInViewport&&d&&T(s.callbacks[r.PARTIALLYEXITVIEWPORT],t),!s.isInViewport&&w&&T(s.callbacks[r.EXITVIEWPORT],t),s.isInViewport!==w&&T(s.callbacks[r.VISIBILITYCHANGE],t),!0){case w!==s.isInViewport:case d!==s.isFullyInViewport:case v!==s.isAboveViewport:case f!==s.isBelowViewport:T(s.callbacks[r.STATECHANGE],t);break;default:return}w=s.isInViewport,d=s.isFullyInViewport,v=s.isAboveViewport,f=s.isBelowViewport};var E=function(){if(!s.locked){var t=s.top,e=s.bottom;if(s.watchItem.nodeName){var i=s.watchItem.style.display;"none"===i&&(s.watchItem.style.display="");for(var o=0,n=s.container;n.containerWatcher;)o+=n.containerWatcher.top-n.containerWatcher.container.viewportTop,n=n.containerWatcher.container;var a=s.watchItem.getBoundingClientRect();s.top=a.top+s.container.viewportTop-o,s.bottom=a.bottom+s.container.viewportTop-o,"none"===i&&(s.watchItem.style.display=i)}else s.watchItem===+s.watchItem?s.top=s.bottom=s.watchItem>0?s.watchItem:s.container.documentHeight-s.watchItem:(s.top=s.watchItem.top,s.bottom=s.watchItem.bottom);s.top-=s.offsets.top,s.bottom+=s.offsets.bottom,s.height=s.bottom-s.top,void 0===t&&void 0===e||s.top===t&&s.bottom===e||T(s.callbacks[r.LOCATIONCHANGE],null)}};this.recalculateLocation=E,E(),this.update(),w=this.isInViewport,d=this.isFullyInViewport,v=this.isAboveViewport,f=this.isBelowViewport}return n(t,[{key:"on",value:function(t,e,i){switch(!0){case t===r.VISIBILITYCHANGE&&!this.isInViewport&&this.isAboveViewport:case t===r.ENTERVIEWPORT&&this.isInViewport:case t===r.FULLYENTERVIEWPORT&&this.isFullyInViewport:case t===r.EXITVIEWPORT&&this.isAboveViewport&&!this.isInViewport:case t===r.PARTIALLYEXITVIEWPORT&&this.isAboveViewport:default:if(e.call(this,this.container.latestEvent,this),i)return}if(!this.callbacks[t])throw Error("Tried to add a scroll monitor listener of type-"+t+"-Your options are:-"+r.eventTypes.join(", "));this.callbacks[t].push({callback:e,isOne:i||!1})}},{key:"off",value:function(t,e){if(!this.callbacks[t])throw Error("Tried to remove a scroll monitor listener of type-"+t+"-Your options are:-"+r.eventTypes.join(", "));for(var i,o=0;i===this.callbacks[t][o];o+=1)if(i.callback===e){this.callbacks[t].splice(o,1);break}}},{key:"one",value:function(t,e){this.on(t,e,!0)}},{key:"recalculateSize",value:function(){this.height=this.watchItem.offsetHeight+this.offsets.top+this.offsets.bottom,this.bottom=this.top+this.height}},{key:"update",value:function(){this.isAboveViewport=this.container.viewportTop>this.top,this.isBelowViewport=this.bottom>this.container.viewportBottom,this.isInViewport=this.container.viewportBottom>this.top&&this.bottom>this.container.viewportTop,this.isFullyInViewport=this.top>=this.container.viewportTop&&(this.container.viewportBottom>=this.bottom||this.isAboveViewport&&this.isBelowViewport)}},{key:"destroy",value:function(){var t=this.container.watchers.indexOf(this),e=this;this.container.watchers.splice(t,1);for(var i=0,o=r.eventTypes.length;o>i;i+=1)e.callbacks[r.eventTypes[i]].length=0}},{key:"lock",value:function(){this.locked=!0}},{key:"unlock",value:function(){this.locked=!1}}]),t}();t.exports=s}]);