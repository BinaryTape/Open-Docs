[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>範例專案</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor Server 應用程式可以利用 GraalVM 為不同平台產生原生映像。
</web-summary>
<link-summary>
了解如何使用 GraalVM 在不同平台上建立原生映像。
</link-summary>

Ktor Server 應用程式可以利用 [GraalVM](https://graalvm.org) 為不同平台產生原生映像，當然也能受益於 GraalVM 提供的更短啟動時間與其他優點。

目前，想要利用 GraalVM 的 Ktor Server 應用程式必須使用 CIO 作為[應用程式引擎](server-engines.md)。

## 為 GraalVM 做好準備

除了安裝 GraalVM 並將安裝目錄加入系統路徑之外，您還需要準備好您的應用程式，以便將所有相依性封裝在一起，也就是說，您需要建立一個 fat jar。

### 反射配置

GraalVM 對於使用反射（reflection）的應用程式有[一些要求](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)，而 Ktor 正是如此。它要求您提供一個包含特定型別資訊的 [JSON 檔案](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)。接著，此配置檔案會作為引數傳遞給 `native-image` 工具。

## 執行 `native-image` 工具

當 fat jar 準備就緒後，唯一的步驟就是使用 `native-image` 命令列工具來建立原生映像。這也可以透過 [Gradle 外掛程式](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)來完成。您可以[在此處](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)查看 `build.gradle.kts` 檔案的範例。然而請注意，某些選項可能會根據所使用的相依性、專案的套件名稱等而有所不同。

## 執行產生的二進位檔

如果 Shell 指令碼執行時沒有任何錯誤，您應該會得到一個原生應用程式，在此範例中稱為 `graal-server`。執行它將啟動 Ktor Server，並在 `https://0.0.0.0:8080` 進行回應。

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor Server 應用程式可以利用 GraalVM 為不同平台產生原生映像。)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor Server 應用程式可以利用 [GraalVM]&#40;https://graalvm.org&#41; 為不同平台產生原生映像，當然也能受益於 GraalVM 提供的更短啟動時間與其他優點。[Ktor Gradle 外掛程式]&#40;https://github.com/ktorio/ktor-build-plugins&#41; 允許您建置專案的 GraalVM 原生映像。)

[//]: # ()
[//]: # (> 目前，想要利用 GraalVM 的 Ktor Server 應用程式必須使用 CIO 作為[應用程式引擎]&#40;Engines.md&#41;。)

[//]: # ()
[//]: # (## 為 GraalVM 做好準備)

[//]: # ()
[//]: # (在建置專案的 GraalVM 原生映像之前，請確保滿足以下先決條件：)

[//]: # (- 已安裝 [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41; 與 [Native Image]&#40;https://www.graalvm.org/reference-manual/native-image/&#41;。)

[//]: # (- 已設定 `GRAALVM_HOME` 與 `JAVA_HOME` 環境變數。)

[//]: # ()
[//]: # (## 配置 Ktor 外掛程式 {id="configure-plugin"})

[//]: # (要建置原生可執行檔，您需要先配置 Ktor 外掛程式：)

[//]: # (1. 開啟 `build.gradle.kts` 檔案並將外掛程式加入 `plugins` 區塊：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. 確保已配置[主應用程式類別]&#40;server-dependencies.xml#create-entry-point&#41;：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. （選填）您可以使用 `ktor.nativeImage` 擴充套件來配置要產生的原生可執行檔名稱：)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## 建置與執行原生可執行檔 {id="build"})

[//]: # ()
[//]: # (Ktor 外掛程式提供的 `buildNativeImage` 任務會在 `build/native/nativeCompile` 目錄中產生包含您應用程式的原生可執行檔。)

[//]: # (執行它將啟動 Ktor Server，預設在 `https://0.0.0.0:8080` 進行回應。)