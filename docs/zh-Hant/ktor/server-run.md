[//]: # (title: 執行)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何執行伺服器 Ktor 應用程式。
</link-summary>

執行 Ktor 伺服器應用程式時，請注意以下幾點：
* 用於[建立伺服器](server-create-and-configure.topic)的方式會影響您在執行[打包的 Ktor 應用程式](#package)時，是否能透過傳遞命令列引數來覆寫伺服器參數。
* Gradle/Maven 建置腳本在使用 [EngineMain](server-create-and-configure.topic#engine-main) 啟動伺服器時，應指定主類別名稱。
* 在 [Servlet 容器](server-war.md)中執行您的應用程式需要特定的 Servlet 設定。

在本主題中，我們將探討這些設定細節，並示範如何在 IntelliJ IDEA 中以及作為打包應用程式來執行 Ktor 應用程式。

## 設定細節 {id="specifics"}

### 設定：程式碼與設定檔 {id="code-vs-config"}

執行 Ktor 應用程式取決於您用於[建立伺服器](server-create-and-configure.topic)的方式 — `embeddedServer` 或 `EngineMain`：
* 對於 `embeddedServer`，伺服器參數（例如主機位址和埠）在程式碼中設定，因此在執行應用程式時您無法更改這些參數。
* 對於 `EngineMain`，Ktor 會從使用 `HOCON` 或 `YAML` 格式的外部檔案載入其設定。使用這種方法，您可以從命令列執行[打包的應用程式](#package)，並透過傳遞相應的[命令列引數](server-configuration-file.topic#command-line)來覆寫所需的伺服器參數。

### 啟動 EngineMain：Gradle 和 Maven 細節 {id="gradle-maven"}

如果您使用 `EngineMain` 建立伺服器，您需要指定 `main` 函式，以啟動具有所需[引擎](server-engines.md)的伺服器。
下面的[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)示範了用於透過 Netty 引擎執行伺服器的 `main` 函式：

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt" include-lines="7"}

若要使用 Gradle/Maven 執行 Ktor 伺服器，而不在 `main` 函式內部設定引擎，您需要像下面這樣在建置腳本中指定主類別名稱：

<include from="server-engines.md" element-id="main-class-set-engine-main"/>

### WAR 細節

Ktor 允許您直接在應用程式中[建立並啟動伺服器](server-create-and-configure.topic)，並使用所需的引擎（例如 Netty、Jetty 或 Tomcat）。在這種情況下，您的應用程式可以控制引擎設定、連線和 SSL 選項。

與此方法相反，Servlet 容器應控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` 引擎，它將應用程式的控制權委派給 Servlet 容器。您可以從 [](server-war.md#configure-war) 了解如何設定您的應用程式。

## 執行應用程式 {id="run"}
> 在開發期間重新啟動伺服器可能需要一些時間。Ktor 允許您透過使用[自動重新載入 (Auto-reload)](server-auto-reload.topic) 來克服此限制，它會在程式碼變更時重新載入應用程式類別並提供快速的回饋循環。

### 使用 Gradle/Maven 執行應用程式 {id="gradle-maven-run"}

若要使用 Gradle 或 Maven 執行 Ktor 應用程式，請使用相應的外掛程式：
* Gradle 的[應用程式 (Application)](server-packaging.md) 外掛程式。對於[原生伺服器](server-native.md)，請使用 [Kotlin 多平台 (Kotlin Multiplatform)](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform) 外掛程式。
* Maven 的 [Exec](https://www.mojohaus.org/exec-maven-plugin/) 外掛程式。

> 若要了解如何在 IntelliJ IDEA 中執行 Ktor 應用程式，請參閱 IntelliJ IDEA 文件中的[執行 Ktor 應用程式](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app)部分。

### 執行打包的應用程式 {id="package"}

在部署您的應用程式之前，您需要以 [](server-deployment.md#packaging) 部分中描述的其中一種方式將其打包。
從產生的套件執行 Ktor 應用程式取決於套件類型，可能如下所示：
* 若要執行打包為胖 JAR 的 Ktor 伺服器並覆寫配置的埠，請執行以下命令：
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
* 若要執行使用 Gradle [應用程式 (Application)](server-packaging.md) 外掛程式打包的應用程式，請執行相應的可執行檔：

   <include from="server-packaging.md" element-id="run_executable"/>
  
* 若要執行 Servlet Ktor 應用程式，請使用 [Gretty](server-war.md#run) 外掛程式的 `run` 任務。

    ```