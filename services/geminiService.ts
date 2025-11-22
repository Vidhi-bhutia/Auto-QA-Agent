import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, TestCase } from "../types";

// Initialize Gemini Client
// NOTE: In a production app, never expose API keys on the client.
// This is for the specific requirements of the "serverless" assignment demo.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_QA = `You are an expert Autonomous QA Agent. 
Your goal is to analyze project documentation and HTML structure to generate comprehensive test plans.
You strictly ground your test cases in the provided documentation. Do not hallucinate features not present in the docs or HTML.`;

const SYSTEM_INSTRUCTION_CODER = `You are a Senior Python Selenium Automation Engineer.
Your goal is to write robust, production-grade Selenium scripts based on provided Test Cases, HTML structure, and Documentation.
Always use explicit waits (WebDriverWait) instead of sleep.
Use the most reliable selectors available in the HTML (ID -> CSS -> XPath).
Output raw Python code.`;

export const generateTestCases = async (
  htmlFile: UploadedFile | null,
  docFiles: UploadedFile[],
  userPrompt: string
): Promise<TestCase[]> => {
  if (!htmlFile) throw new Error("HTML file is required");

  const docContext = docFiles.map(f => `--- DOCUMENT: ${f.name} ---\n${f.content}\n`).join("\n");
  const htmlContext = `--- TARGET HTML (${htmlFile.name}) ---\n${htmlFile.content}\n`;

  const prompt = `
    ${docContext}
    ${htmlContext}

    USER REQUEST: ${userPrompt}

    Based on the above documents and HTML, generate a list of test cases.
    Strictly adhere to the rules in the documents.
    
    Return the response in JSON format with the following schema:
    Array of objects:
    - id: string (e.g., TC-001)
    - feature: string
    - scenario: string (Description of the test)
    - expectedResult: string
    - groundedIn: string (The name of the document this rule comes from)
    - type: "positive" | "negative"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_QA,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              feature: { type: Type.STRING },
              scenario: { type: Type.STRING },
              expectedResult: { type: Type.STRING },
              groundedIn: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["positive", "negative"] },
            },
            required: ["id", "feature", "scenario", "expectedResult", "groundedIn", "type"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as TestCase[];
  } catch (error) {
    console.error("Error generating test cases:", error);
    throw error;
  }
};

export const generateSeleniumScript = async (
  testCase: TestCase,
  htmlFile: UploadedFile,
  docFiles: UploadedFile[]
): Promise<string> => {
  const docContext = docFiles.map(f => `--- DOCUMENT: ${f.name} ---\n${f.content}\n`).join("\n");
  
  const prompt = `
    CONTEXT:
    ${docContext}
    
    TARGET HTML CONTENT:
    ${htmlFile.content}

    TEST CASE TO AUTOMATE:
    ID: ${testCase.id}
    Feature: ${testCase.feature}
    Scenario: ${testCase.scenario}
    Expected Result: ${testCase.expectedResult}

    TASK:
    Write a full Python Selenium script using 'webdriver' and 'unittest'.
    - Setup the driver (assume Chrome).
    - Open 'checkout.html' (assume local file or dummy URL).
    - Implement the steps to reproduce the scenario.
    - Add assertions to verify the Expected Result.
    - Handle potential errors gracefully.
    - DO NOT wrap the code in markdown blocks (e.g., \`\`\`python). Return ONLY the code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is good for coding too, but Pro is better. Using Flash for speed/quota in demo.
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CODER,
      },
    });

    let code = response.text || "# Error generating code";
    // Clean up markdown if the model ignores instructions
    code = code.replace(/^```python/, '').replace(/^```/, '').replace(/```$/, '');
    return code;
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};
