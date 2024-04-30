export function getTimeExpiresFromEnv(unit: string, timeInUnit: string) {
    switch (unit) {
      case 's':
        return Number(timeInUnit) * 1000
      case 'm':
        return Number(timeInUnit) * 1000 * 60
      case 'h':
        return Number(timeInUnit) * 1000 * 60 * 60
      case 'd':
        return Number(timeInUnit) * 1000 * 60 * 60 * 24
      default:
        return Number(timeInUnit)
    }
  }
  
  export function getDateExpires(unit: string, timeInUnit: string) {
    const dateExpires = new Date()
    const timeNow = dateExpires.getTime()
    const timeToExp = getTimeExpiresFromEnv(unit, timeInUnit)
    dateExpires.setTime(timeNow + timeToExp)
  
    return dateExpires
  }
  