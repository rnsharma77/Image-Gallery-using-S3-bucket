# 🖼️ Image Gallery using AWS S3 Bucket

## 📌 Overview

This project is a lightweight and responsive **Image Gallery web application** built using **HTML5, CSS3, and vanilla JavaScript**. It allows users to browse and view images stored in an **Amazon S3 bucket** through a clean and user-friendly interface.

The application focuses on simplicity, performance, and seamless integration with cloud storage, making it ideal for showcasing image collections without requiring a complex backend.

---

## 🚀 Features

* 📷 Display images directly from AWS S3
* ⚡ Fast and lightweight (no frameworks used)
* 📱 Fully responsive design (works on mobile, tablet, desktop)
* 🔄 Dynamic image loading using JavaScript
* 🎨 Clean and modern UI

---

## 🛠️ Technologies Used

* **HTML5** – Structure of the application
* **CSS3** – Styling and responsive layout
* **JavaScript (Vanilla JS)** – Logic for fetching and displaying images
* **AWS S3** – Cloud storage for hosting images

---

## 📂 Project Structure

```
Image-Gallery-using-S3-bucket/
│
├── image/          # Local fallback/sample images
├── index.html      # Main entry point
├── style.css       # Styling and layout
├── script.js       # Core functionality
└── README.md       # Project documentation
```

---

## ⚙️ Setup and Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rnsharma77/Image-Gallery-using-S3-bucket.git
```

### 2️⃣ Navigate to Project Directory

```bash
cd Image-Gallery-using-S3-bucket
```

### 3️⃣ Configure AWS S3

* Ensure your **S3 bucket** has proper **CORS configuration**
* Update the following in `script.js`:

  * Bucket URL
  * Region (if required)
  * Object paths

⚠️ **Important:**
Never commit AWS **access keys** or sensitive credentials to a public repository.

---

### 4️⃣ Run the Application

Simply open:

```
index.html
```

in any modern web browser.

> Note: A local server may be required if you face CORS issues or use advanced JavaScript modules.

---

## 🔐 Security Best Practices

* Do not expose AWS credentials in frontend code
* Use **public-read access carefully** for S3 objects
* Prefer **pre-signed URLs** for secure access in production

---

## 📈 Future Improvements

* 🔍 Search and filter functionality
* 🧾 Pagination or lazy loading
* 🔐 Secure API-based access instead of direct bucket URLs
* ❤️ Like/download feature

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## 📧 Contact

**Rudra Narayan Sharma**
📩 [rudranarayansharma896@gmail.com](mailto:rudranarayansharma896@gmail.com)
🔗 GitHub: https://github.com/rnsharma77

---

## ⭐ If you like this project

Give it a ⭐ on GitHub to support the work!
