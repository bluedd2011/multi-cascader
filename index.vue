<template lang='pug'>
  .multil-cascader(:class='{"is-focus": isFocus}')
    el-popover(
      visible-arrow='true'
      trigger='click'
      popper-class='multil-cascader-popover'
      :placement='popoverPlacement'
      @show='isFocus = true'
      @hide='isFocus = false'
      @after-leave='afterLeave'
    )
      .u-content
        .u-rows(
          v-for='rows in activeItems'
        )
          ul
            li.u-row(
              :title='row[props.label]'
              v-for='(row,index) of rows'
              :key='index'
              @click='clickRow(row)'
            )
              el-checkbox(v-if='!row[props.children] || row[props.children].length<=0' v-model='row.checked' @change='changeCheckbox(row)') {{ row[props.label] }}
              span.u-label(v-else) {{ row[props.label] }}
              i.el-icon-arrow-right(v-show='row[props.children] && row[props.children].length > 0')
      .u-tags(slot='reference')
        template(v-if='selectedCheckboxs && selectedCheckboxs.length>0')
          el-tag(
            closable
            size='small'
            v-for='row in selectedCheckboxs'
            :key='row.deep'
            @close='closeTag(row)'
          ) {{ renderTagLabel(row[tagMode]) }}
        span.u-placeholder(v-else) {{ placeholder }}
</template>

<script>
export default {
  props: {
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value',
          children: 'children'
        }
      }
    },
    placeholder: { type: String, default: '请选择' },
    options: { type: Array, default() { return [] } },
    width: { type: String, default: '180px' },
    popoverHeight: { type: String, default: '200px' },
    popoverPlacement: { type: String, default: 'top-start' },
    tagMode: { type: String, default: 'label' }, // label,deepLabel
    renderTagLabel: { type: Function, default: function (label) { return label } },
  },
  data() {
    return {
      isFocus: false,
      activeItems: [],
      selectedCheckboxs: [],
      selectedStr: '',
    }
  },
  methods: {
    setItemDeep(rows, prefixId, prefixLabel, prefixValue) {
      const props = this.props
      rows.forEach((row, index) => {
        row.deep = prefixId ? `${prefixId},${index}` : index.toString()
        row.deepLabel = prefixLabel ? `${prefixLabel}/${row[props.label]}` : row[props.label]
        row.deepValue = prefixValue ? `${prefixValue},${row[props.value]}` : row[props.value]
        if (row[props.children] && row[props.children].length > 0) {
          this.setItemDeep(row[props.children], row.deep, row.deepLabel, row.deepValue)
        }
        if (row.checked) {
          this.selectedCheckboxs.push(row)
        }
      })
    },
    clickRow(row) {
      const deepArr = row.deep.split(',')
      const deepLen = deepArr.length
      const len = this.activeItems.length
      const children = row[this.props.children]
      if (deepLen <= len) {
        if (children && children.length > 0) {
          this.activeItems.splice(deepLen, len - deepLen, children)
        } else {
          this.activeItems.splice(deepLen, len - deepLen)
        }
      }
    },
    changeCheckbox(row) {
      const index = this.selectedCheckboxs.indexOf(row)
      if (index < 0 && row.checked === true) {
        this.selectedCheckboxs.push(row)
      } else if (index >= 0 && row.checked === false) {
        this.selectedCheckboxs.splice(index, 1)
      }
      this.$emit('change', this.selectedCheckboxs)
    },
    closeTag(row) {
      row.checked = false
      this.selectedCheckboxs.splice(this.selectedCheckboxs.indexOf(row), 1)
      this.$emit('change', this.selectedCheckboxs)
    },
    afterLeave() {
      this.activeItems.splice(1)
    },
    getSelected() {
      return this.selectedCheckboxs
    }
  },
  mounted() {
    this.setItemDeep(this.options)
    this.activeItems.push(this.options)
  }
}
</script>
<style lang='stylus'>
.multil-cascader
  &.is-focus .u-tags
    border-color #0F8EE9
  .u-tags
    position relative
    padding 0 15px
    min-height 32px
    line-height 30px
    text-align left
    border 1px solid #dcdfe6
    border-radius 4px
    background-color #fff
    .el-tag
      margin-right 5px
      &:last-child
        margin-right 0
    .u-placeholder
      position absolute
      color #c0c4cc
.multil-cascader-popover
  &.el-popover
    padding 0
  ul
    padding 0
    margin 0
  li
    box-sizing border-box
  .u-content
    display flex
  .u-rows
    padding  6px 0
    min-width 180px
    height 204px
    line-height 20px
    border-right 1px solid #e4e7ed
    &:last-child
      border-right 0
  .u-row
    display: flex
    justify-content: space-between
    align-items: center
    padding: 7px 20px
    list-style-type: none
    cursor: pointer
    outline: none
    &:hover
      background-color: #f5f7fa
  .u-label
    padding-left 24px
    color #606266
  .u-label,.el-checkbox__label
    font-weight 400
  .u-tag-text
    display inline-block
  .el-icon-arrow-right
    color #bfcbd9
</style>
