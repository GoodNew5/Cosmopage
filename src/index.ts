import './scss/main.scss'
// import './assets/svg/logo.svg'
import BrowserDetector from 'browser-dtector'
import Toast from 'bootstrap/js/dist/toast'
import Collapse from 'bootstrap/js/dist/collapse'
import './formValidator'
import {
  IS_REDUCE_MOTION,
  isMd,
  isReduceMotion,
  isToLg,
  isToMd
} from './breakpoints'

const INITIAL_SECTION = 'contact-us-section'

let scrollTimeout: ReturnType<typeof setTimeout>
let stickyHeaderHeight = 0
let bsCollapseInstance

function handleNavLink(event: JQuery.MouseEventBase) {
  const targetSection = (
    event.currentTarget as HTMLAnchorElement
  )?.getAttribute('href')

  if (targetSection) {
    scrollToSection(targetSection)
  }
}

function setUrlParamsSection(targetSection: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('going', targetSection)

  history.replaceState({}, document.title, url.href)
}

function scrollToSection(targetSection: string) {
  try {
    const section = document.querySelector(`.${targetSection}--js`)

    section?.scrollIntoView({
      block: 'start'
    })
  } catch (error) {
    console.error(error)
  }
}

function getSectionUrlParams() {
  return new URLSearchParams(window.location.search).get('going')
}

function getInitialSectionName() {
  return getSectionUrlParams() || INITIAL_SECTION
}

function animateCards(typeAnimation: 'show' | 'hide') {
  $('.card--js').each(function (index) {
    if (typeAnimation === 'show') {
      $(this)
        .delay(500 * index)
        .animate({ opacity: 1 }, 500)
    } else {
      $(this).stop().clearQueue().removeAttr('style')
    }
  })
}

function handleAnimationSection(element: JQuery) {
  if (isReduceMotion || element.hasClass('section-viewport--visible')) {
    const dataSectionValue = element.attr('data-section')

    if (dataSectionValue) {
      setUrlParamsSection(dataSectionValue)
      setActiveNavLink(undefined, dataSectionValue)
    }
  }
}

function handleNavigation(event: JQuery.MouseEventBase) {
  event.preventDefault()

  bsCollapseInstance?.hide()
  handleNavLink(event)

  if (isReduceMotion) {
    const href = $(event.currentTarget).attr('href')

    if (href) {
      setUrlParamsSection(href)
      setActiveNavLink(event)
    }
  }
}

function setActiveNavLink(event?: JQuery.MouseEventBase, href?: string) {
  const link = event?.currentTarget
  const targetSection =
    (link as HTMLAnchorElement)?.getAttribute('href') || href

  removeActiveClassNavLinks()

  $(`a[href^="${targetSection || getSectionUrlParams()}"]`).addClass(
    'nav-link--active'
  )
}

function removeActiveClassNavLinks() {
  const $navLinkElement = $('.nav-link--js')

  $navLinkElement.each((index, currentElement) => {
    $(currentElement).removeClass('nav-link--active')
  })
}

