import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { adminDb, adminAuth } from '../../adminFirebase'; // Firebaseの設定をインポート
import { useAuthContextAdmin } from '../../contexts/AuthContextAdmin'; // ログイン状態を取得

interface ChatMessage {
  id?: string;
  role: string;
  content: string;
  createdAt: string | null;
  updatedAt?: string | null;
}

const ChatComponent: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null); // 編集モードのためのID
  const { user } = useAuthContextAdmin(); // ログインしたユーザー情報を取得

  // Firestoreからログインユーザーのメッセージ履歴を取得
  const fetchMessages = async () => {
    if (!user) return;

    const q = query(
      collection(adminDb, 'messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role,
          content: data.content,
          createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate().toLocaleString() : null,
        };
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchMessages(); // ページロード時にメッセージ履歴を取得
  }, [user]);

  // チャットメッセージをFirestoreに追加または更新する関数
  const addOrUpdateMessage = async () => {
    if (!prompt.trim() || !user) return;

    setLoading(true);

    const userMessage = { role: 'user', content: prompt };

    try {
      if (editId) {
        // 編集モードの場合、Firestoreのドキュメントを更新
        const messageRef = doc(adminDb, 'messages', editId);
        await updateDoc(messageRef, {
          content: prompt,
          updatedAt: serverTimestamp(), // 更新日を現在時刻に更新
        });
        setEditId(null);
      } else {
        // 新規メッセージをFirestoreに追加
        await addDoc(collection(adminDb, 'messages'), {
          role: 'user',
          content: prompt,
          userId: user.uid,
          createdAt: serverTimestamp(), // 作成日
          updatedAt: serverTimestamp(), // 作成時に同じタイムスタンプを使用
        });
      }
      
      // ChatGPT API呼び出し
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, messages: messages.slice(-5) }), // 最新の5件のみ送信
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };

      // Firestoreにアシスタントのメッセージを保存
      await addDoc(collection(adminDb, 'messages'), {
        role: 'assistant',
        content: assistantMessage.content,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setPrompt(''); // 入力フィールドをリセット
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setLoading(false);
    }
  };

  // メッセージの編集を開始する関数
  const editMessage = (message: ChatMessage) => {
    setPrompt(message.content);
    setEditId(message.id || null);
  };

  return (
    <div>
      <h1>Chat with GPT</h1>

      {/* チャット履歴 */}
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{message.role === 'user' ? 'You' : 'GPT'}:</strong> {message.content}
            <div>
              {message.role === 'user' && (
                <>
                <button onClick={() => editMessage(message)}>Edit</button> {/* メッセージの編集 */}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* プロンプト入力 */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        style={{ width: '100%', height: '50px' }}
      />
      <button onClick={addOrUpdateMessage} style={{ width: '100%', padding: '10px' }} disabled={loading}>
        {loading ? 'Loading...' : editId ? 'Update Message' : 'Submit Message'}
      </button>
    </div>
  );
};

export default ChatComponent;
