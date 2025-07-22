import { XmlNamespace } from "../../xml";

export const XmlNamespaces = {
  ElsterAnhaenge: new XmlNamespace('http://finkonsens.de/elster/anhaenge/simple/v3'),
  ElsterBilanz: new XmlNamespace('http://rzf.fin-nrw.de/RMS/EBilanz/2016/XMLSchema'),
  ElsterFseKapg: new XmlNamespace('http://finkonsens.de/elster/elsterfse/kapg/v202301'),
  ElsterGewst2024: new XmlNamespace('http://finkonsens.de/elster/elstererklaerung/gewst/e20/v2024'),
  ElsterKst2024: new XmlNamespace('http://finkonsens.de/elster/elstererklaerung/kst/e30/v2024'),
  ElsterSchema: new XmlNamespace('http://www.elster.de/elsterxml/schema/v11'),
  ElsterUstva2025: new XmlNamespace('http://finkonsens.de/elster/elsteranmeldung/ustva/v2025'),
  ElsterUst2024: new XmlNamespace('http://finkonsens.de/elster/elstererklaerung/ust/e50/v2024'),
} as const;