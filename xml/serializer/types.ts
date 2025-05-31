import { XmlNamespaces } from '../model/namespaces';

export type NamespaceMap = Record<string, string>;
export type XmlObject = { [key: string]: string | XmlObject | XmlObject[] };

export const DefaultNamespacePrefixes: Record<string, string> = {
  [XmlNamespaces.XbrlLinkbase]: 'link',
  [XmlNamespaces.XbrlInstance]: 'xbrli',
  [XmlNamespaces.XmlSchema]: 'xsd',
  [XmlNamespaces.XbrlDeGaapCi]: 'de-gaap-ci',
  [XmlNamespaces.XbrlDeGcd]: 'de-gcd',
  [XmlNamespaces.XmlSchemaInstance]: 'xsi',
  [XmlNamespaces.XmlLinking]: 'xlink',
  'http://www.elster.de/elsterxml/schema/v11': 'elster',
  'http://rzf.fin-nrw.de/RMS/EBilanz/2016/XMLSchema': 'ebilanz',
  'http://finkonsens.de/elster/elsteranmeldung/ustva/v2025': 'ustva',
  'http://finkonsens.de/elster/elstererklaerung/ust/e50/v2024': 'ust',
  'http://finkonsens.de/elster/elstererklaerung/gewst/e20/v2024': 'gewst',
  'http://finkonsens.de/elster/elstererklaerung/kst/e30/v2024': 'kst',
};
