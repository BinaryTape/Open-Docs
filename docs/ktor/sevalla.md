[//]: # (title: Sevalla)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何准备 Ktor 应用程序并将其部署到 Sevalla。</link-summary>

在本教程中，你将学习如何准备 Ktor 应用程序并将其部署到 [Sevalla](https://sevalla.com/)。你可以根据[创建 Ktor 服务器](server-create-and-configure.topic)的方式，使用以下初始项目之一：

* [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server)

* [Engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main)

## 前提条件 {id="prerequisites"}

在开始本教程之前，你需要[创建一个 Sevalla 帐户](https://sevalla.com)（附赠 50 美元的免费额度）。

## 克隆示例应用程序 {id="clone-sample-app"}

按照以下步骤打开示例应用程序：

1. 克隆 [Ktor 文档仓库](https://github.com/ktorio/ktor-documentation)。
2. 打开 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets) 项目。
3. 打开 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server) 或 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 示例，这两个示例演示了设置 Ktor 服务器的两种不同方法——直接在代码中配置或通过外部配置文件配置。部署这些项目的唯一区别在于如何指定用于侦听传入请求的端口。

## 准备应用程序 {id="prepare-app"}

### 第 1 步：配置端口 {id="port"}

Sevalla 使用 `PORT` 环境变量注入一个随机端口。你的应用程序必须配置为侦听该端口。

如果你选择了在代码中指定服务器配置的 [embedded-server](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server) 示例，则可以使用 `System.getenv()` 获取环境变量的值。打开位于 <Path>src/main/kotlin/com/example</Path> 文件夹中的 <Path>Application.kt</Path> 文件，并按如下所示更改 `embeddedServer()` 函数的端口参数值：

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        // ...
    }.start(wait = true)
}
```

如果你选择了在 <Path>application.conf</Path> 文件中指定服务器配置的 [engine-main](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main) 示例，则可以使用 `${ENV}` 语法将环境变量分配给端口参数。打开位于 <Path>src/main/resources</Path> 中的 <Path>application.conf</Path> 文件，并按如下所示进行更新：

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

### 第 2 步：添加 Dockerfile {id="dockerfile"}

要在 Sevalla 上构建并运行你的 Ktor 项目，你需要一个 Dockerfile。以下是一个使用多阶段构建的示例 Dockerfile：

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

请务必将 `<project-name>` 替换为 <Path>settings.gradle.kts</Path> 文件中定义的项目名称：

```kotlin
rootProject.name = "ktor-app"
```

## 部署应用程序 {id="deploy-app"}

Sevalla 直接通过连接的 Git 仓库构建并部署你的应用程序。仓库可以托管在 GitHub、GitLab、Bitbucket 或任何受支持的 Git 提供商平台上。为了成功部署，请确保你的项目已提交并推送，并且包含所有必要的文件（例如 Dockerfile、<Path>build.gradle.kts</Path> 和源代码）。

要部署应用程序，请登录 [Sevalla](https://sevalla.com/) 并按照以下步骤操作：

1. 点击 **Applications -> Create an app**
  ![Sevalla add app](../images/sevalla-add-app.jpg)
2. 选择你的 Git 仓库并选择相应的分支（通常为 `main` 或 `master`）。
3. 设置 **应用程序名称**，选择 **区域**，然后选择 **pod 大小**（你可以从 0.5 CPU / 1 GB 内存开始）。
4. 点击 **Create**，但暂时跳过部署步骤  
  ![Sevalla create app](../images/sevalla-deployment-create-app.png)
5. 转到 **Settings -> Build**，然后点击 **Build environment** 卡片下的 **Update Settings**。  
  ![Sevalla update build settings](../images/sevalla-deployment-update-build-settings.png)
6. 将构建方法设置为 **Dockerfile**。
  ![Sevalla Dockerfile settings](../images/sevalla-deployment-docker-settings.png)
7. 确认 **Dockerfile 路径** 为 `Dockerfile`，且 **Context** 为 `.`。
8. 返回应用程序的 **Deployment** 选项卡，然后点击 **Deploy**。

Sevalla 将克隆你的 Git 仓库，使用 Dockerfile 构建 Docker 镜像，注入 `PORT` 环境变量，并运行你的应用程序。如果一切配置正确，你的 Ktor 应用将在 `https://<your-app>.sevalla.app` 上线。