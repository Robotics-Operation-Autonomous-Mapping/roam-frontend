import { Department, FormData, TechQuestion } from "./types";

export const DEPT_DESCRIPTIONS: Record<Department, string> = {
  "Mechanical Engineering":
    "Design chassis, suspension systems, sensor mounts, and structural systems optimized for durability and terrain performance.",
  "Electrical Engineering":
    "Develop power systems, motor control, wiring architecture, battery systems, and reliable sensor communication.",
  "Computer Engineering":
    "Work on embedded systems, low-level hardware control, firmware, interfaces, and hardware-software integration.",
  "Software Development":
    "Build autonomy systems using ROS 2, computer vision, path planning, mapping pipelines, and rover intelligence.",
  Geomatics:
    "Process LiDAR, photogrammetry, and spatial data to generate accurate 3D maps and digital twins.",
  Mechatronics:
    "Integrate sensors, actuators, controls, and mechanical systems into one coordinated rover platform.",
  "Business / Operations":
    "Lead sponsorships, partnerships, logistics, planning, timelines, budgeting, and internal organization.",
  "Content & Media":
    "Capture the build journey through photo, video, design, branding, and club communications.",
};

export const DEPT_ICONS: Record<Department, string> = {
  "Mechanical Engineering": "⚙️",
  "Electrical Engineering": "⚡",
  "Computer Engineering": "💾",
  "Software Development": "🤖",
  Geomatics: "🗺️",
  Mechatronics: "🦾",
  "Business / Operations": "📊",
  "Content & Media": "🎥",
};

export const TECH_QUESTIONS: Record<Department, TechQuestion[]> = {
  "Mechanical Engineering": [
    {
      key: "torque",
      label: "What is torque, in simple terms?",
      placeholder: "Explain in your own words...",
      maxWords: 50,
    },
    {
      key: "chassis_design",
      label: "What matters when designing a rover chassis?",
      placeholder: "Key considerations...",
      maxWords: 50,
    },
    {
      key: "cad_experience",
      label: "Have you used CAD software? If yes, which tools?",
      placeholder: "e.g. SolidWorks, Fusion 360, AutoCAD...",
      maxWords: 50,
    },
  ],
  "Electrical Engineering": [
    {
      key: "voltage_current",
      label: "What is the difference between voltage and current?",
      placeholder: "Explain in your own words...",
      maxWords: 50,
    },
    {
      key: "fuse_purpose",
      label: "What is the purpose of a fuse?",
      placeholder: "In your own words...",
      maxWords: 50,
    },
    {
      key: "circuit_experience",
      label:
        "Have you worked with circuits, soldering, Arduino, or similar tools?",
      placeholder: "Describe your experience...",
      maxWords: 50,
    },
  ],
  "Computer Engineering": [
    {
      key: "microcontroller",
      label: "What is a microcontroller?",
      placeholder: "Explain in your own words...",
      maxWords: 50,
    },
    {
      key: "firmware",
      label: "What is firmware?",
      placeholder: "In your own words...",
      maxWords: 50,
    },
    {
      key: "embedded_experience",
      label: "Have you worked with embedded systems or hardware interfaces?",
      placeholder: "Describe your experience...",
      maxWords: 50,
    },
  ],
  "Software Development": [
    {
      key: "languages",
      label: "What programming languages do you know?",
      placeholder: "e.g. Python, C++, JavaScript, Rust...",
      maxWords: 50,
    },
    {
      key: "robotics_interest",
      label: "What interests you about robotics software?",
      placeholder: "What draws you to this space...",
      maxWords: 50,
    },
    {
      key: "coding_project",
      label: "Describe one coding project you worked on.",
      placeholder: "What did you build? What was your role?",
      maxWords: 75,
      multiline: true,
    },
  ],
  Geomatics: [
    {
      key: "lidar_use",
      label: "What is LiDAR used for?",
      placeholder: "Explain its purpose...",
      maxWords: 50,
    },
    {
      key: "mapping_importance",
      label: "Why is accurate mapping important for autonomy?",
      placeholder: "Your reasoning...",
      maxWords: 50,
    },
    {
      key: "gis_experience",
      label: "Have you used GIS, CAD, surveying, or mapping tools?",
      placeholder: "Tools and context...",
      maxWords: 50,
    },
  ],
  Mechatronics: [
    {
      key: "feedback_control",
      label: "What is feedback control?",
      placeholder: "Explain in your own words...",
      maxWords: 50,
    },
    {
      key: "sensor_actuator",
      label: "Give one example of a sensor and actuator working together.",
      placeholder: "A real or hypothetical example...",
      maxWords: 50,
    },
    {
      key: "integrated_systems",
      label: "Have you built any integrated systems before?",
      placeholder: "Describe what you built...",
      maxWords: 50,
    },
  ],
  "Business / Operations": [
    {
      key: "sponsors",
      label: "How would you help ROAM gain sponsors?",
      placeholder: "Your approach...",
      maxWords: 75,
      multiline: true,
    },
    {
      key: "org_strengths",
      label: "What organizational strengths do you bring?",
      placeholder: "Be specific...",
      maxWords: 50,
    },
    {
      key: "led_teams",
      label: "Have you led teams, events, or projects before?",
      placeholder: "Describe the experience...",
      maxWords: 75,
      multiline: true,
    },
  ],
  "Content & Media": [
    {
      key: "tools",
      label: "What tools do you use for photo, video, or design?",
      placeholder: "e.g. Premiere, Lightroom, Figma, Canva...",
      maxWords: 50,
    },
    {
      key: "document_build",
      label: "How would you document a robotics build journey?",
      placeholder: "Your approach...",
      maxWords: 75,
      multiline: true,
    },
    {
      key: "portfolio_link",
      label: "Share any portfolio or social media work (optional).",
      placeholder: "Link or handle...",
      maxWords: 50,
    },
  ],
};

export const DEPARTMENTS = Object.keys(DEPT_DESCRIPTIONS) as Department[];
export const STEPS = [
  "Department",
  "Basic Info",
  "Motivation",
  "Technical",
  "Commitment",
  "Culture",
  "Links",
  "Final",
  "Review",
];

export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year+",
  "Graduate",
];

export const initialData: FormData = {
  full_name: "",
  ucid: "",
  university_email: "",
  personal_email: "",
  phone: "",
  year_of_study: "",
  degree_program: "",
  department: "",
  why_join: "",
  rover_excitement: "",
  hope_to_learn: "",
  project_description: "",
  technical: {},
  hours_per_week: "",
  attend_meetings: "",
  intense_periods: "",
  hobbies: "",
  favorite_song: "",
  interesting_thing: "",
  team_environment: "",
  resume_url: "",
  linkedin: "",
  github: "",
  portfolio: "",
  other_clubs: "",
  which_clubs: "",
  why_bet_on_you: "",
  agree_professionalism: false,
  agree_contribution: false,
  agree_contact: false,
};
