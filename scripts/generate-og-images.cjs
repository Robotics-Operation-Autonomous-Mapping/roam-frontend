/**
 * Render 1200x630 social preview images to public/og/*.png.
 * Re-run after changing a page's headline:  npm run og:generate
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "og");
const W = 1200;
const H = 630;

const PAGES = [
  { file: "home", eyebrow: "Student robotics club · UCalgary", lines: ["Building an autonomous", "LiDAR mapping rover."] },
  { file: "team", eyebrow: "Our team", lines: ["The students", "building ATLAS-1."] },
  { file: "join", eyebrow: "Recruitment", lines: ["Join a UCalgary", "robotics club."] },
  { file: "apply", eyebrow: "Membership application", lines: ["Apply to join", "Schulich ROAM."] },
  { file: "demo", eyebrow: "Flagship project", lines: ["ATLAS-1: autonomous", "mapping rover."] },
  { file: "projects", eyebrow: "Projects", lines: ["Rigs and rovers", "built at UCalgary."] },
  { file: "sponsors", eyebrow: "Sponsorship", lines: ["Sponsor a student", "robotics team in Calgary."] },
  { file: "contact", eyebrow: "Contact", lines: ["Get in touch with", "Schulich ROAM."] },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg({ eyebrow, lines }) {
  const font = "Arial, Helvetica, sans-serif";
  const titleY = 400;
  const title = lines
    .map(
      (l, i) =>
        `<text x="72" y="${titleY + i * 76}" font-family="${font}" font-size="66" font-weight="700" fill="#F5ECD7">${esc(l)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0A0A0B"/>
  <rect width="${W}" height="10" fill="#E8512A"/>
  <text x="196" y="118" font-family="${font}" font-size="44" font-weight="700" letter-spacing="2" fill="#F5ECD7">SCHULICH ROAM</text>
  <text x="196" y="154" font-family="${font}" font-size="21" letter-spacing="3" fill="#E8512A">ROBOTICS OPERATION FOR AUTONOMOUS MAPPING</text>
  <text x="72" y="${titleY - 70}" font-family="${font}" font-size="24" letter-spacing="4" fill="#E8512A">${esc(eyebrow.toUpperCase())}</text>
  ${title}
  <text x="72" y="${H - 52}" font-family="${font}" font-size="24" fill="#F5ECD7" fill-opacity="0.6">Schulich School of Engineering · University of Calgary · schulichroam.com</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const logo = await sharp(path.join(ROOT, "public", "logo.png")).resize(104, 104, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  for (const page of PAGES) {
    const out = path.join(OUT, `${page.file}.png`);
    await sharp(Buffer.from(svg(page)))
      .composite([{ input: logo, left: 72, top: 64 }])
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(out);
    console.log(`${path.relative(ROOT, out)} ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
