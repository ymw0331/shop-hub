// src/types/express.d.ts
// Extend Express Request type to include formidable fields and files

import { IncomingForm } from "formidable";

declare global {
    namespace Express {
        interface Request {
            fields?: any; // From express-formidable
            files?: any;  // From express-formidable
            user?: any;   // From auth middleware
        }
    }
}
