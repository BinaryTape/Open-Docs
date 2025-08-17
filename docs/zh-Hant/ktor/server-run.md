[//]: # (title: 執行)

<show-structure for="chapter" depth="2"/>

<link-summary>
了解如何執行伺服器 Ktor 應用程式。
</link-summary>

執行 Ktor 伺服器應用程式時，請考慮以下特定事項：
*   建立伺服器的方式 ([建立並設定伺服器](server-create-and-configure.topic)) 會影響您是否能夠在執行 [打包好的 Ktor 應用程式](#package) 時，透過傳遞命令列引數來覆寫伺服器參數。
*   Gradle/Maven 建置腳本在使用 [EngineMain](server-create-and-configure.topic#engine-main) 啟動伺服器時，應指定 `main` 類別名稱。
*   在 [Servlet 容器](server-war.md) 內執行您的應用程式需要特定的 Servlet 設定。

在本主題中，我們將探討這些配置細節，並向您展示如何在 IntelliJ IDEA 中以及作為打包應用程式來執行 Ktor 應用程式。

## 配置細節 {id="specifics"}

### 配置：程式碼 vs 配置檔案 {id="code-vs-config"}

執行 Ktor 應用程式取決於您用來 [建立伺服器](server-create-and-configure.topic) 的方式 — `embeddedServer` 或 `EngineMain`：
*   對於 `embeddedServer`，伺服器參數（例如 host address 和 port）是在程式碼中配置的，因此在執行應用程式時無法更改這些參數。
*   對於 `EngineMain`，Ktor 會從使用 `HOCON` 或 `YAML` 格式的外部檔案載入其配置。使用這種方法，您可以從命令列執行 [打包好的應用程式](#package)，並透過傳遞相應的 [命令列引數](server-configuration-file.topic#command-line) 來覆寫所需的伺服器參數。

### 啟動 EngineMain：Gradle 和 Maven 特定事項 {id="gradle-maven"}

如果您使用 `EngineMain` 建立伺服器，您需要指定 `main` 函數，以便用所需的 [engine](server-engines.md) 啟動伺服器。
下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main) 展示了用於使用 Netty engine 執行伺服器的 `main` 函數：

```kotlin
fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)
```

要使用 Gradle/Maven 執行 Ktor 伺服器，而不在 `main` 函數內部配置 engine，您需要在建置腳本中指定 main class name，如下所示：

<TabItem title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

</TabItem>
<TabItem title="Gradle (Groovy)" group-key="groovy">

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

</TabItem>
<TabItem title="Maven" group-key="maven">

```xml
<properties>
    <main.class>io.ktor.server.netty.EngineMain</main.class>
</properties>
```

</TabItem>

### WAR 特定事項

Ktor 允許您在應用程式中直接 [建立並啟動伺服器](server-create-and-configure.topic)，使用所需的 engine（例如 Netty、Jetty 或 Tomcat）。在這種情況下，您的應用程式可以控制 engine 設定、連線和 SSL 選項。

與此方法相反，Servlet 容器應控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 `ServletApplicationEngine` engine，它將您的應用程式控制權委派給 Servlet 容器。您可以從 [配置 WAR](server-war.md#configure-war) 了解如何配置您的應用程式。

## 執行應用程式 {id="run"}
> 在開發過程中重新啟動伺服器可能需要一些時間。Ktor 允許您透過使用 [Auto-reload](server-auto-reload.topic) 來克服此限制，它在程式碼變更時重新載入應用程式類別，並提供快速的回饋循環。

### 使用 Gradle/Maven 執行應用程式 {id="gradle-maven-run"}

要使用 Gradle 或 Maven 執行 Ktor 應用程式，請使用相應的 plugin：
*   Gradle 的 [Application](server-packaging.md) plugin。對於 [Native 伺服器](server-native.md)，請使用 [Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform) plugin。
*   Maven 的 [Exec](https://www.mojohaus.org/exec-maven-plugin/) plugin。

> 要了解如何在 IntelliJ IDEA 中執行 Ktor 應用程式，請參閱 IntelliJ IDEA 文件中的 [執行 Ktor 應用程式](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app) 部分。

### 執行打包好的應用程式 {id="package"}

在部署您的應用程式之前，您需要以 [打包](server-deployment.md#packaging) 部分中描述的其中一種方式將其打包。
從產生的 package 執行 Ktor 應用程式取決於 package 類型，可能如下所示：
*   要執行打包在 fat JAR 中的 Ktor 伺服器並覆寫配置的 port，請執行以下命令：
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
*   要執行使用 Gradle [Application](server-packaging.md) plugin 打包的應用程式，請執行相應的可執行檔：

   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./ktor-sample"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="ktor-sample.bat"/>
   </TabItem>
   </Tabs>
  
*   要執行 Servlet Ktor 應用程式，請使用 [Gretty](server-war.md#run) plugin 的 `run` task。

    ```