[//]: # (title: C interop と libcurl を使用したアプリケーションの作成 – チュートリアル)

> C ライブラリのインポートは[ベータ](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)段階です。cinterop ツールによって C ライブラリから生成されたすべての Kotlin 宣言には、`@ExperimentalForeignApi` アノテーションを付与する必要があります。
>
> Kotlin/Native に同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIX など）では、一部の API でのみオプトインが必要です。
>
{style="note"}

このチュートリアルでは、IntelliJ IDEA を使用してコマンドラインアプリケーションを作成する方法を説明します。Kotlin/Native と libcurl ライブラリを使用して、特定のプラットフォーム上でネイティブに動作するシンプルな HTTP クライアントを作成する方法を学びます。

出力結果は、macOS および Linux 上で実行でき、シンプルな HTTP GET リクエストを送信できる実行可能なコマンドラインアプリになります。

コマンドラインを使用して、直接またはスクリプトファイル（`.sh` や `.bat` ファイルなど）を使用して Kotlin ライブラリを生成することもできます。しかし、この方法は数百のファイルやライブラリを持つ大規模なプロジェクトには向きません。ビルドシステムを使用すると、Kotlin/Native コンパイラのバイナリや推移的依存関係を持つライブラリのダウンロードとキャッシュ、およびコンパイラやテストの実行が簡素化されます。Kotlin/Native は、[Kotlin マルチプラットフォームプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて [Gradle](https://gradle.org) ビルドシステムを使用できます。

## 始める前に

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/) をダウンロードしてインストールします。
2. IntelliJ IDEA で **File | New | Project from Version Control** を選択し、以下の URL を使用して[プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard)をクローンします：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```  

3. プロジェクト構造を確認します：

   ![ネイティブアプリケーションのプロジェクト構造](native-project-structure.png){width=700}

   テンプレートには、開始するために必要なファイルとフォルダを含むプロジェクトが含まれています。Kotlin/Native で書かれたアプリケーションは、コードにプラットフォーム固有の要件がなければ、異なるプラットフォームをターゲットにできることを理解しておくことが重要です。コードは `nativeMain` ディレクトリに配置され、対応する `nativeTest` があります。このチュートリアルでは、フォルダ構造はそのままにしておきます。

4. プロジェクト設定が含まれているビルドスクリプトである `build.gradle.kts` ファイルを開きます。ビルドファイル内の以下の部分に特に注目してください：

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

   * ターゲットは、macOS、Linux、Windows 用に `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64`、および `mingwX64` を使用して定義されています。[サポートされているプラットフォーム](native-target-support.md)の完全なリストを参照してください。
   * `binaries {}` ブロックは、バイナリの生成方法とアプリケーションのエントリポイントを定義します。これらはデフォルト値のままで構いません。
   * C インターオペラビリティ（C interop）は、ビルドの追加ステップとして構成されます。デフォルトでは、C からのすべてのシンボルは `interop` パッケージにインポートされます。`.kt` ファイル内でパッケージ全体をインポートすることもできます。詳細な[構成方法](gradle-configure-project.md#targeting-multiple-platforms)についてはこちらをご覧ください。

## 定義ファイルの作成

ネイティブアプリケーションを作成する際、HTTP リクエストの送信やディスクへの読み書きなど、[Kotlin 標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/)に含まれていない特定の機能へのアクセスが必要になることがよくあります。

Kotlin/Native は標準の C ライブラリの利用をサポートしており、必要となるほぼすべての機能に対して存在するエコシステム全体を利用できます。Kotlin/Native には、標準ライブラリにいくつかの一般的な機能を追加する一連のビルド済み[プラットフォームライブラリ](native-platform-libs.md)がすでに同梱されています。

インターオペラビリティの理想的なシナリオは、同じシグネチャと規約に従って、あたかも Kotlin 関数を呼び出しているかのように C 関数を呼び出すことです。ここで cinterop ツールが役立ちます。これは C ライブラリを取り込み、対応する Kotlin バインディングを生成するため、ライブラリを Kotlin コードであるかのように使用できます。

これらのバインディングを生成するために、各ライブラリには通常ライブラリと同じ名前の定義ファイル（definition file）が必要です。これは、ライブラリをどのように利用すべきかを正確に記述するプロパティファイルです。

このアプリでは、HTTP 呼び出しを行うために libcurl ライブラリが必要になります。その定義ファイルを作成するには：

1. `src` フォルダを選択し、**File | New | Directory** で新しいディレクトリを作成します。
2. 新しいディレクトリに **nativeInterop/cinterop** という名前を付けます。これはヘッダーファイルの場所に関するデフォルトの慣習ですが、別の場所を使用する場合は `build.gradle.kts` ファイルで上書きできます。
3. この新しいサブフォルダを選択し、**File | New | File** で新しい `libcurl.def` ファイルを作成します。
4. ファイルを次のコードで更新します：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` は、Kotlin スタブを生成するヘッダーファイルのリストです。ここに複数のファイルを追加でき、それぞれをスペースで区切ります。この場合は `curl.h` のみです。参照されるファイルは、指定されたパス（この場合は `/usr/include/curl`）で利用可能である必要があります。
   * `headerFilter` は、正確に何が含まれるかを示します。C では、あるファイルが `#include` ディレクティブで別のファイルを参照すると、すべてのヘッダーも含まれます。これが不要な場合もあり、[glob パターン](https://en.wikipedia.org/wiki/Glob_(programming))を使用してこのパラメータを追加し、調整を行うことができます。

     外部依存関係（システム `stdint.h` ヘッダーなど）をインターオペラビリティライブラリに取り込みたくない場合に `headerFilter` を使用できます。また、ライブラリサイズの最適化や、システムと提供された Kotlin/Native コンパイル環境間の潜在的な競合の修正にも役立ちます。

   * 特定のプラットフォームでの動作を変更する必要がある場合は、`compilerOpts.osx` や `compilerOpts.linux` のような形式を使用して、オプションにプラットフォーム固有の値を指定できます。この例では、macOS（`.osx` 接尾辞）と Linux（`.linux` 接尾辞）です。接尾辞のないパラメータ（例：`linkerOpts=`）も可能で、すべてのプラットフォームに適用されます。

   利用可能なオプションの完全なリストについては、[定義ファイル](native-definition-file.md#properties)を参照してください。

> サンプルを動作させるには、システムに `curl` ライブラリのバイナリが必要です。macOS と Linux では通常含まれています。Windows では、[ソース](https://curl.se/download.html)からビルドできます（Microsoft Visual Studio または Windows SDK のコマンドラインツールが必要です）。詳細については、[関連するブログ記事](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)を参照してください。あるいは、[MinGW/MSYS2](https://www.msys2.org/) の `curl` バイナリの検討も良いでしょう。
>
{style="note"}

## ビルドプロセスへのインターオペラビリティの追加

ヘッダーファイルを使用するには、それらがビルドプロセスの一部として生成されるようにする必要があります。このために、以下の `compilations {}` ブロックを `build.gradle.kts` ファイルに追加します：

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

まず `cinterops` が追加され、次に定義ファイルのエントリが追加されます。デフォルトでは、ファイルの名前が使用されます。これは追加のパラメータで上書きできます：

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

ライブラリと対応する Kotlin スタブが用意できたので、アプリケーションからそれらを使用できます。このチュートリアルでは、[simple.c](https://curl.se/libcurl/c/simple.html) の例を Kotlin に変換します。

`src/nativeMain/kotlin/` フォルダにある `Main.kt` ファイルを次のコードで更新します：

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

見ての通り、Kotlin バージョンでは明示的な変数宣言がなくなっていますが、それ以外は C バージョンとほぼ同じです。libcurl ライブラリで期待されるすべての呼び出しが、対応する Kotlin でも利用可能です。

> これは行ごとの逐語的な翻訳です。より Kotlin らしい方法で書くこともできます。
>
{style="tip"}

## アプリケーションのコンパイルと実行

1. アプリケーションをコンパイルします。そのためには、タスクリストから `runDebugExecutableNative` Gradle タスクを実行するか、ターミナルで次のコマンドを使用します：
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   この場合、cinterop ツールによって生成された部分はビルドに暗黙的に含まれます。

2. コンパイル中にエラーが発生しなければ、`main()` 関数の横のガターにある緑色の **Run** アイコンをクリックするか、<shortcut>Shift + Cmd + R</shortcut> / <shortcut>Shift + F10</shortcut> ショートカットを使用します。

   IntelliJ IDEA は **Run** タブを開き、出力として [example.com](https://example.com/) の内容を表示します：

   ![HTML コードを含むアプリケーションの出力](native-output.png){width=700}

`curl_easy_perform` の呼び出しが結果を標準出力にプリントするため、実際の出力が表示されます。これは `curl_easy_setopt` を使用して非表示にすることもできます。

> プロジェクトの全コードは、こちらの [GitHub リポジトリ](https://github.com/kotlin-hands-on/intro-kotlin-native)から入手できます。
>
{style="note"}

## 次のステップ

[C とのインターオペラビリティ](native-c-interop.md)についてさらに詳しく学びましょう。