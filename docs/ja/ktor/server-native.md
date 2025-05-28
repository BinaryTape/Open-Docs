[//]: # (title: ネイティブサーバー)

<tldr>
<var name="example_name" value="embedded-server-native"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。
</link-summary>

Ktorは[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。現在、Kotlin/NativeでKtorサーバーを実行する場合、以下の制限があります。
* サーバーは`embeddedServer`を使用して[作成する必要があります](server-create-and-configure.topic)。
* [CIOエンジン](server-engines.md)のみがサポートされています。
* リバースプロキシなしの[HTTPS](server-ssl.md)はサポートされていません。
* Windows [ターゲット](server-platforms.md)はサポートされていません。

<include from="client-engines.md" element-id="newmm-note"/>

## 依存関係を追加する {id="add-dependencies"}

Kotlin/NativeプロジェクトのKtorサーバーには、少なくとも2つの依存関係が必要です: `ktor-server-core`の依存関係とエンジン依存関係 (CIO)。以下のコードスニペットは、`build.gradle.kts`ファイル内の`nativeMain`ソースセットに依存関係を追加する方法を示しています。

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="33-39,46"}

ネイティブサーバーを[テストする](server-testing.md)には、`ktor-server-test-host`アーティファクトを`nativeTest`ソースセットに追加します。

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="33,40-46"}

## ネイティブターゲットを構成する {id="native-target"}

必要なネイティブターゲットを指定し、`binaries`プロパティを使用して[ネイティブバイナリを宣言します](https://kotlinlang.org/docs/mpp-build-native-binaries.html)。

```kotlin
```
{src="snippets/embedded-server-native/build.gradle.kts" include-lines="16-32"}

完全な例はこちらで見つけることができます: [embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## サーバーを作成する {id="create-server"}

Gradleビルドスクリプトを構成した後、こちらに記載されているようにKtorサーバーを作成できます: [](server-create-and-configure.topic)。