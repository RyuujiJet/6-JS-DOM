// 增 → 创建节点
const div1 = dom.create('<div><span>创建HTML</span></div>')
console.log('div1', div1)

// 增 → 新增弟弟
const div2 = dom.create('<div>NewDiv2</div>')
dom.after(test2, div2)

// 增 → 新增爸爸
const div3 = dom.create('<div id="parent"></div>') // 父节点
dom.wrap(test3, div3)
console.log('div3', div3)

// 删 → 删除后代
const nodes = dom.empty(window.empty)
console.log('empty', nodes)

// 改 → 读写属性
dom.attr(window.attr, 'title', 'hi')
const title = dom.attr(window.attr, 'title')
console.log(`tile值为${title}`)

// 查 → 获取标签
// querySelectorAll返回伪数组，取第一个，下标为0
console.log('document', dom.find('#find')[0])
console.log('scope', dom.find('.red', dom.find('#find')[0])[0])

let s2 = dom.find('#s2')[0]
// 查 → 获取兄弟姐妹元素
console.log('siblings', dom.siblings(s2))
// 查 → 获取弟弟
console.log('next', dom.next(s2))
// 查 → 获取哥哥
console.log('previous', dom.previous(s2))

// 查 → 遍历所有节点
let travel = dom.children(dom.find('#travel')[0])
dom.each(travel, n => {dom.class.add(n, 'red')})

// 查 → 获取排行老几
let t2 = dom.find('#t2')[0]
console.log('index', dom.index(t2))


// 作业
const div = dom.find1('#test1>.pink')[0] // 获取对应的元素
console.log('div', div)

dom.style1(div, 'color', 'pink') // 设置 div.style.color

const divList = dom.find1('.pink') // 获取多个 div.pink 元素
dom.each1(divList, (n, index)=> console.log('n', n)) // 遍历 divList 里的所有元素
