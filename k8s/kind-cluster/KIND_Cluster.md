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

## Step 4: Create the KIND Kubernetes Cluster

After creating the `config.yml` file, I used the KIND command to create the Kubernetes cluster based on the configuration.

First, navigate to the `kind-cluster` directory:

```bash
cd kind-cluster
```

Verify the configuration file:

```bash
ls
```

Output:

```text
config.yml
```

Then create the KIND cluster:

```bash
kind create cluster --config config.yml
```

KIND reads the `config.yml` file and creates the Kubernetes cluster with:

* 1 Control Plane node
* 2 Worker nodes
* Kubernetes version `v1.35.0`
* Port mapping `30080 → 8080`

After successful creation, KIND displays a message confirming that the cluster has been created.

---

## Step 5: Verify the Kubernetes Cluster

After creating the cluster, I verified whether the Kubernetes nodes were running correctly using `kubectl`.

Run:

```bash
kubectl get nodes
```

Expected output:

```text
NAME                    STATUS   ROLES           AGE   VERSION
tws-cluster-control-plane   Ready    control-plane   ...   v1.35.0
tws-cluster-worker          Ready    <none>          ...   v1.35.0
tws-cluster-worker2         Ready    <none>          ...   v1.35.0
```

### Understanding the Output

* **NAME** – Name of the Kubernetes node
* **STATUS** – Current status of the node
* **ROLES** – Role of the node
* **AGE** – How long the node has been running
* **VERSION** – Kubernetes version running on the node

The `Ready` status confirms that the nodes are available and can run workloads.

---

## Step 6: Check All Kubernetes Pods

To check the Pods running across all Kubernetes namespaces:

```bash
kubectl get pods -A
```

Here, `-A` means **all namespaces**.

Kubernetes automatically creates several system Pods required for the cluster to function.

For example:

```text
NAMESPACE     NAME                         READY   STATUS
kube-system   coredns-xxxxx               1/1     Running
kube-system   kube-proxy-xxxxx            1/1     Running
kube-system   kindnet-xxxxx               1/1     Running
```

The `Running` status indicates that the Pods are working correctly.

---

## Step 7: Check Cluster Information

To verify the Kubernetes control-plane endpoint and cluster services:

```bash
kubectl cluster-info
```

This command displays information about the Kubernetes control plane and other cluster services.

---

## Step 8: Understand the KIND Cluster Architecture

The created KIND cluster has one Control Plane and two Worker Nodes.

```text
                    KIND Kubernetes Cluster
                             │
                  ┌──────────┴──────────┐
                  │                     │
           Control Plane 🧠         Worker Nodes ⚙️
                  │                 ┌──────┴──────┐
                  │                 │             │
             API Server          Worker 1      Worker 2
             Scheduler              │             │
             Controller             ↓             ↓
             Manager              Pods          Pods
             etcd
```

### Control Plane

The Control Plane manages the Kubernetes cluster.

Its major components include:

* **API Server** – Provides the communication interface for Kubernetes.
* **Scheduler** – Decides which Worker Node should run a new Pod.
* **Controller Manager** – Maintains the desired state of the cluster.
* **etcd** – Stores Kubernetes cluster information and configuration.

### Worker Nodes

Worker Nodes are responsible for running application workloads.

Important components include:

* **Kubelet** – Manages Pods on the Worker Node.
* **Kube-proxy** – Handles Kubernetes networking.
* **Container Runtime** – Runs containers.
* **Pods** – Run the application containers.

---

## Step 9: Understand kubectl

`kubectl` is the command-line tool used to communicate with and manage the Kubernetes cluster.

For example:

### Check Nodes

```bash
kubectl get nodes
```

### Check Pods

```bash
kubectl get pods
```

### Check Pods in All Namespaces

```bash
kubectl get pods -A
```

### Get Cluster Information

```bash
kubectl cluster-info
```

### Get Detailed Node Information

```bash
kubectl describe node <node-name>
```

The basic communication flow is:

```text
User
  │
  │ kubectl command
  ↓
API Server
  ↓
Control Plane
  ↓
Worker Node
  ↓
Pod
  ↓
Container
  ↓
Application
```

---

## Step 10: Verify the Complete Setup

The complete setup can be verified using the following commands:

```bash
docker ps
```

Check the KIND containers.

```bash
kind get clusters
```

Check the KIND clusters.

```bash
kubectl get nodes
```

Check Kubernetes nodes.

```bash
kubectl get pods -A
```

Check Kubernetes system Pods.

```bash
kubectl cluster-info
```

Check Kubernetes cluster information.

If all nodes show `Ready` and the required system Pods show `Running`, the KIND Kubernetes cluster has been successfully created and is ready for deploying applications.

---

## Complete Workflow

```text
EC2 Instance
     ↓
Install Docker
     ↓
Install KIND
     ↓
Install kubectl
     ↓
Create config.yml
     ↓
kind create cluster --config config.yml
     ↓
KIND Cluster
     ↓
1 Control Plane + 2 Worker Nodes
     ↓
kubectl get nodes
     ↓
Verify Pods
     ↓
Deploy Application
     ↓
Expose Application
     ↓
Access Application
```
