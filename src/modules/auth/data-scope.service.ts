import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Dept } from '@/modules/system/dept/entities/dept.entity'
import { DataScope } from '@/common/enums'

/**
 * DataScopeService
 *
 * 统一的数据权限计算服务：根据当前登录用户的角色数据范围（DataScope）
 * 生成可直接用于 TypeORM 查询的 where 条件（对象或对象数组，用于表达 AND/OR）。
 *
 * 适用目标：
 * - 用户列表：以用户维度过滤可见用户（支持 ALL/CUSTOM/DEPT/DEPT_AND_CHILD/SELF）。
 * - 部门列表：以部门维度过滤可见部门（SELF 在部门维度等价于“本人所在部门”）。
 *
 * 设计要点：
 * - 多角色策略：并集合并，且 ALL 优先（只要有一个角色是 ALL，则不做限制）。
 * - OR 条件：当出现“部门范围 + 仅本人”并存时，返回 where 数组以表达 OR（TypeORM 支持）。
 * - 当前用户上下文：通过控制器从 request.session.id 传入 currentUserId。
 */
@Injectable()
export class DataScopeService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>,
  ) {}

  /**
   * 为“用户列表查询”应用数据范围
   *
   * @param baseWhere 业务基础查询条件（会在其上叠加数据范围限制）
   * @param session 当前登录会话（从 request.session 获取）
   * @returns 可直接传入 TypeORM 的 where 条件；可能是对象或对象数组（表示 OR）
   */
  async applyForUserList(baseWhere: any, session?: Session) {
    // 方式A：优先使用会话中的完整用户信息，避免额外 IO
    if (!session) return baseWhere

    // 优先使用富角色信息，若缺失则退化为 SELF（仅本人可见）
    if (!session.roles || session.roles.length === 0) {
      // 若没有角色，则仅本人可见（依赖会话中的 id）
      return { ...baseWhere, id: session.id }
    }

    // hasAllScope: 一旦为 true，后续直接放行所有数据
    let hasAllScope = false
    const allowedDeptIds = new Set<number>()
    const allowedUserIds = new Set<number>()

    for (const role of session.roles) {
      if (role.status !== 0) continue
      switch (role.dataScope as DataScope) {
        // 1. 全部数据权限：直接放开
        case DataScope.DATA_SCOPE_ALL:
          hasAllScope = true
          break
        // 2. 自定数据权限：取角色绑定的部门集合
        case DataScope.DATA_SCOPE_CUSTOM:
          role.depts?.forEach(d => allowedDeptIds.add(d.id))
          break
        // 3. 本部门数据权限：加入当前用户部门
        case DataScope.DATA_SCOPE_DEPT:
          if (session.deptId) allowedDeptIds.add(session.deptId)
          break
        // 4. 本部门及以下数据权限：加入当前部门 + 所有子孙部门
        case DataScope.DATA_SCOPE_DEPT_AND_CHILD:
          if (session.deptId) {
            allowedDeptIds.add(session.deptId)
            const descendants = await this.getDescendantDeptIds(session.deptId)
            descendants.forEach(id => allowedDeptIds.add(id))
          }
          break
        // 5. 仅本人数据权限：加入当前用户 ID
        case DataScope.DATA_SCOPE_SELF:
          allowedUserIds.add(session.id)
          break
      }
    }

    if (hasAllScope) return baseWhere

    if (allowedUserIds.size > 0 && allowedDeptIds.size === 0) {
      return { ...baseWhere, id: In(Array.from(allowedUserIds)) }
    }

    if (allowedDeptIds.size > 0) {
      const deptIds = Array.from(allowedDeptIds)
      // 当部门 + 本人并存时，用 OR 条件放宽：部门内用户 或 本人
      if (allowedUserIds.size > 0) {
        return [
          { ...baseWhere, deptId: In(deptIds) },
          { ...baseWhere, id: In(Array.from(allowedUserIds)) },
        ]
      }
      return { ...baseWhere, deptId: In(deptIds) }
    }

    if (allowedUserIds.size === 0) allowedUserIds.add(session.id)
    return { ...baseWhere, id: In(Array.from(allowedUserIds)) }
  }

  /**
   * 为“部门列表查询”应用数据范围
   *
   * 说明：SELF 在部门维度下可理解为“仅本人所在部门”。
   *
   * @param baseWhere 业务基础查询条件
   * @param currentUserId 当前登录用户 ID
   * @returns 可直接传入 TypeORM 的 where 条件
   */
  async applyForDeptList(baseWhere: any, session?: Session) {
    // 方式A：优先使用会话中的完整用户信息
    if (!session) return baseWhere

    // 优先使用富角色信息，若缺失则退化为仅“本人所在部门”或空
    if (!session.roles || session.roles.length === 0) {
      return session.deptId
        ? { ...baseWhere, id: session.deptId }
        : { ...baseWhere, id: In([]) }
    }

    let hasAllScope = false
    const allowedDeptIds = new Set<number>()

    for (const role of session.roles) {
      if (role.status !== 0) continue
      switch (role.dataScope as DataScope) {
        // 1. 全部数据权限
        case DataScope.DATA_SCOPE_ALL:
          hasAllScope = true
          break
        // 2. 自定数据权限
        case DataScope.DATA_SCOPE_CUSTOM:
          role.depts?.forEach(d => allowedDeptIds.add(d.id))
          break
        // 3. 本部门
        case DataScope.DATA_SCOPE_DEPT:
          if (session.deptId) allowedDeptIds.add(session.deptId)
          break
        // 4. 本部门及以下
        case DataScope.DATA_SCOPE_DEPT_AND_CHILD:
          if (session.deptId) {
            allowedDeptIds.add(session.deptId)
            const descendants = await this.getDescendantDeptIds(session.deptId)
            descendants.forEach(id => allowedDeptIds.add(id))
          }
          break
        // 5. 仅本人：在部门维度等价于“本人所在部门”
        case DataScope.DATA_SCOPE_SELF:
          if (session.deptId) allowedDeptIds.add(session.deptId)
          break
      }
    }

    if (hasAllScope) return baseWhere

    if (allowedDeptIds.size > 0) {
      return { ...baseWhere, id: In(Array.from(allowedDeptIds)) }
    }

    return { ...baseWhere, id: In([]) }
  }

  /**
   * 获取某部门的所有子孙部门 ID
   *
   * 当前实现基于 `Dept.ancestors`（逗号分隔的祖先链），
   * 若未来改造成 TypeORM Tree，可替换为 TreeRepository 的 findDescendants。
   */

  async getDescendantDeptIds(rootDeptId: number): Promise<number[]> {
    const allDepts = await this.deptRepository.find()
    const rootIdStr = String(rootDeptId)
    return allDepts
      .filter(d => {
        const a = (d.ancestors || '').trim()
        if (!a) return false
        // 以逗号分隔的祖先链，确保边界匹配，避免 1 与 11 的误匹配
        if (a === rootIdStr) return true
        return (
          a.startsWith(rootIdStr + ',') ||
          a.endsWith(',' + rootIdStr) ||
          a.includes(',' + rootIdStr + ',')
        )
      })
      .map(d => d.id)
  }
}
