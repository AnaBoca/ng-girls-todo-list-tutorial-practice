export const searchInputFixture = 'de';

export function getUniqueTitleNameFixture() {
  return new Date().getTime().toString() + Math.floor(Math.random() * 1000000);
}

export const todoListFixture = [
  getUniqueTitleNameFixture(),
  getUniqueTitleNameFixture(),
  getUniqueTitleNameFixture(),
  getUniqueTitleNameFixture(),
  getUniqueTitleNameFixture(),
];
