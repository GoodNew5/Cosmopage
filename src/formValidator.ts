interface IValidatorOptions {
  fieldName: string
  checkFn: (value: string) => boolean
  errorMessage: string
  fieldParent: string
}

declare global {
  interface JQuery {
    validator(options: IValidatorOptions[]): {
      validate: () => {
        isFormValid: boolean
      }
      resetState: () => void
    }
  }
}

export interface IValidatorField {
  isValid: boolean
  errorMessage: string
  fieldStateEl: JQuery
  fieldName: string
}

$.fn.validator = function (options) {
  const $this = $(this)
  const $fields = $this.find('textarea, input')

  function initValidatorState() {
    return options.map((rule) => {
      return {
        ...rule,
        isValid: false,
        isDirty: false
      }
    })
  }

  let validationFields = initValidatorState()

  function resetState() {
    validationFields = initValidatorState()
  }

  validationFields.forEach((field) => {
    $(`.${field.fieldParent}`).after(
      `<div class="form-validator-message form-validator-message-${field.fieldName}"></div>`
    )
  })

  function updateVisualFormState(field: IValidatorField) {
    const { isValid, errorMessage, fieldStateEl, fieldName } = field
    const $messageDiv = $(`.form-validator-message-${fieldName}`)

    if (!isValid) {
      fieldStateEl.removeClass('form-validator-field--is-valid')
      fieldStateEl.addClass('form-validator-field--error')
      $messageDiv.html(errorMessage)

      return
    }

    fieldStateEl.addClass('form-validator-field--is-valid')
    fieldStateEl.removeClass('form-validator-field--error')
    $messageDiv.html('')
  }

  function validate() {
    validationFields.forEach((field) => {
      field.isDirty = true
      const fieldStateEl = $(`.${field.fieldParent}`)
      const { errorMessage, fieldName } = field
      const value = $(`[name='${fieldName}']`).val()

      if (value !== undefined && !Array.isArray(value)) {
        if (!field.checkFn(value.toString())) {
          field.isValid = false

          updateVisualFormState({
            isValid: field.isValid,
            errorMessage,
            fieldStateEl,
            fieldName
          })
        } else {
          field.isValid = true

          updateVisualFormState({
            isValid: field.isValid,
            errorMessage: '',
            fieldStateEl,
            fieldName
          })
        }
      }
    })

    return {
      isFormValid: validationFields.every((field) => field.isValid)
    }
  }

  $fields.on('input', function (event) {
    validationFields.forEach((field) => {
      const { fieldName } = field

      if ($(event.currentTarget).attr('name') === fieldName) {
        field.isValid = true
        field.isDirty = true

        const fieldStateEl = $(`.${field.fieldParent}`)

        updateVisualFormState({
          isValid: field.isValid,
          fieldStateEl,
          errorMessage: '',
          fieldName
        })
      }
    })
  })

  $fields.on('blur', function (event) {
    const currentTarget = $(event.currentTarget)

    validationFields.forEach((field) => {
      const { fieldName } = field

      if (currentTarget.attr('name') === fieldName) {
        const value = $(event.currentTarget).val()
        const fieldStateEl = $(`.${field.fieldParent}`)
        const { errorMessage } = field

        if (!field.isDirty) return

        if (value !== undefined && !Array.isArray(value)) {
          if (!field.checkFn(value.toString())) {
            field.isValid = false

            updateVisualFormState({
              isValid: field.isValid,
              fieldStateEl,
              errorMessage,
              fieldName
            })

            return
          }

          updateVisualFormState({
            isValid: field.isValid,
            fieldStateEl,
            errorMessage: '',
            fieldName
          })
        }
      }
    })
  })

  return {
    validate,
    resetState
  }
}
