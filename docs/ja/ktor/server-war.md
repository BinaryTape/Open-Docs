[//]: # (title: WAR)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war">jetty-war</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war">tomcat-war</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl">tomcat-war-ssl</a>
</p>
</tldr>

<link-summary>
WARアーカイブを使用して、サーブレットコンテナ内でKtorアプリケーションを実行およびデプロイする方法を学びます。
</link-summary>

Ktorアプリケーションは、TomcatやJettyを含むサーブレットコンテナ内で実行およびデプロイできます。サーブレットコンテナ内にデプロイするには、WARアーカイブを生成し、それをWARをサポートするサーバーまたはクラウドサービスにデプロイする必要があります。

このトピックでは、以下の方法について説明します。
* サーブレットアプリケーションでKtorを使用するように設定する。
* WARアプリケーションの実行とパッケージングのためにGrettyとWarプラグインを適用する。
* Ktorサーブレットアプリケーションを実行する。
* WARアーカイブを生成してデプロイする。

## サーブレットアプリケーションでのKtorの設定 {id="configure-ktor"}

Ktorは、[必要なエンジン](server-create-and-configure.topic)（Netty、Jetty、Tomcatなど）を使って、アプリケーション内でサーバーを[作成および起動](server-create-and-configure.topic)することを可能にします。この場合、アプリケーションはエンジンの設定、接続、SSLオプションを制御できます。

上記のアプローチとは対照的に、サーブレットコンテナがアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な[ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html)エンジンを提供します。

> [接続とSSLの設定](server-configuration-file.topic)は、Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、有効にならないことに注意してください。
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl)サンプルは、TomcatでSSLを設定する方法を示しています。

### 依存関係の追加 {id="add-dependencies"}

サーブレットアプリケーションでKtorを使用するには、`ktor-server-servlet-jakarta`アーティファクトをビルドスクリプトに含める必要があります。

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

Tomcat/Jettyの9.x以前のバージョンを使用している場合は、代わりに`ktor-server-servlet`アーティファクトを追加してください。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、個別の[JettyまたはTomcatのアーティファクト](server-engines.md#dependencies)は必要ないことに注意してください。

### サーブレットの設定 {id="configure-servlet"}

アプリケーションにKtorサーブレットを登録するには、`WEB-INF/web.xml`ファイルを開き、`ServletApplicationEngine`を`servlet-class`属性に割り当てます。

<Tabs>
<TabItem title="Tomcat/Jetty v10.x以上">

```xml
<servlet>
    <display-name>KtorServlet</display-name>
    <servlet-name>KtorServlet</servlet-name>
    <servlet-class>io.ktor.server.servlet.jakarta.ServletApplicationEngine</servlet-class>
    <init-param>
        <param-name>io.ktor.ktor.config</param-name>
        <param-value>application.conf</param-value>
    </init-param>
    <async-supported>true</async-supported>
</servlet>
```

</TabItem>
<TabItem title="Tomcat/Jetty v9.x">
<code-block lang="XML" code="&lt;servlet&gt;&#10;    &lt;display-name&gt;KtorServlet&lt;/display-name&gt;&#10;    &lt;servlet-name&gt;KtorServlet&lt;/servlet-name&gt;&#10;    &lt;servlet-class&gt;io.ktor.server.servlet.ServletApplicationEngine&lt;/servlet-class&gt;&#10;    &lt;init-param&gt;&#10;        &lt;param-name&gt;io.ktor.ktor.config&lt;/param-name&gt;&#10;        &lt;param-value&gt;application.conf&lt;/param-value&gt;&#10;    &lt;/init-param&gt;&#10;    &lt;async-supported&gt;true&lt;/async-supported&gt;&#10;&lt;/servlet&gt;"/>
</TabItem>
</Tabs>

次に、このサーブレットのURLパターンを設定します。

```xml
<servlet-mapping>
    <servlet-name>KtorServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

## Grettyの設定 {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty)プラグインを使用すると、JettyおよびTomcatでサーブレットアプリケーションを[実行](#run)できます。このプラグインをインストールするには、`build.gradle.kts`ファイルを開き、`plugins`ブロックに以下のコードを追加します。

```groovy
plugins {
    id("org.gretty") version "4.0.3"
}
```

次に、`gretty`ブロックで以下のように設定できます。

<Tabs>
<TabItem title="Jetty">

```groovy
gretty {
    servletContainer = "jetty11"
    contextPath = "/"
    logbackConfigFile = "src/main/resources/logback.xml"
}
```

</TabItem>
<TabItem title="Tomcat">

```groovy
gretty {
    servletContainer = "tomcat10"
    contextPath = "/"
    logbackConfigFile = "src/main/resources/logback.xml"
}
```

</TabItem>
</Tabs>

最後に、`run`タスクを設定します。

```groovy
afterEvaluate {
    tasks.getByName("run") {
        dependsOn("appRun")
    }
}
```

## Warの設定 {id="configure-war"}

Warプラグインを使用すると、WARアーカイブを[生成](#generate-war)できます。`build.gradle.kts`ファイルの`plugins`ブロックに以下の行を追加することでインストールできます。

```groovy
plugins {
    id("war")
}
```

## アプリケーションの実行 {id="run"}

[設定済みのGrettyプラグイン](#configure-gretty)を使用して、`run`タスクを使ってサーブレットアプリケーションを実行できます。例えば、以下のコマンドは[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)の例を実行します。

```Bash
./gradlew :jetty-war:run
```

## WARアーカイブの生成とデプロイ {id="generate-war"}

[War](#configure-war)プラグインを使用してアプリケーションのWARファイルを生成するには、`war`タスクを実行します。[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)の例では、コマンドは以下のようになります。

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war`は`build/libs`ディレクトリに作成されます。生成されたアーカイブは、`jetty/webapps`ディレクトリにコピーすることで、サーブレットコンテナ内にデプロイできます。例えば、以下の`Dockerfile`は、作成されたWARをJettyまたはTomcatサーブレットコンテナ内で実行する方法を示しています。

<Tabs>
<TabItem title="Jetty">

```Docker
FROM jetty:11.0.25
EXPOSE 8080:8080
COPY ./build/libs/jetty-war.war/ /var/lib/jetty/webapps
WORKDIR /var/lib/jetty
CMD ["java","-jar","/usr/local/jetty/start.jar"]

```

</TabItem>
<TabItem title="Tomcat">

```Docker
FROM tomcat:10.1.41
EXPOSE 8080:8080
COPY ./build/libs/tomcat-war.war/ /usr/local/tomcat/webapps
WORKDIR /usr/local/tomcat
CMD ["catalina.sh", "run"]

```

</TabItem>
</Tabs>

完全な例はこちらで確認できます: [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) および [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。