import type { Component } from 'vue'
import { Cpu, Code2, Droplets, SunMedium } from '@lucide/vue'

/** Company details. Replace the placeholders marked TODO before launch. */
export const company = {
  name: 'Akwap Systems',
  tagline: 'Engineering connected, sun-powered systems from Turkana.',
  location: 'Lodwar, Turkana County, Kenya',
  // TODO: confirm real contact details.
  email: 'info@akwapsystems.co.ke',
}

export type ServiceSlug = 'iot-embedded' | 'software' | 'smart-irrigation' | 'solar'

export interface Service {
  slug: ServiceSlug
  name: string
  short: string
  icon: Component
  accent: string
  summary: string
  intro: string
  capabilities: { title: string; text: string }[]
  stack: string[]
  outcomes: string[]
}

export const services: Service[] = [
  {
    slug: 'iot-embedded',
    name: 'IoT & Embedded Systems',
    short: 'IoT & Embedded',
    icon: Cpu,
    accent: 'var(--site-jade)',
    summary: 'Custom sensor nodes, firmware and gateways that keep working where the grid and the network do not.',
    intro:
      'We design the electronics, write the firmware and build the connectivity that turns remote equipment into live data. Every device is engineered for heat, dust and patchy coverage first.',
    capabilities: [
      { title: 'Hardware & PCB design', text: 'Schematics, board layout and prototyping for sensor, control and telemetry devices.' },
      { title: 'Firmware engineering', text: 'Low-power firmware for microcontrollers, with secure over-the-air updates.' },
      { title: 'Connectivity', text: 'LoRaWAN, GSM/LTE-M, Wi-Fi and satellite links chosen for the site, not the brochure.' },
      { title: 'Edge gateways', text: 'Local buffering and processing so data survives outages and syncs when the link returns.' },
    ],
    stack: ['ESP32', 'STM32', 'LoRaWAN', 'LTE-M', 'MQTT', 'Modbus'],
    outcomes: ['Remote monitoring of pumps, tanks and power', 'Fewer site visits across long distances', 'Early alerts before equipment fails'],
  },
  {
    slug: 'software',
    name: 'Software Systems',
    short: 'Software',
    icon: Code2,
    accent: 'oklch(0.75 0.12 250)',
    summary: 'Web, mobile and cloud platforms that turn field data into decisions, built for low bandwidth.',
    intro:
      'From dashboards for a single farm to platforms serving whole counties, we build software that is fast on a basic phone and dependable on a 2G connection.',
    capabilities: [
      { title: 'Web & mobile apps', text: 'Progressive web and native apps that work offline and sync when connected.' },
      { title: 'Dashboards & analytics', text: 'Live views of devices, water and energy with reports people actually read.' },
      { title: 'Integrations', text: 'Mobile money, SMS and USSD, and the business systems you already run.' },
      { title: 'Cloud & DevOps', text: 'Secure, monitored hosting with backups and a clear handover.' },
    ],
    stack: ['Vue', 'TypeScript', 'Python', 'Django', 'PostgreSQL', 'USSD / SMS'],
    outcomes: ['One view of every device and site', 'Services reachable from any phone', 'Data you own and can export'],
  },
  {
    slug: 'smart-irrigation',
    name: 'Smart Irrigation',
    short: 'Smart Irrigation',
    icon: Droplets,
    accent: 'oklch(0.78 0.12 210)',
    summary: 'Sensor-driven drip and pumping systems that put every litre where the crop needs it.',
    intro:
      'In arid land, water is the whole business. Our irrigation systems read soil, weather and tank levels, then run pumps and valves automatically, from a phone or on a schedule.',
    capabilities: [
      { title: 'Soil & climate sensing', text: 'Moisture, temperature and flow sensors placed by crop and soil type.' },
      { title: 'Automated control', text: 'Valves and pumps that open, close and alert on their own rules.' },
      { title: 'Solar pumping', text: 'Boreholes and lake intakes powered by the sun, sized for the daily need.' },
      { title: 'Water metering', text: 'Know what was pumped, where it went and what it cost.' },
    ],
    stack: ['Drip & micro-sprinkler', 'Soil probes', 'Solar pumps', 'Remote valves', 'SMS control'],
    outcomes: ['Less water per harvest', 'Irrigation that runs without someone on site', 'Clear records for groups and investors'],
  },
  {
    slug: 'solar',
    name: 'Solar Systems',
    short: 'Solar',
    icon: SunMedium,
    accent: 'var(--site-sun)',
    summary: 'Off-grid and hybrid solar power for homes, clinics, schools and business, monitored remotely.',
    intro:
      'Turkana has some of the strongest sunshine in the region. We size, install and monitor solar systems that turn it into reliable power and water, and keep them running.',
    capabilities: [
      { title: 'Off-grid & hybrid PV', text: 'Panels, inverters and storage sized from a real load assessment.' },
      { title: 'Battery storage', text: 'Lithium storage with protection and monitoring for long life.' },
      { title: 'Remote monitoring', text: 'Production, consumption and battery health visible from anywhere.' },
      { title: 'Maintenance', text: 'Scheduled service and fast response, from a team based nearby.' },
    ],
    stack: ['Mono PV', 'Hybrid inverters', 'LiFePO₄', 'MPPT', 'Remote telemetry'],
    outcomes: ['Power where the grid does not reach', 'Lower fuel and generator costs', 'Faults found before the lights go out'],
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)

export const sectors = [
  { title: 'Agriculture & pastoral', text: 'Irrigated farms, fodder plots and water points for livestock.' },
  { title: 'Water utilities', text: 'Borehole, tank and pipeline monitoring for water providers.' },
  { title: 'Health & education', text: 'Reliable power and cold chain for clinics and schools.' },
  { title: 'NGOs & county programmes', text: 'Field data and infrastructure for development projects.' },
  { title: 'Business & homes', text: 'Solar power and smart systems for shops, lodges and homes.' },
]

export const process = [
  { step: '01', title: 'Visit & assess', text: 'We go to the site, measure the load, the water and the signal, and listen.' },
  { step: '02', title: 'Design', text: 'Hardware, software and power designed together as one system.' },
  { step: '03', title: 'Build & install', text: 'Prototyped, tested and installed by our own engineers.' },
  { step: '04', title: 'Monitor & support', text: 'Every system reports in, so we often know about a fault before you do.' },
]
