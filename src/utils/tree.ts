interface TreeOptions {
  parentProperty?: string
  childrenProperty?: string
  customID?: string
  rootID?: any
}

/**
 * 将扁平数组转换为树形结构
 */
export function buildTree(array: any[], options: TreeOptions = {}) {
  const {
    parentProperty = 'parentId',
    childrenProperty = 'children',
    customID = 'id',
    rootID = 0,
  } = options

  if (!Array.isArray(array)) {
    return []
  }

  // 创建映射表
  const map = new Map()
  const result: any[] = []

  // 第一次遍历：创建所有节点的映射
  for (const item of array) {
    const id = item[customID]
    map.set(id, { ...item })
  }

  // 第二次遍历：建立父子关系
  for (const item of array) {
    const node = map.get(item[customID])
    const parentId = item[parentProperty]

    if (parentId === rootID || parentId === undefined || parentId === null) {
      // 根节点
      result.push(node)
    } else {
      // 子节点
      const parent = map.get(parentId)
      if (parent) {
        // 如果父节点还没有 children 属性，则创建
        if (!parent[childrenProperty]) {
          parent[childrenProperty] = []
        }
        ;(parent[childrenProperty] as any[]).push(node)
      } else {
        // 如果找不到父节点，当作根节点处理
        result.push(node)
      }
    }
  }

  return result
}

/**
 * 将扁平数组转换为下拉选择树形结构
 */
export function buildSelectTree(
  array: any[],
  options: TreeOptions & {
    labelKey: string
    valueKey: string
  },
) {
  const { labelKey, valueKey, ...treeOptions } = options

  if (!Array.isArray(array)) {
    return []
  }

  // 先转换数据格式为 label/value 格式
  const transformedArray = array.map(item => ({
    [treeOptions.customID || 'id']: item[treeOptions.customID || 'id'],
    [treeOptions.parentProperty || 'parentId']:
      item[treeOptions.parentProperty || 'parentId'],
    label: item[labelKey],
    value: item[valueKey],
  }))

  // 构建树形结构
  const tree = buildTree(transformedArray, {
    ...treeOptions,
    childrenProperty: 'children',
  })

  // 递归清理树节点，只保留 label、value、children 字段
  function cleanTreeNode(node: any): any {
    const result: any = {
      label: node.label,
      value: node.value,
    }

    // 只有当节点有子级时才添加 children 字段
    if (Array.isArray(node.children) && node.children.length > 0) {
      result.children = (node.children as any[]).map(cleanTreeNode)
    }

    return result
  }

  return tree.map(cleanTreeNode)
}
