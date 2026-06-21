import {
  calculateCo2,
  getEmissionFactor,
  getFactorsByCategory,
} from '@/lib/emission-factors';

describe('emission factor helpers', () => {
  it('finds factors by id and category', () => {
    expect(getEmissionFactor('car_petrol')).toMatchObject({
      label: 'Car (Petrol)',
      category: 'transport',
      co2eKgPerUnit: 0.171,
    });

    const dietFactors = getFactorsByCategory('diet');

    expect(dietFactors).toHaveLength(9);
    expect(dietFactors.every((factor) => factor.category === 'diet')).toBe(true);
  });

  it('calculates emissions to three decimal places', () => {
    expect(calculateCo2('car_petrol', 12.345)).toBe(2.111);
    expect(calculateCo2('unknown_factor', 10)).toBe(0);
  });
});
