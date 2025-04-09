---
title: "C interopとlibcurlを使用したアプリの作成 – チュートリアル"
---
このチュートリアルでは、IntelliJ IDEAを使用してコマンドラインアプリケーションを作成する方法を説明します。Kotlin/Nativeとlibcurlライブラリを使用して、指定されたプラットフォームでネイティブに実行できるシンプルなHTTPクライアントを作成する方法を学びます。

出力は、macOSおよびLinux上で実行して簡単なHTTP GETリクエストを行うことができる実行可能なコマンドラインアプリケーションになります。

コマンドラインを使用して、直接またはスクリプトファイル（`.sh`や`.bat`ファイルなど）を使用してKotlinライブラリを生成できます。
ただし、このアプローチは、数百のファイルやライブラリを持つ大規模なプロジェクトには適していません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリと推移的な依存関係を持つライブラリをダウンロードしてキャッシュし、コンパイラとテストを実行することでプロセスが簡素化されます。
Kotlin/Nativeは、[Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)を介して[Gradle](https://gradle.gradle)ビルドシステムを使用できます。

## 事前準備

1. 最新バージョンの[IntelliJ IDEA](https://www.jetbrains.com/idea/)をダウンロードしてインストールします。
2. IntelliJ IDEAで**File** | **New** | **Project from Version Control**を選択し、次のURLを使用して[プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard)をクローンします。

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```  

3. プロジェクトの構造を調べます。

   <img src="/img/native-project-structure.png" alt="Native application project structure" width="700" style={{verticalAlign: 'middle'}}/>

   このテンプレートには、作業を開始するために必要なファイルとフォルダーを含むプロジェクトが含まれています。Kotlin/Nativeで記述されたアプリケーションは、コードにプラットフォーム固有の要件がない場合、異なるプラットフォームをターゲットにできることを理解することが重要です。コードは、対応する`nativeTest`とともに`nativeMain`ディレクトリに配置されます。このチュートリアルでは、フォルダー構造をそのままにしておきます。

4. プロジェクト設定を含むビルドスクリプトである`build.gradle.kts`ファイルを開きます。ビルドファイルで以下に特に注意してください。

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 `->` macosX64("native")
            hostOs == "Linux" && isArm64 `->` linuxArm64("native")
            hostOs == "Linux" && !isArm64 `->` linuxX64("native")
            isMingwX64 `->` mingwX64("native")
            else `->` throw GradleException("Host OS is not supported in Kotlin/Native.")
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

   * ターゲットは、macOS、Linux、およびWindows用に`macosArm64`、`macosX64`、`linuxArm64`、`linuxX64`、および`mingwX64`を使用して定義されます。[サポートされているプラットフォーム](native-target-support)の完全なリストを参照してください。
   * エントリー自体は、バイナリの生成方法とアプリケーションのエントリーポイントを示す一連のプロパティを定義します。これらはデフォルト値のままにすることができます。
   * Cの相互運用性は、ビルドの追加ステップとして構成されます。デフォルトでは、Cのすべてのシンボルが`interop`パッケージにインポートされます。`.kt`ファイルでパッケージ全体をインポートすることをお勧めします。[構成方法](gradle-configure-project#targeting-multiple-platforms)の詳細をご覧ください。

## 定義ファイルを作成する

ネイティブアプリケーションを作成する場合、[Kotlin標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/)に含まれていない特定の機能（HTTPリクエストの作成、ディスクからの読み書きなど）へのアクセスが必要になることがよくあります。

Kotlin/Nativeは、標準Cライブラリの使用を支援し、必要なほとんどすべての機能のエコシステム全体を開放します。Kotlin/Nativeには、一連のプリビルド[プラットフォームライブラリ](native-platform-libs)が付属しており、標準ライブラリに追加の共通機能を提供します。

相互運用性の理想的なシナリオは、C関数をKotlin関数を呼び出すのと同じように、同じシグネチャと規則に従って呼び出すことです。ここで、cinteropツールが役に立ちます。これは、Cライブラリを受け取り、対応するKotlinバインディングを生成して、ライブラリをKotlinコードであるかのように使用できるようにします。

これらのバインディングを生成するには、各ライブラリに定義ファイルが必要です。通常はライブラリと同じ名前が付けられます。これは、ライブラリをどのように使用するかを正確に記述するプロパティファイルです。

このアプリでは、HTTP呼び出しを行うためにlibcurlライブラリが必要になります。その定義ファイルを作成するには：

1. `src`フォルダーを選択し、**File | New | Directory**で新しいディレクトリを作成します。
2. 新しいディレクトリに**nativeInterop/cinterop**という名前を付けます。これはヘッダーファイルの場所に関するデフォルトの規則ですが、別の場所を使用する場合は、`build.gradle.kts`ファイルで上書きできます。
3. この新しいサブフォルダーを選択し、**File | New | File**で新しい`libcurl.def`ファイルを作成します。
4. ファイルを次のコードで更新します。

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers`は、Kotlinスタブを生成するヘッダーファイルのリストです。このエントリに複数のファイルを追加し、それぞれをスペースで区切ることができます。この場合、`curl.h`のみです。参照されるファイルは、指定されたパス（この場合は`/usr/include/curl`）で使用可能である必要があります。
   * `headerFilter`は、正確に何が含まれているかを示します。Cでは、あるファイルが`#include`ディレクティブで別のファイルを参照すると、すべてのヘッダーも含まれます。場合によっては不要な場合があり、[globパターンを使用](https://en.wikipedia.org/wiki/Glob_(programming))して調整するためにこのパラメーターを追加できます。

     外部依存関係（システムの`stdint.h`ヘッダーなど）を相互運用ライブラリにフェッチしたくない場合は、`headerFilter`を使用できます。また、ライブラリサイズの最適化や、システムと提供されているKotlin/Nativeコンパイル環境間の潜在的な競合の修正にも役立ちます。

   * 特定のプラットフォームの動作を変更する必要がある場合は、`compilerOpts.osx`または`compilerOpts.linux`のような形式を使用して、オプションにプラットフォーム固有の値を提供できます。この場合、これらはmacOS（`.osx`サフィックス）とLinux（`.linux`サフィックス）です。サフィックスのないパラメーター（たとえば、`linkerOpts=`）も可能で、すべてのプラットフォームに適用されます。

   使用可能なオプションの完全なリストについては、[定義ファイル](native-definition-file#properties)を参照してください。

:::note
サンプルを動作させるには、システムに`curl`ライブラリのバイナリが必要です。macOSおよびLinuxでは、通常は含まれています。Windowsでは、[ソース](https://curl.se/download.html)からビルドできます（Microsoft Visual StudioまたはWindows SDKコマンドラインツールが必要です）。詳細については、[関連ブログ投稿](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)を参照してください。あるいは、[MinGW/MSYS2](https://www.msys2.org/) `curl`バイナリを検討することもできます。

:::

## ビルドプロセスに相互運用性を追加する

ヘッダーファイルを使用するには、それらがビルドプロセスの一部として生成されていることを確認してください。このために、次のエントリを`build.gradle.kts`ファイルに追加します。

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

最初に、`cinterops`が追加され、次に定義ファイルのエントリが追加されます。デフォルトでは、ファイルの名前が使用されます。追加のパラメーターを使用して、これを上書きできます。

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

ライブラリと対応するKotlinスタブができたので、アプリケーションから使用できます。
このチュートリアルでは、[simple.c](https://curl.se/libcurl/c/simple.html)の例をKotlinに変換します。

`src/nativeMain/kotlin/`フォルダーで、`Main.kt`ファイルを次のコードで更新します。

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

ご覧のとおり、Kotlinバージョンでは明示的な変数宣言は削除されていますが、それ以外の点はCバージョンとほぼ同じです。libcurlライブラリで期待されるすべての呼び出しは、Kotlin同等で使用できます。

:::note
これは、行ごとの文字通りの翻訳です。よりKotlinらしいイディオム的な方法でこれを記述することもできます。

:::

## アプリケーションをコンパイルして実行する

1. アプリケーションをコンパイルします。これを行うには、タスクリストから`runDebugExecutableNative` Gradleタスクを実行するか、ターミナルで次のコマンドを使用します。
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   この場合、cinteropツールによって生成された部分は、ビルドに暗黙的に含まれています。

2. コンパイル中にエラーが発生しない場合は、`main()`関数の横のガターにある緑色の**実行**アイコンをクリックするか、<shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut>ショートカットを使用します。

   IntelliJ IDEAは**実行**タブを開き、[example.com](https://example.com/)の内容である出力を表示します。

   <img src="/img/native-output.png" alt="Application output with HTML-code" width="700" style={{verticalAlign: 'middle'}}/>

`curl_easy_perform`の呼び出しが結果を標準出力に出力するため、実際の出力が表示されます。`curl_easy_setopt`を使用してこれを非表示にすることができます。

[GitHubリポジトリ](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)で完全なプロジェクトコードを入手できます。

:::

## 次のステップ

[KotlinとCの相互運用性](native-c-interop)の詳細をご覧ください。