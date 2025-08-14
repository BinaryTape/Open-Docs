[//]: # (title: Nativeサーバー)

<tldr>
<var name="example_name" value="embedded-server-native"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。
</link-summary>

Ktorは[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。現在、Kotlin/NativeでKtorサーバーを実行するには以下の制限があります。
*   [サーバーは`embeddedServer`を使用して作成する](server-create-and-configure.topic)必要があります。
*   [CIOエンジン](server-engines.md)のみがサポートされています。
*   リバースプロキシなしの[HTTPS](server-ssl.md)はサポートされていません。
*   Windows [ターゲット](server-platforms.md)はサポートされていません。

## 依存関係の追加 {id="add-dependencies"}

Kotlin/NativeプロジェクトのKtorサーバーには、少なくとも2つの依存関係が必要です。`ktor-server-core`依存関係とエンジン依存関係（CIO）です。以下のコードスニペットは、`build.gradle.kts`ファイルの`nativeMain`ソースセットに依存関係を追加する方法を示しています。

Nativeサーバーを[テスト](server-testing.md)するには、`ktor-server-test-host`アーティファクトを`nativeTest`ソースセットに追加します。

## ネイティブターゲットの設定 {id="native-target"}

必要なネイティブターゲットを指定し、`binaries`プロパティを使用して[ネイティブバイナリを宣言](https://kotlinlang.org/docs/mpp-build-native-binaries.html)します。

完全な例はこちらで確認できます: [embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native)。

## サーバーの作成 {id="create-server"}

Gradleビルドスクリプトを設定した後、ここに記載されているようにKtorサーバーを作成できます: [](server-create-and-configure.topic)。