import { ref } from 'vue'

/** Polite/assertive live-region announcements for status changes. */
export const politeMessage = ref('')
export const assertiveMessage = ref('')

export function useAnnouncer() {
  function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const target = priority === 'polite' ? politeMessage : assertiveMessage
    target.value = ''
    // Clear then set on the next frame so repeated messages are re-read.
    setTimeout(() => (target.value = message), 50)
  }
  return { announce }
}
