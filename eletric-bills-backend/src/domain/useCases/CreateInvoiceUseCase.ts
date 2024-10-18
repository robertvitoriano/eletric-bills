import { inject, injectable } from "tsyringe";
import pdf from "pdf-parse";
import fs from "fs";
import { deleteFile } from "../../utils/file";
import { uploadFile } from "../../utils/upload-file";
import { IInvoicesRepository } from "../infra/repositories/IInvoiceRepository";
@injectable()
class CreateInvoicesUseCase {
  constructor(
    @inject("InvoicesRepository")
    private invoicesRepository: IInvoicesRepository
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
      const { customerName, customerNameLastIndex } =
        this.getCustomerName(sections);
      const customerCpfOrCnpj = this.getCustomerCpfOrCnpj(sections);
      const customerAddres = this.getCustomerAddress(
        sections,
        customerNameLastIndex
      );

      console.log({
        energyConsumption,
        sceeWithoutICMSEnergy,
        compensatedGDEnergy,
        publicIluminationCost,
        totalCost,
        customerName,
        customerCpfOrCnpj,
        customerAddres,
      });
      await deleteFile(path);
      this.deleteFiles(filesForExtraction);
    }

    console.log(invoiceUrl);
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
