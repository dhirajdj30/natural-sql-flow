const API_BASE = 'http://localhost:8004';

export const api = {
  async checkHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  },

  async setDatabase(database: string) {
    const response = await fetch(`${API_BASE}/set_database`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ database }),
    });
    return response.json();
  },

  streamQuery(question: string, model: string, apiBase: string, onEvent: (event: any) => void) {
    const eventSource = new EventSource(
      `${API_BASE}/query/stream?question=${encodeURIComponent(question)}&model=${encodeURIComponent(model)}&api_base=${encodeURIComponent(apiBase)}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
        
        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      onEvent({ type: 'error', error: 'Connection lost' });
    };

    return () => eventSource.close();
  },
};
