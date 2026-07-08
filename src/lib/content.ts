// ============================================================
// SITE CONTENT — single source of truth for all copy.
// Anything wrapped in [PLACEHOLDER — ...] is for Samarth to swap.
// ============================================================

export const site = {
  name: "Samarth Hiremath",
  firstName: "Samarth",
  lastName: "Hiremath",
  role: "AI/ML Engineer",
  heroCenterLabel: "NOW_BUILDING_GOODHART",
  heroTagline: "（ CODE · PRODUCT · VISION ）",
  email: "samhiremath1@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Samarth-Hiremath1" },
    { label: "LinkedIn", href: "https://linkedin.com/in/samarth-hiremath" }, // [PLACEHOLDER — confirm handle]
    { label: "X", href: "https://x.com/samarth" }, // [PLACEHOLDER — confirm handle]
  ],
};

export const quote = {
  text: "The best way to predict the future is to create it.",
  highlight: "create it.",
  attribution: "PETER_DRUCKER",
};

export const about = {
  heading: "About",
  paragraphs: [
    "I take ideas from 0 → 1. Incoming MSCS at USC (Fall 2026 — Dec 2027), B.S. in Computer Science & Statistics from UC Davis — obsessed with building AI products that actually make a difference, from the CUDA kernel to the go-to-market.",
  ],
  badge: {
    idLabel: "ACCESS // SH-2026",
    line1: "Samarth Hiremath",
    line2: "AI/ML · USC MSCS '27",
    photoAlt: "Portrait of Samarth Hiremath", // swap /portrait-placeholder.svg for a real photo in /public
  },
};

export type Waypoint = {
  company: string;
  role: string;
  dates: string;
  description: string;
};

export const experience: Waypoint[] = [
  {
    company: "VIDI Lab · UC Davis",
    role: "Machine Learning Research Intern",
    dates: "DEC_2025 — PRESENT",
    description:
      "Extending transformer seq2seq models for large-scale sequence alignment with distributed PyTorch — targeting a top-venue submission.",
  },
  {
    company: "Boston Consulting Group",
    role: "Data Analyst Intern",
    dates: "JUN_2025 — AUG_2025",
    description:
      "Turned market and user research into a go-to-market roadmap for a Web3 client.",
  },
  {
    company: "AggieWorks / Moober",
    role: "Engineering Lead & Product Manager",
    dates: "APR_2025 — PRESENT",
    description:
      "Scaled a student rideshare platform to 1,500+ weekly actives with a 9-person team — 99.9% uptime.",
  },
  {
    company: "Spin",
    role: "Strategy & Data Consultant Intern",
    dates: "APR_2025 — JUN_2025",
    description:
      "Analyzed 20K+ rides to sharpen pricing and city-compliance strategy.",
  },
  {
    company: "Snap Inc.",
    role: "Software Engineering Intern",
    dates: "MAR_2025 — JUN_2025",
    description:
      "Shipped real-time computer-vision AR filters — 20K+ views in two weeks, +40% engagement.",
  },
  {
    company: "Tagkopoulos Lab · UC Davis",
    role: "Machine Learning Researcher",
    dates: "NOV_2024 — APR_2025",
    description:
      "Automated biomedical ontology mapping — 150K+ disease-drug entities curated for NLP fine-tuning.",
  },
  {
    company: "Liner AI",
    role: "AI Product Consultant Intern",
    dates: "OCT_2024 — DEC_2024",
    description:
      "Product strategy and UX for an AI-powered study platform.",
  },
];

export type Project = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  image: string; // main image — .png files fall back to their .svg placeholder twin
  images?: string[]; // optional multi-shot collage (first = hero shot)
  github?: string; // only rendered if provided
  demo?: string; // only rendered if provided
  status?: string;
};

