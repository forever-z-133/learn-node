import {
  getCodeName,
  convertCodeName,
} from '../utils/mine.mjs';

describe('utils/mine.mjs', () => {
  test('getCodeName', () => {
    expect(getCodeName()).toBe('');
    expect(getCodeName('magnet:?xt=urn:btih:1FCA463D025EEF66ABCBA7DE7A43EBF499524607')).toBe('');
    expect(getCodeName('magnet:?xt=urn:btih:C9783513AB69C537F8C76064987B0C2EFBCF3A06&dn=CADV-353_B.wmv')).toBe('CADV-353');
    expect(getCodeName('magnet:?xt=urn:btih:B63E2876ADB3869E7EB07EE9DF7CC5E08421A81B&dn=LAFBD-40-BD')).toBe('LAFBD-40');
    expect(getCodeName('magnet:?xt=urn:btih:68EB6035250CBD2E58CFD274C8184E96C3E19070&dn=ANJD-012')).toBe('ANJD-012');
    expect(getCodeName('magnet:?xt=urn:btih:F000FEF048CFEE0CB0D41A852EFFCF744EB63D4D&dn=av.pbd-164_4')).toBe('pbd-164');
    expect(getCodeName('magnet:?xt=urn:btih:246AB39801F1DAB9A85F8F7D1CC2FC1997793458&dn=and-178未来Mirai')).toBe('and-178');
    expect(getCodeName('magnet:?xt=urn:btih:2024E07B474C9C4917573625E4CC71C604B7DB5B&dn=1Pondo-030415_038-HD')).toBe('030415_038');
    expect(getCodeName('magnet:?xt=urn:btih:E571BABAABF8BC19BD2A9B0FB7F1CE2A296785C0&dn=Caribbean-043015-001-HD')).toBe('043015-001');
    expect(getCodeName('magnet:?xt=urn:btih:CD74BA0FE0622270BC61EE6E265BDAFF98F4FEAC&www.fulisoso.net-Carib-032916-127-FHD')).toBe('032916-127');
    expect(getCodeName('magnet:?xt=urn:btih:87b51cb32c531037bed880fc2db31230b531d26c&dn=MGMJ-014-720p')).toBe('MGMJ-014');
    expect(getCodeName('ed2k://|file|CWP-07.avi|929685640|AD7B484D231F8D91A5130CD333618474|/')).toBe('CWP-07');
  });

  test('convertCodeName', () => {
    expect(convertCodeName()).toBe('');
    expect(convertCodeName('snisadd432un')).toBe('SNIS-432');
    expect(convertCodeName('SCOP-219A')).toBe('SCOP-219A');
    expect(convertCodeName('043015-001_1')).toBe('043015-001A');
    expect(convertCodeName('CWP-07')).toBe('CWP-007');
    expect(convertCodeName('x188')).toBe('x188');
    expect(convertCodeName('HEYZO-0016')).toBe('HEYZO-0016');
    expect(convertCodeName('MKBD-S03')).toBe('MKBD-S03');
    expect(convertCodeName('FC2-1174921A')).toBe('FC2-1174921A');
  });
});
