[//]: # (title: C interopとlibcurlを使用してアプリを作成する – チュートリアル)

このチュートリアルでは、IntelliJ IDEA を使用してコマンドラインアプリケーションを作成する方法を説明します。Kotlin/Native と libcurl ライブラリを使用して、指定されたプラットフォームでネイティブに実行できるシンプルな HTTP クライアントを作成する方法を学びます。

出力されるのは、macOS および Linux で実行し、簡単な HTTP GET リクエストを実行できる実行可能なコマンドラインアプリです。

コマンドラインを使用して、Kotlin ライブラリを直接、またはスクリプトファイル (例: `.sh` や `.bat` ファイル) で生成できます。しかし、このアプローチは、数百のファイルとライブラリを持つ大規模なプロジェクトにはスケールしません。ビルドシステムを使用することで、Kotlin/Native コンパイラのバイナリや、推移的依存関係を持つライブラリのダウンロードとキャッシュ、コンパイラとテストの実行を自動化し、プロセスを簡素化します。Kotlin/Native は、[Kotlin Multiplatform プラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて [Gradle](https://gradle.org) ビルドシステムを使用できます。

## 始める前に

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。
2.  IntelliJ IDEA で **File** | **New** | **Project from Version Control** を選択し、次の URL を使用して [プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard) をクローンします。

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  プロジェクト構造を確認します。

    ![Native application project structure](native-project-structure.png){width=700}

    このテンプレートには、作業を開始するために必要なファイルとフォルダを含むプロジェクトが含まれています。Kotlin/Native で記述されたアプリケーションは、コードにプラットフォーム固有の要件がない場合、異なるプラットフォームをターゲットにできることを理解しておくことが重要です。コードは `nativeMain` ディレクトリに配置され、対応する `nativeTest` もあります。このチュートリアルでは、フォルダ構造はそのまま維持します。

4.  プロジェクト設定を含むビルドスクリプトである `build.gradle.kts` ファイルを開きます。ビルドファイルで以下の点に特に注意してください。

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

    *   ターゲットは、macOS、Linux、Windows 用に `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64`、`mingwX64` を使用して定義されます。サポートされているプラットフォームの完全なリストは、[こちら](native-target-support.md) を参照してください。
    *   エントリ自体は、バイナリがどのように生成されるか、およびアプリケーションのエントリポイントを示す一連のプロパティを定義します。これらはデフォルト値のままにしておくことができます。
    *   C相互運用性は、ビルドの追加ステップとして構成されます。デフォルトでは、Cからのすべてのシンボルが `interop` パッケージにインポートされます。`.kt` ファイルでパッケージ全体をインポートしたい場合があります。[設定方法](gradle-configure-project.md#targeting-multiple-platforms)の詳細については、こちらを参照してください。

## 定義ファイルの作成

ネイティブアプリケーションを記述する際、HTTP リクエストの作成、ディスクからの読み書きなど、[Kotlin 標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/)に含まれていない特定の機能にアクセスする必要があることがよくあります。

Kotlin/Native は、標準 C ライブラリの利用を支援し、必要なほぼすべての機能が存在するエコシステム全体を開放します。Kotlin/Native にはすでに、標準ライブラリにいくつかの追加の共通機能を提供する、事前構築された一連の[プラットフォームライブラリ](native-platform-libs.md)が同梱されています。

相互運用 (interop) の理想的なシナリオは、C 関数を Kotlin 関数を呼び出すかのように、同じシグネチャと規約に従って呼び出すことです。ここで cinterop ツールが役立ちます。C ライブラリを取り込み、対応する Kotlin バインディングを生成することで、そのライブラリを Kotlin コードであるかのように使用できるようになります。

これらのバインディングを生成するには、各ライブラリに定義ファイルが必要です。これは通常、ライブラリと同じ名前です。これは、ライブラリがどのように利用されるべきかを正確に記述するプロパティファイルです。

このアプリでは、いくつかの HTTP 呼び出しを行うために libcurl ライブラリが必要です。その定義ファイルを作成するには:

1.  `src` フォルダを選択し、**File | New | Directory** で新しいディレクトリを作成します。
2.  新しいディレクトリの名前を **nativeInterop/cinterop** にします。これはヘッダーファイルの場所のデフォルトの慣習ですが、別の場所を使用する場合は `build.gradle.kts` ファイルでオーバーライドできます。
3.  この新しいサブフォルダを選択し、**File | New | File** で新しい `libcurl.def` ファイルを作成します。
4.  ファイルを次のコードで更新します。

    ```c
    headers = curl/curl.h
    headerFilter = curl/*

    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

    *   `headers` は、Kotlin スタブを生成するヘッダーファイルのリストです。このエントリに複数のファイルを追加でき、それぞれをスペースで区切ります。このケースでは、`curl.h` のみです。参照されるファイルは、指定されたパス (このケースでは `/usr/include/curl`) で利用可能である必要があります。
    *   `headerFilter` は、何が正確に含まれるかを示します。C では、あるファイルが `#include` ディレクティブで別のファイルを参照すると、すべてのヘッダーも含まれます。時にはこれは必要ない場合があり、[glob パターン](https://en.wikipedia.org/wiki/Glob_(programming)) を使用してこのパラメータを追加し、調整できます。

        外部依存関係 (システム `stdint.h` ヘッダーなど) を相互運用ライブラリにフェッチしたくない場合は、`headerFilter` を使用できます。また、ライブラリサイズの最適化や、システムと提供される Kotlin/Native コンパイル環境間の潜在的な競合の修正にも役立つ場合があります。

    *   特定のプラットフォームの動作を変更する必要がある場合は、`compilerOpts.osx` や `compilerOpts.linux` のような形式を使用して、オプションにプラットフォーム固有の値を指定できます。このケースでは、macOS (`.osx` サフィックス) と Linux (`.linux` サフィックス) です。サフィックスなしのパラメータ (例: `linkerOpts=`) も可能であり、すべてのプラットフォームに適用されます。

    利用可能なオプションの完全なリストについては、[定義ファイル](native-definition-file.md#properties)を参照してください。

:::note
サンプルを動作させるには、システムに `curl` ライブラリのバイナリが必要です。macOS と Linux では、通常含まれています。Windows では、[ソース](https://curl.se/download.html)からビルドできます (Microsoft Visual Studio または Windows SDK コマンドラインツールが必要です)。詳細については、[関連ブログ記事](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)を参照してください。あるいは、[MinGW/MSYS2](https://www.msys2.org/) の `curl` バイナリを検討することもできます。
:::

## ビルドプロセスへの相互運用性の追加

ヘッダーファイルを使用するには、それらがビルドプロセスの一部として生成されるようにします。そのためには、`build.gradle.kts` ファイルに次のエントリを追加します。

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

まず `cinterops` が追加され、次に定義ファイルのエントリが追加されます。デフォルトでは、ファイル名が使用されます。これを追加のパラメータでオーバーライドできます。

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

## アプリケーションコードの記述

これで、ライブラリと対応する Kotlin スタブができたので、アプリケーションからそれらを使用できます。このチュートリアルでは、[simple.c](https://curl.se/libcurl/c/simple.html) の例を Kotlin に変換します。

`src/nativeMain/kotlin/` フォルダにある `Main.kt` ファイルを次のコードで更新します。

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

ご覧のとおり、Kotlin 版では明示的な変数宣言は省略されていますが、その他は C 版とほぼ同じです。libcurl ライブラリで期待されるすべての呼び出しは、Kotlin の同等物で利用できます。

:::tip
これは逐語的な直訳です。これをより Kotlin らしい書き方で記述することもできます。
:::

## アプリケーションのコンパイルと実行

1.  アプリケーションをコンパイルします。そのためには、タスクリストから `runDebugExecutableNative` Gradle タスクを実行するか、ターミナルで次のコマンドを使用します。

    ```bash
    ./gradlew runDebugExecutableNative
    ```

    この場合、cinterop ツールによって生成される部分は、ビルドに暗黙的に含まれます。

2.  コンパイル中にエラーがない場合は、`main()` 関数の隣にあるガターの緑色の **Run** アイコンをクリックするか、<shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> ショートカットを使用します。

    IntelliJ IDEA が **Run** タブを開き、出力 — [example.com](https://example.com/) のコンテンツ — を表示します。

    ![Application output with HTML-code](native-output.png){width=700}

`curl_easy_perform` の呼び出しが結果を標準出力に出力するため、実際の出力を確認できます。`curl_easy_setopt` を使用してこれを非表示にすることもできます。

:::note
完全なプロジェクトコードは、[GitHub リポジトリ](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)で入手できます。
:::

## 次のステップ

[Kotlin の C との相互運用性](native-c-interop.md)についてさらに詳しく学びましょう。