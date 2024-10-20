import fs from "fs";
import pdf from "pdf-parse";
import { CustomerInfo, InvoiceParameters } from "./types";

export class EletricityInvoiceParser {
  private sections: Array<string>;
  private sectionsTrimmed: Array<string>;
  private barCodeLastElement: string;

  async extractData(path: string): Promise<{
    invoiceParameters: InvoiceParameters;
    customerInfo: CustomerInfo;
  }> {
    const dataBuffer = fs.readFileSync(path);

    const { text } = await pdf(dataBuffer);
    this.sections = text.split(" ");
    this.sectionsTrimmed = text.split(" ").filter((section) => section.trim());

    const invoiceParameters = this.getInvoiceParameters();
    const customerInfo = this.getCustomerInfo();
    return { invoiceParameters, customerInfo };
  }

  private getInvoiceParameters() {
    const damageCompensations = this.getDamageCompensations();
    const paymentRefund = this.getPaymentRefund();
    const yellowFlagCost = this.getYellowFlagCost();
    const compensatedGDEnergy = this.getCompensatedEnergyGD();
    const publicIluminationCost = this.getPublicIluminationCost();
    const sceeWithoutICMSEnergy = this.getSCEEWithoutICMSEnergy();
    const energyConsumption = this.getEnergyConsumption();
    const invoiceDueDate = this.getInvoiceDueDate();
    const { barCode, barCodeLastElement } = this.getInvoiceBarCodeNumber(invoiceDueDate);
    this.barCodeLastElement = barCodeLastElement;
    const totalCost = this.getTotalCost();
    const invoiceReferenceDate = this.getInvoiceReferenceDate();
    const { previousReading, currentReading, nextReading, readingDays } = this.getInvoiceReadingDates();

    return {
      compensatedGDEnergy,
      publicIluminationCost,
      sceeWithoutICMSEnergy,
      energyConsumption,
      invoiceDueDate,
      barCode,
      totalCost,
      invoiceReferenceDate,
      previousReading,
      currentReading,
      nextReading,
      readingDays,
      damageCompensations,
      paymentRefund,
      yellowFlagCost,
    };
  }
  private getCustomerInfo() {
    const { customerName, customerNameLastIndex } = this.getCustomerName();
    const customerCpfOrCnpj = this.getCustomerCpfOrCnpj();
    const customerAddres = this.getCustomerAddress(customerNameLastIndex);
    const customerNumber = this.getCustomerNumber();
    const customerInstalationNumber = this.getCustomerInstalationNumber();
    return {
      customerName,
      customerCpfOrCnpj,
      customerAddres,
      customerNumber,
      customerInstalationNumber,
    };
  }
  private getPublicIluminationCost(): number {
    const publicIluminationReferenceChunkIndex = this.sectionsTrimmed.findIndex((section) => section === "Municipal");
    return Number(this.sectionsTrimmed[publicIluminationReferenceChunkIndex + 1].split("\n")[0].replace(",", "."));
  }

