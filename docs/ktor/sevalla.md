[//]: # (title: Sevalla)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何准备 Ktor 应用程序并将其部署到 Sevalla。</link-summary>

在本教程中，你将学习如何准备 Ktor 应用程序并将其部署到 [Sevalla](https://sevalla.com/)。你可以使用以下初始项目之一，具体取决于用于[创建 Ktor 服务器](server-create-and-configure.topic)的方式：

* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)

* [Engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)

## 前提条件 {id="prerequisites"}

在开始本教程之前，你需要[创建一个 Sevalla 账户](https://sevalla.com)（附赠 $50 免费额度）。

## 克隆示例应用程序 {id="clone-sample-app"}

要打开示例应用程序，请按照以下步骤操作：

1. 克隆 [Ktor 文档版本库](https://github.com/ktorio/ktor-documentation)。
2. 打开 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 项目。
3. 打开 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 示例，这展示了两种不同的 Ktor 服务器设置方法 — 既可以直接在代码中配置，也可以通过外部配置文件配置。部署这些项目的唯一区别在于如何指定用于监听传入请求的端口。

## 准备应用程序 {id="prepare-app"}

### 步骤 1: 配置端口 {id="port"}

Sevalla 使用 `PORT` 环境变量注入一个随机端口。你的应用程序必须配置为监听该端口。

如果你选择了 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server) 示例，且服务器配置在代码中指定，你可以使用 `System.getenv()` 获取环境变量的值。打开位于 <Path>src/main/kotlin/com/example</Path> 文件夹中的 <Path>Application.kt</Path> 文件，并如下所示更改 `embeddedServer()` 函数的端口形参值：

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        // ...
    }.start(wait = true)
}
```

如果你选择了 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 示例，且服务器配置在 <Path>application.conf</Path> 文件中指定，你可以通过使用 `${ENV}` 语法将环境变量赋值给端口形参。打开位于 <Path>src/main/resources</Path> 中的 <Path>application.conf</Path> 文件，并如下所示更新它：

```hocon
ktor {
  deployment {
    port = 5000
    port = ${?PORT}
  }
  application {
    modules = [ com.example.ApplicationKt.module ]
  }
}
```

### 步骤 2: 添加 Dockerfile {id="dockerfile"}

要在 Sevalla 上构建并运行你的 Ktor 项目，你需要一个 Dockerfile。这是一个使用多阶段构建的 Dockerfile 示例：

```docker
# Stage 1: Build the app
FROM gradle:8.5-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle installDist

# Stage 2: Run the app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/install/<project-name>/ ./
ENV PORT=8080
CMD ["./bin/<project-name>"]
```

请确保将 `<project-name>` 替换为你在 <Path>settings.gradle.kts</Path> 文件中定义的项目名称：

```kotlin
rootProject.name = "ktor-app"
```

## 部署应用程序 {id="deploy-app"}

Sevalla 直接从连接的 Git 版本库中构建并部署你的应用程序。这可以托管在 GitHub、GitLab、Bitbucket 或任何受支持的 Git 提供商等平台上。要成功部署，请确保你的项目已提交并推送，并且包含所有必需的文件（例如 Dockerfile、<Path>build.gradle.kts</Path> 和源代码）。

要部署应用程序，请登录到 [Sevalla](https://sevalla.com/) 并按照以下步骤操作：

1. 点击 **应用程序 -> 创建应用**
  ![Sevalla add app](../images/sevalla-add-app.jpg)
2. 选择你的 Git 版本库，并选择合适的分支（通常是 `main` 或 `master`）。
3. 设置**应用程序名称**，选择**区域**，并选择你的 **Pod 大小**（你可以从 0.5 CPU / 1GB RAM 开始）。
4. 点击**创建**，但暂时跳过部署步骤
  ![Sevalla create app](../images/sevalla-deployment-create-app.png)
5. 转到 **设置 -> 构建**，并在**构建环境**卡片下点击**更新设置**。
  ![Sevalla update build settings](../images/sevalla-deployment-update-build-settings.png)
6. 将构建方法设置为 **Dockerfile**。
  ![Sevalla Dockerfile settings](../images/sevalla-deployment-docker-settings.png)
7. 确认 **Dockerfile 路径**是 `Dockerfile` 并且**上下文**是 `.`。
8. 返回你的应用程序的**部署**选项卡，并点击**部署**。

Sevalla 将克隆你的 Git 版本库，使用你的 Dockerfile 构建 Docker 镜像，注入 `PORT` 环境变量，并运行你的应用程序。如果一切配置正确，你的 Ktor 应用将上线，访问地址为 `https://<your-app>.sevalla.app`。