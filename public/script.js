const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Tampilkan pesan sementara (thinking)
  const thinkingMsg = appendMessage('bot', 'Gemini is thinking...');

  try {
    // Kirim ke server Node.js kamu
    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation: [
          { role: 'user', text: userMessage }
        ]
      })
    });

    const data = await res.json();

    // Hapus pesan "thinking" dan ganti dengan jawaban dari AI
    thinkingMsg.textContent = data.data || 'Tidak ada respon dari AI.';

  } catch (error) {
    thinkingMsg.textContent = 'Terjadi kesalahan: ' + error.message;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // supaya bisa diubah nanti
}
