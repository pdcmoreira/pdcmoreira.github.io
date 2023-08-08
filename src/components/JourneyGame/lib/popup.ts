import { computed, ref } from 'vue'

export interface Popup {
  title: string | null
  messages: string | string[]
}

export function usePopup() {
  const popup = ref<Popup | null>(null)

  const isPopupOpen = computed(() => !!popup.value)

  const popupTitle = computed(() => popup.value?.title || null)

  const popupMessages = computed(() => {
    const messages = popup.value?.messages

    if (!messages) {
      return []
    }

    return Array.isArray(messages) ? messages : [messages]
  })

  const openPopup = (messages: string | string[], title: string | null = null) => {
    popup.value = {
      messages,
      title
    }
  }

  const closePopup = () => {
    popup.value = null
  }

  return { popup, isPopupOpen, popupTitle, popupMessages, openPopup, closePopup }
}
