import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const formData = new FormData();
    formData.append('file', new Blob([buffer]));
    formData.append('upload_preset', 'nextjs_profileImage');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(apiKey + ':' + apiSecret).toString('base64')}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      fileUrl: result.secure_url 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}