export const featuredProjects: Project[] = [
  {
    slug: "distributed-transformer-lab",
    name: "Distributed Transformer Lab",
    description:
      "GPT-2 built from scratch with a custom fused-softmax CUDA kernel, 78% DDP scaling efficiency across 4 processes, and 6× faster inference at 2048 tokens via KV caching + INT8 quantization.",
    tags: ["PyTorch", "CUDA", "JAX / XLA", "DDP", "FastAPI"],
    image: "/projects/transformer-lab.svg", // carousel fallback
    images: [
      "/projects/fused_softmax_diagram.png",
      "/projects/ddp_scaling.png",
      "/projects/inference_latency_comparison.png",
    ],
    github: "https://github.com/Samarth-Hiremath1/Distributed-Transformer-Lab",
  },
  {
    slug: "living-memory",
    name: "Living Memory",
    description:
      "Five Claude agents in parallel fan-out/fan-in orchestration (LangGraph + MCP), with an LLM-as-judge eval harness that catches the silent failures pass/fail tests miss. Built at Cerebral Valley × Sandhill for Rosewood Hotels.",
    tags: ["Claude", "LangGraph", "MCP", "Evals"],
    image: "/projects/living-memory.svg", // carousel fallback
    images: [
      "/projects/living-memory-landing.png",
      "/projects/eval_rubric_scores.png",
      "/projects/living-memory-voice-welcome.png",
    ],
    github: "https://github.com/Samarth-Hiremath1/Living-Memory",
  },
  {
    slug: "trajectory-ai",
    name: "Trajectory.ai",
    description:
      "Multi-agent career platform with LangGraph orchestration and RAG pipelines — 50% faster responses via Redis caching, deployed on Docker + Kubernetes with CI/CD and autoscaling.",
    tags: ["LangGraph", "RAG", "Kubernetes", "PostgreSQL"],
    image: "/projects/trajectory.svg", // collage fallback
    images: [
      "/projects/trajectory-1.jpg",
      "/projects/trajectory-2.png",
      "/projects/trajectory-3.png",
    ],
    github: "https://github.com/Samarth-Hiremath1/Trajectory.ai",
  },
  {
    slug: "vq",
    name: "VQ — AI Speech & Body Language Coach",
    description:
      "Multimodal ML pipeline (PyTorch, TensorFlow, MediaPipe) that analyzes speech and body language for clarity, confidence, and posture — on a Dockerized, Airflow-orchestrated stack with automated retraining.",
    tags: ["PyTorch", "TensorFlow", "MediaPipe", "Airflow"],
    image: "/projects/vq-1.jpg",
    // github: "[PLACEHOLDER — repo URL]",
  },
  {
    slug: "blackjack-ai",
    name: "Blackjack AI",
    description:
      "A Q-learning agent that masters blackjack strategy through simulation and reward-based training — applied RL meets game theory. Built for the Google Developer Student Club at UC Davis.",
    tags: ["Python", "Q-Learning", "Reinforcement Learning", "Probability"],
    image: "/projects/blackjack-1.jpg",
    github: "https://github.com/hanyiliu/SamarthBlackjackBot",
    demo: "https://docs.google.com/presentation/d/1GdYHb8CVW-bAWbQH8Qt3tYmktVt_v_BQjTn2lCsTA6Y/edit?usp=sharing",
  },
];

export const archiveProjects: Project[] = [
  {
    slug: "goodhart",
    name: "Goodhart",
    description:
      "Reward-hack CI — attacks any grader with adversarial LLM probes and a small policy RL-trained against it (GRPO), surfacing exploits and a hackability score before you spend real compute.",
    tags: ["RL", "GRPO", "Evals", "Reward Hacking"],
    image: "/projects/goodhart.svg",
    status: "In development",
  },
  {
    slug: "quantfolio",
    name: "QuantFolio",
    description:
      "C++ backtesting engine with microsecond order simulation + PyTorch forecasting — 12% better return prediction than ARIMA baselines.",
    tags: ["C++", "PyTorch", "Airflow", "AWS"],
    image: "/projects/quantfolio.svg",
    github: "https://github.com/Samarth-Hiremath1/Quantfolio",
  },
  {
    slug: "stitchable",
    name: "Stitchable",
    description:
      "AI multi-source video stitching — syncs multi-camera event recordings via cross-correlation and feature-matching.",
    tags: ["FFmpeg", "OpenCV", "TensorFlow", "WebAssembly"],
    image: "/projects/stitchable.svg",
    github: "https://github.com/Samarth-Hiremath1/Stitchable",
  },
];

export type LeadershipCard = {
  org: string;
  role: string;
  dates: string;
  description: string;
  image: string; // the big photo in the description row — swap in /public/leadership
  beltImage?: string | string[]; // separate image(s) for the motion belt (falls back to `image`)
  stats: { value: string; label: string }[];
};

export const leadership: LeadershipCard[] = [
  {
    org: "AggieWorks / Moober",
    role: "Engineering Lead & Product Manager",
    dates: "2025 — PRESENT",
    description:
      "Leading a 9-person engineering, design, and marketing team building a student rideshare platform — turning product requirements into technical specs and shipping weekly.",
    image: "/leadership/aggieworks.JPG",
    beltImage: ["/leadership/aggieworks-belt1.jpg", "/leadership/aggieworks-belt2.JPG"],
    stats: [
      { value: "1,500+", label: "WEEKLY_ACTIVES" },
      { value: "257%", label: "DAU_GROWTH" },
      { value: "99.9%", label: "UPTIME" },
    ],
  },
  {
    org: "SkillsUSA California",
    role: "State Officer",
    dates: "2022 — 2023",
    description:
      "Organized statewide events for 54,000 members — including a 3,500-person State Leadership & Skills Conference — advocated for career education in Washington D.C., and initiated the President's Council to connect schools across the state.",
    image: "/leadership/SkillsUSA-speech.gif",
    beltImage: "/leadership/skillsusa-belt.JPG",
    stats: [
      { value: "54,000", label: "MEMBERS_SERVED" },
      { value: "3,500", label: "CONF_ATTENDEES" },
      { value: "275", label: "OFFICERS_TRAINED" },
    ],
  },
  {
    org: "Summer Python Bootcamp",
    role: "Founder & Instructor",
    dates: "2020 — 2022",
    description:
      "Founded a summer programming bootcamp with the local library and taught middle schoolers to code across three summers — the first thing I ever took from zero to one.",
    image: "/leadership/summer-python-bootcamp.jpg",
    // no separate belt shot supplied — belt falls back to the main photo above
    stats: [
      { value: "120+", label: "STUDENTS_TAUGHT" },
      { value: "3", label: "SUMMERS" },
      { value: "0→1", label: "FIRST_BUILD" },
    ],
  },
];
