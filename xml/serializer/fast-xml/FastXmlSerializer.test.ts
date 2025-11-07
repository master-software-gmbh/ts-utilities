import { describe, it, expect } from 'bun:test';
import { XmlElement } from '../../model/xml/element';
import { FastXmlSerializer, XmlAttribute, XmlNamespace, type XmlSerializer } from '../..';

describe('FastXmlSerializer', () => {
  const serializer: XmlSerializer = new FastXmlSerializer();

  it('should serialize an xml element', async () => {
    const datenabholungNamespace = new XmlNamespace('http://finkonsens.de/elster/elsterdatenabholung/v3');

    const root = new XmlElement('DatenTeil', undefined, [], [
      new XmlElement('Nutzdatenblock', undefined, [], [
        new XmlElement('NutzdatenHeader', undefined, [
          new XmlAttribute('version', '11'),
        ], [
          new XmlElement('NutzdatenTicket', undefined, [], [
            '1',
          ]),
          new XmlElement('Empfaenger', undefined, [
            new XmlAttribute('id', 'L'),
          ], [
            'CS',
          ]),
        ]),
        new XmlElement('Nutzdaten', undefined, [], [
          new XmlElement('Datenabholung', datenabholungNamespace, [
            new XmlAttribute('version', '31'),
          ], [
            new XmlElement('PostfachAnfrage', datenabholungNamespace, [
              new XmlAttribute('max', '10'),
            ], [
              new XmlElement('DatenartBereitstellung', datenabholungNamespace, [
                new XmlAttribute('name', 'AnhangRueckmeldung'),
              ], []),
              new XmlElement('DatenartBereitstellung', datenabholungNamespace, [
                new XmlAttribute('name', 'EBilanzRueckmeldung'),
              ], []),
              new XmlElement('DatenartBereitstellung', datenabholungNamespace, [
                new XmlAttribute('name', 'Gewerbesteuerbescheid'),
              ], []),
            ]),
          ]),
        ]),
      ]),
    ]);

    const result = await serializer.serialize(root);
    
    const expected = 
`<?xml version="1.0" encoding="utf-8"?>
<DatenTeil>
  <Nutzdatenblock>
    <NutzdatenHeader version="11">
      <NutzdatenTicket>1</NutzdatenTicket>
      <Empfaenger id="L">CS</Empfaenger>
    </NutzdatenHeader>
    <Nutzdaten>
      <datenabholung:Datenabholung xmlns:datenabholung="http://finkonsens.de/elster/elsterdatenabholung/v3" version="31">
        <datenabholung:PostfachAnfrage max="10">
          <datenabholung:DatenartBereitstellung name="AnhangRueckmeldung" />
          <datenabholung:DatenartBereitstellung name="EBilanzRueckmeldung" />
          <datenabholung:DatenartBereitstellung name="Gewerbesteuerbescheid" />
        </datenabholung:PostfachAnfrage>
      </datenabholung:Datenabholung>
    </Nutzdaten>
  </Nutzdatenblock>
</DatenTeil>
`;

    expect(result).toEqualIgnoringWhitespace(expected);
  })
})