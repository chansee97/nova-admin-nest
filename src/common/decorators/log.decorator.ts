import { SetMetadata } from '@nestjs/common'
import { BusinessType } from '@/common/enums/business-type.enum'

export { BusinessType }
export const LOG_KEY = 'log'

export const Log = (businessType: BusinessType = BusinessType.OTHER) =>
  SetMetadata(LOG_KEY, { businessType })
