[//]: # (title: C interopとlibcurlを使ってアプリを作成する – チュートリアル)

> Cライブラリのインポートは[ベータ版](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)です。cinteropツールによってCライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが付加されます。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIのみオプトインが必要です。
>
{style="note"}

このチュートリアルでは、IntelliJ IDEA を使用してコマンドラインアプリケーションを作成する方法を説明します。Kotlin/Native と libcurl ライブラリを使用して、特定のプラットフォームでネイティブに実行できるシンプルな HTTP クライアントを作成する方法を学びます。

出力されるのは、macOS および Linux で実行し、簡単な HTTP GET リクエストを実行できる実行可能なコマンドラインアプリです。

Kotlin ライブラリは、コマンドラインを使って直接、またはスクリプトファイル（`.sh`や`.bat`ファイルなど）で生成できます。しかし、このアプローチは、何百ものファイルやライブラリを持つ大規模なプロジェクトにはうまくスケールしません。ビルドシステムを使用すると、Kotlin/Native コンパイラバイナリとライブラリを推移的な依存関係とともにダウンロードしてキャッシュするだけでなく、コンパイラとテストの実行も行うことで、プロセスが簡素化されます。Kotlin/Native は、[Kotlin Multiplatform プラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて [Gradle](https://gradle.org) ビルドシステムを使用できます。

## 開始する前に

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。
2.  IntelliJ IDEA で **File** | **New** | **Project from Version Control** を選択し、以下の URL を使用して [プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard) をクローンします。

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  プロジェクト構造を確認します。

    ![Native application project structure](native-project-structure.png){width=700}

    このテンプレートには、すぐに開始するために必要なファイルとフォルダーを含むプロジェクトが含まれています。Kotlin/Native で書かれたアプリケーションは、コードにプラットフォーム固有の要件がない場合、さまざまなプラットフォームをターゲットにできることを理解しておくことが重要です。コードは `nativeMain` ディレクトリに配置され、対応する `nativeTest` があります。このチュートリアルでは、フォルダー構造をそのままにしておきます。

4.  プロジェクト設定を含むビルドスクリプトである `build.gradle.kts` ファイルを開きます。ビルドファイル内の以下の点に特に注意してください。

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 -> macosX64("native")
            hostOs == "Linux" && isArm64 -> linuxArm64("native")
            hostOs == "Linux" && !isArm64 -> linuxX64("native")
            isMingwX64 -> mingwX64("native")
            else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
        }
    
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                }
            }
        }
    }
    
    ```

    *   ターゲットは macOS、Linux、Windows 用に `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64`、`mingwX64` を使用して定義されます。[サポートされているプラットフォーム](native-target-support.md)の完全なリストを参照してください。
    *   `binaries {}` ブロックは、バイナリがどのように生成されるか、およびアプリケーションのエントリポイントを定義します。これらはデフォルト値のままにしておくことができます。
    *   C 相互運用は、ビルドの追加ステップとして構成されます。デフォルトでは、C からのすべてのシンボルは `interop` パッケージにインポートされます。`.kt` ファイルでパッケージ全体をインポートすることもできます。[設定方法](gradle-configure-project.md#targeting-multiple-platforms)の詳細については、こちらをご覧ください。

## 定義ファイルの作成

ネイティブアプリケーションを記述する際には、HTTP リクエストの実行、ディスクからの読み書きなど、[Kotlin 標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/)に含まれていない特定の機能へのアクセスが必要になることがよくあります。

Kotlin/Native は、標準Cライブラリの利用を支援し、必要なほぼすべての機能のエコシステム全体を開放します。Kotlin/Native には、すでに一連のプレビルドされた[プラットフォームライブラリ](native-platform-libs.md)が同梱されており、標準ライブラリにいくつかの追加の共通機能を提供します。

相互運用における理想的なシナリオは、C 関数を Kotlin 関数を呼び出すかのように、同じシグネチャと規約に従って呼び出すことです。ここで cinterop ツールが役立ちます。これは、C ライブラリを受け取り、対応する Kotlin バインディングを生成して、ライブラリが Kotlin コードであるかのように使用できるようにします。

これらのバインディングを生成するには、各ライブラリに定義ファイルが必要です。通常、ライブラリと同じ名前になります。これは、ライブラリがどのように使用されるべきかを正確に記述するプロパティファイルです。

このアプリでは、HTTP 呼び出しを行うために libcurl ライブラリが必要になります。その定義ファイルを作成するには：

1.  `src` フォルダーを選択し、**File | New | Directory** で新しいディレクトリを作成します。
2.  新しいディレクトリに **nativeInterop/cinterop** と名前を付けます。これはヘッダーファイルの場所のデフォルトの規約ですが、別の場所を使用する場合は `build.gradle.kts` ファイルで上書きできます。
3.  この新しいサブフォルダーを選択し、**File | New | File** で新しい `libcurl.def` ファイルを作成します。
4.  ファイルを以下のコードで更新します。

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

    *   `headers` は、Kotlin スタブを生成するヘッダーファイルのリストです。ここに複数のファイルを追加でき、それぞれをスペースで区切ります。このケースでは、`curl.h` のみです。参照されるファイルは指定されたパス（このケースでは `/usr/include/curl`）で利用可能である必要があります。
    *   `headerFilter` は、何が正確に含まれるかを示します。C では、あるファイルが別のファイルを `#include` ディレクティブで参照すると、すべてのヘッダーも含まれます。場合によってはこれは必要なく、[グロブパターン](https://en.wikipedia.org/wiki/Glob_(programming))を使用してこのパラメータを追加することで調整できます。

        外部の依存関係（システム `stdint.h` ヘッダーなど）を相互運用ライブラリにフェッチしたくない場合は、`headerFilter` を使用できます。また、ライブラリサイズの最適化や、システムと提供されている Kotlin/Native コンパイル環境間の潜在的な競合の修正にも役立つ場合があります。

    *   特定のプラットフォームの動作を変更する必要がある場合は、`compilerOpts.osx` や `compilerOpts.linux` のような形式を使用して、プラットフォーム固有の値をオプションに提供できます。このケースでは、macOS（`.osx` サフィックス）と Linux（`.linux` サフィックス）です。サフィックスのないパラメータ（例: `linkerOpts=`）も可能で、すべてのプラットフォームに適用されます。

    利用可能なオプションの完全なリストについては、[定義ファイル](native-definition-file.md#properties)を参照してください。

> サンプルを動作させるには、システムに `curl` ライブラリのバイナリが必要です。macOS と Linux では通常含まれています。Windows では、[ソース](https://curl.se/download.html)からビルドできます（Microsoft Visual Studio または Windows SDK コマンドラインツールが必要です）。詳細については、[関連ブログ記事](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)を参照してください。あるいは、[MinGW/MSYS2](https://www.msys2.org/) `curl` バイナリを検討してもよいでしょう。
>
{style="note"}

## ビルドプロセスに相互運用を追加する

ヘッダーファイルを使用するには、ビルドプロセスの一部として生成されていることを確認してください。そのためには、`build.gradle.kts` ファイルに以下の `compilations {}` ブロックを追加します。

```kotlin
nativeTarget.apply {
    compilations.getByName("main") {
        cinterops {
            val libcurl by creating
        }
    }
    binaries {
        executable {
            entryPoint = "main"
        }
    }
}
```

まず、`cinterops` が追加され、次に定義ファイルのエントリが追加されます。デフォルトでは、ファイルの名前が使用されます。追加のパラメータでこれをオーバーライドできます。

```kotlin
cinterops {
    val libcurl by creating {
        definitionFile.set(project.file("src/nativeInterop/cinterop/libcurl.def"))
        packageName("com.jetbrains.handson.http")
        compilerOpts("-I/path")
        includeDirs.allHeaders("path")
    }
}
```

## アプリケーションコードを記述する

ライブラリとそれに対応する Kotlin スタブができたので、アプリケーションからそれらを使用できます。このチュートリアルでは、[simple.c](https://curl.se/libcurl/c/simple.html) の例を Kotlin に変換します。

`src/nativeMain/kotlin/` フォルダー内の `Main.kt` ファイルを以下のコードで更新します。

```kotlin
import kotlinx.cinterop.*
import libcurl.*

@OptIn(ExperimentalForeignApi::class)
fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```

ご覧のとおり、Kotlin 版では明示的な変数宣言は省略されていますが、それ以外はC版とほとんど同じです。libcurl ライブラリで期待されるすべての呼び出しは、Kotlin の同等物でも利用可能です。

> これは行ごとの直訳です。より Kotlin らしい慣用的な方法で記述することもできます。
>
{type="tip"}

## アプリケーションをコンパイルして実行する

1.  アプリケーションをコンパイルします。そのためには、タスクリストから `runDebugExecutableNative` Gradle タスクを実行するか、ターミナルで以下のコマンドを使用します。

    ```bash
    ./gradlew runDebugExecutableNative
    ```

    この場合、cinterop ツールによって生成された部分はビルドに暗黙的に含まれます。

2.  コンパイル中にエラーがなければ、`main()` 関数の横のガターにある緑色の **Run** アイコンをクリックするか、<shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> ショートカットを使用します。

    IntelliJ IDEA は **Run** タブを開き、出力として [example.com](https://example.com/) の内容を表示します。

    ![Application output with HTML-code](native-output.png){width=700}

`curl_easy_perform` の呼び出しが結果を標準出力にプリントするため、実際の出力を見ることができます。`curl_easy_setopt` を使用してこれを非表示にすることもできます。

> プロジェクトの完全なコードは、弊社の [GitHub リポジトリ](https://github.com/kotlin-hands-on/intro-kotlin-native)で入手できます。
>
{style="note"}

## 次のステップ

[Kotlin の C との相互運用](native-c-interop.md)についてさらに学びましょう。