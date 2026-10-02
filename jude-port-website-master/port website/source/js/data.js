// Portfolio content — edit this file to personalize the site
const PORTFOLIO_DATA = {
  profile: {
    badge: "JD",
    brand: "Jude",
    name: "JUDE",
    fullName: "Jude",
    role: "Security Analyst / Developer",
    location: "London · New York · Remote",
    status: "Available for select security engagements",
    email: "hello@jude.design",
    bio: "I harden digital systems with a defense-first mindset. Six years across application security, cloud architecture, and secure engineering — focused on reducing real risk, not checkbox compliance.",
    aboutLong: [
      "I work across the stack where attacks actually land: apps, APIs, identity, and cloud infrastructure. That mix lets me model threats early and ship controls that hold up under real pressure.",
      "Outside client work I experiment with detection engineering, defensive cloud patterns, and red-team informed blue-team practice. I care about measurable risk reduction and credentials you can actually verify — not screenshots of PDFs.",
      "Currently taking on AppSec reviews, cloud hardening, and secure builds for teams who want defense without the theatre."
    ],
    skills: [
      { group: "Security", items: ["Threat modeling", "AppSec", "Pentest support", "Incident response"] },
      { group: "Engineering", items: ["TypeScript", "Python", "Go", "Secure APIs"] },
      { group: "Cloud & Defense", items: ["AWS", "Kubernetes", "Zero-trust", "IAM"] }
    ],
    timeline: [
      { year: "2024 — now", title: "Independent security practice", detail: "Assessments, cloud hardening, and secure builds for AI, FinTech, and SaaS teams." },
      { year: "2021 — 2024", title: "Lead security engineer", detail: "Hardened observability and wealth platforms across EU and US teams." },
      { year: "2018 — 2021", title: "Developer → security", detail: "Grew from production engineering into AppSec, IAM, and cloud defense." }
    ],
    socials: [
      { id: "github", label: "GitHub", href: "https://github.com/ibekwejude-alt", icon: "gh" },
      { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com", icon: "in" },
      { id: "x", label: "X / Twitter", href: "https://x.com", icon: "x" },
      { id: "instagram", label: "Instagram", href: "https://www.instagram.com/d_kingjude/", icon: "ig" }
    ],
    stats: [
      { value: "06+", label: "Years in security" },
      { value: "48+", label: "Systems hardened" },
      { value: "99%", label: "Client trust" },
      { value: "Soon", label: "Verified credentials" }
    ]
  },

  // Cybersecurity write-ups: click a card to reveal question + answer (no PDF embeds).
  // Add items when ready, e.g.:
  // { id: "lab-1", title: "Room name", category: "appsec", categoryLabel: "AppSec",
  //   question: "The prompt or challenge question.", answer: "The solution or write-up." }
  projects: [],

  // Add certificates after files/IDs are ready. Leave empty until then.

  labs: [
    {
      id: "lab-particle-wave",
      title: "Generative Wave Matrix",
      category: "Canvas & Physics",
      status: "Interactive",
      description: "Harmonic wave simulation driven by frequency, speed, and strand count.",
      tags: ["Canvas 2D", "Math", "60 FPS"],
      type: "particles"
    },
    {
      id: "lab-glass-generator",
      title: "Glassmorphism Studio",
      category: "UI Tooling",
      status: "Live utility",
      description: "Tune blur and opacity, then copy production-ready CSS tokens.",
      tags: ["CSS", "Backdrop filter", "Export"],
      type: "glass"
    },
    {
      id: "lab-matrix-scrambler",
      title: "Typography Decryptor",
      category: "Typography",
      status: "Interactive",
      description: "Character-rain decrypt effect for editorial headlines.",
      tags: ["Animation", "HUD"],
      type: "scrambler"
    },
    {
      id: "lab-spring-physics",
      title: "Magnetic Gravity Nodes",
      category: "Physics",
      status: "Interactive",
      description: "Spring-damper nodes. Click, drag, and fling them across the canvas.",
      tags: ["Springs", "Micro-interaction"],
      type: "spring"
    }
  ],

  certificates: [],

  testimonials: [
    {
      quote: "Jude tightened our threat model and closed critical gaps before launch. Practical, clear, and production-ready.",
      author: "Elena Rostova",
      role: "VP of Security, Avant Dynamics"
    },
    {
      quote: "Rare to find someone who hardens cloud IAM and still ships secure APIs that engineers actually want to maintain.",
      author: "Marcus Chen",
      role: "Founder & CTO, CryptoX Labs"
    },
    {
      quote: "The assessment and remediation plan for our Paris launch cut residual risk sharply. Transformational.",
      author: "Chloe Dubois",
      role: "Head of Engineering, Synthesis Paris"
    }
  ]
};
