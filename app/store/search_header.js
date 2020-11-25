import { observable, action } from 'mobx';

class SearchHeaderStore {
  @observable navigation; // 注册变量，使其成为可检测的
}

const searchHeaderStore = new SearchHeaderStore();

export { searchHeaderStore };