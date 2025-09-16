import { Injectable } from '@nestjs/common'
import * as os from 'node:os'

/**
 * 服务状态（可读格式）
 */
export interface ServerStatusReadable {
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
  }
  /** CPU 概览 */
  cpu: {
    /** CPU 型号名称 */
    model: string
    /** CPU 核心数（含单位），例如："12 cores" */
    cores: string
    /** 主频（含单位），例如："3700 MHz" */
    speed: string
  }
  /** 内存概览 */
  memory: {
    /** 总内存（含单位），例如："31.9 GB" */
    total: string
    /** 已用内存（含单位），例如："11.3 GB" */
    used: string
    /** 空闲内存（含单位），例如："20.7 GB" */
    free: string
    /** 内存占用百分比（含%），例如："35.32%" */
    usedPercent: string
  }
  /** 网络信息 */
  network: {
    /** 主要 IPv4 地址（首个非内网 IPv4），可能为空 */
    primaryIPv4?: string
    /** 网卡接口数量（字符串），例如："3" */
    interfaceCount: string
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

function formatPercent(p: number): string {
  if (!isFinite(p) || p < 0) return '0%'
  return `${p.toFixed(2)}%`
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
  getSnapshot(): ServerStatusReadable {
    const hostname = os.hostname()
    const platform = os.platform()
    const arch = os.arch()
    const release = os.release()
    const uptimeSec = os.uptime()

    const totalMemBytes = os.totalmem()
    const freeMemBytes = os.freemem()
    const usedMemBytes = Math.max(totalMemBytes - freeMemBytes, 0)
    const usedPercentNum = totalMemBytes
      ? (usedMemBytes / totalMemBytes) * 100
      : 0

    const cpuInfos = os.cpus()
    const cores = cpuInfos.length
    const firstCpu = cpuInfos[0]
    const model = firstCpu?.model || 'Unknown CPU'
    const speedMHz = firstCpu?.speed || 0

    const nets = os.networkInterfaces()
    const interfaceCount = Object.keys(nets).length
    let primaryIPv4: string | undefined
    for (const [, addrs] of Object.entries(nets)) {
      for (const a of addrs || []) {
        if (a.family === 'IPv4' && !a.internal) {
          primaryIPv4 = a.address
          break
        }
      }
      if (primaryIPv4) break
    }

    return {
      hostname,
      os: {
        platform: String(platform),
        arch: String(arch),
        release: String(release),
        uptime: formatSeconds(uptimeSec),
      },
      cpu: {
        model,
        cores: `${cores} cores`,
        speed: `${speedMHz} MHz`,
      },
      memory: {
        total: formatBytes(totalMemBytes),
        used: formatBytes(usedMemBytes),
        free: formatBytes(freeMemBytes),
        usedPercent: formatPercent(usedPercentNum),
      },
      network: { primaryIPv4, interfaceCount: `${interfaceCount}` },
      process: {
        pid: `${process.pid}`,
        nodeVersion: process.version,
        uptime: formatSeconds(process.uptime()),
      },
    }
  }
}
