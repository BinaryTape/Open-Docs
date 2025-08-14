[//]: # (title: 執行中)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何執行伺服器 Ktor 應用程式。
</link-summary>

執行 Ktor 伺服器應用程式時，請考慮以下特殊事項：
* 用於[建立伺服器](server-create-and-configure.topic)的方式會影響您是否可以在執行[打包的 Ktor 應用程式](#package)時透過傳遞命令列引數來覆寫伺服器參數。
* Gradle/Maven 建置指令碼在使用 [EngineMain](server-create-and-configure.topic#engine-main) 啟動伺服器時，應指定主類別名稱。
* 在 [servlet 容器](server-war.md)中執行應用程式需要特定的 servlet 配置。

在本主題中，我們將探討這些配置細節，並向您展示如何在 IntelliJ IDEA 中以及作為打包應用程式執行 Ktor 應用程式。

## 配置細節 {id="specifics"}

### 配置：程式碼 vs 配置檔案 {id="code-vs-config"}

執行 Ktor 應用程式取決於您[建立伺服器](server-create-and-configure.topic)的方式 — `embeddedServer` 或 `EngineMain`：
* 對於 `embeddedServer`，伺服器參數（例如主機位址和連接埠）在程式碼中配置，因此您在執行應用程式時無法更改這些參數。
* 對於 `EngineMain`，Ktor 從使用 `HOCON` 或 `YAML` 格式的外部檔案載入其配置。使用此方法，您可以從命令列執行[打包的應用程式](#package)，並透過傳遞相應的[命令列引數](server-configuration-file.topic#command-line)來覆寫所需的伺服器參數。

### 啟動 EngineMain：Gradle 和 Maven 的特殊事項 {id="gradle-maven"}

如果您使用 `EngineMain` 建立伺服器，您需要指定 `main` 函數以使用所需的[引擎](server-engines.md)啟動伺服器。
下面的[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)演示了用於使用 Netty 引擎執行伺服器的 `main` 函數：

[object Promise]

要使用 Gradle/Maven 執行 Ktor 伺服器而不在 `main` 函數內部配置引擎，您需要在建置指令碼中指定主類別名稱，如下所示：

<tabs group="languages" id="main-class-set-engine-main">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
application {
mainClass.set("io.ktor.server.netty.EngineMain")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<properties>
<main.class>io.ktor.server.netty.EngineMain</main.class>
</properties>
```

</tab>
</tabs>

### WAR 特殊事項

Ktor 允許您在應用程式中直接[建立和啟動伺服器](server-create-and-configure.topic)，並使用所需的引擎（例如 Netty、Jetty 或 Tomcat）。在這種情況下，您的應用程式可以控制引擎設定、連線和 SSL 選項。

與此方法相反，servlet 容器應控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` 引擎，它將您的應用程式控制權委派給 servlet 容器。您可以從 [](server-war.md#configure-war) 了解如何配置您的應用程式。

## 執行應用程式 {id="run"}
> 在開發過程中重新啟動伺服器可能需要一些時間。Ktor 允許您透過使用 [Auto-reload](server-auto-reload.topic) 來克服此限制，它會在程式碼變更時重新載入應用程式類別，並提供快速回饋迴圈。

### 使用 Gradle/Maven 執行應用程式 {id="gradle-maven-run"}

要使用 Gradle 或 Maven 執行 Ktor 應用程式，請使用相應的外掛：
* Gradle 的 [Application](server-packaging.md) 外掛。對於 [Native server](server-native.md)，請使用 [Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform) 外掛。
* Maven 的 [Exec](https://www.mojohaus.org/exec-maven-plugin/) 外掛。

> 要了解如何在 IntelliJ IDEA 中執行 Ktor 應用程式，請參閱 IntelliJ IDEA 文件中的[執行 Ktor 應用程式](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app)部分。

### 執行打包的應用程式 {id="package"}

在部署應用程式之前，您需要按照 [](server-deployment.md#packaging) 部分中描述的一種方式將其打包。
從產生的套件執行 Ktor 應用程式取決於套件類型，可能如下所示：
* 要執行打包在胖 JAR 中且覆寫了配置連接埠的 Ktor 伺服器，請執行以下命令：
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
* 要執行使用 Gradle [Application](server-packaging.md) 外掛打包的應用程式，請執行相應的可執行檔：

   <snippet id="run_executable">
   <tabs group="os">
   <tab title="Linux/macOS" group-key="unix">
   [object Promise]
   </tab>
   <tab title="Windows" group-key="windows">
   [object Promise]
   </tab>
   </tabs>
   </snippet>
  
* 要執行 servlet Ktor 應用程式，請使用 [Gretty](server-war.md#run) 外掛的 `run` 任務。

    ```