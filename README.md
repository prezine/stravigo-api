# Stravigo API

Backend API for Stravigo website - A strategic creative agency platform.

## Features

- **Content Management**: Full CRUD for case studies, insights, services, and testimonials
- **Admin Panel**: Role-based admin system (super_admin, editor, content_contributor)
- **Lead Management**: Capture and manage leads from website forms
- **File Upload**: Image and document upload with Supabase Storage
- **Email Notifications**: Automated email responses for leads and applications
- **Authentication**: JWT-based authentication system

## Tech Stack

- Node.js & Express.js
- Supabase (PostgreSQL & Storage)
- JWT for authentication
- Nodemailer for emails
- Multer for file uploads

## Prerequisites

- Node.js >= 16.0.0
- Supabase account
- SMTP email service

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stravigo-api