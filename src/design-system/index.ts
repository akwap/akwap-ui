/**
 * AkwapUI public API.
 *   import { AkButton, AkInput, useToast } from '@/design-system'
 * or install everything globally:
 *   app.use(AkwapUI)
 */
import type { App, Component, Plugin } from 'vue'
import '../styles/tailwind.css'

import AkLiveRegion from '@/components/shared/AkLiveRegion.vue'
import AkLogo from '@/components/shared/AkLogo.vue'
import AkSkipLink from '@/components/shared/AkSkipLink.vue'
import AkThemeSwitcher from '@/components/shared/AkThemeSwitcher.vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkButtonGroup from '@/components/ui/buttons/AkButtonGroup.vue'
import AkSegmentedControl from '@/components/ui/buttons/AkSegmentedControl.vue'
import AkSplitButton from '@/components/ui/buttons/AkSplitButton.vue'
import AkBarChart from '@/components/ui/charts/AkBarChart.vue'
import AkChartCard from '@/components/ui/charts/AkChartCard.vue'
import AkChartLegend from '@/components/ui/charts/AkChartLegend.vue'
import AkDonutChart from '@/components/ui/charts/AkDonutChart.vue'
import AkLineChart from '@/components/ui/charts/AkLineChart.vue'
import AkSparkline from '@/components/ui/charts/AkSparkline.vue'
import AkAccordion from '@/components/ui/data-display/AkAccordion.vue'
import AkAccordionItem from '@/components/ui/data-display/AkAccordionItem.vue'
import AkActivityFeed from '@/components/ui/data-display/AkActivityFeed.vue'
import AkAvatar from '@/components/ui/data-display/AkAvatar.vue'
import AkAvatarGroup from '@/components/ui/data-display/AkAvatarGroup.vue'
import AkBadge from '@/components/ui/data-display/AkBadge.vue'
import AkCard from '@/components/ui/data-display/AkCard.vue'
import AkDataTable from '@/components/ui/data-display/AkDataTable.vue'
import AkDescriptionList from '@/components/ui/data-display/AkDescriptionList.vue'
import AkDivider from '@/components/ui/data-display/AkDivider.vue'
import AkFileAttachment from '@/components/ui/data-display/AkFileAttachment.vue'
import AkKbd from '@/components/ui/data-display/AkKbd.vue'
import AkKeyValue from '@/components/ui/data-display/AkKeyValue.vue'
import AkList from '@/components/ui/data-display/AkList.vue'
import AkStatCard from '@/components/ui/data-display/AkStatCard.vue'
import AkStatusIndicator from '@/components/ui/data-display/AkStatusIndicator.vue'
import AkStepper from '@/components/ui/data-display/AkStepper.vue'
import AkTimeline from '@/components/ui/data-display/AkTimeline.vue'
import AkAlert from '@/components/ui/feedback/AkAlert.vue'
import AkEmptyState from '@/components/ui/feedback/AkEmptyState.vue'
import AkProgressBar from '@/components/ui/feedback/AkProgressBar.vue'
import AkSkeleton from '@/components/ui/feedback/AkSkeleton.vue'
import AkSpinner from '@/components/ui/feedback/AkSpinner.vue'
import AkToaster from '@/components/ui/feedback/AkToaster.vue'
import AkCalendar from '@/components/ui/forms/AkCalendar.vue'
import AkCheckbox from '@/components/ui/forms/AkCheckbox.vue'
import AkDatePicker from '@/components/ui/forms/AkDatePicker.vue'
import AkDateRangePicker from '@/components/ui/forms/AkDateRangePicker.vue'
import AkField from '@/components/ui/forms/AkField.vue'
import AkFileUpload from '@/components/ui/forms/AkFileUpload.vue'
import AkInput from '@/components/ui/forms/AkInput.vue'
import AkMultiSelect from '@/components/ui/forms/AkMultiSelect.vue'
import AkPasswordStrength from '@/components/ui/forms/AkPasswordStrength.vue'
import AkRadio from '@/components/ui/forms/AkRadio.vue'
import AkRadioGroup from '@/components/ui/forms/AkRadioGroup.vue'
import AkSelect from '@/components/ui/forms/AkSelect.vue'
import AkSwitch from '@/components/ui/forms/AkSwitch.vue'
import AkTextarea from '@/components/ui/forms/AkTextarea.vue'
import AkTimePicker from '@/components/ui/forms/AkTimePicker.vue'
import AkBreadcrumb from '@/components/ui/navigation/AkBreadcrumb.vue'
import AkLink from '@/components/ui/navigation/AkLink.vue'
import AkNavList from '@/components/ui/navigation/AkNavList.vue'
import AkPagination from '@/components/ui/navigation/AkPagination.vue'
import AkTabs from '@/components/ui/navigation/AkTabs.vue'
import AkCommandPalette from '@/components/ui/overlays/AkCommandPalette.vue'
import AkConfirmDialog from '@/components/ui/overlays/AkConfirmDialog.vue'
import AkDialog from '@/components/ui/overlays/AkDialog.vue'
import AkDrawer from '@/components/ui/overlays/AkDrawer.vue'
import AkMenu from '@/components/ui/overlays/AkMenu.vue'
import AkPopover from '@/components/ui/overlays/AkPopover.vue'
import AkTooltip from '@/components/ui/overlays/AkTooltip.vue'

