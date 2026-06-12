# Perikon Solution — Google Stitch Design Prompts
## DevFlow Project Management App

---

### 🎨 Brand CI Reference (ใช้ในทุก Prompt)

```
Brand: Perikon Solution
Product: DevFlow — Developer Project Management
Tone: Premium dark tech, confident, precise

Color System:
- Background primary:   #1A1015  (deep dark maroon-black)
- Background surface:   #241820  (card/panel surface)
- Background elevated:  #2E1F28  (hover / elevated card)
- Primary accent:       #8B8FD4  (periwinkle lavender — logo color)
- Gradient start:       #6B7FFF  (blue-purple)
- Gradient mid:         #9B6FD4  (purple)
- Gradient end-warm:    #E8825A  (coral) → #F0A830 (amber)
- Text primary:         #FFFFFF
- Text secondary:       #A89DB0  (muted lavender-gray)
- Text tertiary:        #6B5F72  (dim)
- Border subtle:        rgba(139,143,212,0.15)
- Border accent:        rgba(139,143,212,0.35)

Typography:
- Display / Logo:  Inter or Plus Jakarta Sans, weight 700, slightly tracked
- UI Labels:       Inter, weight 500, letter-spacing 0.04em uppercase for section headers
- Body:            Inter, weight 400, 14px, line-height 1.6

Signature element: A horizontal gradient rule — blue → purple → coral → amber
  used as accent underlines, progress fills, and active state indicators.
  This gradient IS the brand's visual fingerprint.

Corner radius: 12px cards, 8px inputs/buttons, 6px tags/badges
```

---

## PROMPT 1 — App Shell & Navigation

```
Design a dark-mode web app shell for "DevFlow" by Perikon Solution,
a project management tool for developer teams.

Brand CI:
- Background: #1A1015 deep dark, surface cards at #241820
- Primary accent: periwinkle lavender #8B8FD4
- Signature gradient accent line: left-to-right blue #6B7FFF → purple #9B6FD4 → coral #E8825A → amber #F0A830
- All text white or #A89DB0 muted lavender-gray
- Font: Inter, clean and modern

Layout — full-width desktop (1440px):
Top navbar (52px height):
  - Left: "DevFlow" logo text in #8B8FD4 lavender with a small grid/code icon
  - Center nav links: Dashboard · Projects · Kanban · Calendar · Team
    Active link has the signature gradient underline (2px)
  - Right: notification bell icon + circular user avatar (initials "PS" in gradient)

Left sidebar (200px, full height):
  - Background #1E1520, border-right 1px rgba(139,143,212,0.12)
  - Sections: MAIN (Dashboard, Projects, Calendar) · PROJECTS (list with colored dot per project) · VIEWS (My Tasks, Reports, Settings)
  - Active item: background rgba(139,143,212,0.12), text white, left border 2px gradient

Main content area:
  - Background #1A1015
  - Generous 24px padding

Style: premium dark SaaS, no gradients on backgrounds (flat dark surfaces only),
the gradient appears ONLY as accent lines and active indicators, never as bg fills.
Crisp, minimal, high-contrast. Similar in feel to Linear or Vercel's dashboard.
```

---

## PROMPT 2 — Dashboard / Home Page

