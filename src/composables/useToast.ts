import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

const activeToasts = new Map<string, any>()

export function useToast() {
    const show = (message: string, type: 'success' | 'error' | 'warning' | 'info' | 'loading') => {
        const msg = (message || '').trim()
        const typ = type || ''
        if (!typ || !msg) return ''

        const id = typ == 'loading' ? `toast-${Date.now()}-${Math.random()}` : ''
        const toast = Toastify({
            text: msg,
            duration: typ === 'loading' ? -1 : 3000,
            gravity: 'bottom',
            escapeMarkup: false,
            className: `toast-${typ}`,
        })

        if (id) activeToasts.set(id, toast)
        toast.showToast()
        return id
    }

    const update = (
        id: string,
        options: {
            message: string
            type: 'success' | 'error' | 'warning' | 'info' | 'loading'
        },
    ) => {
        const toast = activeToasts.get(id)
        if (!toast) return

        const toastElement = toast.toastElement
        const msg = options.message ? options.message.trim() : toastElement?.textContent || ''
        const typ = options.type
            ? options.type.trim()
            : toastElement?.className
                  .split(' ')
                  .find((cls: string) => cls.startsWith('toast-'))
                  ?.replace('toast-', '') || ''

        if (!msg || !typ) return

        if (toastElement) {
            toastElement.innerHTML = msg

            toastElement.classList.remove(
                'toast-loading',
                'toast-success',
                'toast-error',
                'toast-warning',
                'toast-info',
            )
            toastElement.classList.add(`toast-${typ}`)

            if (typ == 'success' || typ == 'error' || typ == 'warning' || typ == 'info') {
                setTimeout(() => {
                    toast.hideToast()
                    activeToasts.delete(id)
                }, 3000)
            }
        }
    }

    const dismiss = (id: string) => {
        const toast = activeToasts.get(id)
        if (!toast) return

        toast.hideToast()
        activeToasts.delete(id)
    }

    return {
        success: (message: string) => show(message, 'success'),
        error: (message: string) => show(message, 'error'),
        warning: (message: string) => show(message, 'warning'),
        info: (message: string) => show(message, 'info'),
        loading: (message: string) => show(message, 'loading'),
        update,
        dismiss,
    }
}
