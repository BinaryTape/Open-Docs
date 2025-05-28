[//]: # (title: サーバーエンジン)

<show-structure for="chapter" depth="3"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学びます。
</link-summary>

Ktorサーバーアプリケーションを実行するには、まずサーバーを[作成](server-create-and-configure.topic)して構成する必要があります。
サーバーの構成には、さまざまな設定が含まれます。
- ネットワークリクエストを処理するための[エンジン](#supported-engines);
- サーバーへのアクセスに使用されるホストとポートの値;
- SSL設定;
- ...など。

## サポートされているエンジン {id="supported-engines"}

以下の表は、Ktorでサポートされているエンジンと、サポートされているプラットフォームを示しています。

| エンジン                                  | プラットフォーム                                            | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (Coroutine-based I/O)             | JVM, [Native](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 依存関係の追加 {id="dependencies"}

目的のエンジンを使用する前に、対応する依存関係を[ビルドスクリプト](server-dependencies.topic)に追加する必要があります。

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

以下は、Nettyの依存関係を追加する例です。

<var name="artifact_name" value="ktor-server-netty"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## サーバーの作成方法を選択する {id="choose-create-server"}
Ktorサーバーアプリケーションは、[2つの方法](server-create-and-configure.topic#embedded)で[作成して実行できます](server-create-and-configure.topic#embedded)。コード内でサーバーパラメータをすばやく渡すには[embeddedServer](#embeddedServer)を使用し、外部の`application.conf`または`application.yaml`ファイルから構成を読み込むには[EngineMain](#EngineMain)を使用します。

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html)関数は、特定のタイプのエンジンを作成するために使用されるエンジンファクトリを受け入れます。以下の例では、Nettyエンジンでサーバーを実行し、`8080`ポートでリッスンするために[Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html)ファクトリを渡します。

```kotlin
```

{src="snippets/embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="3-7,13,28-35"}

### EngineMain {id="EngineMain"}

`EngineMain`は、サーバーを実行するためのエンジンを表します。以下のエンジンを使用できます。

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main`関数は、選択したエンジンでサーバーを起動し、外部の[構成ファイル](server-configuration-file.topic)で指定された[アプリケーションモジュール](server-modules.md)を読み込むために使用されます。以下の例では、アプリケーションの`main`関数からサーバーを起動します。

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

ビルドシステムタスクを使用してサーバーを起動する必要がある場合は、必要な`EngineMain`をメインクラスとして構成する必要があります。

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

## エンジンの構成 {id="configure-engine"}

このセクションでは、さまざまなエンジン固有のオプションを指定する方法について説明します。

### コード内で {id="embedded-server-configure"}

<include from="server-configuration-code.topic" element-id="embedded-engine-configuration"/>

### 構成ファイル内で {id="engine-main-configure"}

<include from="server-configuration-file.topic" element-id="engine-main-configuration"/>