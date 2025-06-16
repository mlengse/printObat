# Print Obat Chrome Extension

## Overview

**Print Obat** is a Chrome extension designed to print patient identity labels and medication information onto sticker labels. This functionality is based on registrations within the j-care system.

(In Indonesian: Cetak label identitas pasien dan obat untuk diprint di stiker etiket identitas berdasarkan registrasi j-care)

## Login & Configuration

This extension now requires users to log in using their Google account for authentication. After logging in, users can configure specific settings for the extension:

*   **Target j-care URL**: The base URL for the j-care system where the extension will activate (e.g., `http://your-jcare-server/j-care/`).
*   **Nama Puskesmas (Clinic Name)**: The name of the clinic/Puskesmas to be printed on the labels (e.g., `PKM Jayengan`).

These settings are accessible via the extension's popup or the options page.

## How it Works

The extension automatically activates when you are logged in and navigate to pages matching the configured "Target j-care URL" (specifically paths under its `/visits/` subfolder if the pattern from the original code is maintained, or the base URL itself).

Once active on a compatible page, the extension enhances the interface by adding print icons (drug_16x16.png) next to relevant items, such as medication entries in a table.

## Usage

1.  Click on the extension icon to open the popup. If not logged in, click "Login with Google" and complete the authentication process.
2.  If it's your first time or you need to change settings, click "Open Settings" in the popup. Configure your "Target j-care URL" and "Nama Puskesmas" and save the settings.
3.  Navigate to the j-care system, specifically a page under the configured "Target j-care URL".
4.  Ensure you are logged in to the j-care system and the patient data or medication list is visible.
5.  The extension will automatically add print icons next to printable items.
6.  Click the print icon next to the item you wish to generate a label for.
7.  This will trigger the generation of a PDF label, likely displayed in a new iframe or tab, ready for printing.

## Prerequisites

- Login to the extension using your Google Account via the extension popup or options page.
- Access to your j-care system at the configured "Target j-care URL".
- The extension is primarily designed to work on pages under the configured "Target j-care URL" (typically paths like `/visits/`). Functionality on other pages is not guaranteed.

## Technologies Used

*   jQuery
*   Libraries for barcode generation (`bardcode.min.js`) and PDF creation (`jsLabel2PDF.js`).

## For Developers (Setting up from Source)

If you are setting up this extension from the source code, you will need to create your own Google OAuth 2.0 Client ID:

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to "APIs & Services" > "Credentials".
4.  Create an "OAuth 2.0 Client ID".
    *   Select "Chrome App" as the application type.
    *   Enter your extension's ID. To get a stable extension ID during development:
        *   Load the extension unpacked in Chrome.
        *   Go to `chrome://extensions`, find your extension, and note the ID.
        *   Copy this ID into the `key` field in your `manifest.json` file (you might need to generate a private key if you use the `key` field for the first time, but for OAuth Client ID configuration, providing the ID itself in the Google Console is the main part).
        *   Alternatively, for a more robust setup, you can generate a public key and add it to the `key` field in `manifest.json`. The extension ID will then be derived from this key.
5.  The authorized redirect URI will be something like: `https://<YOUR_EXTENSION_ID>.chromiumapp.org/` (replace `<YOUR_EXTENSION_ID>` with your actual extension ID).
6.  Once you have the Client ID, replace the placeholder value in the `oauth2.client_id` field in the `manifest.json` file.

---
_This README was generated based on the extension's manifest and code._
