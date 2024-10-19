import { inject, injectable } from "tsyringe";
import pdf from "pdf-parse";
import fs from "fs";
import { deleteFile } from "../../../utils/file";
import { uploadFile } from "../../../utils/upload-file";
import { IInvoicesRepository } from "../../repositories/IInvoicesRepository";
import { ICustomersRepository } from "../../repositories/ICustomersRepository";
import { parse } from "date-fns";
import path from "path";
@injectable()
class CreateInvoicesUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository,
    @inject("CustomersRepository")
    private customersRepository: ICustomersRepository
  ) {}

  async execute(invoice: Express.Multer.File): Promise<void> {
    if (invoice) {
      const { url, path } = await uploadFile({
        file: invoice,
      });

      const dataBuffer = fs.readFileSync(path);

      const { text } = await pdf(dataBuffer);
      const sections = text.split(" ");
      const sectionsTrimmed = text
        .split(" ")
        .filter((section) => section.trim());
      const textObj = { text: text };
      const filesForExtraction = [
        { name: "./invoice-text.json", data: textObj },
        { name: "./inovice-sections.json", data: sections },
        {
          name: "./inovice-sections-trimmed.json",
          data: sectionsTrimmed,
        },
      ];
      filesForExtraction.forEach(({ name, data }) => {
        fs.writeFileSync(name, JSON.stringify(data).toString());
      });
      const damageCompensations = this.getDamageCompensations(sectionsTrimmed);
      const paymentRefund = this.getPaymentRefund(sectionsTrimmed);
      const yellowFlagCost = this.getYellowFlagCost(sectionsTrimmed);
      const totalCost = this.getTotalCost(sectionsTrimmed);
      const compensatedGDEnergy = this.getCompensatedEnergyGD(sectionsTrimmed);
      const publicIluminationCost =
        this.getPublicIluminationCost(sectionsTrimmed);
      const sceeWithoutICMSEnergy =
        this.getSCEEWithoutICMSEnergy(sectionsTrimmed);
      const energyConsumption = this.getEnergyConsumption(sectionsTrimmed);

      const invoiceDueDate = this.getInvoiceDueDate(sectionsTrimmed);
      const { barCode, barCodeLastElement } = this.getInvoiceBarCodeNumber(
        sectionsTrimmed,
        invoiceDueDate
      );
      const invoiceReferenceDate =
        this.getInvoiceReferenceDate(sectionsTrimmed);
      const { previousReading, currentReading, nextReading, readingDays } =
        this.getInvoiceReadingDates(sectionsTrimmed);
      console.log({
        publicIluminationCost,
        damageCompensations,
        compensatedGDEnergy,
        sceeWithoutICMSEnergy,
        energyConsumption,
        totalCost,
        invoiceDueDate,
        barCode,
        invoiceReferenceDate,
        previousReading,
        currentReading,
        nextReading,
        readingDays,
        paymentRefund,
        yellowFlagCost,
      });
      const { customerName, customerNameLastIndex } = this.getCustomerName(
        sections,
        barCodeLastElement
      );
      const customerCpfOrCnpj = this.getCustomerCpfOrCnpj(sections);
      const customerAddres = this.getCustomerAddress(
        sections,
        customerNameLastIndex
      );
      const customerNumber = this.getCustomerNumber(sectionsTrimmed);
      const customerInstalationNumber =
        this.getCustomerInstalationNumber(sectionsTrimmed);

      let customer = await this.customersRepository.find({
        cpf_cnpj: customerCpfOrCnpj,
        installation_number: customerInstalationNumber,
        customer_number: customerNumber,
      });

      if (!customer) {
        customer = await this.customersRepository.store({
          address: customerAddres,
          cpf_cnpj: customerCpfOrCnpj,
          customer_number: customerNumber,
          installation_number: customerInstalationNumber,
          name: customerName,
        });
      }

      let currentInvoice = await this.invoicesRepository.find({
        bar_code_number: barCode,
      });
      const currentInvoiceYear = new Date(invoiceDueDate).getFullYear();
      const { nextYear, previousYear } = this.getAdjustedYear(
        currentReading,
        currentInvoiceYear
      );
      if (!currentInvoice) {
        currentInvoice = await this.invoicesRepository.store({
          bar_code_number: barCode,
          current_reading: parse(
            `${currentReading}/${currentInvoiceYear}`,
            "dd/MM/yyyy",
            new Date()
          ),
          next_reading: parse(
            `${nextReading}/${nextYear}`,
            "dd/MM/yyyy",
            new Date()
          ),
          previous_reading: parse(
            `${previousReading}/${previousYear}`,
            "dd/MM/yyyy",
            new Date()
          ),
          due_date: parse(invoiceDueDate, "dd/MM/yyyy", new Date()),
          reading_days: readingDays,
          reference: invoiceReferenceDate,
          total_amount: totalCost,
          url,
          customer_id: customer.id,
        });
      }
      await deleteFile(path);
      //  this.deleteFiles(filesForExtraction);
    }
  }

  private getAdjustedYear(
    readingDate: string,
    currentYear: number
  ): { nextYear: number; previousYear: number } {
    const [day, month] = readingDate.split("/").map(Number);

    let nextYear = currentYear;
    let previousYear = currentYear;

    if (month === 12) {
      nextYear = currentYear + 1;
    } else if (month === 1) {
      previousYear = currentYear - 1;
    }

    return { nextYear, previousYear };
  }
  getPublicIluminationCost(sections: Array<string>): number {
    const publicIluminationReferenceChunkIndex = sections.findIndex(
      (section) => section === "Municipal"
    );
    console.log;
    return Number(
      sections[publicIluminationReferenceChunkIndex + 1]
        .split("\n")[0]
        .replace(",", ".")
    );
  }

  getEnergyConsumption(sections: Array<string>): {
    quantity: number;
    cost: number;
  } {
    const quantity = Number(
      sections[sections.findIndex((section) => section === "ElétricakWh") + 1]
    );
    const cost = Number(
      sections[
        sections.findIndex((section) => section === "ElétricakWh") + 3
      ].replace(",", ".")
    );
    return { quantity, cost };
  }
  getSCEEWithoutICMSEnergy(sections: Array<string>): {
    quantity: number;
    cost: number;
  } {
    const quantity = Number(
      sections[
        sections.findIndex((section) => section === "ICMSkWh") + 1
      ].replace(".", "")
    );
    const cost = Number(
      sections[sections.findIndex((section) => section === "ICMSkWh") + 3]
        .replace(",", ".")
        .replace(".", "")
    );

    return { quantity, cost };
  }
  getCompensatedEnergyGD(sections: Array<string>): {
    quantity: number;
    cost: number;
  } {
    const gdReferenceChunkIndex = sections.findIndex(
      (section, index) => section === "IkWh" && sections[index - 1] === "GD"
    );
    const quantity = Number(
      sections[gdReferenceChunkIndex + 1].replace(".", "")
    );
    const cost = Number(
      sections[gdReferenceChunkIndex + 3].replace(",", ".").replace(".", "")
    );

    return { quantity, cost };
  }
  getDamageCompensations(sections: Array<string>): number {
    const damageCompensationsChunkIndex = sections.findIndex((section, index) =>
      section.includes("Danos")
    );

    const cost = Number(
      sections[damageCompensationsChunkIndex + 1]
        .replace(",", ".")
        .replace("\nTOTAL", "")
    );

    return cost;
  }
  getPaymentRefund(sections: Array<string>): number {
    const damageCompensationsChunkIndex = sections.findIndex(
      (section, index) =>
        section.includes("Restituição") &&
        sections[index + 1].includes("de") &&
        sections[index + 2].includes("Pagamento")
    );

    const cost = Number(
      sections[damageCompensationsChunkIndex + 3]
        .replace(",", ".")
        .replace("\nTOTAL", "")
    );

    return cost;
  }
  getYellowFlagCost(sections: Array<string>): number {
    const yellowFlagCostChunkIndex = sections.findIndex((section, index) =>
      section.includes("Bandeira")
    );
    for (let i = yellowFlagCostChunkIndex + 1; i < sections.length; i++) {
      if (!isNaN(Number(sections[i].charAt(0)))) {
        const cost = Number(
          sections[i].replace(",", ".").replace("\nHistórico", "")
        );
        return cost;
      }
    }
  }
  getTotalCost(sections: Array<string>): number {
    const totalCostReferenceChunkIndex = sections.findIndex((section) =>
      section.includes("\nTOTAL")
    );

    if (totalCostReferenceChunkIndex > 1) {
      return Number(
        sections[totalCostReferenceChunkIndex + 1]
          .replace("\nHistórico", "")
          .replace(",", ".")
      );
    }
  }

  getInvoiceDueDate(sections: Array<string>): string {
    const dueDateReferenceChunkIndex = sections.findIndex(
      (section) =>
        section.includes("R$") &&
        !isNaN(Number(section.split("R$")[1].charAt(0)))
    );
    const [dueDateChunk] = sections[dueDateReferenceChunkIndex].split("R$");

    return dueDateChunk.substring(
      dueDateChunk.length - 10,
      dueDateChunk.length
    );
  }

  getCustomerName(
    sections: Array<string>,
    barCodeLastElement: string
  ): {
    customerName: string;
    customerNameLastIndex: number;
  } {
    let customerName = "";
    let customerNameReferenteIndex = 0;
    const automaticReferenceIndex = sections.findIndex((section) =>
      section.includes("AUTOMÁTICO\n")
    );

    if (automaticReferenceIndex > 1) {
      customerNameReferenteIndex = automaticReferenceIndex;
    } else {
      customerNameReferenteIndex = sections.findIndex((section) =>
        section.includes(`${barCodeLastElement}\n`)
      );
    }
    customerName = sections[customerNameReferenteIndex].split("\n")[1];

    let customerNameLastIndex: number;

    for (let i = customerNameReferenteIndex + 1; i < sections.length; i++) {
      if (sections[i].includes("\n")) {
        customerName += " " + sections[i].split("\n")[0];
        customerNameLastIndex = i;
        break;
      }
      customerName += " " + sections[i];
    }
    return { customerName, customerNameLastIndex };
  }
  getCustomerCpfOrCnpj(sections: Array<string>): string {
    const cpfCnpjReference = sections.findIndex(
      (section) => section.includes("\nCNPJ") || section.includes("\nCPF")
    );
    return sections[cpfCnpjReference + 1]
      .replace("\n", "")
      .replace("INSCRIÇÃO", "");
  }
  getCustomerAddress(
    sections: Array<string>,
    customerNameLastIndex: number
  ): string {
    let address: string = "";

    address = sections[customerNameLastIndex].split("\n")[1];

    for (let i = customerNameLastIndex + 1; i < sections.length; i++) {
      if (sections[i].includes("\nCNPJ")) {
        address += " " + sections[i].split("\n")[0];
        break;
      }
      address += " " + sections[i];
    }

    return address.replace(/\n/g, " ");
  }

  getCustomerNumber(sections: Array<string>): string {
    const customerNumberReferenteIndex = sections.findIndex((section) =>
      section.includes("INSTALAÇÃO\n")
    );
    return sections[customerNumberReferenteIndex + 1];
  }
  getCustomerInstalationNumber(sections: Array<string>): string {
    const customerNumberReferenteIndex = sections.findIndex((section) =>
      section.includes("INSTALAÇÃO\n")
    );
    return sections[customerNumberReferenteIndex + 2];
  }

  getInvoiceBarCodeNumber(
    sections: Array<string>,
    dueDate: string
  ): { barCode: string; barCodeLastElement: string } {
    const barCodeReferenceChunkIndex = sections.findIndex((section) =>
      section.includes(`${dueDate}R$`)
    );
    let barCode: string = "";
    let barCodeLastElement = "";
    if (barCodeReferenceChunkIndex > 1) {
      const barCodeInitialChunk = sections[barCodeReferenceChunkIndex];
      barCode = barCodeInitialChunk.substring(
        barCodeInitialChunk.length - 13,
        barCodeInitialChunk.length
      );
    }
    for (let i = barCodeReferenceChunkIndex + 1; i < sections.length; i++) {
      if (sections[i].includes("\n")) {
        barCode += " " + sections[i].split("\n")[0];
        barCodeLastElement = sections[i].split("\n")[0];
        break;
      }
      barCode += " " + sections[i];
    }
    return { barCode, barCodeLastElement };
  }
  getInvoiceReferenceDate(sections: Array<string>) {
    const referenceDateNearChunkIndex = sections.findIndex(
      (section, index) =>
        section.includes("(R$)\n") &&
        sections[index - 1].includes("pagar") &&
        sections[index - 2].includes("a") &&
        sections[index - 3].includes("Valor")
    );
    return sections[referenceDateNearChunkIndex + 1];
  }
  getInvoiceReadingDates(sections: Array<string>): {
    previousReading: string;
    currentReading: string;
    nextReading: string;
    readingDays: number;
  } {
    const threePhaseReferenceDateNearChunkIndex = sections.findIndex(
      (section, index) =>
        section.includes("atividades") &&
        sections[index - 1].includes("outras") &&
        sections[index - 2].includes("e") &&
        sections[index - 3].includes("Trifásico")
    );
    const biPhasicReferenceDateNearChunkIndex = sections.findIndex((section) =>
      section.includes("Bifásico")
    );

    if (threePhaseReferenceDateNearChunkIndex > 1) {
      const readingsChunk = sections[
        threePhaseReferenceDateNearChunkIndex
      ].replace("atividades", "");

      const readingsMidIndex = Math.floor(readingsChunk.length / 2);
      const previousReading = readingsChunk.slice(0, readingsMidIndex);
      const currentReading = readingsChunk.slice(readingsMidIndex);

      const nextReadingChunk =
        sections[threePhaseReferenceDateNearChunkIndex + 1];

      const readingDays = Number(nextReadingChunk.substring(0, 2));

      const nextReading = nextReadingChunk
        .replace("\nInformações", "")
        .replace(String(readingDays), "");

      return { previousReading, currentReading, readingDays, nextReading };
    }
    if (biPhasicReferenceDateNearChunkIndex) {
      const readingsChunk = sections[
        biPhasicReferenceDateNearChunkIndex
      ].replace("diasPróxima\nBifásico", "");

      const readingsMidIndex = Math.floor(readingsChunk.length / 2);
      const previousReading = readingsChunk.slice(0, readingsMidIndex);
      const currentReading = readingsChunk.slice(readingsMidIndex);

      const nextReadingChunk =
        sections[biPhasicReferenceDateNearChunkIndex + 1];

      const readingDays = Number(nextReadingChunk.substring(0, 2));

      const nextReading = nextReadingChunk
        .replace("\nInformações", "")
        .replace(String(readingDays), "");

      return { previousReading, currentReading, readingDays, nextReading };
    }
  }
  deleteFiles(filesArray: Array<{ name; data }>) {
    filesArray.forEach(({ name }) => {
      try {
        fs.unlinkSync(name);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export { CreateInvoicesUseCase };
