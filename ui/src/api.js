const API_BASE = 'http://localhost:8080';

export async function getFeed() {
  const res = await fetch(`${API_BASE}/feed`);
  if (!res.ok) throw new Error('Failed to fetch feed');
  const data = await res.json();
  return data.profiles;
}

export async function postSwipe(targetId, action) {
  const res = await fetch(`${API_BASE}/swipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetId, action }),
  });
  if (!res.ok) throw new Error('Failed to record swipe');
  return res.json();
}

export async function getMatches() {
  const res = await fetch(`${API_BASE}/matches`);
  if (!res.ok) throw new Error('Failed to fetch matches');
  const data = await res.json();
  return data.matches;
}
