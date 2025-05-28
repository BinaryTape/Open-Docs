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
WARアーカイブを使用して、Ktorアプリケーションをサーブレットコンテナ内で実行およびデプロイする方法を学びます。
</link-summary>

Ktorアプリケーションは、TomcatやJettyを含むサーブレットコンテナ内で実行およびデプロイできます。サーブレットコンテナ内にデプロイするには、WARアーカイブを生成し、それをWARをサポートするサーバーまたはクラウドサービスにデプロイする必要があります。

このトピックでは、次の方法を示します。
* サーブレットアプリケーションでKtorを使用するように構成する
* WARアプリケーションの実行とパッケージ化のためにGrettyおよびWarプラグインを適用する
* Ktorサーブレットアプリケーションを実行する
* WARアーカイブを生成してデプロイする

## サーブレットアプリケーションでKtorを構成する {id="configure-ktor"}

Ktorでは、目的のエンジン（Netty、Jetty、Tomcatなど）を使用して、アプリケーション内で直接[サーバーを作成して起動](server-create-and-configure.topic)できます。この場合、アプリケーションがエンジン設定、接続、およびSSLオプションを制御します。

上記のアプローチとは対照的に、サーブレットコンテナはアプリケーションのライフサイクルと接続設定を制御すべきです。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な[ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html)エンジンを提供します。

> [接続とSSL設定](server-configuration-file.topic)は、Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合は有効になりません。
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl)サンプルは、TomcatでSSLを構成する方法を示しています。

### 依存関係を追加する {id="add-dependencies"}

サーブレットアプリケーションでKtorを使用するには、ビルドスクリプトに`ktor-server-servlet-jakarta`アーティファクトを含める必要があります。

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

Tomcat/Jettyの9.x以前のバージョンを使用している場合は、代わりに`ktor-server-servlet`アーティファクトを追加します。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、個別の[JettyまたはTomcatのアーティファクト](server-engines.md#dependencies)は必要ありません。

### サーブレットを構成する {id="configure-servlet"}

アプリケーションにKtorサーブレットを登録するには、`WEB-INF/web.xml`ファイルを開き、`servlet-class`属性に`ServletApplicationEngine`を割り当てます。

<tabs>
<tab title="Tomcat/Jetty v10.x+">

```xml
```
{src="snippets/jetty-war/src/main/webapp/WEB-INF/web.xml" include-lines="7-16"}

</tab>
<tab title="Tomcat/Jetty v9.x">
<code-block lang="XML">
<![CDATA[
<servlet>
    <display-name>KtorServlet</display-name>
    <servlet-name>KtorServlet</servlet-name>
    <servlet-class>io.ktor.server.servlet.ServletApplicationEngine</servlet-class>
    <init-param>
        <param-name>io.ktor.ktor.config</param-name>
        <param-value>application.conf</param-value>
    </init-param>
    <async-supported>true</async-supported>
</servlet>
]]>
</code-block>
</tab>
</tabs>

次に、このサーブレットのURLパターンを構成します。

```xml
```
{src="snippets/jetty-war/src/main/webapp/WEB-INF/web.xml" include-lines="18-21"}

## Grettyを構成する {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty)プラグインを使用すると、JettyおよびTomcat上でサーブレットアプリケーションを[実行](#run)できます。このプラグインをインストールするには、`build.gradle.kts`ファイルを開き、`plugins`ブロックに以下のコードを追加します。

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="5,8,10"}

次に、`gretty`ブロックで次のように構成できます。

<tabs>
<tab title="Jetty">

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="12-16"}

</tab>
<tab title="Tomcat">

```groovy
```
{src="snippets/tomcat-war/build.gradle.kts" include-lines="12-16"}

</tab>
</tabs>

最後に、`run`タスクを構成します。

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="32-36"}

## Warを構成する {id="configure-war"}

Warプラグインを使用すると、WARアーカイブを[生成](#generate-war)できます。このプラグインは、`build.gradle.kts`ファイルの`plugins`ブロックに以下の行を追加することでインストールできます。

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="5,9-10"}

## アプリケーションを実行する {id="run"}

[構成されたGrettyプラグイン](#configure-gretty)を使用するサーブレットアプリケーションは、`run`タスクを使用して実行できます。例えば、以下のコマンドは[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)の例を実行します。

```Bash
./gradlew :jetty-war:run
```

## WARアーカイブを生成してデプロイする {id="generate-war"}

[Warプラグイン](#configure-war)を使用してアプリケーションのWARファイルを生成するには、`war`タスクを実行します。[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)の例では、コマンドは次のようになります。

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war`は`build/libs`ディレクトリに作成されます。生成されたアーカイブは、`jetty/webapps`ディレクトリにコピーすることで、サーブレットコンテナ内にデプロイできます。例えば、以下に示す`Dockerfile`は、作成されたWARをJettyまたはTomcatサーブレットコンテナ内で実行する方法を示しています。

<tabs>
<tab title="Jetty">

```Docker
```
{src="snippets/jetty-war/Dockerfile"}

</tab>
<tab title="Tomcat">

```Docker
```
{src="snippets/tomcat-war/Dockerfile"}

</tab>
</tabs>

完全な例は、[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)と[tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)で確認できます。