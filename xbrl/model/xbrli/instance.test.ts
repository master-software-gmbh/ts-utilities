import { describe, it, expect, beforeEach } from 'bun:test';
import { FastXmlSerializer, type XmlSerializer } from '../../../xml';
import { XbrlInstance } from './instance';
import { XbrlContext } from './context';
import { XbrlEntity } from './entity';
import { XbrlIdentifier } from './identifier';
import { XbrlPeriod } from './period';
import { LinkSchemaRef } from './schema-ref';
import { XbrlUnit } from './unit';
import { XbrlMeasure } from './measure';
import { XbrlFact } from './fact';
import { XbrlConcept } from '../xbrl/concept';

describe('XbrlInstance', () => {
  const serializer: XmlSerializer = new FastXmlSerializer();
  let instance: XbrlInstance;

  beforeEach(() => {
    instance = new XbrlInstance();
  });

  it('should serialize an xbrl context', async () => {
    const identifier = new XbrlIdentifier('http://www.rzf-nrw.de/Steuernummer', '123456789')
    const entity = new XbrlEntity(identifier);
    const period = new XbrlPeriod('2024-01-02');
    const context = new XbrlContext('instant', entity, period);
  
    instance.addContext(context);

    const xmlElement = instance.toXML();
    const xmlString = await serializer.serialize(xmlElement);

    const expected = `
      <?xml version="1.0" encoding="utf-8"?>
      <xbrli:xbrl xmlns:de-gaap-ci="http://www.xbrl.de/taxonomies/de-gaap-ci-2024-04-01" xmlns:de-gcd="http://www.xbrl.de/taxonomies/de-gcd-2024-04-01" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:iso4217="http://www.xbrl.org/2003/iso4217" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xbrldi="http://xbrl.org/2006/xbrldi">
        <xbrli:context id="instant">
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.rzf-nrw.de/Steuernummer">123456789</xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:instant>2024-01-02</xbrli:instant>
          </xbrli:period>
        </xbrli:context>
      </xbrli:xbrl>
    `;

    expect(xmlString.data).toEqualIgnoringWhitespace(expected)
  });

  it('should serialize an xbrl schema ref', async () => {
    const schemaRef = new LinkSchemaRef('http://www.xbrl.de/taxonomies/de-gcd-2023-04-01/de-gcd-2023-04-01-shell.xsd');
  
    instance.addSchemaRef(schemaRef);

    const xmlElement = instance.toXML();
    const xmlString = await serializer.serialize(xmlElement);

    const expected = `
      <?xml version="1.0" encoding="utf-8"?>
      <xbrli:xbrl xmlns:de-gaap-ci="http://www.xbrl.de/taxonomies/de-gaap-ci-2024-04-01" xmlns:de-gcd="http://www.xbrl.de/taxonomies/de-gcd-2024-04-01" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:iso4217="http://www.xbrl.org/2003/iso4217" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xbrldi="http://xbrl.org/2006/xbrldi">
        <link:schemaRef xlink:type="simple" xlink:href="http://www.xbrl.de/taxonomies/de-gcd-2023-04-01/de-gcd-2023-04-01-shell.xsd" />
      </xbrli:xbrl>
    `;

    expect(xmlString.data).toEqualIgnoringWhitespace(expected)
  });

  it('should serialize an xbrl unit', async () => {
    const unit = new XbrlUnit('EUR', [
      XbrlMeasure.EUR,
    ]);

    instance.addUnit(unit);

    const xmlElement = instance.toXML();
    const xmlString = await serializer.serialize(xmlElement);

    const expected = `
      <?xml version="1.0" encoding="utf-8"?>
      <xbrli:xbrl xmlns:de-gaap-ci="http://www.xbrl.de/taxonomies/de-gaap-ci-2024-04-01" xmlns:de-gcd="http://www.xbrl.de/taxonomies/de-gcd-2024-04-01" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:iso4217="http://www.xbrl.org/2003/iso4217" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xbrldi="http://xbrl.org/2006/xbrldi">
        <xbrli:unit id="EUR">
          <xbrli:measure>iso4217:EUR</xbrli:measure>
        </xbrli:unit>
      </xbrli:xbrl>
    `;

    expect(xmlString.data).toEqualIgnoringWhitespace(expected)
  });

  it('should serialize an xbrl fact', async () => {
    const identifier = new XbrlIdentifier('http://www.rzf-nrw.de/Steuernummer', '123456789')
    const entity = new XbrlEntity(identifier);
    const period = new XbrlPeriod('2024-01-02');
    const context = new XbrlContext('instant', entity, period);
  
    instance.addContext(context);

    const unit = new XbrlUnit('EUR', [
      XbrlMeasure.EUR,
    ]);

    instance.addUnit(unit);

    const concept = new XbrlConcept('de-gaap-ci_bs.eqLiab.equity', 'bs.eqLiab.equity', 'http://www.xbrl.de/taxonomies/de-gaap-ci-2024-04-01');
    const fact = new XbrlFact(false, ['7000.00'], concept, context, unit, 2);

    instance.addFact(fact);

    const xmlElement = instance.toXML();
    const xmlString = await serializer.serialize(xmlElement);

    const expected = `
      <?xml version="1.0" encoding="utf-8"?>
      <xbrli:xbrl xmlns:de-gaap-ci="http://www.xbrl.de/taxonomies/de-gaap-ci-2024-04-01" xmlns:de-gcd="http://www.xbrl.de/taxonomies/de-gcd-2024-04-01" xmlns:link="http://www.xbrl.org/2003/linkbase" xmlns:xbrli="http://www.xbrl.org/2003/instance" xmlns:iso4217="http://www.xbrl.org/2003/iso4217" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xbrldi="http://xbrl.org/2006/xbrldi">
        <xbrli:context id="instant">
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.rzf-nrw.de/Steuernummer">123456789</xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:instant>2024-01-02</xbrli:instant>
          </xbrli:period>
        </xbrli:context>
        <xbrli:unit id="EUR">
          <xbrli:measure>iso4217:EUR</xbrli:measure>
        </xbrli:unit>
        <de-gaap-ci:bs.eqLiab.equity unitRef="EUR" contextRef="instant" decimals="2">7000.00</de-gaap-ci:bs.eqLiab.equity>
      </xbrli:xbrl>
    `;

    expect(xmlString.data).toEqualIgnoringWhitespace(expected)
  });
})