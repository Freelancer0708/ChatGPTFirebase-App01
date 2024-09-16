import { useAuthContextUser } from '../../contexts/AuthContextUser';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { userAuth } from '../../userFirebase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // エラーメッセージの状態を追加
    const { user } = useAuthContextUser();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // 新しい試行の前にエラーをリセット
        try {
            await signInWithEmailAndPassword(userAuth, email, password);
            router.push('/user'); // ログイン後のリダイレクト先
        } catch (error: any) {
            console.error(error);
            setError(error.message); // エラーメッセージを設定
        }
    };

    if (user) {
        router.push('/user'); // 既にログインしている場合はリダイレクト
        return null;
    }

    return (
        <div>
            <section className='login'>
                <h1>ログイン画面</h1>
                <form onSubmit={handleSubmit} className='login-form'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="メールアドレス"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワード"
                        required
                    />
                    <button type="submit">ログイン</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>
        </div>
    );
};

export default LoginPage;