  private getEnergyConsumption(): {
    quantity: number;
    cost: number;
  } {
    const quantity = Number(
      this.sectionsTrimmed[this.sectionsTrimmed.findIndex((section) => section === "ElétricakWh") + 1]
    );
    const cost = Number(
      this.sectionsTrimmed[this.sectionsTrimmed.findIndex((section) => section === "ElétricakWh") + 3].replace(",", ".")
    );
    return { quantity, cost };
  }
  private getSCEEWithoutICMSEnergy(): {
    quantity: number;
    cost: number;
  } {
    const quantity = Number(
      this.sectionsTrimmed[this.sectionsTrimmed.findIndex((section) => section === "ICMSkWh") + 1].replace(".", "")
    );
    const cost = Number(
      this.sectionsTrimmed[this.sectionsTrimmed.findIndex((section) => section === "ICMSkWh") + 3].replace(",", ".")
    );

    return { quantity, cost };
  }
  private getCompensatedEnergyGD(): {
    quantity: number;
    cost: number;
  } {
    const gdReferenceChunkIndex = this.sectionsTrimmed.findIndex(
      (section, index) => section === "IkWh" && this.sectionsTrimmed[index - 1] === "GD"
    );
    const quantity = Number(this.sectionsTrimmed[gdReferenceChunkIndex + 1].replace(".", ""));
    const cost = Number(this.sectionsTrimmed[gdReferenceChunkIndex + 3].replace(",", "."));
    return { quantity, cost };
  }
  private getDamageCompensations(): number {
    const damageCompensationsChunkIndex = this.sectionsTrimmed.findIndex((section) => section.includes("Danos"));

    const cost = Number(
      this.sectionsTrimmed[damageCompensationsChunkIndex + 1].replace(",", ".").replace("\nTOTAL", "")
    );

    return cost;
  }
  private getPaymentRefund(): number {
    const damageCompensationsChunkIndex = this.sectionsTrimmed.findIndex(
      (section, index) =>
        section.includes("Restituição") &&
        this.sectionsTrimmed[index + 1].includes("de") &&
        this.sectionsTrimmed[index + 2].includes("Pagamento")
    );

    const cost = Number(
      this.sectionsTrimmed[damageCompensationsChunkIndex + 3].replace(",", ".").replace("\nTOTAL", "")
    );

    return cost;
  }
  private getYellowFlagCost(): number {
    const yellowFlagCostChunkIndex = this.sectionsTrimmed.findIndex((section, index) => section.includes("Bandeira"));
    for (let i = yellowFlagCostChunkIndex + 1; i < this.sectionsTrimmed.length; i++) {
      if (!isNaN(Number(this.sectionsTrimmed[i].charAt(0)))) {
        const cost = Number(this.sectionsTrimmed[i].replace(",", ".").replace("\nHistórico", ""));
        return cost;
      }
    }
  }
  private getTotalCost(): number {
    const totalCostReferenceChunkIndex = this.sectionsTrimmed.findIndex((section) => section.includes("\nTOTAL"));

    if (totalCostReferenceChunkIndex > 1) {
      return Number(
        this.sectionsTrimmed[totalCostReferenceChunkIndex + 1].replace("\nHistórico", "").replace(",", ".")
      );
    }
  }

  private getInvoiceDueDate(): string {
    const dueDateReferenceChunkIndex = this.sectionsTrimmed.findIndex(
      (section) => section.includes("R$") && !isNaN(Number(section.split("R$")[1].charAt(0)))
    );
    const [dueDateChunk] = this.sectionsTrimmed[dueDateReferenceChunkIndex].split("R$");

    return dueDateChunk.substring(dueDateChunk.length - 10, dueDateChunk.length);
  }

  private getCustomerName(): {
    customerName: string;
    customerNameLastIndex: number;
  } {
    let customerName = "";
    let customerNameReferenteIndex = 0;
    const automaticReferenceIndex = this.sections.findIndex((section) => section.includes("AUTOMÁTICO\n"));

    if (automaticReferenceIndex > 1) {
      customerNameReferenteIndex = automaticReferenceIndex;
    } else {
      customerNameReferenteIndex = this.sections.findIndex((section) =>
        section.includes(`${this.barCodeLastElement}\n`)
      );
    }
    customerName = this.sections[customerNameReferenteIndex].split("\n")[1];

    let customerNameLastIndex: number;

    for (let i = customerNameReferenteIndex + 1; i < this.sections.length; i++) {
      if (this.sections[i].includes("\n")) {
        customerName += " " + this.sections[i].split("\n")[0];
        customerNameLastIndex = i;
        break;
      }
      customerName += " " + this.sections[i];
    }
    return { customerName, customerNameLastIndex };
  }
  private getCustomerCpfOrCnpj(): string {
    const cpfCnpjReference = this.sections.findIndex(
      (section) => section.includes("\nCNPJ") || section.includes("\nCPF")
    );
    return this.sections[cpfCnpjReference + 1].replace("\n", "").replace("INSCRIÇÃO", "");
  }
  private getCustomerAddress(customerNameLastIndex: number): string {
    let address: string = "";

    address = this.sections[customerNameLastIndex].split("\n")[1];

    for (let i = customerNameLastIndex + 1; i < this.sections.length; i++) {
      if (this.sections[i].includes("\nCNPJ")) {
        address += " " + this.sections[i].split("\n")[0];
        break;
      }
      address += " " + this.sections[i];
    }

    return address.replace(/\n/g, " ");
  }

