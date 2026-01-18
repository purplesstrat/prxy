import fetch from "node-fetch";

export default async function handler(req, res) {
    const target = req.query.url;
    if (!target) return res.status(400).send("Please provide a URL like /api/proxy?url=https://example.com");

    try {
        const response = await fetch(target);
        const contentType = response.headers.get("content-type");
        let body = await response.text();

        // Rewrite redirect URLs in HTML (very basic)
        body = body.replace(/href="(http[s]?:\/\/[^"]+)"/g, (match, p1) => {
            return `href="/api/proxy?url=${encodeURIComponent(p1)}"`;
        });
        body = body.replace(/action="(http[s]?:\/\/[^"]+)"/g, (match, p1) => {
            return `action="/api/proxy?url=${encodeURIComponent(p1)}"`;
        });

        res.setHeader("Content-Type", contentType);
        res.send(body);
    } catch (err) {
        res.status(500).send("Error fetching the URL: " + err.message);
    }
}
