"use client";
import { useEffect, useState } from "react";

interface voiceObject {
  available_for_tiers: string[];
  category: string;
  description: string;
  name: string;
  voice_id: string;
}

export default function Home() {
  const [theText, setTheText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [arrayOfVoices, setArrayOfVoices] = useState<
    Array<voiceObject> | undefined
  >();
  const [theVoiceId, setTheVoiceId] = useState<string | undefined>();
  const [theAudio, setTheAudio] = useState<string | undefined>();

  async function getGeneratedVoices() {
    const getResponse = await fetch("/api", {
      method: "GET",
    });

    if (getResponse.ok) {
      const tempGenVoices = await getResponse.json();
      console.log(tempGenVoices);
      setArrayOfVoices(tempGenVoices.body);
      console.log(arrayOfVoices);
    }
  }

  useEffect(() => {
    getGeneratedVoices();
    console.log(arrayOfVoices);
  }, []);

  useEffect(() => {
    console.log(theVoiceId);
  }, [theVoiceId]);
  useEffect(() => {
    console.log(arrayOfVoices);
  }, [arrayOfVoices]);

  const generateSpeech = async () => {
    setIsLoading(true);
    if (!theText || !theVoiceId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ text: theText, voiceId: theVoiceId }),
      });

      if (response.ok) {
        console.log("Speech generated successfully");
        const theResponse = await response.blob();
        const audioElement = new Audio();
        setTheAudio(URL.createObjectURL(theResponse));

        setIsLoading(false);
      } else {
        console.error("Failed to generate speech");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-900 flex-col items-center justify-between px-24 py-12">
      <h1 className=" text-5xl mb-4">FakeVoice</h1>
      <div className="mb-4">
        This is a project that uses the ElevenLabs API to convert your text into
        a speech dictated by a fake, AI-generated voice
      </div>
      <div className="w-full items-center flex flex-col gap-2 mt-2">
        <div className="w-full">
          <div className="text-center">Choose a voice</div>
          <div className="w-full  flex  justify-center">
            {arrayOfVoices? (
              <div className="flex gap-4">
                {arrayOfVoices.map((e: voiceObject) => (
                  <button
                    className={`border ${
                      theVoiceId === e.voice_id ? "bg-gray-700" : ""
                    }   px-2 my-2 rounded-sm  py-1`}
                    onClick={() => setTheVoiceId(e.voice_id)}
                    key={e.voice_id}
                  >{e.name}
                  </button>
                ))}
              </div>
            ) : (
              "loading..."
            )}
          </div>
        </div>

        <textarea
          className=" p-1 w-[40rem] text-black rounded-sm  border-gray-600"
          onChange={(event) => {
            setTheText(event.target.value);
          }}
        />

        <button
          className="bg-blue-600 px-5 mt-2 py-1 self-center h-max rounded-sm disabled:cursor-not-allowed disabled:bg-blue-900 transition-colors"
          onClick={generateSpeech}
          disabled={isLoading || !theText}
        >
          Go!{" "}
        </button>
      </div>
      <div className="w-80 h-80 mt-12 relative placeholderdiv">
        {theAudio ? (
          <audio controls src={theAudio}>
            Your browser does not support the audio tag
          </audio>
        ) : (
          ""
        )}
      </div>
    </main>
  );
}