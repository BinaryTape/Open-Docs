[//]: # (title: WAR)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war">jetty-war</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war">tomcat-war</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl">tomcat-war-ssl</a>
</p>
</tldr>

<link-summary>
學習如何在 servlet 容器中，使用 WAR 歸檔來執行與部署 Ktor 應用程式。
</link-summary>

Ktor 應用程式可以在包含 Tomcat 和 Jetty 的 servlet 容器中執行與部署。要在 servlet 容器中部署，您需要生成一個 WAR 歸檔，然後將其部署到支援 WAR 的伺服器或雲端服務。

在本主題中，我們將向您展示如何：
* 設定 Ktor 以在 servlet 應用程式中使用；
* 應用 Gretty 和 War 外掛程式來執行與打包 WAR 應用程式；
* 執行 Ktor servlet 應用程式；
* 生成並部署 WAR 歸檔。

## 在 servlet 應用程式中設定 Ktor {id="configure-ktor"}

Ktor 允許您直接在應用程式中，使用所需的引擎（例如 Netty、Jetty 或 Tomcat）來[建立並啟動伺服器](server-create-and-configure.topic)。在此情況下，您的應用程式可以控制引擎設定、連線和 SSL 選項。

與上述方法相反，servlet 容器應該控制應用程式生命週期和連線設定。Ktor 提供了一個特殊的 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 引擎，可將應用程式的控制權委託給 servlet 容器。

> 請注意，當 Ktor 應用程式部署在 servlet 容器中時，[連線和 SSL 設定](server-configuration-file.topic)不會生效。
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 範例展示了如何在 Tomcat 中設定 SSL。

### 新增依賴項 {id="add-dependencies"}

若要在 servlet 應用程式中使用 Ktor，您需要在建置腳本中包含 `ktor-server-servlet-jakarta` artifact：

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>

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
    

如果您使用 9.x 或更早版本的 Tomcat/Jetty，請改為新增 `ktor-server-servlet` artifact。

> 請注意，當 Ktor 應用程式部署在 servlet 容器中時，您不需要單獨的 [Jetty 或 Tomcat artifact](server-engines.md#dependencies)。

### 設定 servlet {id="configure-servlet"}

若要在應用程式中註冊 Ktor servlet，請開啟 `WEB-INF/web.xml` 檔案並將 `ServletApplicationEngine` 指定給 `servlet-class` 屬性：

<tabs>
<tab title="Tomcat/Jetty v10.x+">

[object Promise]

</tab>
<tab title="Tomcat/Jetty v9.x">
[object Promise]
</tab>
</tabs>

然後，設定此 servlet 的 URL 模式：

[object Promise]

## 設定 Gretty {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 外掛程式允許您在 Jetty 和 Tomcat 上[執行](#run) servlet 應用程式。若要安裝此外掛程式，請開啟 `build.gradle.kts` 檔案並將以下程式碼新增至 `plugins` 區塊：

[object Promise]

然後，您可以在 `gretty` 區塊中如下設定它：

<tabs>
<tab title="Jetty">

[object Promise]

</tab>
<tab title="Tomcat">

[object Promise]

</tab>
</tabs>

最後，設定 `run` 任務：

[object Promise]

## 設定 War {id="configure-war"}

War 外掛程式允許您[生成](#generate-war) WAR 歸檔。您可以透過將以下行新增至 `build.gradle.kts` 檔案中的 `plugins` 區塊來安裝它：

[object Promise]

## 執行應用程式 {id="run"}

您可以使用[已設定的 Gretty 外掛程式](#configure-gretty)來執行 servlet 應用程式，方法是使用 `run` 任務。例如，以下命令執行 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 範例：

```Bash
./gradlew :jetty-war:run
```

## 生成並部署 WAR 歸檔 {id="generate-war"}

若要使用 [War](#configure-war) 外掛程式生成帶有您應用程式的 WAR 檔案，請執行 `war` 任務。對於 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 範例，命令如下所示：

```Bash
./gradlew :jetty-war:war
```

在 `build/libs` 目錄中會建立 `jetty-war.war`。您可以將生成的歸檔複製到 `jetty/webapps` 目錄中，以將其部署到 servlet 容器中。例如，以下 `Dockerfile` 顯示了如何在 Jetty 或 Tomcat servlet 容器中執行建立的 WAR：

<tabs>
<tab title="Jetty">

[object Promise]

</tab>
<tab title="Tomcat">

[object Promise]

</tab>
</tabs>

您可以在此處找到完整的範例：[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 和 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。