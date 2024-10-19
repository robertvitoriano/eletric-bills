import { inject, injectable } from "tsyringe";
import pdf from "pdf-parse";
import fs from "fs";
import { deleteFile } from "../../utils/file";
import { uploadFile } from "../../utils/upload-file";
import { IInvoicesRepository } from "../repositories/IInvoicesRepository";
import { ICustomersRepository } from "../repositories/ICustomersRepository";
import { Customer } from "../entities/Customer";
@injectable()
class CreateInvoicesUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository,
    @inject("CustomersRepository")
    private customersRepository: ICustomersRepository
  ) {}

  async execute(invoice: Express.Multer.File): Promise<void> {
    let invoiceUrl = "";
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

      const energyConsumption = this.getEnergyConsumption(sectionsTrimmed);
      const sceeWithoutICMSEnergy =
        this.getSCEEWithoutICMSEnergy(sectionsTrimmed);
      const compensatedGDEnergy = this.getCompensatedEnergyGD(sectionsTrimmed);
      const publicIluminationCost =
        this.getPublicIluminationCost(sectionsTrimmed);
      const totalCost = this.getTotalCost(sectionsTrimmed);
      const invoiceDueDate = this.getInvoiceDueDate(sectionsTrimmed);
      const barCodeNumber = this.getInvoiceBarCodeNumber(
        sectionsTrimmed,
        invoiceDueDate
      );
      const invoiceReferenceDate =
        this.getInvoiceReferenceDate(sectionsTrimmed);
      console.log({
        publicIluminationCost,
        compensatedGDEnergy,
        sceeWithoutICMSEnergy,
        energyConsumption,
        totalCost,
        invoiceDueDate,
        barCodeNumber,
        invoiceReferenceDate,
      });
      const { customerName, customerNameLastIndex } =
        this.getCustomerName(sections);
      const customerCpfOrCnpj = this.getCustomerCpfOrCnpj(sections);
      const customerAddres = this.getCustomerAddress(
        sections,
        customerNameLastIndex
      );
      const customerNumber = this.getCustomerNumber(sectionsTrimmed);
      const customerInstalationNumber =
        this.getCustomerInstalationNumber(sectionsTrimmed);

      const customer = await this.customersRepository.find({
        cpf_cnpj: customerCpfOrCnpj,
        installation_number: customerInstalationNumber,
        customer_number: customerNumber,
      });

      let storedCustomer: Customer;
      if (!customer) {
        storedCustomer = await this.customersRepository.store({
          address: customerAddres,
          cpf_cnpj: customerCpfOrCnpj,
          customer_number: customerNumber,
          installation_number: customerInstalationNumber,
          name: customerName,
        });
      }

      await deleteFile(path);
      //this.deleteFiles(filesForExtraction);
    }
  }

  getPublicIluminationCost(sections: Array<string>): number {
    const publicIluminationReferenceChunkIndex = sections.findIndex(
      (section, index) =>
        section === "Municipal" && sections[index - 1] === "Publica"
    );

    return Number(
      sections[publicIluminationReferenceChunkIndex + 1]
        .replace("\nTOTAL", "")
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
      sections[
        sections.findIndex((section) => section === "ICMSkWh") + 3
      ].replace(",", ".")
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
    const cost = Number(sections[gdReferenceChunkIndex + 3].replace(",", "."));

    return { quantity, cost };
  }
  getTotalCost(sections: Array<string>): number {
    const publicIluminationReferenceChunkIndex = sections.findIndex(
      (section, index) =>
        section.includes("\nTOTAL") && sections[index - 1] === "Municipal"
    );
    if (publicIluminationReferenceChunkIndex > 1) {
      return Number(
        sections[publicIluminationReferenceChunkIndex + 1]
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

  getCustomerName(sections: Array<string>): {
    customerName: string;
    customerNameLastIndex: number;
  } {
    let customerName = "";
    const customerNameReferenteIndex = sections.findIndex((section) =>
      section.includes("AUTOMÁTICO\n")
    );
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
    return sections[cpfCnpjReference + 1].replace("\n", "");
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

  getInvoiceBarCodeNumber(sections: Array<string>, dueDate: string): string {
    const barCodeReferenceChunkIndex = sections.findIndex((section) =>
      section.includes(`${dueDate}R$`)
    );
    let barCode: string = "";
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
        break;
      }
      barCode += " " + sections[i];
    }
    return barCode;
  }
  getInvoiceReferenceDate(sections: Array<string>) {
    const referenceDateNearChunkIndex = sections.findIndex(
      (section, index) =>
        section.includes("(R$)\n") &&
        sections[index - 1].includes("pagar") &&
        sections[index - 2].includes("a") &&
        sections[index - 3].includes("a")
    );
    return sections[referenceDateNearChunkIndex + 1];
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
