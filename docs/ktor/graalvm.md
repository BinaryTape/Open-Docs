[//]: # (title: GraalVM)

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
了解如何在不同平台上为原生镜像使用 GraalVM。
</link-summary>

Ktor 服务器应用程序可以利用 [GraalVM](https://graalvm.org) 为不同平台生成原生镜像，并利用 GraalVM 提供的更快的启动时间及其他优势。

目前，希望利用 GraalVM 的 Ktor 服务器应用程序必须使用 CIO 作为 [应用程序引擎](server-engines.md)。

## 为 GraalVM 做准备

除了安装 GraalVM 并将安装目录添加到系统路径中之外，你还需要准备你的应用程序，以便所有依赖项都打包在一起，即你需要创建一个 fat jar。

### 反射配置

GraalVM 对使用反射的应用程序有[一些要求](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)，Ktor 就是这种情况。它要求你提供一个包含特定类型信息的 [JSON 文件](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)。然后，此配置文件将作为实参传递给 `native-image` 工具。

## 执行 `native-image` 工具

一旦 fat jar 准备就绪，唯一需要的步骤是使用 `native-image` CLI 工具创建原生镜像。这也可以通过 [Gradle 插件](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html) 来完成。你可以在[此处](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)查看 `build.gradle.kts` 文件的示例。但是，请注意，某些选项可能会有所不同，具体取决于所使用的依赖项、你的项目包名等。

## 运行生成的二进制文件

如果 shell 脚本执行没有任何错误，你将获得一个原生应用程序，在示例中，它被称为 `graal-server`。执行它将启动 Ktor 服务器，并在 `https://0.0.0.0:8080` 上响应。

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (
    <p>
        <b>Code example</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    )

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor server applications can make use of GraalVM in order to have native images for different platforms.)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor server applications can make use of [GraalVM]&#40;https://graalvm.org&#41; in order to have native images for different platforms and, of course, take advantage of the faster start-up times and other benefits that GraalVM provides. The [Ktor Gradle plugin]&#40;https://github.com/ktorio/ktor-build-plugins&#41; allows you to build a project's GraalVM native image.)

[//]: # ()
[//]: # (> Currently, Ktor server applications that want to leverage GraalVM have to use CIO as the [application engine]&#40;Engines.md&#41;.)

[//]: # ()
[//]: # (## Prepare for GraalVM)

[//]: # ()
[//]: # (Before building a project's GraalVM native image, make sure the following prerequisites are met:)

[//]: # (- [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41; and [Native Image]&#40;https://www.graalvm.org/reference-manual/native-image/&#41; are installed.)

[//]: # (- The `GRAALVM_HOME` and `JAVA_HOME` environment variables are set.)

[//]: # ()
[//]: # (## Configure the Ktor plugin {id="configure-plugin"})

[//]: # (To build a native executable, you need to configure the Ktor plugin first:)

[//]: # (1. Open the `build.gradle.kts` file and add the plugin to the `plugins` block:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. Make sure the [main application class]&#40;server-dependencies.xml#create-entry-point&#41; is configured:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. Optionally, you can  configure the name of the native executable to be generated using the `ktor.nativeImage` extension:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## Build and run a native executable {id="build"})

[//]: # ()
[//]: # (The `buildNativeImage` task provided by the Ktor plugin generates a native executable with your application in the `build/native/nativeCompile` directory.)

[//]: # ()
[//]: # (Executing it will launch the Ktor server, responding on `https://0.0.0.0:8080` by default.)