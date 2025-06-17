# Print Obat Chrome Extension

## Overview

**Print Obat** is a Chrome extension designed to print patient identity labels and medication information onto sticker labels. This functionality is based on registrations within the j-care system.

(In Indonesian: Cetak label identitas pasien dan obat untuk diprint di stiker etiket identitas berdasarkan registrasi j-care)

## Configuration

This extension requires manual configuration for the Target j-care URL and the Nama Puskesmas (Clinic Name). These settings are accessible via the extension's popup or by right-clicking the extension icon and choosing "Options".

*   **Target j-care URL**: The base URL for the j-care system where the extension will activate (e.g., `http://your-jcare-server/j-care/`). This field is mandatory.
*   **Nama Puskesmas (Clinic Name)**: The name of the clinic/Puskesmas to be printed on the labels (e.g., `PKM Jayengan`). This will be used as the default name on labels.

## How it Works

The extension automatically activates when you navigate to pages matching the configured "Target j-care URL". It is designed to work on paths under this URL, typically involving `/visits/`.

Once active on a compatible page, the extension enhances the interface by adding print icons (drug_16x16.png) next to relevant items, such as medication entries in a table.

## Usage

1.  Click on the extension icon to open the popup, or right-click the icon and select "Options". Configure your "Target j-care URL" and "Nama Puskesmas". Save the settings. The Target URL is required for the extension to function.
2.  Navigate to the j-care system, specifically a page under the configured "Target j-care URL".
3.  Ensure the patient data or medication list is visible on the j-care page.
4.  The extension will automatically add print icons next to printable items.
5.  Click the print icon next to the item you wish to generate a label for.
6.  This will trigger the generation of a PDF label, likely displayed in a new iframe or tab, ready for printing.

## Prerequisites

- Configuration of the "Target j-care URL" in the extension's options page. The "Nama Puskesmas" should also be set.
- Access to your j-care system at the configured "Target j-care URL".
- The extension is primarily designed to work on pages under the configured "Target j-care URL" (typically paths like `/visits/`). Functionality on other pages is not guaranteed.

## Technologies Used

*   jQuery
*   Libraries for barcode generation (`bardcode.min.js`) and PDF creation (`jsLabel2PDF.js`).

---
_README updated to reflect simplified configuration._
