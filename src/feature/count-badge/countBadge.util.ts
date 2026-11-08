const COUNT_BADGE_CAP = 99

const countBadgeText = (count: number): string => (count > COUNT_BADGE_CAP ? `${COUNT_BADGE_CAP}+` : String(count))

export { COUNT_BADGE_CAP, countBadgeText }
