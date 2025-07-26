export async function translateText(text, targetLanguage) {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLanguage,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Error translating text: ${res.statusText}`);
    }

    const data = await res.json();
    return data.translatedText;
  } catch (error) {
    console.error(error);
    return text; // Kembalikan teks asli jika terjadi kesalahan
  }
}
