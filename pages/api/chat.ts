import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the form data.' });
      return;
    }

    const input = fields.input || '';
    const imageFile = files.image?.[0];

    const messages = [{ role: 'user', content: input }];

    const formData = new FormData();
    formData.append("model", "gpt-4-vision-preview");
    formData.append("messages", JSON.stringify(messages));
    formData.append("max_tokens", "1000");

    if (imageFile) {
      const buffer = fs.readFileSync(imageFile.filepath);
      formData.append("image", new Blob([buffer]), imageFile.originalFilename);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Gagal mendapatkan balasan." });
  });
}