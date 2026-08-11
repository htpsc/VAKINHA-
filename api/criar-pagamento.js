export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { amount, description } = req.body;

    const valor = Number(amount);

    if (!valor || valor < 10) {
      return res.status(400).json({
        error: "O valor mínimo é R$ 10,00"
      });
    }

    const response = await fetch("https://api.anovapay.com.br/charges", {
      method: "POST",
      headers: {
        "ci": process.env.NOVAPAY_CLIENT_ID,
        "cs": process.env.NOVAPAY_CLIENT_SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: valor,
        description: description || "Doação para o Rafinha"
      })
    });

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Erro NovaPay:", error);

    return res.status(500).json({
      error: "Erro ao criar pagamento"
    });
  }
}
