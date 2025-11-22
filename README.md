# Autonomous QA Agent

## Overview
The Autonomous QA Agent is an intelligent testing assistant that constructs a "testing brain" from your project documentation and HTML code. It uses Google's Gemini 2.5 Flash model to generate grounded test cases and executable Selenium scripts automatically.

## Features

- **Knowledge Base Ingestion**: Upload your target HTML file and support documents (Markdown, Text, JSON) to build the testing context.
- **Grounded Test Generation**: Generates positive and negative test cases that are strictly based on the rules defined in your uploaded documentation.
- **Automated Script Writing**: Converts abstract test cases into production-ready Python Selenium scripts, using specific selectors from your HTML.
- **Interactive UI**: A modern React-based interface to manage the QA workflow.

## Architecture

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **Safety**: Uses environment variables for API key management.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- A valid Google Cloud API Key with access to Gemini models.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auto-qa-agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory (or configure your environment variables accordingly):
   ```env
   API_KEY=your_google_api_key_here
   ```

4. **Run the Application**
   ```bash
   npm start
   ```
   The application will typically run at `http://localhost:3000`.

## Usage Guide

### 1. Build Knowledge Base
- Navigate to the **Knowledge** tab.
- Upload your **Target HTML** (e.g., `checkout.html`).
- Upload **Support Docs** (e.g., `product_specs.md`, `ui_ux_guide.txt`).
- *Tip: You can click "Load Demo Data" to see the agent in action immediately.*

### 2. Generate Test Plan
- Click **Process Knowledge Base**.
- In the **Plan** tab, enter a prompt strategy (e.g., "Generate critical path tests for payment").
- The Agent will produce a list of test cases, citing the specific document that validates each rule.

### 3. Generate Code
- Click **Automate** on any test card.
- The Agent will read the specific HTML structure and the test scenario to write a Python Selenium script.
- Copy the code and run it in your local Python environment:
  ```bash
  pip install selenium
  python generated_test.py
  ```

## Security Note
This project is configured to read the API key from `process.env.API_KEY`. Ensure this variable is set in your deployment or local environment. Do not commit your `.env` file to version control.
