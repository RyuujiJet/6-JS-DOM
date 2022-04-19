window.dom = {
    // 增 → 创建节点
    create(string) {
        const container = document.createElement('template')
        container.innerHTML = string.trim()
        return container.content.firstChild
    },
    // 增 → 新增弟弟
    after(node, newNode) {
        node.parentNode.insertBefore(newNode, node.nextSibling)
    },
    // 增 → 新增哥哥
    before(node, newNode) {
        node.parentNode.insertBefore(newNode, node)
    },
    // 增 → 新增儿子
    append(parent, newNode) {
        parent.appendChild(newNode)
    },
    // 增 → 新增爸爸
    wrap(node, NewParent) {
        dom.before(node, NewParent) // 先将新的父节点插入子元素之前，成为哥哥节点
        dom.append(NewParent, node) // 再将子元素新增为哥哥节点的子节点（子元素只有一个，不会重复）
    },
    // 删 → 删除节点
    remove(node) {
        node.parentNode.removeChild(node)
        return node // 以防后续操作
    },
    // 删 → 删除后代
    empty(node) {
        // 方法一：node.innerHTML = ''
        // 方法二：可以获取到所有节点
        // const {childNodes} = node // const childNodes = node.childNodes
        const array = []
        let x = node.firstChild
        while(x) {
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },
    // 改 → 读写属性
    attr(node, name, value) { // 重载
        if(arguments.length === 3){
            node.setAttribute(name, value)
        } else if(arguments.length === 2) {
            return node.getAttribute(name)
        }
    },
    // 改 → 读写文本内容
    test(node, value) { // 适配
        // node.innerText // ie
        // node.textContent // Firefox / Chrome
        if (arguments.length === 2) {
            if ('innerText' in node) {
                node.innerText = value
            } else {
                node.textContent = value
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText
            } else {
                return node.textContent
            }
        }
        
    },
    // 改 → 读写HTML内容
    html(node, value) {
        if (arguments.length === 2) {
            node.innerHTML = value
        } else if (arguments.length === 1) {
            return node.innerHTML
        }
    },
    // 改 → 修改style
    style(node, obj, value) {
        if (arguments.length === 3) {
            // dom.style(node, 'color', 'red')
            node.style[obj] = value
        } else if (arguments.length === 2) {
            if (typeof obj === 'string') {
                // dom.style(node, 'color')
                return node.style[obj]
            } else if (obj instanceof Object) {
                // dom.style(node, {color: 'red'})
                for (let key in obj) {
                    node.style[key] = obj[key]
                }
            }
        }
    },
    class: {
        // 改 → 添加class
        add(node, className) {
            node.classList.add(className)
        },
        // 改 → 删除class
        remove(node, className) {
            node.classList.remove(className)
        },
        // 是否有这个class
        has(node, className) {
            return node.classList.contains(className)
        }
    },
    // 改 → 添加事件监听
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },
    // 改 → 删除事件监听
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },
    // 查 → 获取标签
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
    },
    // 查 → 获取父元素
    parent(node) {
        return node.parentNode
    },
    // 查 → 获取子元素
    children(node) {
        // return node.childNodes // 包括回车、空格、标签；Node提供的API
        return node.children // 只包括标签；Element提供的API
    },
    // 查 → 获取兄弟姐妹元素
    siblings(node) {
        return Array.from(node.parentNode.children).filter(n => n !== node)
    },
    // 查 → 获取弟弟
    next(node) {
        // return node.nextSibling // 含空格、回车等文本节点
        // return node.nextElementSibling // 不含空格、回车等文本节点
        let x = node.nextSibling
        while(x && x.nodeType !== 1) {
            x = x.nextSibling
        }
        return x
    },
    // 查 → 获取哥哥
    previous(node) {
        // return node.previousSibling // 含空格、回车等文本节点
        // return node.previousElementSibling // 不含空格、回车等文本节点
        let x = node.previousSibling
        while(x && x.nodeType !== 1) {
            x = x.previousSibling
        }
        return x
    },
    // 查 → 遍历所有节点
    each(nodeList, fn) {
        for(let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i])
        }
    },
    // 查 → 获取排行老几
    index(node) {
        let x = Array.from(dom.children(dom.parent(node)))
        for(let i = 0; i < x.length; i++) {
            if(x[i] === node) {
                return i + 1
            }
        }
    },


    // 作业 → find
    find1(selector, scope) {
        return (scope || document).querySelectorAll(selector)
    },
    // 作业 → style
    style1(node, obj, value) {
        if(arguments.length === 3) {
            // dom.style1(node, 'color', 'red')
            node.style[obj] = value
        } else if (arguments.length === 2) {
            if (typeof obj === 'string') { // 查看
                // dom.style1(node,'color')
                return node.style[obj]
            } else if (obj instanceof Object) {
                // dom.style1(node, {color: red})
                for(let key in obj) {
                    node.style[key] = obj[key]
                }
            }
        }
    },
    // 作业 → each
    each1(nodeList, fn) {
        for(let i = 0; i < nodeList.length; i++) {
            fn(nodeList[i])
        }
    }
}