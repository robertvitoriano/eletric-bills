import { EletricityInvoiceParser } from "./EletricityInvoiceParserService";

describe("EletricityInvoiceParser", () => {
  it("should extract data correctly from a valid PDF", async () => {
    const invoiceParser = new EletricityInvoiceParser();
    const extractedData = await invoiceParser.extractData("../../../utils/test-files/");

    expect(extractedData.invoiceParameters.energyConsumption).toEqual({
      quantity: 1000,
      cost: 1000.0,
    });

    expect(extractedData.invoiceParameters.sceeWithoutICMSEnergy).toEqual({
      quantity: 500,
      cost: 500.0,
    });

    expect(extractedData.invoiceParameters.publicIluminationCost).toBe(50);
    expect(extractedData.invoiceParameters.totalCost).toBe(1500.0);
  });
});
