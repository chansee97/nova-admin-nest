import { Injectable } from '@nestjs/common'
import * as os from 'node:os'

/**
 * 服务状态（可读格式）
 */
export interface ServerStatus {
  /** 主机名，例如：DESKTOP-XXXX */
  hostname: string
  /** 操作系统信息 */
  os: {
    /** 平台，例如：win32、linux、darwin */
    platform: string
    /** 架构，例如：x64、arm64 */
    arch: string
    /** 系统版本号，例如：10.0.26100 */
    release: string
    /** 系统运行时长，已格式化，例如："1d 2h 3m 4s" */
    uptime: string
    /** 内核类型，例如：Windows_NT、Linux、Darwin */
    type?: string
    /** 内核版本（可能为空，平台相关） */
    kernelVersion?: string
    /**
     * 系统负载等级（仅类 Unix 系统有意义）
     * - low: 负载较轻
     * - medium: 负载中等
     * - high: 负载较高
     * - overload: 过载
     * - 平台差异：Windows 上为 undefined
     */
    load?: 'low' | 'medium' | 'high' | 'overload'
  }
  /** CPU 概览 */
  cpu: {
    /** CPU 型号名称 */
    model: string
    /** CPU 核心数（含单位），例如："12 cores" */
    cores: string
    /** 主频（含单位），例如："3700 MHz" */
    speed: string
    /** 逻辑核心数量（数值） */
    logicalCores?: number
    /** CPU 用户使用率（百分比） */
    userUsage: number
    /** CPU 系统使用率（百分比） */
    systemUsage: number
    /** CPU 当前空闲率（百分比） */
    idle: number
  }
  /** 内存概览 */
  memory: {
    /** 总内存（含单位），例如："31.9 GB" */
    total: string
    /** 已用内存（含单位），例如："11.3 GB" */
    used: string
    /** 空闲内存（含单位），例如："20.7 GB" */
    free: string
    /** 内存占用百分比（含%），例如："35.32" */
    usedPercent: number
  }
  /** 网络信息 */
  network: {
    /** 主要 IPv4 地址（首个非内网 IPv4），可能为空 */
    primaryIPv4?: string
    /** 网卡接口数量（字符串），例如："3" */
    interfaceCount: string
    /** 网卡接口简单列表 */
    interfaces?: Array<{
      /** 网卡名称（接口名） */
      name: string
      /** 物理地址（可能为空） */
      mac?: string
      /** IPv4 地址列表 */
      ipv4: string[]
      /** IPv6 地址列表 */
      ipv6: string[]
      /** 是否为内网/回环接口 */
      internal: boolean
    }>
  }
  /** 进程信息 */
  process: {
    /** 进程 ID（字符串） */
    pid: string
    /** Node.js 版本，例如："v18.19.0" */
    nodeVersion: string
    /** 进程运行时长，已格式化，例如："14m 8s" */
    uptime: string
  }
}

function formatBytes(bytes: number): string {
  if (!isFinite(bytes) || bytes < 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }
  let fixed: string
  if (val >= 100) {
    fixed = val.toFixed(0)
  } else if (val >= 10) {
    fixed = val.toFixed(1)
  } else {
    fixed = val.toFixed(2)
  }
  return `${fixed} ${units[i]}`
}

function formatPercent(p: number): number {
  if (!isFinite(p) || p < 0) return 0
  return Number(p.toFixed(2))
}

function formatSeconds(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0s'
  const s = Math.floor(sec)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  const parts: string[] = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (seconds || parts.length === 0) parts.push(`${seconds}s`)
  return parts.join(' ')
}

