import Base from './Base'
import { walk, asyncRun } from '../utils'

//  思维导图
class MindMap extends Base {
  //  构造函数
  // 在逻辑结构图的基础上增加一个变量来记录生长方向，向左还是向右，同时在计算left的时候根据方向来计算、调整top时只考虑同方向的节点即可
  constructor(opt = {}) {
    super(opt)
  }

  //  布局
  doLayout(callback) {
    let task = [
      () => {
        this.computedBaseValue()
      },
      () => {
        this.computedTopValue()
      },
      () => {
        this.adjustTopValue()
      },
      () => {
        callback(this.root)
      }
    ]
    asyncRun(task)
  }

  //  遍历数据计算节点的left、width、height
  computedBaseValue() {
    walk(
      this.renderer.renderTree,
      null,
      (cur, parent, isRoot, layerIndex, index) => {
        let newNode = this.createNode(cur, parent, isRoot, layerIndex)
        // 根节点定位在画布中心位置
        if (isRoot) {
          this.setNodeCenter(newNode)
        } else {
          // 非根节点
          // 三级及以下节点以上级为准
          if (parent._node.dir) {
            newNode.dir = parent._node.dir
          } else {
            // 节点生长方向
            newNode.dir = index % 2 === 0 ? 'right' : 'left'
          }
          // 根据生长方向定位到父节点的左侧或右侧
          newNode.left =
            newNode.dir === 'right'
              ? parent._node.left +
                parent._node.width +
                this.getMarginX(layerIndex)
              : parent._node.left - this.getMarginX(layerIndex) - newNode.width
        }
        if (!cur.data.expand) {
          return true
        }
      },
      (cur, parent, isRoot, layerIndex) => {
        // 返回时计算节点的leftChildrenAreaHeight和rightChildrenAreaHeight，也就是左侧和右侧子节点所占的高度之和，包括外边距
        if (!cur.data.expand) {
          cur._node.leftChildrenAreaHeight = 0
          cur._node.rightChildrenAreaHeight = 0
          return
        }
        // 理论上只有根节点是存在两个方向的子节点的，其他节点的子节点一定全都是同方向，但是为了逻辑统一，就不按特殊处理的方式来写了
        let leftLen = 0
        let rightLen = 0
        let leftChildrenAreaHeight = 0
        let rightChildrenAreaHeight = 0
        cur._node.children.forEach(item => {
          if (item.dir === 'left') {
            leftLen++
            leftChildrenAreaHeight += item.height
          } else {
            rightLen++
            rightChildrenAreaHeight += item.height
          }
        })
        cur._node.leftChildrenAreaHeight =
          leftChildrenAreaHeight +
          (leftLen + 1) * this.getMarginY(layerIndex + 1)
        cur._node.rightChildrenAreaHeight =
          rightChildrenAreaHeight +
          (rightLen + 1) * this.getMarginY(layerIndex + 1)
      },
      true,
      0
    )
  }

  //  遍历节点树计算节点的top
  computedTopValue() {
    walk(
      this.root,
      null,
      (node, parent, isRoot, layerIndex) => {
        if (
          node.nodeData.data.expand &&
          node.children &&
          node.children.length
        ) {
          let marginY = this.getMarginY(layerIndex + 1)
          let baseTop = node.top + node.height / 2 + marginY
          // 第一个子节点的top值 = 该节点中心的top值 - 子节点的高度之和的一半
          let leftTotalTop = baseTop - node.leftChildrenAreaHeight / 2
          let rightTotalTop = baseTop - node.rightChildrenAreaHeight / 2
          node.children.forEach(cur => {
            if (cur.dir === 'left') {
              cur.top = leftTotalTop
              leftTotalTop += cur.height + marginY
            } else {
              cur.top = rightTotalTop
              rightTotalTop += cur.height + marginY
            }
          })
        }
      },
      null,
      true
    )
  }

