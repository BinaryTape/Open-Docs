[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>示例项目</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor Server 应用程序可以利用 GraalVM，以获得适用于不同平台的原生镜像。
</web-summary>
<link-summary>
了解如何使用 GraalVM 为不同平台生成原生镜像。
</link-summary>

Ktor Server 应用程序可以利用 [GraalVM](https://graalvm.org) 获得适用于不同平台的原生镜像，当然，还能利用 GraalVM 提供的更快启动时间和其他优势。

目前，希望利用 GraalVM 的 Ktor Server 应用程序必须使用 CIO 作为 [应用程序引擎](server-engines.md)。

## 为 GraalVM 做准备

除了安装 GraalVM 并将安装目录添加到系统路径中之外，您还需要准备您的应用程序，以便所有依赖项都捆绑在一起，即您需要创建一个 fat jar。

### 反射配置

GraalVM 对使用反射的应用程序有一些[要求](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)，Ktor 就是如此。它要求您提供一个包含特定类型信息的 [JSON 文件](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)。然后，此配置文件将作为实参传递给 `native-image` 工具。

## 执行 `native-image` 工具

一旦 fat jar 准备就绪，唯一需要的步骤是使用 `native-image` CLI 工具创建原生镜像。这也可以通过 [Gradle 插件](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html) 来完成。您可以在[此处](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts) 查看 `build.gradle.kts` 文件的示例。但是，请注意，某些选项可能会因所使用的依赖项、项目包名等而异。

## 运行生成的二进制文件

如果 shell 脚本执行时没有出现任何错误，您将获得一个原生应用程序，在示例中，它被称为 `graal-server`。执行它将启动 Ktor Server，并在 `https://0.0.0.0:8080` 响应。

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<p>
    <b>Code example</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor Server 应用程序可以利用 GraalVM，以获得适用于不同平台的原生镜像。)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor Server 应用程序可以利用 [GraalVM](https://graalvm.org) 获得适用于不同平台的原生镜像，当然，还能利用 GraalVM 提供的更快启动时间和其他优势。[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 允许您构建项目的 GraalVM 原生镜像。)

[//]: # ()
[//]: # (> 目前，希望利用 GraalVM 的 Ktor Server 应用程序必须使用 CIO 作为 [应用程序引擎](Engines.md)。)

[//]: # ()
[//]: # (## 为 GraalVM 做准备)

[//]: # ()
[//]: # (在构建项目的 GraalVM 原生镜像之前，请确保满足以下先决条件：)

[//]: # (- [GraalVM](https://www.graalvm.org/docs/getting-started/) 和 [Native Image](https://www.graalvm.org/reference-manual/native-image/) 已安装。)

[//]: # (- GRAALVM_HOME 和 JAVA_HOME 环境变量已设置。)

[//]: # ()
[//]: # (## 配置 Ktor 插件 {id="configure-plugin"})

[//]: # (要构建原生可执行文件，您需要首先配置 Ktor 插件：)

[//]: # (1. 打开 build.gradle.kts 文件并将插件添加到 plugins 代码块中：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. 确保 [主应用程序类](server-dependencies.xml#create-entry-point) 已配置：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. （可选）您可以使用 ktor.nativeImage 扩展来配置要生成的原生可执行文件的名称：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## 构建并运行原生可执行文件 {id="build"})

[//]: # ()
[//]: # (Ktor 插件提供的 buildNativeImage 任务会在 build/native/nativeCompile 目录中生成一个包含您应用程序的原生可执行文件。)

[//]: # (执行它将启动 Ktor 服务器，默认在 https://0.0.0.0:8080 响应。)