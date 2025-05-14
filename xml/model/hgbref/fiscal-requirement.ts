import { XsString } from '../xs/string';

export type Children = [
  'Mussfeld' | 'Mussfeld, Kontennachweis erwünscht' | 'Rechnerisch notwendig, soweit vorhanden' | 'Summenmussfeld',
];

export class HgbrefFiscalRequirement extends XsString<Children> {
  static readonly Mussfeld = 'Mussfeld';
  static readonly MussfeldKontennachweisErwuenscht = 'Mussfeld, Kontennachweis erwünscht';
  static readonly RechnerischNotwendigSoweitVorhanden = 'Rechnerisch notwendig, soweit vorhanden';
  static readonly Summenmussfeld = 'Summenmussfeld';

  get isRequired(): boolean {
    return [
      HgbrefFiscalRequirement.Mussfeld,
      HgbrefFiscalRequirement.Summenmussfeld,
      HgbrefFiscalRequirement.MussfeldKontennachweisErwuenscht,
    ].includes(this.value);
  }
}