```
Design a dark-mode dashboard home page for "DevFlow" by Perikon Solution.

Brand CI: background #1A1015, surfaces #241820, accent #8B8FD4 lavender,
signature gradient: #6B7FFF → #9B6FD4 → #E8825A → #F0A830 (used only as accent lines/fills),
all fonts Inter, white and #A89DB0 text.

Page title area (top):
  "Good morning, Dev Team 👋" in 22px white
  Subtitle: "June 2025 — 4 active projects, 3 deadlines this week" in 13px #A89DB0

Metric cards row (4 cards, grid):
  Each card: background #241820, 12px radius, 1px border rgba(139,143,212,0.15)
  Card content: muted label top, large number below
  - Active Projects: 4 (number in #8B8FD4)
  - Tasks In Progress: 12 (number in #F0A830 amber)
  - Completed This Week: 8 (number in #5DCAA5 teal-green)
  - Overdue Tasks: 2 (number in #E8825A coral-red)

Two-column section below:
  Left (wider): Mini calendar widget for June 2025
    - Background #241820, 12px radius
    - Day cells flat dark, today's date highlighted with #8B8FD4 circle
    - Deadline dots: small colored dots under dates (gradient colors)
    - Section label "June 2025" white 14px medium

  Right: Recent Activity feed
    - Background #241820, 12px radius
    - Each activity: icon circle (colored per type) + text + timestamp
    - Icons: check (lavender bg), plus (teal bg), warning (coral bg), user (blue bg)

Full-width section: Project Progress
  - Background #241820 card
  - Each project row: colored dot + name + percentage text + progress bar
  - Progress bars use the signature gradient fill: #6B7FFF → #9B6FD4 → #E8825A → #F0A830
  - Projects: E-commerce Platform 72%, Mobile App v2 45%, API Gateway 30%, Data Pipeline 88%

Aesthetic: premium dark SaaS, Linear/Vercel feel, flat surfaces no glow or blur,
gradient used only in progress fills and accent lines.
```

---

## PROMPT 3 — Projects List Page

```
Design a dark-mode Projects listing page for "DevFlow" by Perikon Solution.

Brand CI: background #1A1015, card surfaces #241820, accent #8B8FD4 lavender,
signature gradient #6B7FFF → #9B6FD4 → #E8825A → #F0A830, font Inter.

Page header:
  - Title "Projects" 20px white, subtitle "4 active projects" in #A89DB0
  - Top-right: "New Project" button — dark background, 1px #8B8FD4 border,
    lavender text with + icon, 8px radius

Project cards grid (3 columns):
  Each card: background #241820, 1px border rgba(139,143,212,0.15), 12px radius
  Hover state: border-color rgba(139,143,212,0.4), background #2E1F28

  Card anatomy:
    Top: project icon (32px rounded square, tinted bg) + project name (13px medium white) + member count (11px #6B5F72)
    Middle: 2-line description text in #A89DB0, 12px
    Progress bar: thin 4px bar, signature gradient fill, gray track #2E1F28
    Bottom row: percentage text + stacked member avatar circles (20px, colored initials)

  Projects to show:
    1. E-commerce Platform — icon: shopping cart, icon bg lavender tint, 72%, members TK/AP/SS
    2. Mobile App v2 — icon: mobile device, icon bg teal tint, 45%, members NT/PL
    3. API Gateway — icon: api/plug, icon bg coral tint, 30%, members SS/AP
    4. Data Pipeline — icon: database, icon bg blue tint, 88%, members NT/TK/WC
    5. "+ New Project" card — dashed border rgba(139,143,212,0.3), hover turns lavender tint bg

Member avatars: 20px circles, slightly overlapping, each a unique subtle tinted bg

Style: premium dark SaaS. No gradients on backgrounds. Clean, airy layout with
enough whitespace that cards breathe. Feels like Linear's project list.
```

---

## PROMPT 4 — Kanban Board (Core Feature)

