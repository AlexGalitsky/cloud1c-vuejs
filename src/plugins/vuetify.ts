// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// SVG paths для иконок
import {
  mdiEmail,
  mdiLock,
  mdiAccount,
  mdiServer,
  mdiText,
  mdiMagnify,
  mdiClose,
  mdiDelete,
  mdiPencil,
  mdiPlus,
  mdiLogout,
  mdiCheck,
  mdiAlert,
  mdiInformation,
  mdiAlertCircle,
  mdiEye,
  mdiEyeOff,
  mdiLoading,
} from '@mdi/js'

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      email: mdiEmail,
      lock: mdiLock,
      person: mdiAccount,
      server: mdiServer,
      text: mdiText,
      search: mdiMagnify,
      close: mdiClose,
      delete: mdiDelete,
      edit: mdiPencil,
      add: mdiPlus,
      logout: mdiLogout,
      check: mdiCheck,
      warning: mdiAlert,
      info: mdiInformation,
      error: mdiAlertCircle,
      eye: mdiEye,
      eyeOff: mdiEyeOff,
      loading: mdiLoading,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#4F46E5',
          secondary: '#6B7280',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          background: '#F3F4F6',
          surface: '#FFFFFF',
          'on-primary': '#FFFFFF',
          'on-surface': '#111827',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'xl',
      elevation: 2,
    },
    VCard: {
      rounded: 'xl',
      elevation: 2,
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'xl',
    },
    VPasswordTextField: {
      variant: 'outlined',
      rounded: 'xl',
    },
  },
})
