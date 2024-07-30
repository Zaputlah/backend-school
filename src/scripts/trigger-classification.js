const { exec } = require('child_process');

const triggerClassification = () => {
    exec('python src/generateAI/generate_classes.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
};

// Memicu pengelompokan
triggerClassification();