  //  调整节点top
  adjustTopValue() {
    walk(
      this.root,
      null,
      (node, parent, isRoot, layerIndex) => {
        if (!node.nodeData.data.expand) {
          return
        }
        // 判断子节点所占的高度之和是否大于该节点自身，大于则需要调整位置
        let base = this.getMarginY(layerIndex + 1) * 2 + node.height
        let leftDifference = node.leftChildrenAreaHeight - base
        let rightDifference = node.rightChildrenAreaHeight - base
        if (leftDifference > 0 || rightDifference > 0) {
          this.updateBrothers(node, leftDifference / 2, rightDifference / 2)
        }
      },
      null,
      true
    )
  }

  //  更新兄弟节点的top
  updateBrothers(node, leftAddHeight, rightAddHeight) {
    if (node.parent) {
      // 过滤出和自己同方向的节点
      let childrenList = node.parent.children.filter(item => {
        return item.dir === node.dir
      })
      let index = childrenList.findIndex(item => {
        return item === node
      })
      childrenList.forEach((item, _index) => {
        if (item.hasCustomPosition()) {
          // 适配自定义位置
          return
        }
        let _offset = 0
        let addHeight = item.dir === 'left' ? leftAddHeight : rightAddHeight
        // 上面的节点往上移
        if (_index < index) {
          _offset = -addHeight
        } else if (_index > index) {
          // 下面的节点往下移
          _offset = addHeight
        }
        item.top += _offset
        // 同步更新子节点的位置
        if (item.children && item.children.length) {
          this.updateChildren(item.children, 'top', _offset)
        }
      })
      // 更新父节点的位置
      this.updateBrothers(node.parent, leftAddHeight, rightAddHeight)
    }
  }

  //  绘制连线，连接该节点到其子节点
  renderLine(node, lines, style, lineStyle) {
    if (lineStyle === 'curve') {
      this.renderLineCurve(node, lines, style)
    } else if (lineStyle === 'direct') {
      this.renderLineDirect(node, lines, style)
    } else {
      this.renderLineStraight(node, lines, style)
    }
  }

  //  直线风格连线
  renderLineStraight(node, lines, style) {
    if (node.children.length <= 0) {
      return []
    }
    let { left, top, width, height, expandBtnSize } = node
    let marginX = this.getMarginX(node.layerIndex + 1)
    let s1 = (marginX - expandBtnSize) * 0.6
    let nodeUseLineStyle = this.mindMap.themeConfig.nodeUseLineStyle
    node.children.forEach((item, index) => {
      let x1 = 0
      let _s = 0
      // 节点使用横线风格，需要额外渲染横线
      let nodeUseLineStyleOffset = nodeUseLineStyle
        ? item.width
        : 0
      if (item.dir === 'left') {
        _s = -s1
        x1 = node.layerIndex === 0 ? left : left - expandBtnSize
        nodeUseLineStyleOffset = -nodeUseLineStyleOffset
      } else {
        _s = s1
        x1 = node.layerIndex === 0 ? left + width : left + width + expandBtnSize
      }
      let y1 = top + height / 2
      let x2 = item.dir === 'left' ? item.left + item.width : item.left
      let y2 = item.top + item.height / 2
      y1 = nodeUseLineStyle && !node.isRoot ? y1 + height / 2 : y1
      y2 = nodeUseLineStyle ? y2 + item.height / 2 : y2
      let path = `M ${x1},${y1} L ${x1 + _s},${y1} L ${x1 + _s},${y2} L ${
        x2 + nodeUseLineStyleOffset
      },${y2}`
      lines[index].plot(path)
      style && style(lines[index], item)
    })
  }

