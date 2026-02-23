# Deployment Guide

Welcome to the project! Follow these instructions to get your development environment up and running.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Step 1: Install IIS](#step-1-install-iis)
  - [Step 2: Download URL Rewrite Module](#step-2-download-url-rewrite-module)
  - [Step 3: Install .NET 8 Hosting Bundle](#step-3-install-net-8-hosting-bundle)
  - [Step 4: Install Redis](#step-4-install-redis)
  - [Step 5: Install Redis Manager](#step-5-install-redis-manager)
  - [Step 6: Install Seq](#step-6-install-seq)
  - [Step 7: Install RabbitMq](#step-7-install-rabbitmq)
  - [Step 8: Install Prometheus](#step-8-install-prometheus)
  - [Step 9: Install Grafana](#step-9-install-grafana)
  - [Step 10: Running the Application](#step-10-running-the-application)
  - [IIS Configuration](#iis-configuration)
  - [Folder Structure](#folder-structure)
  - [Reverse Proxy Configuration](#reverse-proxy-configuration)


## Record Video
[here](https://saudimicrotec.sharepoint.com/:v:/s/MeetingRoom/ETXcy7ANI_NPp6fep-aB8GMBMNQIi8SYZrFZyywqr0TD1g?e=q6hLFZ&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Visual Studio Code] or any other preferred code editor
- [Git]

## Setup Instructions

### Step 1: Install IIS

1. Open the **Control Panel** on your machine.
2. Navigate to **Programs** > **Programs and Features** > **Turn Windows features on or off**.
3. In the **Windows Features** dialog, check the box for **Internet Information Services (IIS)** and click **OK**.
4. Wait for the installation to complete. Once done, IIS will be installed and ready to use.

### Step 2: Download URL Rewrite Module

1. Download the URL Rewrite Module from [here].
2. Run the installer and follow the instructions to complete the installation.

### Step 3: Install .NET 8 Hosting Bundle

1. Download the .NET 8 Hosting Bundle from [here].
2. Run the installer and follow the on-screen instructions to complete the installation.
3. Restart your machine to ensure all changes take effect.

### Step 4: Install Redis

1. Download the Redis installer from [here].
2. Run the `.msi` file and follow the installation instructions.

### Step 5: Install Redis Manager

1. Download the Redis Manager installer from [here].
2. Run the `.exe` file and follow the installation instructions.

### Step 6: Install Seq

1. Download the Seq installer from [here].
2. Run the installer and follow the instructions to set it up.
3. During the setup, configure Seq to use port `1234`.

### Step 7: Install RabbitMq

1. Download the RabbitMq installer from [here].
2. Run the installer and follow the instructions to set it up.
3. During the setup, configure RabbitMq to use the default port `5672`.
4. Configure the username and password. The defaults are `guest` for both.
5. Install the Management Plugin for the interface from [here].
6. Open the RabbitMq command prompt and run this command: `rabbitmq-plugins enable rabbitmq_management`.
7. You can access the Management interface from [http://localhost:15672/].

### Step 8: Install Prometheus

1. Download Prometheus from [here].
2. Extract the downloaded `.zip` file to a directory of your choice.
3. Locate the `prometheus.yml` file in the extracted folder, and replace it with the `prometheus.yml` file provided in the solution items of this project.
4. Open the folder and run the `prometheus.exe` file.
5. You can access Prometheus on the default port, which is [http://localhost:9090].

### Step 9: Install Grafana

1. Download the Grafana installer from [here].
2. Run the `.msi` file and follow the installation instructions.
3. Once installed, Grafana will be accessible at [http://localhost:3000].
4. The default username is `admin`, and the default password is also `admin`. You may be prompted to change the password upon first login.
5. After logging in, go to the **Dashboards** section in Grafana, and click **+ New**.
6. Choose **Import** and load the JSON file named `GrafanaDashboard.json` from the solution items.
7. Ensure that Prometheus is configured as a data source in Grafana to populate the dashboard.

### Step 10: Running the Application

1. Ensure all services (Redis, Seq, RabbitMq, Prometheus, and Grafana) are running.
2. Open the project in your preferred code editor.
3. Run the application using the appropriate command for your environment (e.g., `dotnet run` or through Visual Studio).
4. Verify that the application is running and connected to all required services.

## IIS Configuration

### IIS Website Configuration

![IIS Website Configuration](https://files.slack.com/files-pri/T04L468FTDW-F08AH9WB9F0/image.png?is_viewed=1)

### Folder Structure

![Folder Structure](https://files.slack.com/files-pri/T04L468FTDW-F08AM5T3P4J/img-20250115-wa0006.jpg?is_viewed=1)

## Reverse Proxy Configuration

### How Reverse Proxy Works

A reverse proxy acts as an intermediary for requests from clients seeking resources from servers. It forwards client requests to the appropriate server and returns the server's response to the client. This can help distribute load, enhance security, and simplify client access.

#### Server Variables Used

- **HTTP_X_FORWARDED_FOR**: This server variable holds the same information as the X-Forwarded-For header, explicitly indicating the originating IP address of the client.

- **HTTP_X_FORWARDED_HOST**: This server variable contains the original host requested by the client, similar to the X-Forwarded-Host header, allowing the backend server to know the intended destination.

- **HTTP_X_FORWARDED_PROTO**: This server variable indicates the protocol used by the client (HTTP or HTTPS) for the original request, mirroring the functionality of the X-Forwarded-Proto header.

- **HTTP_HOST**: This server variable contains the original Host header sent by the client, which specifies the domain name of the server being requested. It is crucial for routing requests correctly to the appropriate server.

- **HTTP_X_ORIGINAL_ACCEPT_ENCODING**: This header is used to preserve the client's original `Accept-Encoding` header. It allows the backend server to respond with the appropriate encoding (like gzip or deflate) based on what the client can accept.

- **HTTP_ACCEPT_ENCODING**: This header specifies the content encodings that the client can process. The proxy can use this information to determine how to compress the response.

For detailed instructions on configuring IIS as a reverse proxy, refer to the guide: [IIS Acting as Reverse Proxy: Where the Problems Start](https://techcommunity.microsoft.com/t5/iis-support-blog/iis-acting-as-reverse-proxy-where-the-problems-start/ba-p/846259#:~:text=Outbound%20rewrite%20rules%20cannot%20be,response%20that%20is%20already%20compressed).

### Download Microsoft Application Request Routing 3.0

You can download Microsoft Application Request Routing 3.0 (x64) from the official Microsoft Download Center [here](https://www.microsoft.com/en-us/download/details.aspx?id=47333).