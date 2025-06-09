export class ReportElement {
  id: string;
  roleURI: string;

  static readonly GuV = new ReportElement(
    'de-gcd_genInfo.report.id.reportElement.reportElements.GuV',
    'http://www.xbrl.de/taxonomies/de-gaap-ci/role/incomeStatement',
  );

  static readonly Bilanz = new ReportElement(
    'de-gcd_genInfo.report.id.reportElement.reportElements.B',
    'http://www.xbrl.de/taxonomies/de-gaap-ci/role/balanceSheet',
  );

  static readonly Ergebnisverwendung = new ReportElement(
    'de-gcd_genInfo.report.id.reportElement.reportElements.EV',
    'http://www.xbrl.de/taxonomies/de-gaap-ci/role/appropriationProfits',
  );

  static readonly Betriebsvermoegensvergleich = new ReportElement(
    'de-gcd_genInfo.report.id.reportElement.reportElements.BVV',
    'http://www.xbrl.de/taxonomies/de-gaap-ci/role/transfersTaxAssets',
  );

  constructor(id: string, roleURI: string) {
    this.id = id;
    this.roleURI = roleURI;
  }
}
