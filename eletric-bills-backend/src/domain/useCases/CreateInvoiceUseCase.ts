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
      const sections = text.split(" ").filter((section) => section.trim());
      fs.writeFileSync("./sections.json", JSON.stringify(sections).toString());
      const energyConsumption = this.getEnergyConsumption(sections);
      const sceeWithoutICMSEnergy = this.getSCEEWithoutICMSEnergy(sections);
      const compensatedGDEnergy = this.getCompensatedEnergyGD(sections);
      const publicIluminationCost = this.getPublicIluminationCost(sections);
      const totalCost = this.getTotalCost(sections);
      console.log({
        energyConsumption,
        sceeWithoutICMSEnergy,
        compensatedGDEnergy,
        publicIluminationCost,
        totalCost,
      });
      await deleteFile(path);
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
}

export { CreateInvoicesUseCase };
