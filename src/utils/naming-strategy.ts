import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'

/**
 * 下划线命名策略
 * 将 TypeScript 的驼峰命名自动转换为数据库的下划线命名
 */
export class SnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  /**
   * 表名命名策略
   * @param className 类名
   * @param customName 自定义表名
   * @returns 表名
   */
  tableName(className: string, customName?: string): string {
    // 如果用户指定了自定义表名，直接使用
    if (customName) {
      return customName
    }

    // 如果没有指定，将类名转换为下划线命名
    return snakeCase(className)
  }

  /**
   * 列名命名策略
   * @param propertyName 属性名
   * @param customName 自定义列名
   * @param embeddedPrefixes 嵌入前缀
   * @returns 列名
   */
  columnName(
    propertyName: string,
    customName?: string,
    embeddedPrefixes?: string[],
  ): string {
    if (customName) {
      return customName
    }

    // 处理嵌入前缀
    if (embeddedPrefixes && embeddedPrefixes.length > 0) {
      return snakeCase(embeddedPrefixes.join('_') + '_' + propertyName)
    }

    // 将驼峰命名转换为下划线命名
    return snakeCase(propertyName)
  }

  /**
   * 关系名命名策略
   * @param propertyName 属性名
   * @returns 关系名
   */
  relationName(propertyName: string): string {
    return snakeCase(propertyName)
  }

  /**
   * 连接列名命名策略
   * @param relationName 关系名
   * @param referencedColumnName 引用列名
   * @returns 连接列名
   */
  joinColumnName(relationName: string): string {
    return snakeCase(relationName)
  }

  /**
   * 连接表名命名策略
   * @param firstTableName 第一个表名
   * @param secondTableName 第二个表名
   * @param firstPropertyName 第一个属性名
   * @param secondPropertyName 第二个属性名
   * @returns 连接表名
   */
  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName?: string,
    secondPropertyName?: string,
  ): string {
    return snakeCase(firstPropertyName + '_' + secondPropertyName)
  }

  /**
   * 连接表列名命名策略
   * @param tableName 表名
   * @param propertyName 属性名
   * @param columnName 列名
   * @returns 连接表列名
   */
  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    // 如果提供了 columnName，直接使用（假设已经是正确的格式）
    if (columnName) {
      return columnName
    }
    // 否则将 propertyName 转换为 snake_case
    return snakeCase(propertyName)
  }

  /**
   * 连接表反向列名命名策略
   * @param tableName 表名
   * @param propertyName 属性名
   * @param columnName 列名
   * @returns 连接表反向列名
   */
  joinTableInverseColumnName(
    _tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    // 如果提供了 columnName，直接使用（假设已经是正确的格式）
    if (columnName) {
      return columnName
    }
    // 否则将 propertyName 转换为 snake_case
    return snakeCase(propertyName)
  }

  /**
   * 索引名命名策略
   * @param tableOrName 表名或表对象
   * @param columns 列名数组
   * @param userProvidedName 用户提供的名称
   * @returns 索引名
   */
  indexName(
    tableOrName: string | Table,
    columns: string[],
    userProvidedName?: string,
  ): string {
    if (userProvidedName) {
      return userProvidedName
    }

    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name
    const columnNames = columns.map(column => snakeCase(column)).join('_')

    return `idx_${tableName}_${columnNames}`
  }

  /**
   * 外键名命名策略
   * @param tableOrName 表名或表对象
   * @param columnNames 列名数组
   * @param referencedTablePath 引用表路径
   * @param referencedColumnNames 引用列名数组
   * @param userProvidedName 用户提供的名称
   * @returns 外键名
   */
  foreignKeyName(
    tableOrName: string | Table,
    columnNames: string[],
    _referencedTablePath?: string,
    _referencedColumnNames?: string[],
    userProvidedName?: string,
  ): string {
    if (userProvidedName) {
      return userProvidedName
    }

    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name
    const columnName = columnNames.map(column => snakeCase(column)).join('_')

    return `fk_${tableName}_${columnName}`
  }

  /**
   * 唯一约束名命名策略
   * @param tableOrName 表名或表对象
   * @param columnNames 列名数组
   * @param userProvidedName 用户提供的名称
   * @returns 唯一约束名
   */
  uniqueConstraintName(
    tableOrName: string | Table,
    columnNames: string[],
    userProvidedName?: string,
  ): string {
    if (userProvidedName) {
      return userProvidedName
    }

    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name
    const columnName = columnNames.map(column => snakeCase(column)).join('_')

    return `uk_${tableName}_${columnName}`
  }

  /**
   * 检查约束名命名策略
   * @param tableOrName 表名或表对象
   * @param expression 表达式
   * @param userProvidedName 用户提供的名称
   * @returns 检查约束名
   */
  checkConstraintName(tableOrName: string | Table): string {
    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name

    return `chk_${tableName}`
  }

  /**
   * 排除约束名命名策略
   * @param tableOrName 表名或表对象
   * @param expression 表达式
   * @param userProvidedName 用户提供的名称
   * @returns 排除约束名
   */
  exclusionConstraintName(
    tableOrName: string | Table,
    _expression: string,
    userProvidedName?: string,
  ): string {
    if (userProvidedName) {
      return userProvidedName
    }

    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name

    return `xcl_${tableName}`
  }

  /**
   * 主键名命名策略
   * @param tableOrName 表名或表对象
   * @param columnNames 列名数组
   * @param userProvidedName 用户提供的名称
   * @returns 主键名
   */
  primaryKeyName(
    tableOrName: string | Table,
    _columnNames: string[],
    userProvidedName?: string,
  ): string {
    if (userProvidedName) {
      return userProvidedName
    }

    const tableName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name

    return `pk_${tableName}`
  }
}
