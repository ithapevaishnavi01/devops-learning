# KIND Kubernetes Cluster Setup

## Step 1: Create EC2 Instance

First, I created an **EC2 instance with a high configuration** to provide sufficient CPU and memory for running Docker, KIND, and Kubernetes.

The EC2 instance is used as the environment where we install the required tools and create the Kubernetes cluster.

---

## Step 2: Install Docker, KIND and kubectl

After creating the EC2 instance, the next step is to install the required tools:

* **Docker** – Used as the container runtime for KIND.
* **KIND (Kubernetes IN Docker)** – Used to create and run a Kubernetes cluster using Docker containers.
* **kubectl** – Used to communicate with and manage the Kubernetes cluster.

To install these tools, I created a shell script named **`installation.sh`**.

### Installation Script

The script contains the commands required to install Docker, KIND, and kubectl.

👉 [View installation.sh](installation.sh)

Make the script executable:

```bash
chmod +x installation.sh
```

Run the installation script:

```bash
./installation.sh
```

After installation, verify the tools:

```bash
docker --version
kind --version
kubectl version --client
```

---

## Step 3: Create KIND Cluster Configuration

After installing **Docker, KIND, and kubectl**, the next step is to create the configuration file for the KIND Kubernetes cluster.

I created a folder named **`kind-cluster`** and inside it, created a file named **`config.yml`**.

### Project Structure

```text
.
├── installation.sh
├── kind-cluster/
│   └── config.yml
└── README.md
```

👉 [View config.yml](kind-cluster/config.yml)

### Cluster Configuration

The `config.yml` file defines the structure of the KIND Kubernetes cluster.

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: tws-cluster

nodes:
- role: control-plane
  image: kindest/node:v1.35.0
  extraPortMappings:
    - containerPort: 30080
      hostPort: 8080
      protocol: TCP

- role: worker
  image: kindest/node:v1.35.0

- role: worker
  image: kindest/node:v1.35.0
```

### Configuration Explanation

| Configuration                 | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `kind: Cluster`               | Defines a KIND Kubernetes cluster               |
| `apiVersion`                  | Specifies the KIND configuration API version    |
| `name: tws-cluster`           | Name of the Kubernetes cluster                  |
| `role: control-plane`         | Creates the control-plane node                  |
| `role: worker`                | Creates worker nodes                            |
| `image: kindest/node:v1.35.0` | Kubernetes node image used for all nodes        |
| `containerPort: 30080`        | Port exposed from the KIND node                 |
| `hostPort: 8080`              | Maps the node port to port 8080 on the EC2 host |
| `protocol: TCP`               | Specifies TCP protocol for the port mapping     |

### Cluster Structure

This configuration creates:

* **1 Control Plane node**
* **2 Worker nodes**
* **Kubernetes version:** `v1.35.0`
* **Port mapping:** `30080 → 8080`

```text
                 TWS KIND CLUSTER
                       │
              ┌────────┴────────┐
              │                 │
        Control Plane       Worker Nodes
              │              ┌──────┴──────┐
              │              │             │
        Port Mapping       Worker 1      Worker 2
        30080 → 8080
```

The `extraPortMappings` configuration allows traffic from **port 8080 on the EC2 host** to reach **port 30080 inside the KIND control-plane node**.
