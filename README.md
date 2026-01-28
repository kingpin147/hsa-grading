# HSA Grading & Trading Card System

A comprehensive Wix-based platform for professional trading card grading, search, and submission management.

## 🚀 Project Overview

This system provides an end-to-end workflow for a trading card grading business. It allows graders to log detailed assessments, users to search for their card's official grade, and customers to submit new cards for grading through a secure payment portal.

## 🛠️ Key Features

### 1. Card Grading Form (`grading.js`)
- **Automated ID Generation**: Generates sequential tracking IDs starting from a baseline (e.g., `000340`).
- **Detailed Assessment**: Captures specific "front" and "back" grading criteria using repeaters.
- **Image Integration**: Direct photo upload support for card scans.
- **CMS Storage**: Saves all grading data into the `CardGrades` collection for persistent storage.

### 2. Public Search Portal (`findMyCard.js`)
- **Instant Lookup**: Users can enter their card's unique ID to retrieve full grading results.
- **Rich Display**: Shows high-res scans, final grades, grader notes, and the full breakdown of front/back scores.
- **Robust Verification**: Validates card IDs and provides clear feedback if a card is not found.

### 3. Submission & Checkout System (`submission.js`)
- **Dynamic Cart**: Allows customers to add multiple products/cards to a single submission.
- **Real-time Totals**: Automatically calculates subtotal, taxes, and shipping fees.
- **State-Based Tax Logic**: Includes a comprehensive tax table for all 50 US states and international flat rates.
- **Secure Payments**: Integration with Wix Pay for processing transactions safely.

### 4. Backend Architecture
- **`payment.jsw`**: Securely handles sensitive math (tax/shipping) on the server to prevent frontend tampering.
- **`products.jsw`**: Automatically generates storage products or physical items in the Wix ecosystem upon payment.

## 📂 File Structure

| File | Type | Responsibility |
| :--- | :--- | :--- |
| `grading.js` | Frontend | Grader-facing form for evaluation and data entry. |
| `findMyCard.js` | Frontend | Customer-facing search page for grade verification. |
| `submission.js` | Frontend | Order intake and checkout process. |
| `payment.jsw` | Backend | Secure calculation of taxes and Wix Pay initialization. |
| `products.jsw` | Backend | Store product generation and media management. |

## ⚙️ Setup & Requirements

- **Platform**: Wix / Velo (Corvid).
- **Database**: A CMS collection named `CardGrades` with fields for `input1Value`, `scanPhoto`, `finalGrade`, `frontGrades` (object), `backGrades` (object), etc.
- **Modules**: Requires `wix-data`, `wix-pay`, `wix-pay-backend`, and `wix-stores-backend`.

## 📝 Design Standards

- **Error Handling**: Standardized generic error text for users with detailed technical logging for developers.
- **Testing**: Integrated `console.log` traces for every major state change (Uploads, Queries, Validation, Submission).
- **UX**: Visual feedback on all buttons (disabling during processing) and automated form resets after success.
