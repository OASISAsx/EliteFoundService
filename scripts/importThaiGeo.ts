import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const provinces = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/provinces.json"), "utf8"),
);

const districts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/districts.json"), "utf8"),
);

const subdistricts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/subdistricts.json"), "utf8"),
);

async function run() {
  console.log("Import provinces...");
  for (const p of provinces) {
    await prisma.province.upsert({
      where: { code: p.provinceCode },
      update: {
        nameTh: p.provinceNameTh,
        nameEn: p.provinceNameEn,
      },
      create: {
        code: p.provinceCode,
        nameTh: p.provinceNameTh,
        nameEn: p.provinceNameEn,
      },
    });
  }

  console.log("Import districts...");
  for (const d of districts) {
    await prisma.district.upsert({
      where: { code: d.districtCode },
      update: {
        nameTh: d.districtNameTh,
        nameEn: d.districtNameEn,
        provinceCode: d.provinceCode,
      },
      create: {
        code: d.districtCode,
        nameTh: d.districtNameTh,
        nameEn: d.districtNameEn,
        provinceCode: d.provinceCode,
      },
    });
  }

  console.log("Import subdistricts...");
  for (const s of subdistricts) {
    await prisma.subdistrict.upsert({
      where: { code: s.subdistrictCode },
      update: {
        nameTh: s.subdistrictNameTh,
        nameEn: s.subdistrictNameEn,
        postalCode: String(s.postalCode),
        districtCode: s.districtCode,
        provinceCode: s.provinceCode,
      },
      create: {
        code: s.subdistrictCode,
        nameTh: s.subdistrictNameTh,
        nameEn: s.subdistrictNameEn,
        postalCode: String(s.postalCode),
        districtCode: s.districtCode,
        provinceCode: s.provinceCode,
      },
    });
  }

  console.log("✅ Import completed");
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
