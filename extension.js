const vscode = require('vscode');
const fileProcessing = require('./libraries/fileProcessing.js');
const terminalUtils = require('./libraries/terminalUtils.js');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "autodoc" is now active!');

    const commentThisFile = vscode.commands.registerCommand('autodoc.CommentThisFile', async function () {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const filePath = editor.document.fileName;
            try {
                await fileProcessing.processFile(filePath);
                vscode.window.showInformationMessage('File has been commented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error commenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    });

    const documentCode = vscode.commands.registerCommand('autodoc.documentCode', function () {
        vscode.window.showInformationMessage('Documenting code!');
    });

    const analyzeThisFile = vscode.commands.registerCommand('autodoc.analyzeThisFile', async function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.fileName;
            try {
                // Prompt the user to select the type of analysis
                const analysisType = await terminalUtils.promptAnalysisType();

                // Perform file processing based on the selected analysis type
                const output = await fileProcessing.Document(filePath, `In the mark down file,
                only discuss, evaluate and analyze ${analysisType} in the file.`);

                const outputFilePath = await ("ANALYZED_"+filePath.split(".")[0]+".md")
                console.log(output)
                await fileProcessing.writeFile(outputFilePath, output);

                console.log(`Processed file saved as ${outputFilePath}`);

                vscode.window.showInformationMessage('File has been documented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error documenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    });
    
    const documentThisFile = vscode.commands.registerCommand('autodoc.DocumentThisFile', async function () {
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            const filePath = editor.document.fileName;
            try {
                await fileProcessing.processFileDocument(filePath);
                vscode.window.showInformationMessage('File has been documented successfully!');
            } catch (error) {
                vscode.window.showErrorMessage('Error documenting the file: ' + error.message);
            }
        } else {
            vscode.window.showInformationMessage('No active editor found!');
        }
    })
    
    context.subscriptions.push(commentThisFile);
    context.subscriptions.push(documentCode);
    context.subscriptions.push(analyzeThisFile);
    context.subscriptions.push(documentThisFile);

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}