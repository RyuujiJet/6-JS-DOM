// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  // 增 → 创建节点
  create: function create(string) {
    var container = document.createElement('template');
    container.innerHTML = string.trim();
    return container.content.firstChild;
  },
  // 增 → 新增弟弟
  after: function after(node, newNode) {
    node.parentNode.insertBefore(newNode, node.nextSibling);
  },
  // 增 → 新增哥哥
  before: function before(node, newNode) {
    node.parentNode.insertBefore(newNode, node);
  },
  // 增 → 新增儿子
  append: function append(parent, newNode) {
    parent.appendChild(newNode);
  },
  // 增 → 新增爸爸
  wrap: function wrap(node, NewParent) {
    dom.before(node, NewParent); // 先将新的父节点插入子元素之前，成为哥哥节点

    dom.append(NewParent, node); // 再将子元素新增为哥哥节点的子节点（子元素只有一个，不会重复）
  },
  // 删 → 删除节点
  remove: function remove(node) {
    node.parentNode.removeChild(node);
    return node; // 以防后续操作
  },
  // 删 → 删除后代
  empty: function empty(node) {
    // 方法一：node.innerHTML = ''
    // 方法二：可以获取到所有节点
    // const {childNodes} = node // const childNodes = node.childNodes
    var array = [];
    var x = node.firstChild;

    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    }

    return array;
  },
  // 改 → 读写属性
  attr: function attr(node, name, value) {
    // 重载
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  // 改 → 读写文本内容
  test: function test(node, value) {
    // 适配
    // node.innerText // ie
    // node.textContent // Firefox / Chrome
    if (arguments.length === 2) {
      if ('innerText' in node) {
        node.innerText = value;
      } else {
        node.textContent = value;
      }
    } else if (arguments.length === 1) {
      if ('innerText' in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  // 改 → 读写HTML内容
  html: function html(node, value) {
    if (arguments.length === 2) {
      node.innerHTML = value;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  // 改 → 修改style
  style: function style(node, obj, value) {
    if (arguments.length === 3) {
      // dom.style(node, 'color', 'red')
      node.style[obj] = value;
    } else if (arguments.length === 2) {
      if (typeof obj === 'string') {
        // dom.style(node, 'color')
        return node.style[obj];
      } else if (obj instanceof Object) {
        // dom.style(node, {color: 'red'})
        for (var key in obj) {
          node.style[key] = obj[key];
        }
      }
    }
  },
  class: {
    // 改 → 添加class
    add: function add(node, className) {
      node.classList.add(className);
    },
    // 改 → 删除class
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    // 是否有这个class
    has: function has(node, className) {
      return node.classList.contains(className);
    }
  },
  // 改 → 添加事件监听
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  // 改 → 删除事件监听
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  // 查 → 获取标签
  find: function find(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  // 查 → 获取父元素
  parent: function parent(node) {
    return node.parentNode;
  },
  // 查 → 获取子元素
  children: function children(node) {
    // return node.childNodes // 包括回车、空格、标签；Node提供的API
    return node.children; // 只包括标签；Element提供的API
  },
  // 查 → 获取兄弟姐妹元素
  siblings: function siblings(node) {
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    });
  },
  // 查 → 获取弟弟
  next: function next(node) {
    // return node.nextSibling // 含空格、回车等文本节点
    // return node.nextElementSibling // 不含空格、回车等文本节点
    var x = node.nextSibling;

    while (x && x.nodeType !== 1) {
      x = x.nextSibling;
    }

    return x;
  },
  // 查 → 获取哥哥
  previous: function previous(node) {
    // return node.previousSibling // 含空格、回车等文本节点
    // return node.previousElementSibling // 不含空格、回车等文本节点
    var x = node.previousSibling;

    while (x && x.nodeType !== 1) {
      x = x.previousSibling;
    }

    return x;
  },
  // 查 → 遍历所有节点
  each: function each(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  // 查 → 获取排行老几
  index: function index(node) {
    var x = Array.from(dom.children(dom.parent(node)));

    for (var i = 0; i < x.length; i++) {
      if (x[i] === node) {
        return i + 1;
      }
    }
  },
  // 作业 → find
  find1: function find1(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  // 作业 → style
  style1: function style1(node, obj, value) {
    if (arguments.length === 3) {
      // dom.style1(node, 'color', 'red')
      node.style[obj] = value;
    } else if (arguments.length === 2) {
      if (typeof obj === 'string') {
        // 查看
        // dom.style1(node,'color')
        return node.style[obj];
      } else if (obj instanceof Object) {
        // dom.style1(node, {color: red})
        for (var key in obj) {
          node.style[key] = obj[key];
        }
      }
    }
  },
  // 作业 → each
  each1: function each1(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn(nodeList[i]);
    }
  }
};
},{}],"../../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50588" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map