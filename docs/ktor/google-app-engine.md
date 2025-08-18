[//]: # (title: Google App Engine)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<control>初始项目</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main">engine-main</a>
</p>
<p>
<control>最终项目</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard">google-appengine-standard</a>
</p>
</tldr>

<web-summary>
本教程展示了如何准备 Ktor 项目并将其部署到 Google App Engine 标准环境。
</web-summary>

<link-summary>
了解如何将你的项目部署到 Google App Engine 标准环境。
</link-summary>

在本教程中，我们将向你展示如何准备 Ktor 项目并将其部署到 Google App Engine 标准环境。本教程使用 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 示例项目作为起始项目。

## 先决条件 {id="prerequisites"}
在开始本教程之前，你需要执行以下步骤：
* 注册 [Google Cloud Platform](https://console.cloud.google.com/)。
* 安装并初始化 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)。
* 使用以下命令安装适用于 Java 的 App Engine 扩展项：
   ```Bash
   gcloud components install app-engine-java
   ```

## 克隆示例应用程序 {id="clone"}
要打开示例应用程序，请按照以下步骤操作：
1. 克隆 Ktor 文档版本库并打开 [codeSnippets](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets) 项目。
2. 打开 [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 模块。
   > 请注意，Ktor 提供了两种 [创建和配置服务器](server-create-and-configure.topic) 的方法：在代码中或使用配置文件。在本教程中，部署过程对于这两种方法都是相同的。

## 准备应用程序 {id="prepare-app"}
### 步骤 1: 应用 Shadow 插件 {id="configure-shadow-plugin"}
本教程展示了如何使用 [fat JAR](server-fatjar.md) 将应用程序部署到 Google App Engine。要生成 fat JAR，你需要应用 Shadow 插件。打开 `build.gradle.kts` 文件并将插件添加到 `plugins` 代码块：
```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.9"
}
```

### 步骤 2: 配置 App Engine 插件 {id="configure-app-engine-plugin"}
[Google App Engine Gradle 插件](https://github.com/GoogleCloudPlatform/app-gradle-plugin) 提供构建和部署 Google App Engine 应用程序的任务。要使用此插件，请按照以下步骤操作：

1. 打开 `settings.gradle.kts` 文件并插入以下代码以从中央 Maven 版本库引用插件：
   ```groovy
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           maven("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
       }
       resolutionStrategy {
           eachPlugin {
               if (requested.id.id.startsWith("com.google.cloud.tools.appengine")) {
                   useModule("com.google.cloud.tools:appengine-gradle-plugin:${requested.version}")
               }
           }
       }
   }
   ```

2. 打开 `build.gradle.kts` 并在 `plugins` 代码块中应用插件：
   ```kotlin
   plugins {
       id("com.google.cloud.tools.appengine") version "2.8.0"
   }
   ```

3. 在 `build.gradle.kts` 文件中添加 `appengine` 代码块并包含以下设置：
   ```kotlin
   import com.google.cloud.tools.gradle.appengine.appyaml.AppEngineAppYamlExtension
   
   configure<AppEngineAppYamlExtension> {
       stage {
           setArtifact("build/libs/${project.name}-all.jar")
       }
       deploy {
           version = "GCLOUD_CONFIG"
           projectId = "GCLOUD_CONFIG"
       }
   }
   ```

### 步骤 3: 配置 App Engine 设置 {id="configure-app-engine-settings"}
你可以在 [app.yaml](https://cloud.google.com/appengine/docs/standard/python/config/appref) 文件中配置应用程序的 App Engine 设置：
1. 在 `src/main` 内部创建 `appengine` 目录。
2. 在此目录内部，创建 `app.yaml` 文件并添加以下内容（将 `google-appengine-standard` 替换为你的项目名称）：
   ```yaml
   runtime: java21
   entrypoint: 'java -jar google-appengine-standard-all.jar'
   
   ```
   
   `entrypoint` 选项包含一个命令，用于运行为应用程序生成的 fat JAR。

   关于支持的配置选项的更多文档可以在 [Google AppEngine 文档](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=java) 中找到。

## 部署应用程序 {id="deploy-app"}

要部署应用程序，请打开终端并按照以下步骤操作：

1. 首先，创建一个 Google Cloud 项目，它是一个用于存放应用程序资源的顶层容器。例如，以下命令创建一个名为 `ktor-sample-app-engine` 的项目：
   ```Bash
   gcloud projects create ktor-sample-app-engine --set-as-default
   ```
   
2. 为 Cloud 项目创建一个 App Engine 应用程序：
   ```Bash
   gcloud app create
   ```

3. 要部署应用程序，请执行 `appengineDeploy` Gradle 任务……
   ```Bash
   ./gradlew appengineDeploy
   ```
   ……然后等待 Google Cloud 构建并发布应用程序：
   ```
   ...done.
   Deployed service [default] to [https://ktor-sample-app-engine.ew.r.appspot.com]
   ```
   {style="block"}
   > 如果你在构建期间收到 `Cloud Build has not been used in project` 错误，请根据错误报告中的说明启用它。
   >
   {type="note"}

你可以在此处找到完整的示例：[google-appengine-standard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/google-appengine-standard)。