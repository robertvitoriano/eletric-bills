import { EletricityInvoiceParser } from "../EletricityInvoiceParserService";
import * as path from "path";

describe("EletricityInvoiceParser", () => {
  it("should extract data correctly from a valid invoice", async () => {
    const invoiceParser = new EletricityInvoiceParser();
    const pdfPath = path.resolve(__dirname, "./standard-3001422762-02-2024.pdf");
    const extractedData = await invoiceParser.extractData(pdfPath);

    expect(extractedData.invoiceParameters.energyConsumption).toEqual({
      quantity: 100,
      cost: 96.12,
    });

    expect(extractedData.invoiceParameters.sceeWithoutICMSEnergy).toEqual({
      quantity: 1940,
      cost: 994.96,
    });

    expect(extractedData.invoiceParameters.publicIluminationCost).toBe(40.45);
    expect(extractedData.invoiceParameters.totalCost).toBe(186.11);
  });
});
