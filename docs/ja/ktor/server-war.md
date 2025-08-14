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

このトピックでは、次の方法について説明します。
*   サーブレットアプリケーションでKtorを使用するための設定
*   WARアプリケーションの実行とパッケージングのためのGrettyおよびWarプラグインの適用
*   Ktorサーブレットアプリケーションの実行
*   WARアーカイブの生成とデプロイ

## サーブレットアプリケーションでのKtorの設定 {id="configure-ktor"}

Ktorを使用すると、アプリケーション内で目的のエンジン（Netty、Jetty、Tomcatなど）を使って[サーバーを作成して起動](server-create-and-configure.topic)できます。この場合、アプリケーションはエンジン設定、接続、SSLオプションを制御します。

上記のアプローチとは対照的に、サーブレットコンテナはアプリケーションのライフサイクルと接続設定を制御する必要があります。Ktorは、アプリケーションの制御をサーブレットコンテナに委譲する特別な[ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html)エンジンを提供します。

> Ktorアプリケーションがサーブレットコンテナ内にデプロイされている場合、[接続とSSL設定](server-configuration-file.topic)は適用されないことに注意してください。
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl)サンプルは、TomcatでSSLを設定する方法を示しています。

### 依存関係の追加 {id="add-dependencies"}

サーブレットアプリケーションでKtorを使用するには、`ktor-server-servlet-jakarta`アーティファクトをビルドスクリプトに含める必要があります。

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
    

Tomcat/Jettyの9.x以前のバージョンを使用する場合は、代わりに`ktor-server-servlet`アーティファクトを追加してください。

> Ktorアプリケーションをサーブレットコンテナ内にデプロイする場合、個別の[JettyまたはTomcatアーティファクト](server-engines.md#dependencies)は不要であることに注意してください。

### サーブレットの設定 {id="configure-servlet"}

アプリケーションにKtorサーブレットを登録するには、`WEB-INF/web.xml`ファイルを開き、`ServletApplicationEngine`を`servlet-class`属性に割り当てます。

<tabs>
<tab title="Tomcat/Jetty v10.x+">

[object Promise]

</tab>
<tab title="Tomcat/Jetty v9.x">
[object Promise]
</tab>
</tabs>

次に、このサーブレットのURLパターンを設定します。

[object Promise]

## Grettyの設定 {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty)プラグインを使用すると、JettyおよびTomcat上でサーブレットアプリケーションを[実行](#run)できます。このプラグインをインストールするには、`build.gradle.kts`ファイルを開き、`plugins`ブロックに以下のコードを追加します。

[object Promise]

次に、`gretty`ブロックで次のように設定できます。

<tabs>
<tab title="Jetty">

[object Promise]

</tab>
<tab title="Tomcat">

[object Promise]

</tab>
</tabs>

最後に、`run`タスクを設定します。

[object Promise]

## Warの設定 {id="configure-war"}

Warプラグインを使用すると、WARアーカイブを[生成](#generate-war)できます。`build.gradle.kts`ファイルの`plugins`ブロックに以下の行を追加することでインストールできます。

[object Promise]

## アプリケーションの実行 {id="run"}

[設定済みのGrettyプラグイン](#configure-gretty)を使用すると、`run`タスクでサーブレットアプリケーションを実行できます。例えば、以下のコマンドは[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)の例を実行します。

```Bash
./gradlew :jetty-war:run
```

## WARアーカイブの生成とデプロイ {id="generate-war"}

[War](#configure-war)プラグインを使用してアプリケーションのWARファイルを生成するには、`war`タスクを実行します。[jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)の例では、コマンドは次のようになります。

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war`は`build/libs`ディレクトリに作成されます。生成されたアーカイブは、`jetty/webapps`ディレクトリにコピーすることでサーブレットコンテナ内にデプロイできます。例えば、以下の`Dockerfile`は、作成されたWARをJettyまたはTomcatサーブレットコンテナ内で実行する方法を示しています。

<tabs>
<tab title="Jetty">

[object Promise]

</tab>
<tab title="Tomcat">

[object Promise]

</tab>
</tabs>

完全な例は、こちらで確認できます: [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war)と[tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war)。