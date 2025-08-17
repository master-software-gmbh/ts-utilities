export const ElsterTestmerker = {
  /**
   * Testfall, der sofort nach dem Empfang im jeweiligen Rechenzentrum des Bundeslandes gelöscht wird. Es erfolgt keine weitere Verarbeitung. Dient zum Test der Leitungsverbindung.
   * Dieser Testmerker ist auch zu verwenden, um die Rückmeldung zu Anhängen mit dem Verfahren `ElsterDatenabholung` zu testen.
   */
  TestLeitungsverbindung: '700000001',
  /**
   * Testfall, der sofort nach Eingang in dem ELSTER-Annahmeserver gelöscht wird. Es erfolgt keine weitere Verarbeitung. Dient dem externen Softwarehersteller zum Testen der Datenübertragung.
   */
  TestDatenuebertragung: '700000004',
  /**
   * Testfall. Mit diesem Testmerker ist es möglich eine Server-Testantwort mit mehreren gefüllten Tags <ElsterInfo> zuerhalten. Der versandte Steuerfall wird in dem ELSTER-Annahmeserver direkt ausgesteuert.
   */
  TestElsterInfo: '010000001',
} as const;
