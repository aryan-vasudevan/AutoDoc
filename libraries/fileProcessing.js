const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Read the API key from an environment variable
const { API_KEY } = require('../configs/creds');

// Function to read the file content
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Function to write content to a file
function writeFile(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Function to send code to ChatGPT and receive the response
async function getCommentedCode(code, fileType) {
    const prompt = `Here is a ${fileType} file. Please add appropriate code comments to it.\n\n${code}`;

    const response = await axios.post(
        'https://api.openai.com/v1/engines/gpt-4/completions',
        {
            prompt: prompt,
            max_tokens: 1500,
            n: 1,
            stop: null,
            temperature: 0.7,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        }
    );
    console.log(response.data.choices[0].text)
    return response.data.choices[0].text;
}

// Main function to process the file
async function processFile(filePath) {
    try {
        const fileExtension = path.extname(filePath).substring(1);
        const fileContent = await readFile(filePath);

        const commentedCode = await getCommentedCode(fileContent, fileExtension);

        const outputFilePath = `commented_${path.basename(filePath)}`;
        await writeFile(outputFilePath, commentedCode);

        console.log(`Processed file saved as ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing the file:', error);
        throw error;
    }
}

module.exports = {
    processFile
};