import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles/tailwind.css'
import { useBrand } from './composables/useBrand'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Re-apply a persisted brand colour (the inline script in index.html does the
// same before first paint; this keeps the reactive state in sync).
const { brand, applyBrand } = useBrand()
applyBrand(brand.value)
