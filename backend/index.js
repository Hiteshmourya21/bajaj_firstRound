import express from  'express';
import cors from 'cors';
import { fileTypeFromBuffer }  from 'file-type';

const app = express();

app.use(express.json({ limit: '10mb' })); // Adjust size (e.g., 10mb, 50mb)
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors("https://bajaj-firstround-frontend.onrender.com"));

const PORT = process.env.PORT || 5000;

// Route for GET request
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Route for POST request
app.post('/bfhl', async (req, res) => {
    try {
        const { data, full_name,roll_number, dob,file } = req.body;

        if (!data || !full_name || !dob ||!roll_number) {
            return res.status(400).json({ is_success: false, message: "Invalid input" });
        }
        let fileInfo = { file_valid: false, file_mime_type: null, file_size_kb: null };
        // User ID logic
        const user_id = `${full_name.split(' ').join('_')}_${dob.replace(/-/g, '')}`;

        // Separate numbers and alphabets
        const numbers = data.filter((item) => !isNaN(item));
        const alphabets = data.filter((item) => /^[a-zA-Z]+$/.test(item));

        // Highest lowercase alphabet
        const lowerCaseAlphabets = alphabets.filter((ch) => ch === ch.toLowerCase());
        const highestLowercase = lowerCaseAlphabets.length ? lowerCaseAlphabets.sort().pop() : null;

        // Check for prime numbers
        const isPrime = (num) => {
            if (num < 2) return false;
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) return false;
            }
            return true;
        };
        const hasPrime = numbers.some((num) => isPrime(parseInt(num)));

        // File handling
        if (file) {
            try {
                // Decode Base64 string to Buffer
                const fileBuffer = Buffer.from(file, "base64");
    
                // Detect MIME type
                const fileType = await fileTypeFromBuffer(fileBuffer);
    
                if (fileType) {
                    fileInfo.file_valid = true;
                    fileInfo.file_mime_type = fileType.mime;
                    fileInfo.file_size_kb = (fileBuffer.length / 1024).toFixed(2); // File size in KB
                } else {
                    fileInfo.file_valid = false; // Invalid file if MIME type detection fails
                }
            } catch (error) {
                fileInfo.file_valid = false;
            }
        }

        // Response
        res.status(200).json({
            is_success: true,
            user_id,
            college_email_id: `${full_name.split(' ').join('_')}@xyz.com`,
            college_roll_number: roll_number,
            numbers,
            alphabets,
            highest_lowercase: highestLowercase,
            has_prime: hasPrime,
            file_info: fileInfo,
        });
    } catch (error) {
        res.status(500).json({ is_success: false, message: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