export {
  AkLiveRegion,
  AkLogo,
  AkSkipLink,
  AkThemeSwitcher,
  AkButton,
  AkButtonGroup,
  AkSegmentedControl,
  AkSplitButton,
  AkBarChart,
  AkChartCard,
  AkChartLegend,
  AkDonutChart,
  AkLineChart,
  AkSparkline,
  AkAccordion,
  AkAccordionItem,
  AkActivityFeed,
  AkAvatar,
  AkAvatarGroup,
  AkBadge,
  AkCard,
  AkDataTable,
  AkDescriptionList,
  AkDivider,
  AkFileAttachment,
  AkKbd,
  AkKeyValue,
  AkList,
  AkStatCard,
  AkStatusIndicator,
  AkStepper,
  AkTimeline,
  AkAlert,
  AkEmptyState,
  AkProgressBar,
  AkSkeleton,
  AkSpinner,
  AkToaster,
  AkCalendar,
  AkCheckbox,
  AkDatePicker,
  AkDateRangePicker,
  AkField,
  AkFileUpload,
  AkInput,
  AkMultiSelect,
  AkPasswordStrength,
  AkRadio,
  AkRadioGroup,
  AkSelect,
  AkSwitch,
  AkTextarea,
  AkTimePicker,
  AkBreadcrumb,
  AkLink,
  AkNavList,
  AkPagination,
  AkTabs,
  AkCommandPalette,
  AkConfirmDialog,
  AkDialog,
  AkDrawer,
  AkMenu,
  AkPopover,
  AkTooltip,
}

/** Every component by registration name (typed loosely to keep declarations small). */
export const components: Record<string, Component> = {
  AkLiveRegion,
  AkLogo,
  AkSkipLink,
  AkThemeSwitcher,
  AkButton,
  AkButtonGroup,
  AkSegmentedControl,
  AkSplitButton,
  AkBarChart,
  AkChartCard,
  AkChartLegend,
  AkDonutChart,
  AkLineChart,
  AkSparkline,
  AkAccordion,
  AkAccordionItem,
  AkActivityFeed,
  AkAvatar,
  AkAvatarGroup,
  AkBadge,
  AkCard,
  AkDataTable,
  AkDescriptionList,
  AkDivider,
  AkFileAttachment,
  AkKbd,
  AkKeyValue,
  AkList,
  AkStatCard,
  AkStatusIndicator,
  AkStepper,
  AkTimeline,
  AkAlert,
  AkEmptyState,
  AkProgressBar,
  AkSkeleton,
  AkSpinner,
  AkToaster,
  AkCalendar,
  AkCheckbox,
  AkDatePicker,
  AkDateRangePicker,
  AkField,
  AkFileUpload,
  AkInput,
  AkMultiSelect,
  AkPasswordStrength,
  AkRadio,
  AkRadioGroup,
  AkSelect,
  AkSwitch,
  AkTextarea,
  AkTimePicker,
  AkBreadcrumb,
  AkLink,
  AkNavList,
  AkPagination,
  AkTabs,
  AkCommandPalette,
  AkConfirmDialog,
  AkDialog,
  AkDrawer,
  AkMenu,
  AkPopover,
  AkTooltip,
}

export type { ButtonVariant, ButtonSize } from '@/components/ui/buttons/AkButton.vue'
export type { MenuItem } from '@/components/ui/overlays/AkMenu.vue'
export type { Column, SortState } from '@/components/ui/data-display/AkDataTable.vue'
export type { TabItem } from '@/components/ui/navigation/AkTabs.vue'
export type { NavItem, NavSection } from '@/components/ui/navigation/AkNavList.vue'
export type { Command } from '@/components/ui/overlays/AkCommandPalette.vue'
export type { SelectOption } from '@/components/ui/forms/AkSelect.vue'
export type { Series } from '@/components/ui/charts/chartUtils'
export type { Rule } from '@/utils/validation'

export { useTheme } from '@/composables/useTheme'
export { useBrand } from '@/composables/useBrand'
export { useToast } from '@/composables/useToast'
export { useAnnouncer } from '@/composables/useAnnouncer'
export { useFocusTrap } from '@/composables/useFocusTrap'
export { useFloating } from '@/composables/useFloating'
export { useForm } from '@/composables/useForm'
export { rules, validate, passwordStrength } from '@/utils/validation'

/** Vue plugin: registers every Ak* component globally. */
const AkwapUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) app.component(name, component)
  },
}

export default AkwapUI
