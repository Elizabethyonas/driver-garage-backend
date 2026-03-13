import multer from 'multer';

/** Use for multipart/form-data (e.g. garage signup). Populates req.body with text fields and req.files with uploads. */
export const multipartForm = multer().any();
