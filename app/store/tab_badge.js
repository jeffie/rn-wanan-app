import { observable, action } from 'mobx'

class TabBadgeStore {
  @observable tabInfo // 注册变量，使其成为可检测的

  constructor() {
    this.tabInfo = {}
  }

  @action  // 方法推荐用箭头函数的形式
  add = (target, num) => {
    this.tabInfo[target] = num
  }

  @action
  clear = (target) => {
    this.tabInfo[target] = 0
  }
}

const tabBadgeStore = new TabBadgeStore()

export { tabBadgeStore }