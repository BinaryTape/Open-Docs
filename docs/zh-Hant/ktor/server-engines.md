[//]: # (title: 伺服器引擎)

<show-structure for="chapter" depth="3"/>

<link-summary>
了解處理網路請求的引擎。
</link-summary>

若要執行 Ktor 伺服器應用程式，您需要首先[建立](server-create-and-configure.topic)並配置伺服器。
伺服器配置包含不同的設定：
- 用於處理網路請求的[引擎](#supported-engines)；
- 用於存取伺服器的主機和連接埠值；
- SSL 設定；
- ... 等等。

## 支援的引擎 {id="supported-engines"}

下表列出了 Ktor 支援的引擎及其支援的平台：

| 引擎                                  | 平台                                                 | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (Coroutine-based I/O)             | JVM、[Native](server-native.md)、[GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 新增依賴項 {id="dependencies"}

在使用所需引擎之前，您需要將相應的依賴項新增到您的[建構指令碼](server-dependencies.topic)中：

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

以下是新增 Netty 依賴項的範例：

<var name="artifact_name" value="ktor-server-netty"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 選擇如何建立伺服器 {id="choose-create-server"}
Ktor 伺服器應用程式可以[透過兩種方式建立和執行](server-create-and-configure.topic#embedded)：使用 [embeddedServer](#embeddedServer) 在程式碼中快速傳遞伺服器參數，或使用 [EngineMain](#EngineMain) 從外部的 `application.conf` 或 `application.yaml` 檔案載入配置。

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 函式接受一個引擎工廠，該工廠用於建立特定類型的引擎。在下面的範例中，我們傳遞 [Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 工廠來執行使用 Netty 引擎的伺服器並監聽 `8080` 連接埠：

[object Promise]

### EngineMain {id="EngineMain"}

`EngineMain` 代表用於執行伺服器的引擎。您可以使用以下引擎：

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main` 函式用於啟動選定引擎的伺服器，並載入外部[配置檔案](server-configuration-file.topic)中指定的[應用程式模組](server-modules.md)。在下面的範例中，我們從應用程式的 `main` 函式啟動伺服器：

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>

<tab title="application.conf">

[object Promise]

</tab>

<tab title="application.yaml">

[object Promise]

</tab>
</tabs>

如果您需要使用建構系統任務啟動伺服器，則需要將所需的 `EngineMain` 配置為主類別：

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

在本節中，我們將了解如何指定各種引擎特定的選項。

### 在程式碼中 {id="embedded-server-configure"}

        <p>
            <code>embeddedServer</code> 函式允許您使用 <code>configure</code> 參數傳遞引擎特定的選項。此參數包含所有引擎通用的選項，並由
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
                ApplicationEngine.Configuration
            </a>
            類別公開。
        </p>
        <p>
            以下範例展示了如何使用 <code>Netty</code> 引擎配置伺服器。在 <code>configure</code> 區塊中，我們定義一個 <code>connector</code> 以指定主機和連接埠，並自訂各種伺服器參數：
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code> 方法定義了一個連接器，其中包含指定的主機 (<code>127.0.0.1</code>) 和連接埠 (<code>8080</code>)。
        </p>
        <p>除了這些選項外，您還可以配置其他引擎特定的屬性。</p>
        <chapter title="Netty" id="netty-code">
            <p>
                Netty 特定的選項由
                <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
                    NettyApplicationEngine.Configuration
                </a>
                類別公開。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Jetty" id="jetty-code">
            <p>
                Jetty 特定的選項由
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
                    JettyApplicationEngineBase.Configuration
                </a>
                類別公開。
            </p>
            <p>您可以在
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
                    configureServer
                </a>
                區塊內配置 Jetty 伺服器，該區塊提供對
                <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
                實例的存取。
            </p>
            <p>
                使用 <code>idleTimeout</code> 屬性指定連接在關閉前可以閒置的時長。
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO 特定的選項由
                <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
                    CIOApplicationEngine.Configuration
                </a>
                類別公開。
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>如果您使用 Tomcat 作為引擎，您可以使用
                <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
                    configureTomcat
                </a>
                屬性配置它，該屬性提供對
                <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
                實例的存取。
            </p>
            [object Promise]
        </chapter>
        

### 在配置檔案中 {id="engine-main-configure"}

            <p>
                如果您使用 <code>EngineMain</code>，您可以在 <code>ktor.deployment</code> 群組中指定所有引擎通用的選項。
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="engine-main-conf">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="engine-main-yaml">
                    [object Promise]
                </tab>
            </tabs>
            <chapter title="Netty" id="netty-file">
                <p>
                    您也可以在配置檔案中，在 <code>ktor.deployment</code> 群組內配置 Netty 特定的選項：
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon" id="application-conf-1">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml" id="application-yaml-1">
                        [object Promise]
                    </tab>
                </tabs>
            </chapter>