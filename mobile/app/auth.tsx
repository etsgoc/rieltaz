import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import { useSession } from '@/providers/SessionProvider';

export default function AuthScreen() {
  const router = useRouter();
  const { session } = useSession();
  useEffect(() => { if (session && router.canGoBack()) router.back(); }, [session]);
  return <Screen><Header close /><AuthForm onDone={() => router.canGoBack() && router.back()} /></Screen>;
}