```
Design a dark-mode Kanban board screen for "DevFlow" by Perikon Solution.

Brand CI: background #1A1015, surfaces #241820, accent lavender #8B8FD4,
signature gradient #6B7FFF → #9B6FD4 → #E8825A → #F0A830, font Inter.

Board header bar (below main navbar):
  - Background #1E1520, bottom border 1px rgba(139,143,212,0.12)
  - Left: colored dot + project name "E-commerce Platform" 15px medium white
  - Right: "Filter" button, "Members" button (both ghost style), 
    "Add Card" button (solid lavender #8B8FD4, white text, + icon)

Board area (horizontal scroll, 5 columns):
  Background #1A1015, 20px padding, columns gap 12px

  Column header per column:
    - Column name in 12px medium white
    - Count badge: rounded pill, colored bg + matching text
      Backlog: gray · To Do: blue tint · In Progress: amber tint · Review: lavender tint · Done: green tint
    - Small + icon button to add card (ghost)

  Task cards (in each column):
    Background #241820, 1px border rgba(139,143,212,0.12), 12px radius
    Hover: border rgba(139,143,212,0.35), background #2E1F28
    
    Card anatomy (top to bottom):
      1. Tag pill (10px, colored): Feature / Bug / Design / Backend / Frontend / DevOps
         Each tag has its own subtle tinted background
      2. Card title: 13px medium white, 1-2 lines
      3. Card description: 11px #A89DB0, 2 lines max
      4. Footer row: 
         Left — calendar icon + due date (coral/red if urgent, gray otherwise)
         Right — assignee circle avatar (20px, initials, tinted bg)

  Show realistic cards spread across columns:
    To Do: "Design checkout flow" (Design tag, Jun 15, AP)
    In Progress: "Payment Gateway Integration" (Backend, Jun 12 URGENT, TK), "Product listing page" (Frontend, SS)
    Review: "User auth module" (Backend, TK)
    Done: "DB schema design" (Backend, AP)
    Backlog: "Email notifications" (Feature, SS)

  Drop zone (bottom of each column):
    Dashed border rgba(139,143,212,0.2), "Drop here" text in dim gray
    When drag-active: dashed border turns lavender, bg rgba(139,143,212,0.08)

Aesthetic: premium dark tool. Columns feel light and organized despite dark bg.
Cards have breathing room. Only accents pop — everything else recedes into dark.
```

---

## PROMPT 5 — Calendar Page

```
Design a dark-mode Calendar overview page for "DevFlow" by Perikon Solution.

Brand CI: background #1A1015, surfaces #241820, accent lavender #8B8FD4,
signature gradient #6B7FFF → #9B6FD4 → #E8825A → #F0A830, font Inter.

Page header:
  - "Calendar" 20px white, "Deadlines across all projects" subtitle #A89DB0
  - Right: month navigation (left arrow · "June 2025" badge · right arrow)

Full calendar grid (main card, background #241820, 12px radius):
  7-column grid, Mon–Sun headers in 11px uppercase #6B5F72
  
  Day cells:
    - Date number: 12px, #A89DB0
    - Today (June 12): date number in lavender circle #8B8FD4, white text
    - Event pills inside cells (compact, 9px): 
      Each event tinted to its project color:
      - Jun 12: "Payment GW" — coral tint (urgent)
      - Jun 15: "Checkout UI" — lavender tint (E-commerce)
      - Jun 18: "UI Handoff" — teal tint (Mobile App)
      - Jun 25: "Pipeline Go-live" — blue tint (Data Pipeline)
      - Jun 28: "Sprint Review" — amber tint

Upcoming Deadlines section (below calendar):
  Card: background #241820, 12px radius
  Section title "Upcoming Deadlines" 14px medium white

  3 deadline rows, each:
    Background #2E1F28 rounded row, 8px radius
    Left: date block (36px square, 10px radius) colored to project — shows "Jun / 12"
    Middle: task name 13px white medium + project name 11px #A89DB0
    Right: status badge pill — "Urgent" coral · "On track" teal · "In review" blue

  Rows:
    Jun 12 — Payment Gateway Integration / E-commerce Platform / Urgent (coral)
    Jun 18 — UI Design Handoff / Mobile App v2 / On track (teal)
    Jun 25 — Data Pipeline Go-Live / Data Pipeline / In review (blue)

Aesthetic: premium dark, clean grid calendar. Event pills are subtle tints,
not heavy blocks. Deadlines section feels like a focused sidebar summary.
```

---

## PROMPT 6 — Add/Edit Card Modal

