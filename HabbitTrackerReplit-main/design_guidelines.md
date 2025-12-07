# HabitTrac Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from productivity apps like Notion, Linear, and Asana for clean, data-focused interfaces with the specified modern gray/blue aesthetic.

## Core Design Principles
- **Minimalist Efficiency:** Clean, uncluttered interfaces that prioritize function
- **Data Clarity:** Information hierarchy that makes tracking progress effortless
- **Calm Productivity:** Muted color palette that reduces visual fatigue during daily use

## Typography System
- **Primary Font:** Inter or DM Sans via Google Fonts
- **Heading Hierarchy:** 
  - H1: 2.5rem (40px), font-weight 700 - Page titles
  - H2: 1.75rem (28px), font-weight 600 - Section headers
  - H3: 1.25rem (20px), font-weight 600 - Card titles
- **Body Text:** 0.875rem (14px), font-weight 400, increased line-height (1.6) for readability
- **Labels/Metadata:** 0.75rem (12px), font-weight 500, uppercase with letter-spacing

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)
- Consistent 8px grid system
- Card padding: p-6
- Section spacing: py-8 to py-12
- Component gaps: gap-4 for lists, gap-6 for card grids

## Component Library

### Landing Page
- **Hero Section:** Centered layout with large typography (text-5xl), minimal decoration
- **Primary CTA:** Large button (px-8 py-4) with subtle shadow, positioned prominently below heading
- **Background:** Clean, solid color or subtle gradient

### Dashboard Layout
- **Sidebar Navigation:** Fixed left sidebar (w-64), dark background with light text
  - Icon + label navigation items (gap-3 between icon and text)
  - Active state with background highlight and left border accent
  - Sticky positioning for scroll contexts
- **Main Content Area:** Grid layout with responsive columns
  - Calendar: Month view in card container, date cells with hover states
  - Habit Checklist: Checkbox + label rows with strikethrough on completion
  - Summary Widgets: 2-3 column grid (grid-cols-2 lg:grid-cols-3) with stat cards

### Cards & Containers
- **Base Card:** Rounded corners (rounded-lg), subtle border, light background, shadow-sm
- **Stat Cards:** Large number display (text-3xl font-bold), smaller label below, icon accent
- **Interactive Cards:** Hover state with slight elevation increase (shadow-md)

### Profile Page
- **User Header:** Avatar + name + stats row (flex layout with gap-6)
- **Statistics Section:** Horizontal card row showcasing key metrics (Streak, Total Habits)
- **Achievements Grid:** Badge display in 3-4 column grid, icon + title + description
- **Friend Updates:** List view with avatar + activity text + timestamp

### Modal/Dialog
- **Overlay:** Semi-transparent dark background (bg-black/50)
- **Modal Container:** Centered, max-width (max-w-lg), rounded corners (rounded-xl), padding p-8
- **Form Elements:** Full-width inputs with clear labels above, slider with visual feedback
- **Action Buttons:** Right-aligned footer with cancel (secondary) and confirm (primary) buttons

### Statistics/Charts
- **Data Table:** Alternating row backgrounds, compact padding (px-4 py-3), clear column headers
- **Charts (Recharts):** Bar charts with grid lines, axis labels, tooltip on hover
- **Metric Cards:** Positioned above charts showing totals and trends

### Form Elements
- **Input Fields:** Border style, rounded corners (rounded-md), padding (px-3 py-2), focus ring
- **Checkboxes:** Custom styled with accent color fill when checked
- **Slider:** Track with accent-colored fill, large thumb for easy interaction
- **Dropdowns:** Matching input styling with chevron icon

### Navigation
- **Primary Nav:** Sidebar with vertical icon list
- **Secondary Nav:** Top bar if needed, breadcrumbs for deep navigation

## Interaction Patterns
- **Hover States:** Subtle background color shifts (opacity changes)
- **Active/Selected States:** Border accent or background fill
- **Loading States:** Skeleton screens for data-heavy sections
- **Transitions:** Quick, purposeful (150-200ms) for state changes
- **Checkbox Completion:** Instant visual feedback with strikethrough animation

## Gray/Blue Aesthetic Specifications
This application uses a sophisticated gray-blue palette that creates a calm, focused environment:
- **Backgrounds:** Light grays (#F7F9FC, #F1F3F5) for main areas, darker grays (#2C3E50, #34495E) for sidebar
- **Accent Colors:** Muted blues (#3B82F6, #60A5FA) for interactive elements, success states
- **Text:** Dark gray (#1F2937) for primary text, medium gray (#6B7280) for secondary
- **Borders:** Light gray (#E5E7EB) for separation, blue accent borders for active states

## Responsive Behavior
- **Mobile (< 768px):** Sidebar collapses to hamburger menu, single column layouts, full-width cards
- **Tablet (768px - 1024px):** 2-column grids, persistent sidebar
- **Desktop (> 1024px):** Multi-column layouts, expanded sidebar, optimal data density

## Images
No hero images required. This is a productivity tool focused on data and functionality rather than marketing imagery.