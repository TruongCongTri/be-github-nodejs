import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const folders = [
  "src",
  "src/controllers",
  "src/routes",
  "src/middlewares",
  "src/services",
  "src/utils",
  "src/config",
];

// create folders
folders.forEach((folder) => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 Created: ${folder}`);
  } else {
    console.log(`✅ Exists: ${folder}`);
  }
});

// create index.js
const indexPath = path.join(__dirname, "src/index.js");
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(
    indexPath,
    `import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';

    dotenv.config();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello from ESModule Express!');
    });

    const PORT = process.env.HTTP_PORT || 3000;
    app.listen(PORT, () => {
        console.log(\`🚀 Server is running on http://localhost:\${PORT}\`);
    });
    `
  );
  console.log(`📄 Created: index.js`);
}

// create .env
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `HTTP_PORT=3000`);
  console.log(`📄 Created: .env`);
}

// create nodemon.json
// create .env
const nodemonPath = path.join(__dirname, "nodemon.json");
if (!fs.existsSync(nodemonPath)) {
  fs.writeFileSync(
    nodemonPath,
    JSON.stringify(
      {
        watch: ["src"],
        ext: "js",
        exec: "node src/index.js",
      },
      null,
      2
    )
  );
  console.log(`📄 Created: nodemon.json`);
}

// updated package.json (add type: module & scripts)
const pkgPath = path.join(__dirname, "package.json");
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.type = "module";
  pkg.scripts = {
    ...pkg.scripts,
    dev: "nodemon",
    start: "node src/index.js",
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`✅ Updated: package.json`);
} else {
  console.warn(`⚠️ package.json not found. Please run 'npm init -y' first.`);
}
