export class MessageService {
  async getResponse(message: string): Promise<string> {
    const response = await fetch('http://localhost:3000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });
    return await response.text();
  }
}
