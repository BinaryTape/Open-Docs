[//]: # (title: Dokku)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何准备 Ktor 应用程序并将其部署到 Dokku。</link-summary>

[Dokku](https://dokku.com/) 是一个在您自己的 Linux 服务器上运行的自托管平台即服务 (PaaS)，并提供类似于 [Heroku](heroku.md) 的部署工作流。虽然您可以通过手动将 fat JAR 复制到服务器来部署 Ktor 应用程序，但 Dokku 自动处理了周围的基础架构：

* **基于 Git 的部署** — 使用 `git push` 推送您的代码，Dokku 会自动构建并重启应用程序，无需 SSH 文件复制或手动重启。
* **进程管理** — Dokku 会自动启动、停止和重启您的应用程序，包括在服务器重启后。
* **一台服务器上运行多个应用** — 每个应用程序都在隔离的容器中运行，防止应用之间的端口冲突和干扰。
* **HTTPS** — 只需一条命令即可为您的应用配置 Let's Encrypt 证书。
* **零停机部署** — Dokku 会等待新容器通过健康检查，然后才将流量从旧容器切走。

Dokku 需要在 Linux 服务器上运行。一些托管提供商提供预装的 Dokku 镜像，因此您不需要手动设置：[DigitalOcean](https://marketplace.digitalocean.com/apps/dokku)、[Hostinger](https://www.hostinger.com/vps/dokku-hosting) 和 [HOSTKEY](https://hostkey.com/apps/developer-tools/dokku/)。

## 先决条件 {id="prerequisites"}
在开始本教程之前，请确保满足以下先决条件：
* 您有一台安装了 Dokku 的 Linux 服务器。您可以[手动安装](https://dokku.com/docs/getting-started/installation/)，也可以使用提供预装 Dokku 镜像的托管提供商。
* 您的计算机上已安装 [Git](https://git-scm.com/downloads)。

## 准备应用程序 {id="prepare-app"}

### 步骤 1：配置端口 {id="port"}

首先，您需要指定用于侦听传入请求的端口。Dokku 会为每个应用程序动态分配一个端口，并通过 `PORT` 环境变量进行传递。您的应用程序必须在启动时读取此变量，否则它可能会侦听错误的端口，导致 Dokku 无法将流量路由给它。根据您[配置 Ktor 服务器](server-create-and-configure.topic)的方式，请执行以下操作之一：
* 如果您的服务器配置是在代码中指定的，请使用 `System.getenv()` 函数读取环境变量并将其传递给 `embeddedServer()` 函数的 `port` 形参：
   ```kotlin
   fun main() {
       embeddedServer(Netty, port = System.getenv("PORT")?.toIntOrNull() ?: 8080) {
           // ...
       }.start(wait = true)
   }
   ```

* 如果您的服务器配置是在配置文件中指定的，请打开位于 `src/main/resources` 中的 <Path>application.conf</Path> 或 <Path>application.yaml</Path> 文件，并按如下所示更新 `port` 属性：

   <Tabs group="config">
   <TabItem title="application.conf" group-key="hocon">

   ```shell
   ktor {
       deployment {
           port = 8080
           port = ${?PORT}
       }
   }
   ```

   </TabItem>
   <TabItem title="application.yaml" group-key="yaml">

   ```yaml
   ktor:
       deployment:
           port: ${PORT:8080}
   ```

   </TabItem>
   </Tabs>

### 步骤 2：添加 stage 任务 {id="stage"}

打开 <Path>build.gradle.kts</Path> 文件并添加一个 Dokku 用于构建应用程序的自定义 `stage` 任务：
```kotlin
tasks {
    register("stage").configure {
        dependsOn("installDist")
    }
}
```
> `installDist` 任务随 Gradle [application 插件](https://docs.gradle.org/current/userguide/application_plugin.html)一起提供。
>
{style="tip"}

### 步骤 3：指定 Java 版本 {id="java-version"}

在项目根目录下创建一个 <Path>system.properties</Path> 文件以指定 Java 版本：
```properties
java.runtime.version=21
```

该版本必须与 <Path>build.gradle.kts</Path> 文件中指定的 JVM 工具链版本匹配。如果没有此文件，Dokku 将使用最新的可用 JDK 版本，这可能会随着时间而变化并导致意外的构建失败。

### 步骤 4：创建 Procfile {id="procfile"}

在项目根目录下创建一个 `Procfile` 并添加以下内容：
```text
web: ./build/install/<project-name>/bin/<project-name>
```
{style="block"}

此文件告诉 Dokku 在由 [`stage`](#stage) 任务构建后如何启动应用程序。
将 `<project-name>` 替换为您的项目名称。要查找您的项目名称，请运行以下命令：
```bash
./gradlew properties -q | grep "^name:" | sed 's/name: //'
```

## 部署应用程序 {id="deploy-app"}

要使用 Git 将应用程序部署到 Dokku，请打开一个新的终端窗口并按照以下步骤操作：

1. 在本地提交在[上一节](#prepare-app)中所做的更改：
   ```bash
   git add .
   git commit -m "Prepare app for deploying"
   ```
2. 连接到您的服务器并创建一个 Dokku 应用程序。
   将 `<app-name>` 替换为您的应用程序名称：
   ```bash
   ssh <user>@<your-server> dokku apps:create <app-name>
   ```
3. 将 Dokku 服务器添加为 Git 远程仓库。
   将 `<your-server>` 替换为您服务器的主机名或 IP 地址，并将 `<app-name>` 替换为上一步中使用的名称：
   ```bash
   git remote add dokku dokku@<your-server>:<app-name>
   ```
4. 将代码推送到 Dokku 以触发构建和部署：
   ```bash
   git push dokku main
   ```
   如果您的分支名称不同，请将 `main` 替换为您的分支名称。

   如果您的 Ktor 应用程序位于子目录中，请改用 `git subtree push`：
    ```bash
    git subtree push --prefix=<subdir> dokku main
    ```
5. 等待 Dokku 构建并启动应用程序：
   ```text
   ...
   =====> Application deployed:
          http://<app-name>.<your-server>
   ```
   {style="block"}
6. 设置域名或 IP 地址以使应用程序可供访问：
   ```bash
   ssh <user>@<your-server> dokku domains:set <app-name> <domain-or-ip>
   ```
7. 应用程序将可以通过 `http://<domain-or-ip>` 访问。