function validateEmail(email: string) {
  return !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

function isNotEmpty(value: string) {
  return !!value.length
}

function setRippleButtonPosition(event: JQuery.MouseEventBase) {
  const { clientX, clientY } = event
  const { left, top } = event.currentTarget.getBoundingClientRect()
  const y = clientY - top
  const x = clientX - left

  event.currentTarget.style.setProperty('--touch-effect-click-x', `${x}px`)
  event.currentTarget.style.setProperty('--touch-effect-click-y', `${y}px`)
}

const validationFields = [
  {
    fieldName: 'input-feedback-name--js',
    fieldParent: 'input-name-wrapper--js',
    errorMessage: 'Field must not be empty',
    checkFn: (value: string) => isNotEmpty(value)
  },
  {
    fieldName: 'input-feedback-email--js',
    fieldParent: 'input-email-wrapper--js',
    errorMessage: 'Enter a valid email address',
    checkFn: (value: string) => validateEmail(value)
  },
  {
    fieldName: 'input-feedback-message--js',
    fieldParent: 'input-message-wrapper--js',
    errorMessage: 'Field must not be empty',
    checkFn: (value: string) => isNotEmpty(value)
  }
]

$(function () {
  const $window = $(window)
  const $fieldName = $('input[name="input-feedback-name--js"]')
  const $fieldEmail = $('input[name="input-feedback-email--js"]')
  const $fieldMessage = $('textarea[name="input-feedback-message--js"]')
  const $navLinkElement = $('.nav-link--js')
  const $form = $('.landing-page-form--js')
  const formValidator = $form.validator(validationFields)
  const initialSectionName = getInitialSectionName()
  const browser = new BrowserDetector(window.navigator.userAgent)
  const $html = $('html')

  function isSectionInViewport(elem: JQuery) {
    const scrollTop = Number($window.scrollTop())
    const windowHeight = $window.height() || 0
    const windowHeightIncludingScroll = scrollTop + windowHeight
    const elemTop = Number(elem.offset()?.top)
    const elemHeight = elem.height() || 0
    const elemBottom = elemTop + elemHeight

    if (isToMd) {
      stickyHeaderHeight = 90
    }

    if (isMd) {
      stickyHeaderHeight = 140
    }

    return (
      (elemHeight > windowHeight - stickyHeaderHeight &&
        elemTop <= scrollTop &&
        elemBottom >= windowHeightIncludingScroll) ||
      (elemTop >= scrollTop &&
        elemTop < windowHeightIncludingScroll - stickyHeaderHeight) ||
      (elemBottom - stickyHeaderHeight > scrollTop &&
        elemBottom <= windowHeightIncludingScroll)
    )
  }

  function setCurrentSectionClass(targetSection: string) {
    $html.addClass(targetSection)
  }

  function handlePageScroll() {
    const visibleClass = 'section-viewport--visible'

    $('.section-viewport--js').each((index, section) => {
      const $el = $(section)
      const currentSection = $el.attr('data-section')
      const isContactUsSection = $el.hasClass('contact-us-section--js')

      if (isSectionInViewport($el)) {
        clearTimeout(scrollTimeout)

        scrollTimeout = setTimeout(function () {
          if (currentSection) {
            $html.addClass(currentSection)
          }

          handleAnimationSection($el)

          if (!isReduceMotion && isContactUsSection) {
            animateCards('show')
          }
        }, 100)

        if (!isReduceMotion) {
          $el.addClass(visibleClass)
        }
      } else {
        $html.removeClass(currentSection)

        if (!isReduceMotion) {
          if (isContactUsSection) {
            animateCards('hide')
          }

          $el.removeClass(visibleClass)
        }
      }
    })
  }

  browser.parseUserAgent()

  const { isSafari } = browser.parseUserAgent()

  if (isSafari) {
    $html.addClass('safari')
  }

  if (isToLg) {
    bsCollapseInstance = new Collapse('.navbar-collapse--js', {
      toggle: false
    })
  } else {
    bsCollapseInstance = null
  }

  setCurrentSectionClass(initialSectionName)
  setUrlParamsSection(initialSectionName)
  scrollToSection(initialSectionName)
  setActiveNavLink()
  handlePageScroll()

  async function sendFeedbackForm(event: JQuery.MouseEventBase) {
    const $buttonSubmit = $(event.currentTarget)

    try {
      const name = $fieldName.val()
      const email = $fieldEmail.val()
      const message = $fieldMessage.val()

      $buttonSubmit.attr('disabled', 'true')
      $form.addClass('feedback-form-is-loading')

      const result: { id: number } = await $.ajax({
        type: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        data: {
          name,
          email,
          message
        }
      })

      $buttonSubmit.removeAttr('disabled')
      $form.removeClass('feedback-form-is-loading')

      return result
    } catch (error) {
      $buttonSubmit.prop('disabled', false)
      $form.removeClass('feedback-form-is-loading')

      console.log(error)
    }
  }

  function clearFormValues() {
    $fieldName.val('')
    $fieldEmail.val('')
    $fieldMessage.val('')
  }

  async function handleFormSubmit(event: JQuery.MouseEventBase) {
    event.preventDefault()

    const { validate, resetState } = formValidator
    const { isFormValid } = validate()

    if (!isFormValid) return

    const result = await sendFeedbackForm(event)

    if (result?.id) {
      clearFormValues()
      resetState()

      const toastEl = document.getElementById(
        'message-successfully-sended-toast'
      )

      if (toastEl) {
        const toastBootstrap = Toast.getOrCreateInstance(toastEl, {
          autohide: true,
          delay: 5000
        })

        toastBootstrap.show()
      }
    }
  }

  IS_REDUCE_MOTION.addEventListener('change', function () {
    handlePageScroll()
  })

  $navLinkElement.on('click', handleNavigation)
  $window.on('scroll resize', handlePageScroll)

  $('.button-touch-effect--js').on('click', setRippleButtonPosition)
  $('.btn-feedback-form-submit--js').on('click', handleFormSubmit)
})
