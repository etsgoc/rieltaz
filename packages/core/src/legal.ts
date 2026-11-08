export interface LegalSection { heading: string; paragraphs: string[] }
export interface LegalDoc { id: 'terms' | 'privacy' | 'refunds' | 'cookies'; title: string; updated: string; sections: LegalSection[] }
export interface LegalEntity { company: string; email: string; address: string }

export const LEGAL_UPDATED = '31 October 2026';
export const LEGAL_IDS = ['terms', 'privacy', 'refunds', 'cookies'] as const;

export function legalDocs(e: LegalEntity): LegalDoc[] {
  const contact = `Questions about this document: ${e.email}.`;
  return [
    {
      id: 'terms', title: 'Terms of use', updated: LEGAL_UPDATED,
      sections: [
        { heading: 'Who we are', paragraphs: [`${e.company} ("Reeltaz", "we") runs this website and app. We show residences from several developers and arrange related services. Unless a document says otherwise, we are not the developer or the seller of any property.`] },
        { heading: 'Property listings', paragraphs: [
          'Listing details, prices, payment plans, fees and images come from the developers and can change without notice. Images are illustrative and do not show final specifications.',
          'Figures about occupancy, room rates and returns are estimates given by the developer. They are not a promise of income.'] },
        { heading: 'Enquiries and contracts', paragraphs: [
          'Contacting us about a property is an enquiry only and does not reserve it. Nothing becomes binding until you sign an agreement with the developer or the owner. Their agreements set the reservation fee, the payment schedule, and the terms of the sale, lease or rental.',
          'Payments for a property are made to the developer under its agreements, not to Reeltaz, unless we confirm otherwise in writing.'] },
        { heading: 'Services', paragraphs: [
          'Services such as transfers, flights, visa help, rentals and concierge are provided by us or by partners. A request is not a booking until we confirm it. Prices shown before confirmation are estimates.',
          'When we confirm a request you receive a ticket code. Keep it, because you may be asked for it by the partner.'] },
        { heading: 'Using the site', paragraphs: ['You do not need an account. Give us accurate details when you contact us. You must be at least 18 years old to use this service.'] },
        { heading: 'Acceptable use', paragraphs: ['Do not misuse the service, try to break it, copy listings in bulk, or send false requests.'] },
        { heading: 'Advice and liability', paragraphs: [
          'Nothing on Reeltaz is legal, tax or investment advice. Get independent advice before you buy or lease property abroad.',
          'To the extent the law allows, we are not liable for losses caused by developers, partners or third parties, or for information that changes after you read it.'] },
        { heading: 'Changes and law', paragraphs: ['We may update these terms and will show the date of the latest version. The governing law and courts will be stated here once the operating entity is registered.', contact] },
      ],
    },
    {
      id: 'privacy', title: 'Privacy policy', updated: LEGAL_UPDATED,
      sections: [
        { heading: 'Who is responsible', paragraphs: [`${e.company}, ${e.address}, is the controller of your personal data. Contact: ${e.email}.`] },
        { heading: 'What we collect', paragraphs: [
          'Contact details you send us: name, email address and, if you give it, phone number.',
          'Messages you send us about properties and services.',
          'Technical data kept on your device: theme, language, saved properties, and a copy of the listings.'] },
        { heading: 'Why we use it', paragraphs: [
          'To answer your enquiries, handle service requests, and keep the service secure.',
          'Our legal bases are the contract with you, our legitimate interest in running and protecting the service, and your consent where we ask for it.'] },
        { heading: 'Who receives it', paragraphs: [
          'The developer or partner you deal with receives the details they need to serve you, such as your name, contact details and what you asked for.',
          'We use providers to run the service: an email or form provider and website hosting. They process data on our behalf.',
          'If you allow it, maps, 360 tours and photos are loaded from other providers such as OpenStreetMap, Google Drive and cdnjs. They receive your IP address and device details when they serve that content.'] },
        { heading: 'How long we keep it', paragraphs: ['We keep enquiries for as long as needed to answer them and for legal and accounting duties.'] },
        { heading: 'Your rights', paragraphs: [
          'You can ask to see, correct, delete or export your data, and you can object to some uses. Write to us and we will reply within one month. You can also complain to your data protection authority.',
          'Where Thai law applies, you have comparable rights under the Personal Data Protection Act.'] },
        { heading: 'Transfers', paragraphs: ['Our providers may process data outside your country. We use providers that apply recognised safeguards for international transfers.', contact] },
      ],
    },
    {
      id: 'refunds', title: 'Refund policy', updated: LEGAL_UPDATED,
      sections: [
        { heading: 'Who handles refunds', paragraphs: ['Refunds, cancellations and contract terms are set and handled by the developers for properties and by our service partners for services. Reeltaz does not hold property funds. We help you reach the right party and follow up.'] },
        { heading: 'Property reservations', paragraphs: [
          'The reservation fee and the payment schedule are defined in the developer\'s agreement. The developers we list state that the reservation fee is non refundable, and that missed payments can lead to funds paid being forfeited after written notice. Read the agreement before you sign.',
          'Any exception, such as a refund when a unit is withdrawn or the sale does not proceed because of the developer, is decided by the developer under its agreement.'] },
        { heading: 'Services', paragraphs: [
          'You can cancel a service request for free until we confirm it.',
          'After confirmation, the partner\'s cancellation terms apply. We show them with your quote or confirmation. Where a refund is due, the partner or we will pay it to the original payment method.',
          'We aim to answer refund questions within 10 business days.'] },
        { heading: 'Problems', paragraphs: ['If something went wrong with a service, tell us within 14 days with your ticket code and we will work with the partner to fix it.', contact] },
      ],
    },
    {
      id: 'cookies', title: 'Cookies and storage', updated: LEGAL_UPDATED,
      sections: [
        { heading: 'What we store on your device', paragraphs: ['We use local storage that the service needs to work: your theme, language, saved properties, a copy of the listings and your choice on this page. We do not use advertising or tracking cookies and we do not run analytics that follow you.'] },
        { heading: 'Content from other providers', paragraphs: ['Maps (OpenStreetMap), 360 tours (cdnjs and the image host), and some photos (Google Drive and image hosts) are loaded from other providers and may set their own cookies. On the website we load maps and tours only after you allow it.'] },
        { heading: 'Your choice', paragraphs: ['Choose "Allow all" to show maps and tours, or "Essential only" to keep them blocked. You can change your choice at any time with "Cookie settings" at the bottom of the website, or by clearing the site data in your browser.', contact] },
      ],
    },
  ];
}
