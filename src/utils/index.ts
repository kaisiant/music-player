import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(args));
};

export const isDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const convertImageArrayToDataURI = (
  imageArray: number[],
  mimeType: string,
) => {
  try {
    const uint8Array = new Uint8Array(imageArray);
    const binaryString = uint8Array.reduce((accumulator, byte) => {
      return accumulator + String.fromCharCode(byte);
    }, "");

    const base64String = btoa(binaryString);
    const dataURI = `data:${mimeType};base64,${base64String}`;

    return dataURI;
  } catch (error) {
    console.error("Error converting image array to data URI:", error);
    return null;
  }
};

export const convertFilePathToFileObject = async (
  filePath: string,
  fileName: string,
) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    if (!response.headers.get("content-type"))
      throw new Error("Error content type");
    const file = new File([arrayBuffer], fileName, {
      type: response.headers.get("content-type")!,
    });
    return file;
  } catch (error) {
    console.error("Error converting file path to File object:", error);
    return null;
  }
};
