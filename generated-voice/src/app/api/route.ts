import { NextRequest, NextResponse } from "next/server";

const getHeaders = new Headers();
getHeaders.append("accept", "application/json");
getHeaders.append("xi-api-key", process.env.XI_API_KEY || "");
//   body: JSON.stringify(request.prompt),

const postHeaders = new Headers();
postHeaders.append("accept", "audio/mpeg");
postHeaders.append("xi-api-key", process.env.XI_API_KEY || "");
postHeaders.append("Content-Type", "application/json");

interface voiceObject {
  available_for_tiers: string[];
  category: string;
  description: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: getHeaders,
    method: "GET",
  });
  const result = await response.json();
  const arrayOfGeneratedVoices = result.voices.filter(
    (element: voiceObject) => element.category === "generated"
  );
//   console.log(arrayOfGeneratedVoices);
  return NextResponse.json({ body: arrayOfGeneratedVoices });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const request = await req.json();
  console.log(request.text)
  console.log(request.voiceId)
  const theText = request.text
  const theVoiceId= request.voiceId
  // postHeaders.append
  const postData = {
    text: theText,
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5
    }
  };
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${theVoiceId}`, {
    headers: postHeaders,
    method: "POST",
    body: JSON.stringify(postData)
  });
  const result = await response.blob();
  console.log(response)
  console.log(result)
  const finalResponse=new NextResponse(result)
  return finalResponse
}
