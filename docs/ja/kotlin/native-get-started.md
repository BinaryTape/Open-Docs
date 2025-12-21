[//]: # (title: Kotlin/Native の利用を開始する)

このチュートリアルでは、Kotlin/Native アプリケーションの作成方法を学びます。あなたにとって最適なツールを選択し、以下の方法でアプリを作成できます。

*   **[IDE](#in-ide)**。ここでは、バージョン管理システムからプロジェクトテンプレートをクローンし、IntelliJ IDEA で使用できます。
*   **[Gradle ビルドシステム](#using-gradle)**。内部の仕組みをよりよく理解するために、プロジェクトのビルドファイルを手動で作成します。
*   **[コマンドラインツール](#using-the-command-line-compiler)**。標準の Kotlin ディストリビューションの一部として提供される Kotlin/Native コンパイラを使用して、コマンドラインツールで直接アプリを作成できます。

    コンソールでのコンパイルは簡単で分かりやすく見えるかもしれませんが、数百のファイルやライブラリを持つ大規模なプロジェクトには適していません。そのようなプロジェクトには、IDEまたはビルドシステムの使用をお勧めします。

Kotlin/Native では、Linux、macOS、Windows など、[様々なターゲット](native-target-support.md)向けにコンパイルできます。クロスプラットフォームコンパイル（あるプラットフォームを使用して別のプラットフォーム向けにコンパイルすること）は可能ですが、このチュートリアルでは、コンパイルしているのと同じプラットフォームをターゲットにします。

> Mac を使用していて macOS またはその他の Apple ターゲット向けのアプリケーションを作成・実行したい場合は、[Xcode Command Line Tools](https://developer.apple.com/download/) をインストールし、起動して、最初にライセンス条項に同意する必要があります。
>
{style="note"}

## IDE で

このセクションでは、IntelliJ IDEA を使用して Kotlin/Native アプリケーションを作成する方法を学びます。Community Edition と Ultimate Edition の両方を使用できます。

### プロジェクトを作成する

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。
2.  IntelliJ IDEA で **File** | **New** | **Project from Version Control** を選択し、以下のURLを使用して[プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard)をクローンします。

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  プロジェクトの依存関係のバージョンカタログである `gradle/libs.versions.toml` ファイルを開きます。Kotlin/Native アプリケーションを作成するには、Kotlin と同じバージョンの Kotlin Multiplatform Gradle プラグインが必要です。最新の Kotlin バージョンを使用していることを確認してください。

    ```none
    [versions]
    kotlin = "%kotlinVersion%"
    ```

4.  提案に従って Gradle ファイルをリロードします。

    ![Load Gradle changes button](load-gradle-changes.png){width=295}

これらの設定の詳細については、[Multiplatform Gradle DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)を参照してください。

### アプリケーションをビルドして実行する

`src/nativeMain/kotlin/` ディレクトリにある `Main.kt` ファイルを開きます。

*   `src` ディレクトリには Kotlin ソースファイルが含まれています。
*   `Main.kt` ファイルには、[`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用して "Hello, Kotlin/Native!" を出力するコードが含まれています。

ガターの緑色のアイコンを押してコードを実行します。

![Run the application](native-run-gutter.png){width=478}

IntelliJ IDEA は Gradle タスクを使用してコードを実行し、結果を**Run**タブに出力します。

![Application output](native-output-gutter-1.png){width=331}

初回実行後、IDE は上部に該当する実行設定を作成します。

![Gradle run configuration](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate ユーザーは、コンパイルされたネイティブ実行可能ファイルのデバッグを可能にし、インポートされた Kotlin/Native プロジェクトの実行設定を自動的に作成する[Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) プラグインをインストールできます。

[IntelliJ IDEA を設定](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build)して、プロジェクトを自動的にビルドできます。

1.  **Settings | Build, Execution, Deployment | Compiler** に移動します。
2.  **Compiler** ページで、**Build project automatically** を選択します。
3.  変更を適用します。

これで、クラスファイルに変更を加えるか、ファイルを保存する（<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>）と、IntelliJ IDEA はプロジェクトのインクリメンタルビルドを自動的に実行します。

### アプリケーションを更新する

アプリケーションに、名前の文字数を数える機能を追加しましょう。

1.  `Main.kt` ファイルに、入力を読み取るコードを追加します。[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数を使用して入力値を読み取り、`name` 変数に割り当てます。

    ```kotlin
    fun main() {
        // 入力値を読み取ります。
        println("Hello, enter your name:")
        val name = readln()
    }
    ```

2.  このアプリを Gradle を使用して実行するには、`build.gradle.kts` ファイルで使用する入力として `System.in` を指定し、Gradle の変更をロードします。

    ```kotlin
    kotlin {
        //...
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                    runTaskProvider?.configure { standardInput = System.`in` }
                }
            }
        }
        //...
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="runTaskProvider?.configure { standardInput = System.`in` }"}

3.  空白を削除し、文字数を数えます。

    *   [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 関数を使用して、名前から空白を削除します。
    *   スコープ関数 [`let`](scope-functions.md#let) を使用して、オブジェクトコンテキスト内で関数を実行します。
    *   [文字列テンプレート](strings.md#string-templates)を使用して、ドル記号を追加し中括弧で囲むことで、名前の長さを文字列に挿入します – `${it.length}`。`it` は[ラムダパラメータ](coding-conventions.md#lambda-parameters)のデフォルト名です。

   ```kotlin
   fun main() {
       // 入力値を読み取ります。
       println("Hello, enter your name:")
       val name = readln()
       // 名前の文字数を数えます。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4.  アプリケーションを実行します。
5.  名前を入力し、結果を確認します。

   ![Application output](native-output-gutter-2.png){width=422}

次に、名前のユニークな文字だけを数えてみましょう。

1.  `Main.kt` ファイルに、`String` の新しい[拡張関数](extensions.md#extension-functions) `.countDistinctCharacters()` を宣言します。

    *   [`lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 関数を使用して、名前を小文字に変換します。
    *   [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 関数を使用して、入力文字列を文字のリストに変換します。
    *   [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 関数を使用して、名前のユニークな文字のみを選択します。
    *   [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 関数を使用して、ユニークな文字の数を数えます。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2.  `.countDistinctCharacters()` 関数を使用して、名前のユニークな文字数を数えます。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 入力値を読み取ります。
       println("Hello, enter your name:")
       val name = readln()
       // 名前の文字数を数えます。
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // ユニークな文字数を出力します。
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3.  アプリケーションを実行します。
4.  名前を入力し、結果を確認します。

   ![Application output](native-output-gutter-3.png){width=422}

## Gradle を使用する

このセクションでは、[Gradle](https://gradle.org) を使用して Kotlin/Native アプリケーションを手動で作成する方法を学びます。これは Kotlin/Native および Kotlin Multiplatform プロジェクトのデフォルトのビルドシステムであり、Java、Android、その他のエコシステムでも一般的に使用されています。

Kotlin/Native プロジェクトをビルドする際、Kotlin Gradle プラグインは以下のアーティファクトをダウンロードします。

*   `konanc`、`cinterop`、`jsinterop` などの様々なツールを含む主要な Kotlin/Native バンドル。デフォルトでは、Kotlin/Native バンドルは単純な Gradle 依存関係として [Maven Central](https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/) リポジトリからダウンロードされます。
*   `konanc` 自体に必要な `llvm` などの依存関係。これらはカスタムロジックを使用して JetBrains CDN からダウンロードされます。

主要なバンドルのダウンロード元は、Gradle ビルドスクリプトの `repositories {}` ブロックで変更できます。

### プロジェクトファイルを作成する

1.  まず、互換性のあるバージョンの[Gradle](https://gradle.org/install/)をインストールします。[互換性テーブル](gradle-configure-project.md#apply-the-plugin)を参照して、Kotlin Gradle プラグイン (KGP) と利用可能な Gradle バージョンの互換性を確認してください。
2.  空のプロジェクトディレクトリを作成します。その中に、次の内容の `build.gradle(.kts)` ファイルを作成します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       // 主要バンドルのダウンロード元を指定
       // Maven Central はデフォルトで使用されます
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // macOS上
       // linuxArm64("native") // Linux上
       // mingwX64("native")   // Windows上
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       // 主要バンドルのダウンロード元を指定
       // Maven Central はデフォルトで使用されます
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // macOS上
       // linuxArm64('native') // Linux上
       // mingwX64('native')   // Windows上
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '%gradleVersion%'
       distributionType = 'BIN'
   }
   ```

   </tab>
   </tabs>

   `macosArm64`、`iosArm64`、`linuxArm64`、`mingwX64` のような異なる[ターゲット名](native-target-support.md)を使用して、コードをコンパイルするターゲットを定義できます。これらのターゲット名は、オプションでプラットフォーム名をパラメータとして取ることができます。この場合は `native` です。プラットフォーム名は、プロジェクト内のソースパスとタスク名を生成するために使用されます。

3.  プロジェクトディレクトリに空の `settings.gradle(.kts)` ファイルを作成します。
4.  `src/nativeMain/kotlin` ディレクトリを作成し、その中に以下の内容の `hello.kt` ファイルを配置します。

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

慣例により、すべてのソースは `src/<target name>[Main|Test]/kotlin` ディレクトリに配置されます。ここで `Main` はソースコード用、`Test` はテスト用です。`<target name>` は、ビルドファイルで指定されたターゲットプラットフォーム（この場合は `native`）に対応します。

### プロジェクトをビルドして実行する

1.  プロジェクトのルートディレクトリから、ビルドコマンドを実行します。

   ```bash
   ./gradlew nativeBinaries
   ```

   このコマンドは `build/bin/native` ディレクトリを作成し、その中に `debugExecutable` と `releaseExecutable` の2つのディレクトリを作成します。これらには対応するバイナリファイルが含まれます。

   デフォルトでは、バイナリファイルの名前はプロジェクトディレクトリと同じになります。

2.  プロジェクトを実行するには、以下のコマンドを実行します。

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

ターミナルに "Hello, Kotlin/Native!" と出力されます。

### IDE でプロジェクトを開く

これで、Gradle をサポートする任意の IDE でプロジェクトを開くことができます。IntelliJ IDEA を使用する場合:

1.  **File** | **Open** を選択します。
2.  プロジェクトディレクトリを選択し、**Open** をクリックします。
    IntelliJ IDEA は、それが Kotlin/Native プロジェクトであるかどうかを自動的に検出します。

プロジェクトで問題が発生した場合、IntelliJ IDEA は**Build**タブにエラーメッセージを表示します。

## コマンドラインコンパイラを使用する

このセクションでは、コマンドラインツールで Kotlin コンパイラを使用して Kotlin/Native アプリケーションを作成する方法を学びます。

### コンパイラをダウンロードしてインストールする

コンパイラをインストールするには：

1.  Kotlin の[GitHubリリース](%kotlinLatestUrl%)ページに移動し、**Assets**セクションまでスクロールします。
2.  名前に `kotlin-native` を含むファイルを探し、ご使用のオペレーティングシステムに適したものをダウンロードします。例えば、`kotlin-native-prebuilt-linux-x86_64-%kotlinVersion%.tar.gz` です。
3.  選択したディレクトリにアーカイブを解凍します。
4.  シェルプロファイルを開き、コンパイラの `/bin` ディレクトリへのパスを `PATH` 環境変数に追加します。

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> コンパイラ出力には依存関係や仮想マシンの要件はありませんが、コンパイラ自体には Java 1.8 以降のランタイムが必要です。[JDK 8 (JAVA SE 8) 以降のバージョン](https://www.oracle.com/java/technologies/downloads/)でサポートされています。
>
{style="note"}

### プログラムを作成する

作業ディレクトリを選択し、`hello.kt` という名前のファイルを作成します。以下のコードで更新します。

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### コンソールからコードをコンパイルする

アプリケーションをコンパイルするには、ダウンロードしたコンパイラで以下のコマンドを実行します。

```bash
kotlinc-native hello.kt -o hello
```

`-o` オプションの値は出力ファイルの名前を指定するため、この呼び出しは macOS および Linux では `hello.kexe` バイナリファイル（Windows では `hello.exe`）を生成します。

利用可能なオプションの完全なリストについては、[Kotlin コンパイラオプション](compiler-reference.md)を参照してください。

### プログラムを実行する

プログラムを実行するには、コマンドラインツールでバイナリファイルが含まれるディレクトリに移動し、以下のコマンドを実行します。

<tabs>
<tab title="macOS および Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

アプリケーションは標準出力に "Hello, Kotlin/Native" と出力します。

## 次のステップ

*   ネイティブ HTTP クライアントを作成し、C ライブラリと相互運用する方法を説明する[C interop と libcurl を使用したアプリの作成](native-app-with-c-and-libcurl.md)チュートリアルを完了してください。
*   [実際の Kotlin/Native プロジェクト向けに Gradle ビルドスクリプトを記述する方法](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)を学びましょう。
*   Gradle ビルドシステムの詳細については、[ドキュメント](gradle.md)を参照してください。