[//]: # (title: Kotlin/Nativeを始める)

このチュートリアルでは、Kotlin/Nativeアプリケーションを作成する方法を学びます。最適なツールを選択し、以下の方法でアプリを作成します。

*   **[IDE](#in-ide)**。ここでは、バージョン管理システムからプロジェクトテンプレートをクローンし、IntelliJ IDEAで使用できます。
*   **[Gradleビルドシステム](#using-gradle)**。内部でどのように動作するかをよりよく理解するために、プロジェクトのビルドファイルを手動で作成します。
*   **[コマンドラインツール](#using-the-command-line-compiler)**。標準のKotlinディストリビューションの一部として提供されるKotlin/Nativeコンパイラを使用して、コマンドラインツールで直接アプリを作成できます。

    コンソールでのコンパイルは簡単で分かりやすいように見えるかもしれませんが、何百ものファイルやライブラリを持つ大規模なプロジェクトにはうまくスケールしません。そのようなプロジェクトには、IDEまたはビルドシステムの使用をお勧めします。

Kotlin/Nativeでは、Linux、macOS、Windowsなど、[さまざまなターゲット](native-target-support.md)向けにコンパイルできます。クロスプラットフォームコンパイル（あるプラットフォームを使用して別のプラットフォーム向けにコンパイルすること）も可能ですが、このチュートリアルでは、コンパイルを行うのと同じプラットフォームをターゲットにします。

> Macを使用していて、macOSまたはその他のAppleターゲット向けのアプリケーションを作成・実行したい場合は、まず[Xcode Command Line Tools](https://developer.apple.com/download/)をインストールし、起動してライセンス条項に同意する必要があります。
>
{style="note"}

## IDEで

このセクションでは、IntelliJ IDEAを使用してKotlin/Nativeアプリケーションを作成する方法を学びます。Community EditionとUltimate Editionのどちらも使用できます。

### プロジェクトを作成する

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/)の最新バージョンをダウンロードしてインストールします。
2.  IntelliJ IDEAで**File** | **New** | **Project from Version Control**を選択し、このURLを使用して[プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard)をクローンします。

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  プロジェクトの依存関係のバージョンカタログである`gradle/libs.versions.toml`ファイルを開きます。Kotlin/Nativeアプリケーションを作成するには、Kotlinと同じバージョンのKotlin Multiplatform Gradleプラグインが必要です。最新のKotlinバージョンを使用していることを確認してください。

    ```none
    [versions]
    kotlin = "%kotlinVersion%"
    ```

4.  Gradleファイルのリロードの提案に従います。

    ![Load Gradle changes button](load-gradle-changes.png){width=295}

これらの設定の詳細については、[Multiplatform Gradle DSLリファレンス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)を参照してください。

### アプリケーションをビルドして実行する

`src/nativeMain/kotlin/`ディレクトリにある`Main.kt`ファイルを開きます。

*   `src`ディレクトリにはKotlinソースファイルが含まれています。
*   `Main.kt`ファイルには、[`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)関数を使用して「Hello, Kotlin/Native!」と出力するコードが含まれています。

ガターにある緑色のアイコンを押してコードを実行します。

![Run the application](native-run-gutter.png){width=478}

IntelliJ IDEAはGradleタスクを使用してコードを実行し、結果を**Run**タブに出力します。

![Application output](native-output-gutter-1.png){width=331}

初回実行後、IDEは上部に該当する実行構成を作成します。

![Gradle run configuration](native-run-config.png){width=503}

> IntelliJ IDEA Ultimateユーザーは、コンパイルされたネイティブ実行可能ファイルのデバッグを可能にし、インポートされたKotlin/Nativeプロジェクトの実行構成を自動的に作成する[Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)プラグインをインストールできます。

プロジェクトを自動的にビルドするように[IntelliJ IDEAを設定](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build)できます。

1.  **Settings | Build, Execution, Deployment | Compiler**に移動します。
2.  **Compiler**ページで、**Build project automatically**を選択します。
3.  変更を適用します。

これで、クラスファイルに変更を加えるかファイルを保存する（<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>）と、IntelliJ IDEAがプロジェクトのインクリメンタルビルドを自動的に実行します。

### アプリケーションを更新する

アプリケーションに名前の文字数を数える機能を追加しましょう。

1.  `Main.kt`ファイルに、入力を読み取るコードを追加します。[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)関数を使用して入力値を読み取り、`name`変数に割り当てます。

    ```kotlin
    fun main() {
        // 入力値を読み込む。
        println("Hello, enter your name:")
        val name = readln()
    }
    ```

2.  Gradleを使用してこのアプリを実行するには、`build.gradle.kts`ファイルで`System.in`を使用する入力として指定し、Gradleの変更をロードします。

    ```kotlin
    kotlin {
        //...
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                    runTask?.standardInput = System.`in`
                }
            }
        }
        //...
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="runTask?.standardInput = System.`in`"}

3.  空白を削除して文字数を数えます。

    *   [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html)関数を使用して、名前の空白を削除します。
    *   スコープ関数[`let`](scope-functions.md#let)を使用して、オブジェクトコンテキスト内で関数を実行します。
    *   [文字列テンプレート](strings.md#string-templates)を使用して、ドル記号を追加し中括弧で囲むことで、名前の長さを文字列に挿入します – `${it.length}`。`it`は[ラムダパラメータ](coding-conventions.md#lambda-parameters)のデフォルト名です。

    ```kotlin
    fun main() {
        // 入力値を読み込む。
        println("Hello, enter your name:")
        val name = readln()
        // 名前の文字数を数える。
        name.replace(" ", "").let {
            println("Your name contains ${it.length} letters")
        }
    }
    ```

4.  アプリケーションを実行します。
5.  名前を入力して結果を確認します。

    ![Application output](native-output-gutter-2.png){width=422}

次に、名前内の一意の文字のみを数えましょう。

1.  `Main.kt`ファイルで、`String`の新しい[拡張関数](extensions.md#extension-functions)`.countDistinctCharacters()`を宣言します。

    *   [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html)関数を使用して名前を小文字に変換します。
    *   [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html)関数を使用して入力文字列を文字のリストに変換します。
    *   [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html)関数を使用して名前内の一意の文字のみを選択します。
    *   [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用して一意の文字を数えます。

    ```kotlin
    fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
    ```

2.  `.countDistinctCharacters()`関数を使用して、名前内の一意の文字数を数えます。

    ```kotlin
    fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

    fun main() {
        // 入力値を読み込む。
        println("Hello, enter your name:")
        val name = readln()
        // 名前の文字数を数える。
        name.replace(" ", "").let {
            println("Your name contains ${it.length} letters")
            // 一意の文字数を出力する。
            println("Your name contains ${it.countDistinctCharacters()} unique letters")
        }
    }
    ```

3.  アプリケーションを実行します。
4.  名前を入力して結果を確認します。

    ![Application output](native-output-gutter-3.png){width=422}

## Gradleを使用する

このセクションでは、[Gradle](https://gradle.org)を使用してKotlin/Nativeアプリケーションを手動で作成する方法を学びます。GradleはKotlin/NativeおよびKotlin Multiplatformプロジェクトのデフォルトのビルドシステムであり、Java、Android、その他のエコシステムでも一般的に使用されています。

### プロジェクトファイルを作成する

1.  まず、互換性のあるバージョンの[Gradle](https://gradle.org/install/)をインストールします。[互換性テーブル](gradle-configure-project.md#apply-the-plugin)を参照して、利用可能なGradleバージョンとKotlin Gradleプラグイン（KGP）の互換性を確認してください。
2.  空のプロジェクトディレクトリを作成します。その中に、以下の内容で`build.gradle(.kts)`ファイルを作成します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosArm64("native") {  // macOSの場合
        // linuxArm64("native") // Linuxの場合
        // mingwX64("native")   // Windowsの場合
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
        mavenCentral()
    }

    kotlin {
        macosArm64('native') {  // macOSの場合
        // linuxArm64('native') // Linuxの場合
        // mingwX64('native')   // Windowsの場合
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

    コードをコンパイルするターゲットを定義するために、`macosArm64`、`iosArm64`、`linuxArm64`、`mingwX64`などの異なる[ターゲット名](native-target-support.md)を使用できます。これらのターゲット名は、オプションでプラットフォーム名をパラメータとして受け取ることができます。この場合、プラットフォーム名は`native`です。プラットフォーム名は、プロジェクト内のソースパスとタスク名を生成するために使用されます。

3.  プロジェクトディレクトリに空の`settings.gradle(.kts)`ファイルを作成します。
4.  `src/nativeMain/kotlin`ディレクトリを作成し、その中に以下の内容で`hello.kt`ファイルを配置します。

    ```kotlin
    fun main() {
        println("Hello, Kotlin/Native!")
    }
    ```

慣例により、すべてのソースは`src/<target name>[Main|Test]/kotlin`ディレクトリに配置されます。ここで`Main`はソースコード用、`Test`はテスト用です。`<target name>`は、ビルドファイルで指定されたターゲットプラットフォーム（この場合は`native`）に対応します。

### プロジェクトをビルドして実行する

1.  プロジェクトのルートディレクトリから、ビルドコマンドを実行します。

    ```bash
    ./gradlew nativeBinaries
    ```

    このコマンドは`build/bin/native`ディレクトリを作成し、その中に`debugExecutable`と`releaseExecutable`の2つのディレクトリを作成します。これらには対応するバイナリファイルが含まれています。

    デフォルトでは、バイナリファイルの名前はプロジェクトディレクトリと同じになります。

2.  プロジェクトを実行するには、次のコマンドを実行します。

    ```bash
    build/bin/native/debugExecutable/<project_name>.kexe
    ```

ターミナルに「Hello, Kotlin/Native!」と表示されます。

### IDEでプロジェクトを開く

これで、Gradleをサポートする任意のIDEでプロジェクトを開くことができます。IntelliJ IDEAを使用している場合は、次の手順を実行します。

1.  **File** | **Open**を選択します。
2.  プロジェクトディレクトリを選択し、**Open**をクリックします。
    IntelliJ IDEAは、それがKotlin/Nativeプロジェクトであるかどうかを自動的に検出します。

プロジェクトに問題が発生した場合、IntelliJ IDEAは**Build**タブにエラーメッセージを表示します。

## コマンドラインコンパイラを使用する

このセクションでは、コマンドラインツールでKotlinコンパイラを使用してKotlin/Nativeアプリケーションを作成する方法を学びます。

### コンパイラをダウンロードしてインストールする

コンパイラをインストールするには：

1.  Kotlinの[GitHubリリース](%kotlinLatestUrl%)ページにアクセスします。
2.  名前に`kotlin-native`を含むファイルを探し、ご使用のオペレーティングシステムに適したものをダウンロードします。例えば、`kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`などです。
3.  選択したディレクトリにアーカイブを解凍します。
4.  シェルプロファイルを開き、コンパイラの`/bin`ディレクトリへのパスを`PATH`環境変数に追加します。

    ```bash
    export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
    ```

> コンパイラの出力には依存関係や仮想マシンの要件はありませんが、コンパイラ自体にはJava 1.8以降のランタイムが必要です。これは[JDK 8 (JAVA SE 8)以降のバージョン](https://www.oracle.com/java/technologies/downloads/)でサポートされています。
>
{style="note"}

### プログラムを作成する

作業ディレクトリを選択し、`hello.kt`というファイルを作成します。以下のコードで更新します。

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### コンソールからコードをコンパイルする

アプリケーションをコンパイルするには、ダウンロードしたコンパイラで次のコマンドを実行します。

```bash
kotlinc-native hello.kt -o hello
```

`-o`オプションの値は出力ファイルの名前を指定するため、この呼び出しはmacOSおよびLinuxでは`hello.kexe`バイナリファイル（Windowsでは`hello.exe`）を生成します。

利用可能なオプションの完全なリストについては、[Kotlinコンパイラオプション](compiler-reference.md)を参照してください。

### プログラムを実行する

プログラムを実行するには、コマンドラインツールでバイナリファイルがあるディレクトリに移動し、次のコマンドを実行します。

<tabs>
<tab title="macOSとLinux">

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

アプリケーションは標準出力に「Hello, Kotlin/Native」と表示します。

## 次のステップ

*   ネイティブHTTPクライアントを作成し、Cライブラリと連携する方法を説明する[Cインターロップとlibcurlを使用したアプリの作成](native-app-with-c-and-libcurl.md)チュートリアルを完了します。
*   [実際のKotlin/NativeプロジェクトのGradleビルドスクリプトを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)方法を学びます。
*   [ドキュメント](gradle.md)でGradleビルドシステムについてさらに詳しく読みます。