  private getCustomerNumber(): string {
    const customerNumberReferenteIndex = this.sectionsTrimmed.findIndex((section) => section.includes("INSTALAÇÃO\n"));
    return this.sectionsTrimmed[customerNumberReferenteIndex + 1];
  }
  private getCustomerInstalationNumber(): string {
    const customerNumberReferenteIndex = this.sectionsTrimmed.findIndex((section) => section.includes("INSTALAÇÃO\n"));
    return this.sectionsTrimmed[customerNumberReferenteIndex + 2].replace("\n", "");
  }

  private getInvoiceBarCodeNumber(dueDate: string): {
    barCode: string;
    barCodeLastElement: string;
  } {
    const barCodeReferenceChunkIndex = this.sectionsTrimmed.findIndex((section) => section.includes(`${dueDate}R$`));
    let barCode: string = "";
    let barCodeLastElement = "";
    if (barCodeReferenceChunkIndex > 1) {
      const barCodeInitialChunk = this.sectionsTrimmed[barCodeReferenceChunkIndex];
      barCode = barCodeInitialChunk.substring(barCodeInitialChunk.length - 13, barCodeInitialChunk.length);
    }
    for (let i = barCodeReferenceChunkIndex + 1; i < this.sectionsTrimmed.length; i++) {
      if (this.sectionsTrimmed[i].includes("\n")) {
        barCode += " " + this.sectionsTrimmed[i].split("\n")[0];
        barCodeLastElement = this.sectionsTrimmed[i].split("\n")[0];
        break;
      }
      barCode += " " + this.sectionsTrimmed[i];
    }
    return { barCode, barCodeLastElement };
  }
  private getInvoiceReferenceDate() {
    const referenceDateNearChunkIndex = this.sectionsTrimmed.findIndex(
      (section, index) =>
        section.includes("(R$)\n") &&
        this.sectionsTrimmed[index - 1].includes("pagar") &&
        this.sectionsTrimmed[index - 2].includes("a") &&
        this.sectionsTrimmed[index - 3].includes("Valor")
    );
    return this.sectionsTrimmed[referenceDateNearChunkIndex + 1];
  }
  private getInvoiceReadingDates(): {
    previousReading: string;
    currentReading: string;
    nextReading: string;
    readingDays: number;
  } {
    const threePhaseReferenceDateNearChunkIndex = this.sectionsTrimmed.findIndex(
      (section, index) =>
        section.includes("atividades") &&
        this.sectionsTrimmed[index - 1].includes("outras") &&
        this.sectionsTrimmed[index - 2].includes("e") &&
        this.sectionsTrimmed[index - 3].includes("Trifásico")
    );
    const biPhasicReferenceDateNearChunkIndex = this.sectionsTrimmed.findIndex((section) =>
      section.includes("Bifásico")
    );

    if (threePhaseReferenceDateNearChunkIndex > 1) {
      const readingsChunk = this.sectionsTrimmed[threePhaseReferenceDateNearChunkIndex].replace("atividades", "");

      const readingsMidIndex = Math.floor(readingsChunk.length / 2);
      const previousReading = readingsChunk.slice(0, readingsMidIndex);
      const currentReading = readingsChunk.slice(readingsMidIndex);

      const nextReadingChunk = this.sectionsTrimmed[threePhaseReferenceDateNearChunkIndex + 1];

      const readingDays = Number(nextReadingChunk.substring(0, 2));

      const nextReading = nextReadingChunk.replace("\nInformações", "").replace(String(readingDays), "");

      return { previousReading, currentReading, readingDays, nextReading };
    }
    if (biPhasicReferenceDateNearChunkIndex) {
      const readingsChunk = this.sectionsTrimmed[biPhasicReferenceDateNearChunkIndex].replace(
        "diasPróxima\nBifásico",
        ""
      );

      const readingsMidIndex = Math.floor(readingsChunk.length / 2);
      const previousReading = readingsChunk.slice(0, readingsMidIndex);
      const currentReading = readingsChunk.slice(readingsMidIndex);

      const nextReadingChunk = this.sectionsTrimmed[biPhasicReferenceDateNearChunkIndex + 1];

      const readingDays = Number(nextReadingChunk.substring(0, 2));

      const nextReading = nextReadingChunk.replace("\nInformações", "").replace(String(readingDays), "");

      return { previousReading, currentReading, readingDays, nextReading };
    }
  }
}
