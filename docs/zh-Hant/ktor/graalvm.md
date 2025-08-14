[//]: # (title: GraalVM)

<tldr>
<p>
<control>範例專案</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor Server 應用程式可以利用 GraalVM 來為不同平台提供原生映像檔。
</web-summary>
<link-summary>
學習如何在不同平台使用 GraalVM 建立原生映像檔。
</link-summary>

Ktor Server 應用程式可以利用 [GraalVM](https://graalvm.org) 來為不同平台建立原生映像檔，當然，也能利用 GraalVM 提供的更快的啟動時間及其他優點。

目前，想要利用 GraalVM 的 Ktor Server 應用程式必須使用 CIO 作為其 [應用程式引擎](server-engines.md)。

## 為 GraalVM 準備

除了安裝 GraalVM 並將安裝目錄設定到系統路徑中之外，您還需要準備您的應用程式，使其所有依賴項都能被打包，亦即您需要建立一個 fat jar 檔案。

### 反射組態

GraalVM 對於使用反射的應用程式（例如 Ktor）有一些 [要求](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)。它要求您提供一個包含特定型別資訊的 [JSON 檔案](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)。這個組態檔案隨後會作為參數傳遞給 `native-image` 工具。

## 執行 `native-image` 工具

一旦 fat jar 準備就緒，唯一需要的步驟就是使用 `native-image` CLI 工具建立原生映像檔。這也可以透過 [Gradle 外掛程式](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html) 完成。您可以在[此處](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts) 查看 `build.gradle.kts` 檔案的範例。然而，請注意，某些選項可能會根據所使用的依賴項、專案的套件名稱等而有所不同。

## 執行產生的二進位檔

如果 shell 指令碼執行時沒有任何錯誤，您應該會得到一個原生應用程式，在此範例中，它被稱為 `graal-server`。執行它將會啟動 Ktor Server，並在 `https://0.0.0.0:8080` 上響應。

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

[//]: # (Executing it will launch the Ktor server, responding on `https://0.0.0.0:8080` by default.)