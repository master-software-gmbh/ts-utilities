import type { BaseFactory } from '../../factory/base.ts';
import { HgbrefFiscalRequirementFactory } from '../../factory/hgbref/fiscal-requirement.ts';
import { HgbrefNotPermittedForFactory } from '../../factory/hgbref/not-permitted-for.ts';
import { HgbrefTradeAccountingNotPermittedForFactory } from '../../factory/hgbref/trade-accounting-not-permitted-for.ts';
import { HgbrefTypeOperatingResultFactory } from '../../factory/hgbref/type-operating-result.ts';
import { XsBooleanFactory } from '../../factory/xs/boolean.ts';
import { XsDateFactory } from '../../factory/xs/date.ts';
import type { HgbrefFiscalRequirement } from '../../model/hgbref/fiscal-requirement.ts';
import type { HgbrefFiscalValidSince } from '../../model/hgbref/fiscal-valid-since.ts';
import type { HgbrefFiscalValidThrough } from '../../model/hgbref/fiscal-valid-through.ts';
import type { HgbrefLegalFormEu } from '../../model/hgbref/legal-form-eu.ts';
import type { HgbrefLegalFormKSt } from '../../model/hgbref/legal-form-kst.ts';
import type { HgbrefLegalFormPg } from '../../model/hgbref/legal-form-pg.ts';
import type { HgbrefNotPermittedFor } from '../../model/hgbref/not-permitted-for.ts';
import type { HgbrefOnlyPermittedSobilErgbil } from '../../model/hgbref/only-permitted-sobil-ergbil.ts';
import type { HgbrefTradeAccountingNotPermittedFor } from '../../model/hgbref/trade-accounting-not-permitted-for.ts';
import type { HgbrefTypeOperatingResult } from '../../model/hgbref/type-operating-result.ts';
import type { HgbrefValidSince } from '../../model/hgbref/valid-since.ts';
import type { HgbrefValidThrough } from '../../model/hgbref/valid-through.ts';
import type { XmlElement } from '../../model/xml/element.ts';
import type { XmlMapperContext } from '../context.ts';
import type { XmlMapperPlugin } from '../interface.ts';

type MapperResult =
  | HgbrefLegalFormPg
  | HgbrefLegalFormKSt
  | HgbrefLegalFormEu
  | HgbrefValidSince
  | HgbrefValidThrough
  | HgbrefTypeOperatingResult
  | HgbrefFiscalRequirement
  | HgbrefFiscalValidSince
  | HgbrefFiscalValidThrough
  | HgbrefNotPermittedFor
  | HgbrefTradeAccountingNotPermittedFor
  | HgbrefOnlyPermittedSobilErgbil;

export class HgbrefMapperPlugin implements XmlMapperPlugin<MapperResult> {
  async map(element: XmlElement, context: XmlMapperContext): Promise<MapperResult | null> {
    if (element.namespace?.uri !== 'http://www.xbrl.de/taxonomies/de-ref-2010-02-19') {
      return null;
    }

    let factory: BaseFactory<MapperResult, unknown, unknown> | undefined;

    if (element.name === 'legalFormEU') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'legalFormKSt') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'legalFormPG') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'notPermittedFor') {
      factory = new HgbrefNotPermittedForFactory();
    } else if (element.name === 'typeOperatingResult') {
      factory = new HgbrefTypeOperatingResultFactory();
    } else if (element.name === 'fiscalRequirement') {
      factory = new HgbrefFiscalRequirementFactory();
    } else if (element.name === 'ValidSince') {
      factory = new XsDateFactory();
    } else if (element.name === 'ValidThrough') {
      factory = new XsDateFactory();
    } else if (element.name === 'fiscalValidSince') {
      factory = new XsDateFactory();
    } else if (element.name === 'fiscalValidThrough') {
      factory = new XsDateFactory();
    } else if (element.name === 'tradeAccountingNotPermittedFor') {
      factory = new HgbrefTradeAccountingNotPermittedForFactory();
    } else if (element.name === 'onlyPermittedForSoBil_ErgBil') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'relevanceDiFin') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'disabledCalcMinClassification') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'KHBV') {
      factory = new XsBooleanFactory();
    } else if (element.name === 'PBV') {
      factory = new XsBooleanFactory();
    }

    if (!factory) {
      return null;
    }

    const { data = null } = await factory.map(element, context);

    return data;
  }
}
