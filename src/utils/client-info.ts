import { UAParser } from 'ua-parser-js'
import * as geoip from 'geoip-lite'

export interface ClientInfo {
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
}

export function getClientInfo(request: any): ClientInfo {
  const ip = request.ip
  const uaString = request.headers['user-agent']

  const ua = new UAParser(uaString).getResult()
  const geo = geoip.lookup(ip)

  return {
    ipaddr: ip,
    loginLocation: geo ? `${geo.country} ${geo.city}` : '未知',
    browser: `${ua.browser.name} ${ua.browser.version}`,
    os: `${ua.os.name} ${ua.os.version}`,
  }
}
