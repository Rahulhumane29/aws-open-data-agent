const API_BASE_URL = 'http://localhost:8000';

export interface FileItem {
  name: string;
  size: number;
  last_modified: string;
}

export async function fetchOpenDataFiles(): Promise<FileItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/list-open-data`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}