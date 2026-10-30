import { WebView } from 'react-native-webview';
import { PANNELLUM_CSS, PANNELLUM_JS } from '@core';
import type { Tour } from '@core';

const html = (url: string) => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="${PANNELLUM_CSS}"><style>html,body,#p{margin:0;width:100%;height:100%;background:#000}</style></head>
<body><div id="p"></div><script src="${PANNELLUM_JS}"></script>
<script>pannellum.viewer('p',{type:'equirectangular',panorama:${JSON.stringify(url)},autoLoad:true,compass:false,hfov:105,showZoomCtrl:true});</script></body></html>`;

export default function Pano({ tour }: { tour: Tour }) {
  if (tour.type === 'embed') return <WebView source={{ uri: tour.url }} allowsFullscreenVideo style={{ flex: 1 }} />;
  return <WebView originWhitelist={['*']} source={{ html: html(tour.url), baseUrl: 'https://reeltaz.app' }} style={{ flex: 1, backgroundColor: '#000' }} />;
}
