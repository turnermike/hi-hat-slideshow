export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  return new Response(JSON.stringify({message: 'Edge test working!'}), {
    status: 200,
    headers: {'content-type': 'application/json'}
  });
}