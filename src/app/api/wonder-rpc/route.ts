const RPC_URL = process.env.NEXT_PUBLIC_WONDER_RPC_URL || "https://rpc.testnet.wonderchain.org";

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(`${RPC_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