```
Design a dark-mode modal dialog for creating a new task card in "DevFlow" by Perikon Solution.

Brand CI: background overlay rgba(0,0,0,0.6) blur behind modal,
modal card background #241820, border 1px rgba(139,143,212,0.3),
accent lavender #8B8FD4, font Inter.

Modal size: 380px wide, centered, 12px radius

Modal header:
  - Icon + "Add New Card" title 15px medium white
  - Small × close button top-right (ghost, #6B5F72)

Form fields (stacked, 12px gap):
  Each field: label 11px uppercase #6B5F72 tracking wide, input below

  1. Title — single line text input
     Background #1A1015, 1px border rgba(139,143,212,0.2), 8px radius, 36px height
     Focus: border #8B8FD4, no glow

  2. Description — textarea 3 lines
     Same styling as text input

  3. Column — select dropdown (Backlog / To Do / In Progress / Review / Done)
     Same input styling, custom arrow icon in lavender

  4. Tag — select dropdown (Feature / Bug / Design / Backend / Frontend / DevOps)

  5. Due Date — single line input, placeholder "e.g. Jun 30"

  6. Assignee — row of 5 avatar circles (24px), click to select
     Selected: ring border 2px #8B8FD4 around avatar

Modal footer:
  - Right-aligned: "Cancel" ghost button + "Add Card" solid button
  - Add Card: background #8B8FD4 lavender, white text, 8px radius, 500 weight
  - Hover: slightly darker lavender

Aesthetic: modal feels premium and focused. Dark surface lifts slightly from
the page background. Clean form with no clutter. Every field styled consistently.
The only color is the lavender accent on focus states and the primary button.
```

---

## PROMPT 7 — Empty State & Onboarding

```
Design a dark-mode empty state screen for "DevFlow" by Perikon Solution,
shown when a user has no projects yet.

Brand CI: background #1A1015, accent #8B8FD4 lavender,
signature gradient line #6B7FFF → #9B6FD4 → #E8825A → #F0A830, font Inter.

Center of the content area (vertically and horizontally centered):

  Illustration area (top):
    Abstract minimal illustration: a dark rounded card outline (#241820 with subtle border)
    floating slightly, with a small + icon in lavender in its center.
    Below it, 2 smaller "ghost" card outlines at angles, very dim.
    No heavy illustration — just minimal geometric shapes that suggest cards/tasks.

  Text (below illustration):
    Headline: "No projects yet" — 18px, medium, white
    Body: "Create your first project to start managing tasks with your team."
      14px, #A89DB0, centered, max-width 260px, line-height 1.6

  Signature gradient rule:
    Short 80px horizontal line, the signature gradient, centered below body text
    2px height, border-radius pill

  CTA button:
    "+ New Project" — background #8B8FD4, white text, 8px radius, 500 weight, 40px height
    Subtle hover: darker lavender #6B7FDD

Aesthetic: minimal, elegant, not sad. The empty state is an invitation, not a dead end.
Dark, confident, premium. The gradient rule adds a visual moment of brand personality
before the call to action.
```

---

## 📋 Quick Reference — ใช้เพิ่มใน Prompt ใดก็ได้

```
Always apply these Perikon Solution brand rules:
- Dark background: #1A1015 page, #241820 surfaces, #2E1F28 hover/elevated
- Accent: #8B8FD4 periwinkle lavender for primary interactive elements
- Signature gradient: #6B7FFF → #9B6FD4 → #E8825A → #F0A830
  Used ONLY for: progress bars, active underlines, accent rules, CTA buttons gradient
  NEVER as background fills
- Text: #FFFFFF primary, #A89DB0 secondary, #6B5F72 tertiary/dim
- Borders: rgba(139,143,212,0.15) default, rgba(139,143,212,0.35) hover/focus
- Radius: 12px cards, 8px inputs/buttons/badges
- Font: Inter throughout
- Feel: Linear / Vercel / Raycast — premium dark SaaS, flat surfaces, accent-only color
- NO gradients on backgrounds, NO glow effects, NO heavy shadows
```
