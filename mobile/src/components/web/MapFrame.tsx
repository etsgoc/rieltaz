import { WebView } from 'react-native-webview';
import { mapEmbedUrl } from '@core';

export default function MapFrame({ lat, lng, span, interactive = true }: { lat: number; lng: number; span?: number; interactive?: boolean }) {
  return <WebView source={{ uri: mapEmbedUrl(lat, lng, span) }} pointerEvents={interactive ? 'auto' : 'none'} style={{ flex: 1 }} />;
}
