## 介绍

这是一个多级联动的，可多选的```vue```组件。

本组件开发基于```vue 2.6.6```、```element-ui 2.6.1```。

![效果](http://cdn.ninix.cn/multi-cascader.png)

## 注意

* 不支持全选功能。
* 标签框用的是```element-ui```的```tag```组件，它的宽度无法设置最大宽度，因此无法控制```tag```的宽度。
* 浮层基于```element-ui```的```popover```组件，因此可以设置浮层位置，也可以让它自由决定浮层位置。
* 记得引入```element-ui```的样式文件```import 'element-ui/lib/theme-chalk/index.css'```。
* 本组件源码使用```pug```、```stylus```，注意安装相关loader。


## Attribute

属性|说明|类型|默认值
----|----|----|--
props                  | 配置选项，详细见下面说明      | object   | {label: 'label', value: 'value', children: 'children'}
options                | 可选项数据源                  | string
placeholder            | 输入框占位文本                | string   | 请选择
popover-placement      | 浮层的位置，同 popover        | string   | top-start
tag-mode                | tag中显示文字模式             | string   | label
render-tag-label       | 自定义tag的文字               | function

* props 说明：
    * label，指定选项标签为选项对象的某个属性值，默认为'label'
    * value，指定选项的值为选项对象的某个属性值，默认为'value'
    * children，指定选项的子选项为选项对象的某个属性值，默认为'children'
* options 格式：
    * 每个节点包含属性：label、checked、children
        * label 用于显示的文本
        * checked 表示该项是否被勾选，有子节点的节点不需要该属性
        * children 存储子节点，没有子节点的节点不需要该属性
    * 节点会被组件添加属性：deep、deepLabel、deepValue
        * deep 表示该节点在节点树中的深度，如'0,1,1'
        * deepLabel 为基于节点深度的文本信息，如'一级菜单0/二级菜单1/三级菜单1'
        * deepValue 为基于节点深度的value信息，如'0,01,001'
* popover-placement 可选值：
    * top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
* tag-mode 可选值：
    * label，即label属性
    * deepLabel，包含父层级label，以‘/’分隔
* render-tag-label 用于自定义tag上的文本，接受一个表示tagMode对应的值的参数，需返回要显示的文本

## Event

事件名      |   说明                            | 参数
------------|-----------------------------------|---------
change      |   选中项或删除项后触发            | 改变过后的所有选中项

## Methods

方法名      |   说明                            |   参数
------------|-----------------------------------|-------------
getSelected |   获取所有选中的节点              |

## 使用案例

```html
<template lang="pug">
  multi-cascader(
    ref='myMultiCascader'
    :style='{width: "300px"}'
    :options='options'
    :render-tag-label='renderTagLabel'
    @change='changeCascader'
  )
</template>

<script>
import MultiCascader from 'multi-cascader'

export default {
  components: {
    MultiCascader
  },
  data() {
    return {
      options: [
        {
          value: '1', label: '一级菜单',
          children: [
            {
              value: '11', label: '二级菜单',
              children: [
                { value: '111', checked: true, label: '三级菜单' }
              ]
            },
            { value: '12', checked: false, label: '二级菜单2' }
          ]
        },
        { value: '2', checked: false, label: '一级菜单2' },
        { value: '3', checked: true, label: '一级菜单3' }
      ],
    }
  },
  methods: {
    // 每次改变选中项，都会触发change事件，参数为当前的选中项列表
    changeCascader(items) {
      console.log(items)
    },
    // 每次改变选中项，可自定义用于依次重新计算选中项的显示文本的函数
    renderTagLabel(tagLabel) {
      console.log(tagLabel)
      return tagLabel
    },
    // 通过方法直接获取已选中的节点
    getSelected() {
        console.log(this.$refs.myMultiCascader.getSelected())
    }
  }
}
```

如果想要全局引入，可在 main.js 写入以下内容：

```js
import MultiCascader from 'multi-cascader'

Vue.use(MultiCascader)
```