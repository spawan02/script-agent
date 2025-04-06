import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

async function uploadToSupabase(
    filePath: string,
    fileBuffer: Buffer
): Promise<string> {
    const { data, error } = await supabase.storage
        .from("audio")
        .upload(filePath, fileBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: "audio/mp3",
        });

    if (error) throw error;
    const signed = await supabase.storage
        .from("audio")
        .createSignedUrl(filePath, 3600);
    if (signed.data?.signedUrl != null) {
        return signed.data.signedUrl;
    } else {
        return "error in getting signed url of supabase";
    }
}

export { uploadToSupabase };
