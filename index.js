import MultiCascader from './src/multi-cascader';

/* istanbul ignore next */
MultiCascader.install = function(Vue) {
  Vue.component(MultiCascader.name, MultiCascader);
};

export default MultiCascader;