  //  直连风格
  renderLineDirect(node, lines, style) {
    if (node.children.length <= 0) {
      return []
    }
    let { left, top, width, height, expandBtnSize } = node
    let nodeUseLineStyle = this.mindMap.themeConfig.nodeUseLineStyle
    node.children.forEach((item, index) => {
      let x1 =
        node.layerIndex === 0
          ? left + width / 2
          : item.dir === 'left'
          ? left - expandBtnSize
          : left + width + expandBtnSize
      let y1 = top + height / 2
      let x2 = item.dir === 'left' ? item.left + item.width : item.left
      let y2 = item.top + item.height / 2
      y1 = nodeUseLineStyle && !node.isRoot ? y1 + height / 2 : y1
      y2 = nodeUseLineStyle ? y2 + item.height / 2 : y2
      // 节点使用横线风格，需要额外渲染横线
      let nodeUseLineStylePath = ''
      if (nodeUseLineStyle) {
        if (item.dir === 'left') {
          nodeUseLineStylePath = ` L ${item.left},${y2}`
        } else {
          nodeUseLineStylePath = ` L ${item.left + item.width},${y2}`
        }
      }
      let path = `M ${x1},${y1} L ${x2},${y2}` + nodeUseLineStylePath
      lines[index].plot(path)
      style && style(lines[index], item)
    })
  }

  //  曲线风格连线
  renderLineCurve(node, lines, style) {
    if (node.children.length <= 0) {
      return []
    }
    let { left, top, width, height, expandBtnSize } = node
    let nodeUseLineStyle = this.mindMap.themeConfig.nodeUseLineStyle
    node.children.forEach((item, index) => {
      let x1 =
        node.layerIndex === 0
          ? left + width / 2
          : item.dir === 'left'
          ? left - expandBtnSize
          : left + width + 20
      let y1 = top + height / 2
      let x2 = item.dir === 'left' ? item.left + item.width : item.left
      let y2 = item.top + item.height / 2
      let path = ''
      y1 = nodeUseLineStyle && !node.isRoot ? y1 + height / 2 : y1
      y2 = nodeUseLineStyle ? y2 + item.height / 2 : y2
      // 节点使用横线风格，需要额外渲染横线
      let nodeUseLineStylePath = ''
      if (this.mindMap.themeConfig.nodeUseLineStyle) {
        if (item.dir === 'left') {
          nodeUseLineStylePath = ` L ${item.left},${y2}`
        } else {
          nodeUseLineStylePath = ` L ${item.left + item.width},${y2}`
        }
      }
      if (node.isRoot) {
        path = this.quadraticCurvePath(x1, y1, x2, y2) + nodeUseLineStylePath
      } else {
        path = this.cubicBezierPath(x1, y1, x2, y2) + nodeUseLineStylePath
      }
      lines[index].plot(path)
      style && style(lines[index], item)
    })
  }

  //  渲染按钮
  renderExpandBtn(node, btn) {
    let { width, height, expandBtnSize } = node
    let { translateX, translateY } = btn.transform()
    // 节点使用横线风格，需要调整展开收起按钮位置
    let nodeUseLineStyleOffset = this.mindMap.themeConfig.nodeUseLineStyle
      ? height / 2
      : 0
    let x = (node.dir === 'left' ? 0 - expandBtnSize : width) - translateX
    let y = height / 2 - translateY + nodeUseLineStyleOffset
    btn.translate(x, y)
  }

  //  创建概要节点
  renderGeneralization(node, gLine, gNode) {
    let isLeft = node.dir === 'left'
    let {
      top,
      bottom,
      left,
      right,
      generalizationLineMargin,
      generalizationNodeMargin
    } = this.getNodeBoundaries(node, 'h', isLeft)
    let x = isLeft
      ? left - generalizationLineMargin
      : right + generalizationLineMargin
    let x1 = x
    let y1 = top
    let x2 = x
    let y2 = bottom
    let cx = x1 + (isLeft ? -20 : 20)
    let cy = y1 + (y2 - y1) / 2
    let path = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`
    gLine.plot(path)
    gNode.left =
      x +
      (isLeft ? -generalizationNodeMargin : generalizationNodeMargin) -
      (isLeft ? gNode.width : 0)
    gNode.top = top + (bottom - top - gNode.height) / 2
  }
}

export default MindMap
