export default async function handler(req, res) {
  const data = await fetch("http://localhost:5000/api/discord");
  const json = await data.json();
  res.status(200).json(json);
}
