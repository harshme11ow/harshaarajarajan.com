// Starter copy — replace with your own drawings, photos, measurements, and approved technical details.
export const projects = [
  {
    slug: "boba-hardware", number: "01", category: "SPACE SYSTEMS", title: "BoBa Satellite Hardware",
    subtitle: "Designing and validating electronics for a small satellite.",
    role: "Hardware engineering · UGA SSRL", year: "2026 — ongoing", status: "In progress",
    tags: ["PCB", "Systems", "Testing"],
    intro: "A working record of my contributions to BoBa at UGA's Small Satellite Research Laboratory. This page will become a technical case study as I add work that is cleared for public release.",
    challenge: "Space hardware must be designed with reliability, integration, and testability in mind. The final write-up will explain the specific subsystem and constraints once the details are cleared for publication.",
    approach: ["Document the electrical subsystem and design requirements that can be shared.", "Show the iteration from schematic review through hardware validation.", "Explain testing methodology, issues found, and lessons learned without revealing restricted material."],
    outcome: "Documentation in progress. Final test results and approved photographs will be added here.",
  },
  {
    slug: "formula-ev-electronics", number: "02", category: "ELECTRIC VEHICLES", title: "Formula EV Electronics",
    subtitle: "PCB work for sensing and electronic throttle control.",
    role: "Powertrain · UGA Motorsports", year: "2026", status: "Case study draft",
    tags: ["PCB Design", "Sensors", "EV"],
    intro: "Electronics work within a Formula EV powertrain team, including designs related to brake and acceleration encoders and electronic throttle control.",
    challenge: "Reliable driver input sensing depends on clear signal paths, good hardware interfaces, and careful verification.",
    approach: ["Describe each board's role in the larger powertrain architecture.", "Explain layout decisions, interfaces, and electrical checks.", "Add scope, measured results, and design images after review."],
    outcome: "Case study scaffold. Add actual validation results and your specific design contributions.",
  },
  {
    slug: "accord-telemetry", number: "03", category: "EMBEDDED SYSTEMS", title: "Accord Telemetry Display",
    subtitle: "Experimenting with car data, microcontrollers, and small displays.",
    role: "Personal project", year: "2026 — ongoing", status: "Prototype",
    tags: ["ESP32", "CAN / OBD-II", "OLED"],
    intro: "A personal project exploring how to read useful diagnostics from a 2018 Honda Accord and display them on a compact custom interface.",
    challenge: "Extracting the right signals at useful refresh rates while keeping the interface safe and understandable.",
    approach: ["Compare ELM327 OBD-II polling against direct CAN possibilities.", "Prototype display layouts and data update behavior.", "Document wiring, power protection, and what worked in testing."],
    outcome: "Prototype notes in progress. Future updates will include screenshots and logged readings.",
  },
  {
    slug: "transcribbl", number: "04", category: "SOFTWARE", title: "Transcribbl",
    subtitle: "A local tool for turning handwritten forms into structured data.",
    role: "Personal software project", year: "2026", status: "In development",
    tags: ["Python", "OCR", "Desktop UI"],
    intro: "An experiment in turning fixed-layout handwritten forms into structured spreadsheets using a local desktop workflow.",
    challenge: "Real handwritten forms are messy. A good pipeline needs a predictable layout, clear error handling, and easy review of extracted values.",
    approach: ["Create a desktop interface to select and process forms.", "Experiment with text extraction and field mapping.", "Make imperfect results easy to identify and correct."],
    outcome: "Development ongoing. Add UI screenshots and a demo after the workflow is stable.",
  },
];

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}
