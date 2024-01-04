export const IS_TO_LG_BREAKPOINT = window.matchMedia('(max-width: 991px)')
export const IS_TO_MD_BREAKPOINT = window.matchMedia('(max-width: 767px)')
export const IS_MD_BREAKPOINT = window.matchMedia('(min-width: 768px)')
export const IS_REDUCE_MOTION = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
)

export let isToLg = IS_TO_LG_BREAKPOINT.matches
export let isMd = IS_MD_BREAKPOINT.matches
export let isToMd = IS_TO_MD_BREAKPOINT.matches
export let isReduceMotion = IS_REDUCE_MOTION.matches

IS_TO_LG_BREAKPOINT.addEventListener('change', function () {
  isToLg = IS_TO_LG_BREAKPOINT.matches
})

IS_TO_MD_BREAKPOINT.addEventListener('change', function () {
  isToMd = IS_TO_MD_BREAKPOINT.matches
})

IS_MD_BREAKPOINT.addEventListener('change', function () {
  isMd = IS_MD_BREAKPOINT.matches
})

IS_REDUCE_MOTION.addEventListener('change', function () {
  isReduceMotion = IS_REDUCE_MOTION.matches
})
