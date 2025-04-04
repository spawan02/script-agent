import { uploadToSupabase } from '../utils/uploadToSupabase';

export async function uploaderAgent(filePath: string): Promise<string> {
  return await uploadToSupabase(filePath);
}
