import fs from "fs";
import path from "path";

const pagesDir = "E:/newerp/Frontend/src/Pages";
const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const dynamicBase = "${import.meta.env.VITE_API_BASE_URL}";

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (exts.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walk(pagesDir);
let changed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  let after = before.replace(
    /(['"])http:\/\/localhost:7000([^'"`]*)\1/g,
    (_, _q, suffix) => `\`${dynamicBase}${suffix}\``
  );
  after = after.replace(
    /`http:\/\/localhost:7000([^`]*)`/g,
    (_, suffix) => `\`${dynamicBase}${suffix}\``
  );

  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

console.log(`updated_pages=${changed}`);
