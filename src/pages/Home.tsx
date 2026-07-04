import { RiQrScan2Line } from "react-icons/ri";
import { useRef, useState, useEffect } from "react";
import { addMealToToday, notifyDayRecordsUpdated, parseMealFromApi } from "../utils/dayStorage";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Arranca la cámara al montar
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } }) // cámara trasera
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error cámara:", err));

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Captura foto del video y devuelve base64
  const capturePhoto = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1]; // base64 sin prefijo
  };

  const handleScan = async () => {
    const base64 = capturePhoto();
    if (!base64) return;

    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_CHATGPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analiza esta comida. Comentario del usuario: "${comment}".
                  Responde SOLO un JSON así, sin markdown ni backticks:
                  {
                    "alimento": "nombre del plato",
                    "sodio": 0,
                    "azucares": 0,
                    "azucares_anadidos": 0,
                    "carbohidratos_refinados": 0,
                    "alcohol": 0,
                    "grasas_saturadas": 0,
                    "proteina": 0,
                    "calorias": 0,
                    "potasio": 0,
                    "agua": 0,
                    "retention_score": 0
                  }
                  Sodio y potasio en mg, agua en ml, todo lo demás en gramos.
                  
                  El retention_score es un número de 0 a 100 que indica cuánto contribuye este plato a la retención de líquidos facial.
                  100 = cara hinchada seguro, 0 = ningún riesgo.
                  
                  Factores que SUBEN el score:
                  - Sodio alto (el factor principal, más de 500mg por plato ya es alto)
                  - Azúcares añadidos y carbohidratos refinados (picos de insulina = retención de sodio)
                  - Alcohol (deshidrata y luego rebote de retención)
                  - Glutamato / MSG
                  - Alimentos ultraprocesados
                  
                  Factores que BAJAN el score:
                  - Alto en potasio (contrarresta el sodio: plátano, aguacate, espinacas)
                  - Alto en agua (pepino, sandía, lechuga)
                  - Alimentos antiinflamatorios (jengibre, cúrcuma, omega-3)
                  - Proteína limpia sin mucho sodio`,
                },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64}` },
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });

      const data = await res.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
      const meal = parseMealFromApi(parsed);

      addMealToToday(meal);
      notifyDayRecordsUpdated();

      setComment("");
      alert(`✅ ${meal.alimento} añadido`);
    } catch (err) {
      console.error(err);
      alert("Error al analizar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen gap-10 items-center justify-center py-10 px-2">
      <header className="flex flex-col gap-4 items-center justify-center top-20 fixed">
        <h1 className="text-2xl font-bold text-center">Identify your fuel</h1>
        <p className="text-sm text-gray-500 text-center">
          Scan the fuel tank to identify the type <br />
          of fuel you are using
        </p>
      </header>

      <section className="flex flex-col items-center justify-center">
        {/* Cámara en vivo */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-[300px] w-[300px] object-cover rounded bg-black"
        />
        {/* Canvas oculto para capturar la foto */}
        <canvas ref={canvasRef} className="hidden" />

        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añade un comentario"
          className="w-[75%] px-4 py-2 h-[50px] rounded border border-gray-300 mt-5 text-center"
        />

        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-[#FFD700] text-gray-700 text-lg font-bold px-4 py-7 rounded-full mt-10 w-[75%] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RiQrScan2Line className="text-2xl" />
          {loading ? "Analizando..." : "Escanear"}
        </button>
      </section>
    </main>
  );
}