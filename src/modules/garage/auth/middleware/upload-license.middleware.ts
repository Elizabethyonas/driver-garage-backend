import multer from 'multer';
import path from 'path';
import fs from 'fs';

const MAX_SIZE_MB = 10;
const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const uploadDir = path.join(process.cwd(), 'uploads', 'garage-licenses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype === 'application/pdf' ? '.pdf' : '.jpg');
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, name);
  },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG and PNG files are allowed (max 10MB).'));
  }
};

export const uploadBusinessLicense = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
}).single('business_license_document');
