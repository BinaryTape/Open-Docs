[//]: # (title: モジュール)

<tldr>
<p>
<b>コード例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>モジュールを使用すると、ルーティングをグループ化してアプリケーションを構造化できます。</link-summary>

Ktorでは、モジュールを使用して、特定のモジュール内に特定の[ルーティング](server-routing.md)セットを定義することで、アプリケーションを[構造化](server-application-structure.md)できます。モジュールは、[Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)クラスの_[拡張関数](https://kotlinlang.org/docs/extensions.html)_です。以下の例では、`module1`拡張関数が、`/module1` URLパスへのGETリクエストを受け入れるモジュールを定義しています。

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-15"}

アプリケーションでのモジュールの読み込みは、[サーバーの作成方法](server-create-and-configure.topic)によって異なります。`embeddedServer`関数を使用したコード内での作成、または`application.conf`設定ファイルの使用です。

> 指定されたモジュールにインストールされた[プラグイン](server-plugins.md#install)は、他のロードされたモジュールにも有効であることに注意してください。

## embeddedServer {id="embedded-server"}

通常、`embeddedServer`関数はモジュールをラムダ引数として暗黙的に受け取ります。
[](server-create-and-configure.topic#embedded-server)セクションで例を見ることができます。
また、アプリケーションロジックを別のモジュールに抽出し、
このモジュールへの参照を`module`パラメーターとして渡すこともできます。

```kotlin
```
{src="snippets/embedded-server-modules/src/main/kotlin/com/example/Application.kt"}

完全な例は、こちらで見つけることができます: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 設定ファイル {id="hocon"}

`application.conf`または`application.yaml`ファイルを使用してサーバーを設定する場合、`ktor.application.modules`プロパティを使用してロードするモジュールを指定する必要があります。

2つのパッケージに3つのモジュールが定義されているとします。`com.example`パッケージに2つ、`org.sample`パッケージに1つです。

<tabs>
<tab title="Application.kt">

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt"}

</tab>
<tab title="Sample.kt">

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/org/sample/Sample.kt"}

</tab>
</tabs>

設定ファイル内でこれらのモジュールを参照するには、完全修飾名を提供する必要があります。
完全修飾モジュール名には、クラスの完全修飾名と拡張関数名が含まれます。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```
{src="snippets/engine-main-modules/src/main/resources/application.conf" include-lines="1,5-10"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```
{src="snippets/engine-main-modules/src/main/resources/_application.yaml" include-lines="1,4-8"}

</tab>
</tabs>

完全な例は、こちらで見つけることができます: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。