@Injectable()
export class ServerService {
  getSnapshot(): ServerStatus {
    const hostname = os.hostname()
    const platform = os.platform()
    const arch = os.arch()
    const release = os.release()
    const uptimeSec = os.uptime()
    const osType = os.type()
    const osWithVersion = os as unknown as { version?: () => string }
    const kernelVersion =
      typeof osWithVersion.version === 'function'
        ? osWithVersion.version()
        : undefined
    const loadavg = os.loadavg
      ? (os.loadavg() as [number, number, number])
      : undefined

    const totalMemBytes = os.totalmem()
    const freeMemBytes = os.freemem()
    const usedMemBytes = Math.max(totalMemBytes - freeMemBytes, 0)
    const usedPercentNum = totalMemBytes
      ? (usedMemBytes / totalMemBytes) * 100
      : 0

    const cpus = os.cpus()
    const model = cpus[0]?.model || 'Unknown'
    const cores = cpus.length
    const speedMHz = cpus[0]?.speed || 0

    const calculateCpuUsage = () => {
      const cpus = os.cpus()
      const total = cpus.reduce((acc, cpu) => {
        return acc + Object.values(cpu.times).reduce((a, b) => a + b, 0)
      }, 0)
      const user = cpus.reduce((acc, cpu) => acc + cpu.times.user, 0)
      const system = cpus.reduce((acc, cpu) => acc + cpu.times.sys, 0)
      const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0)
      return {
        userUsage: formatPercent((user / total) * 100),
        systemUsage: formatPercent((system / total) * 100),
        idle: formatPercent((idle / total) * 100),
      }
    }

    const cpuUsage = calculateCpuUsage()

    const nets = os.networkInterfaces()
    const interfaceCount = Object.keys(nets).length
    let primaryIPv4: string | undefined
    const ifaceList: Array<{
      name: string
      mac?: string
      ipv4: string[]
      ipv6: string[]
      internal: boolean
    }> = []
    for (const [name, addrs] of Object.entries(nets)) {
      const ipv4: string[] = []
      const ipv6: string[] = []
      let mac: string | undefined
      let internal = false
      const entries = Array.isArray(addrs) ? addrs : []
      for (const a of entries) {
        // Node 18+ family can be a string or number; normalize to string
        const family: 'IPv4' | 'IPv6' = (() => {
          const f: unknown = (a as any).family
          if (f === 4 || f === 'IPv4') return 'IPv4'
          return 'IPv6'
        })()
        if (family === 'IPv4') {
          ipv4.push(a.address)
          if (!a.internal && !primaryIPv4) primaryIPv4 = a.address
        } else if (family === 'IPv6') {
          ipv6.push(a.address)
        }
        mac = a.mac || mac
        internal = internal || a.internal
      }
      ifaceList.push({ name, mac, ipv4, ipv6, internal })
    }

    // 计算负载等级（基于 5 分钟窗口）
    const loadLevel = (() => {
      if (!loadavg) return undefined
      const ref = loadavg[1] / (cores || 1) // 使用 5 分钟窗口
      if (ref < 0.5) return 'low'
      if (ref < 1.0) return 'medium'
      if (ref < 1.5) return 'high'
      return 'overload'
    })()

    return {
      hostname,
      os: {
        platform: String(platform),
        arch: String(arch),
        release: String(release),
        uptime: formatSeconds(uptimeSec),
        type: osType,
        kernelVersion,
        load: loadLevel,
      },
      cpu: {
        model,
        cores: `${cores} cores`,
        speed: `${speedMHz} MHz`,
        logicalCores: cores,
        userUsage: cpuUsage.userUsage,
        systemUsage: cpuUsage.systemUsage,
        idle: cpuUsage.idle,
      },
      memory: {
        total: formatBytes(totalMemBytes),
        used: formatBytes(usedMemBytes),
        free: formatBytes(freeMemBytes),
        usedPercent: formatPercent(usedPercentNum),
      },
      network: {
        primaryIPv4,
        interfaceCount: `${interfaceCount}`,
        interfaces: ifaceList,
      },
      process: {
        pid: `${process.pid}`,
        nodeVersion: process.version,
        uptime: formatSeconds(process.uptime()),
      },
    }
  }
}
