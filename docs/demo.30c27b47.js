parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"Tnu0":[function(require,module,exports) {

},{}],"VNNP":[function(require,module,exports) {
var define;
var e;function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}parcelRequire=function(r,n,o,u){var i="function"==typeof parcelRequire&&parcelRequire,s="function"==typeof require&&require;function c(e,t){if(!n[e]){if(!r[e]){var o="function"==typeof parcelRequire&&parcelRequire;if(!t&&o)return o(e,!0);if(i)return i(e,!0);if(s&&"string"==typeof e)return s(e);var u=new Error("Cannot find module '"+e+"'");throw u.code="MODULE_NOT_FOUND",u}l.resolve=function(t){return r[e][1][t]||t},l.cache={};var f=n[e]=new c.Module(e);r[e][0].call(f.exports,l,f,f.exports,this)}return n[e].exports;function l(e){return c(l.resolve(e))}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.exports={}},c.modules=r,c.cache=n,c.parent=i,c.register=function(e,t){r[e]=[function(e,r){r.exports=t},{}]};for(var f=0;f<o.length;f++)c(o[f]);if(o.length){var l=c(o[o.length-1]);"object"==("undefined"==typeof exports?"undefined":t(exports))&&"undefined"!=typeof module?module.exports=l:"function"==typeof e&&e.amd&&e(function(){return l})}return c}({"7QCb":[function(e,t,r){"use strict";function n(e,t){var r=t.length,n=e.length;if(n>r)return{isMatch:!1,score:0,indexes:[]};var o=e===t;if(n===r)return{isMatch:o,score:o?n:0,indexes:o?[{start:0,end:n}]:[]};var u=[],i=null,s=null,c=0;e:for(var f=0,l=0;f<n;f++){for(var a=e.charCodeAt(f);l<r;){if(t.charCodeAt(l)===a){null===i&&(i=l),s=++l;continue e}null!==i&&(c=s-i>c?s-i:c,u.push({start:i,end:s}),i=null),l++}return{isMatch:!1,score:0,indexes:[]}}return null!==i&&(c=s-i>c?s-i:c,u.push({start:i,end:s})),{isMatch:u.length>0,score:c,indexes:u}}function o(e,t,r){void 0===r&&(r="strong");var n=t.length;if(!n)return e;for(var o=[],u=0,i=0;i<n;i++)o.push(e.substring(u,t[i].start),"<"+r+">",e.substring(t[i].start,t[i].end),"</"+r+">"),u=t[i].end;return o.push(e.substring(u)),o.join("")}r.__esModule=!0,r.isFuzzyMatch=function(e,t){return"string"==typeof t?n(e,t).isMatch:Object.keys(t).some(function(r){return n(e,t[r]).isMatch})},r.search=n,r.fuzzyHighlight=function(e,t,r){return o(t,n(e,t).indexes,r)},r.highlight=o},{}]},{},["7QCb"]);
},{}],"Focm":[function(require,module,exports) {
"use strict";require("./styles.css");var e=require("../lib/index");function t(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},l=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(l=l.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),l.forEach(function(t){n(e,t,r[t])})}return e}function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}document.getElementById("needle").addEventListener("input",function(e){var t=e.target.value,n=document.getElementById("haystack").value;r(t,n.split("\n"))}),document.getElementById("haystack").addEventListener("input",function(e){var t=e.target.value,n=document.getElementById("needle").value;r(n,t.split("\n"))});var r=function(n,r){var l=r.map(function(r){return t({label:r},(0,e.search)(n,r))}).filter(function(e){return e.isMatch});l.length?(document.getElementById("result").style.color="black",document.getElementById("result").innerHTML="",l.sort(function(e,t){return t.score-e.score}),l.forEach(function(t){if(t.label){var n=(0,e.highlight)(t.label,t.indexes);document.getElementById("result").innerHTML+="<li>".concat(n,"</li>")}})):(document.getElementById("result").style.color="red",document.getElementById("result").innerHTML="No matches")};
},{"./styles.css":"Tnu0","../lib/index":"VNNP"}]},{},["Focm"], null)