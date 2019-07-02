const { calculation } = require("@monorepo/common");
const { add } = calculation;

describe("dummy test", () => {
  it("will pass", () => {
    expect(add(1, 1)).toEqual("2");
  });
});
