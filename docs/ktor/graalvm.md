[//]: # (title: GraalVM)

<tldr>
<p>
<control>示例项目</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor 服务器应用程序可以利用 GraalVM 为不同平台生成原生镜像。
</web-summary>
<link-summary>
了解如何使用 GraalVM 在不同平台上生成原生镜像。
</link-summary>

Ktor 服务器应用程序可以利用 [GraalVM](https://graalvm.org) 为不同平台生成原生镜像，当然，还能利用 GraalVM 提供的更快的启动时间和其他优势。

目前，想要利用 GraalVM 的 Ktor 服务器应用程序必须使用 CIO 作为 [应用程序引擎](server-engines.md)。

## 为 GraalVM 做准备

除了安装 GraalVM 并将安装目录添加到系统路径之外，你还需要准备好你的应用程序，以便捆绑所有依赖项，即你需要创建一个 fat jar。

### 反射配置

对于使用反射的应用程序，GraalVM 有 [一些要求](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)，而 Ktor 正是这种情况。它要求你为其提供一个包含特定类型信息的 [JSON 文件](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)。然后将此配置文件作为参数传递给 `native-image` 工具。

## 执行 `native-image` 工具

一旦 fat jar 准备就绪，唯一需要的步骤就是使用 `native-image` 命令行工具创建原生镜像。这也可以通过 [Gradle 插件](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html) 来完成。你可以在[此处](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)查看 `build.gradle.kts` 文件的示例。但是，请注意，某些选项可能会根据所使用的依赖项、项目的软件包名称等而有所不同。

## 运行生成的二进制文件

如果 shell 脚本执行时没有任何错误，你应该会得到一个原生应用程序，在本示例中名为 `graal-server`。执行它将启动 Ktor 服务器，响应地址为 `https://0.0.0.0:8080`。

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor 服务器应用程序可以利用 GraalVM 为不同平台生成原生镜像。)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor 服务器应用程序可以利用 [GraalVM]&#40;https://graalvm.org&#41; 为不同平台生成原生镜像，当然，还能利用 GraalVM 提供的更快的启动时间和其他优势。[Ktor Gradle 插件]&#40;https://github.com/ktorio/ktor-build-plugins&#41; 允许你构建项目的 GraalVM 原生镜像。)

[//]: # ()
[//]: # (> 目前，想要利用 GraalVM 的 Ktor 服务器应用程序必须使用 CIO 作为 [应用程序引擎]&#40;Engines.md&#41;。)

[//]: # ()
[//]: # (## 为 GraalVM 做准备)

[//]: # ()
[//]: # (在构建项目的 GraalVM 原生镜像之前，请确保满足以下先决条件：)

[//]: # (- 已安装 [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41; 和 [Native Image]&#40;https://www.graalvm.org/reference-manual/native-image/&#41;。)

[//]: # (- 已设置 `GRAALVM_HOME` 和 `JAVA_HOME` 环境变量。)

[//]: # ()
[//]: # (## 配置 Ktor 插件 {id="configure-plugin"})

[//]: # (要构建原生可执行文件，你需要先配置 Ktor 插件：)

[//]: # (1. 打开 `build.gradle.kts` 文件并将插件添加到 `plugins` 代码块中：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. 确保已配置 [应用程序主类]&#40;server-dependencies.xml#create-entry-point&#41;：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. （可选）你可以使用 `ktor.nativeImage` 扩展来配置要生成的原生可执行文件的名称：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## 构建并运行原生可执行文件 {id="build"})

[//]: # ()
[//]: # (Ktor 插件提供的 `buildNativeImage` 任务会在 `build/native/nativeCompile` 目录中生成包含你的应用程序的原生可执行文件。)

[//]: # (执行它将启动 Ktor 服务器，默认响应地址为 `https://0.0.0.0:8080`。)