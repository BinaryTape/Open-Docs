[//]: # (title: 伺服器引擎)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解處理網路請求的引擎。
</link-summary>

要執行 Ktor 伺服器應用程式，您需要先[建立](server-create-and-configure.topic)並配置伺服器。
伺服器配置包含不同的設定：
- 用於處理網路請求的[引擎](#supported-engines)；
- 用於存取伺服器的主機和連接埠值；
- SSL 設定；
- ... 等等。

## 支援的引擎 {id="supported-engines"}

下表列出了 Ktor 支援的引擎，以及支援的平台：

| 引擎                                  | 平台                                            | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (基於協程的 I/O)             | JVM, [Native](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 新增依賴項 {id="dependencies"}

在使用所需的引擎之前，您需要將相應的依賴項新增到您的[構建腳本](server-dependencies.topic)中：

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

以下是新增 Netty 依賴項的範例：

<var name="artifact_name" value="ktor-server-netty"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 選擇如何建立伺服器 {id="choose-create-server"}
Ktor 伺服器應用程式可以[透過兩種方式建立和執行](server-create-and-configure.topic#embedded)：使用[embeddedServer](#embeddedServer) 在程式碼中快速傳遞伺服器參數，或使用[EngineMain](#EngineMain) 從外部的 `application.conf` 或 `application.yaml` 檔案載入配置。

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 函數接受一個引擎工廠，用於建立特定類型的引擎。在下面的範例中，我們傳遞 [Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 工廠，以 Netty 引擎執行伺服器並監聽 `8080` 連接埠：

```kotlin
```

{src="snippets/embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="3-7,13,28-35"}

### EngineMain {id="EngineMain"}

`EngineMain` 代表一個用於執行伺服器的引擎。您可以使用以下引擎：

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main` 函數用於使用選定的引擎啟動伺服器，並載入外部[配置檔案](server-configuration-file.topic)中指定的[應用程式模組](server-modules.md)。在下面的範例中，我們從應用程式的 `main` 函數啟動伺服器：

<tabs>
<tab title="Application.kt">

```kotlin
```

{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>

<tab title="application.conf">

```shell
```

{src="snippets/engine-main/src/main/resources/application.conf"}

</tab>

<tab title="application.yaml">

```yaml
```

{src="snippets/engine-main-yaml/src/main/resources/application.yaml"}

</tab>
</tabs>

如果您需要使用構建系統任務啟動伺服器，您需要將所需的 `EngineMain` 配置為主類別：

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

## 配置引擎 {id="configure-engine"}

在本節中，我們將探討如何指定各種引擎特有的選項。

### 在程式碼中 {id="embedded-server-configure"}

<include from="server-configuration-code.topic" element-id="embedded-engine-configuration"/>

### 在配置檔案中 {id="engine-main-configure"}

<include from="server-configuration-file.topic" element-id="engine-main-configuration"/>