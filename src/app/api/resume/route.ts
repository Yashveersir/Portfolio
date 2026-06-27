import { NextResponse } from 'next/server';

let cachedFileId: string | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const download = searchParams.get('download') === 'true';

  const now = Date.now();
  let fileId = cachedFileId;

  if (!fileId || now - cacheTime > CACHE_DURATION) {
    try {
      const response = await fetch(
        'https://drive.google.com/drive/folders/1ZhDEURPB0Q6K-ob74rvSSQksPdZ2bM8h?usp=sharing',
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          next: { revalidate: 300 }, // Cache fetch at Next.js level for 5 minutes
        }
      );
      const html = await response.text();
      const match = html.match(/data-id="([a-zA-Z0-9_-]+?)"[^>]*?data-tooltip="([^"]+?\.pdf)/);
      if (match && match[1]) {
        fileId = match[1];
        cachedFileId = fileId;
        cacheTime = now;
      }
    } catch (error) {
      console.error('Error fetching Google Drive folder:', error);
    }
  }

  // Fallback to the known file ID if fetching fails
  if (!fileId) {
    fileId = '13qGEN6QbTcMJF6jhuJ4gWwHb58NI1I0y';
  }

  if (download) {
    return NextResponse.redirect(`https://drive.google.com/uc?export=download&id=${fileId}`);
  } else {
    // Redirect to the Google Drive preview viewer
    return NextResponse.redirect(`https://drive.google.com/file/d/${fileId}/view?usp=sharing`);
  }
}
