const fs = require('fs');
const path = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b25591aa-2617-4ce5-bd7c-db235b068884\\.system_generated\\logs\\overview.txt';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
    if (line.includes('Updating Tailwind config')) {
        try {
            const data = JSON.parse(line);
            const toolCall = data.tool_calls.find(tc => tc.name === 'multi_replace_file_content');
            if (toolCall) {
                fs.writeFileSync('palette_raw.json', JSON.stringify(toolCall.args, null, 2));
                console.log('Saved to palette_raw.json');
            }
        } catch (e) {
        }
    }
}
