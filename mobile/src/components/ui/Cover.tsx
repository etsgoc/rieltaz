import { useState } from 'react';
import { Image, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const hue = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

export function Mark({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Rect width={512} height={512} rx={112} fill="#1E1E1E" />
      <Path d="M112 266 L256 140 L400 266" fill="none" stroke="#EDEDED" strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M158 262 L256 176 L354 262 V388 a28 28 0 0 1 -28 28 H186 a28 28 0 0 1 -28 -28 Z" fill="#EDEDED" />
      <Path d="M222 416 V350 a34 34 0 0 1 68 0 V416 Z" fill="#7BA3FF" />
    </Svg>
  );
}

export default function Cover({ uri, seed, style }: { uri?: string; seed: string; style?: StyleProp<ViewStyle> }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    const h = hue(seed);
    return <View style={[{ backgroundColor: hsl(h, 34, 28), alignItems: 'center', justifyContent: 'center' }, style]}><Mark size={44} /></View>;
  }
  return <Image source={{ uri }} resizeMode="cover" onError={() => setFailed(true)} style={[{ backgroundColor: '#2D2D2D' }, style as object]} />;
}
