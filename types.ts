export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  type: 'html' | 'doc';
}

export interface TestCase {
  id: string;
  feature: string;
  scenario: string;
  expectedResult: string;
  groundedIn: string;
  type: 'positive' | 'negative';
}

export enum AppView {
  INGESTION = 'ingestion',
  TEST_GENERATION = 'test_generation',
  SCRIPT_GENERATION = 'script_generation'
}

export interface GeminiResponse<T> {
  data: T | null;
  error?: string;
}