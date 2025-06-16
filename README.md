# Print Obat Chrome Extension

## Overview

**Print Obat** is a Chrome extension designed to print patient identity labels and medication information onto sticker labels. This functionality is based on registrations within the j-care system.

(In Indonesian: Cetak label identitas pasien dan obat untuk diprint di stiker etiket identitas berdasarkan registrasi j-care)

## How it Works

The extension automatically activates when you navigate to pages within the j-care system, specifically URLs under `http://192.168.100.178/j-care/visits/`.

Once active on a compatible page, the extension enhances the interface by adding print icons (drug_16x16.png) next to relevant items, such as medication entries in a table.

## Usage

1.  Navigate to the j-care system, specifically a page under the `http://192.168.100.178/j-care/visits/` path.
2.  Ensure you are logged in and the patient data or medication list is visible.
3.  The extension will automatically add print icons next to printable items.
4.  Click the print icon next to the item you wish to generate a label for.
5.  This will trigger the generation of a PDF label, likely displayed in a new iframe or tab, ready for printing.

## Prerequisites

*   Access to the j-care system at `http://192.168.100.178/`.
*   The extension is primarily designed to work on pages under the `http://192.168.100.178/j-care/visits/` path. Functionality on other pages is not guaranteed.

## Technologies Used

*   jQuery
*   Libraries for barcode generation (`bardcode.min.js`) and PDF creation (`jsLabel2PDF.js`).

---
_This README was generated based on the extension's manifest and code._
