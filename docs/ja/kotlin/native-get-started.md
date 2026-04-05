[//]: # (title: Kotlin/Native を始める)

このチュートリアルでは、Kotlin/Native アプリケーションの作成方法を学びます。自分に最適なツールを選択し、以下のいずれかを使用してアプリを作成してください。

* **[IDE](#in-ide)**：バージョン管理システムからプロジェクトテンプレートをクローンし、IntelliJ IDEA で使用します。
* **[Gradle ビルドシステム](#using-gradle)**：内部の仕組みをより深く理解するために、プロジェクトのビルドファイルを手動で作成します。
* **[コマンドラインツール](#using-the-command-line-compiler)**：標準の Kotlin ディストリビューションの一部として提供されている Kotlin/Native コンパイラを使用し、コマンドラインツールで直接アプリを作成します。

コンソールでのコンパイルは簡単で分かりやすく思えるかもしれませんが、数百のファイルやライブラリを持つ大規模なプロジェクトには向きません。そのようなプロジェクトでは、IDE またはビルドシステムの使用をお勧めします。

Kotlin/Native を使用すると、Linux、macOS、Windows を含む[さまざまなターゲット](native-target-support.md)向けにコンパイルできます。クロスプラットフォームコンパイル（あるプラットフォームを使用して別のプラットフォーム向けにコンパイルすること）も可能ですが、このチュートリアルでは、コンパイルを実行しているのと同じプラットフォームをターゲットにします。

> Mac を使用しており、macOS やその他の Apple ターゲット向けのアプリケーションを作成・実行したい場合は、まず [Xcode Command Line Tools](https://developer.apple.com/download/) をインストールして起動し、ライセンス条項に同意する必要があります。
>
{style="note"}

## IDE で作成する

このセクションでは、IntelliJ IDEA を使用して Kotlin/Native アプリケーションを作成する方法を学びます。Community Edition と Ultimate Edition の両方を使用できます。

### プロジェクトの作成

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/) をダウンロードしてインストールします。
2. IntelliJ IDEA で **File** | **New** | **Project from Version Control** を選択し、以下の URL を使用して [プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard) をクローンします。

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```   

3. プロジェクトの依存関係のバージョンカタログである `gradle/libs.versions.toml` ファイルを開きます。Kotlin/Native アプリケーションを作成するには、Kotlin と同じバージョンの Kotlin マルチプラットフォーム Gradle プラグインが必要です。最新の Kotlin バージョンを使用していることを確認してください。

   ```none
   [versions]
   kotlin = "%kotlinVersion%"
   ```

4. 提案に従って Gradle ファイルをリロードします。

   ![Gradle の変更をロードするボタン](load-gradle-changes.png){width=295}

これらの設定に関する詳細は、[マルチプラットフォーム Gradle DSL リファレンス](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)を参照してください。

### アプリケーションのビルドと実行

`src/nativeMain/kotlin/` ディレクトリにある `Main.kt` ファイルを開きます。

* `src` ディレクトリには Kotlin ソースファイルが含まれています。
* `Main.kt` ファイルには、[`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用して "Hello, Kotlin/Native!" を出力するコードが含まれています。

ガター（エディタの左端）にある緑色のアイコンを押してコードを実行します。

![アプリケーションを実行する](native-run-gutter.png){width=450}

IntelliJ IDEA は Gradle タスクを使用してコードを実行し、その結果を **Run** タブに出力します。

![アプリケーションの出力](native-output-gutter-1.png){width=450}

初回実行後、IDE は上部にガターに対応する実行構成を作成します。

![Gradle 実行構成](native-run-config.png){width=500}

> IntelliJ IDEA Ultimate のユーザーは、[Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) プラグインをインストールできます。これにより、コンパイルされたネイティブ実行ファイルのデバッグが可能になり、インポートされた Kotlin/Native プロジェクトの実行構成も自動的に作成されます。

プロジェクトを自動的にビルドするように [IntelliJ IDEA を設定](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) することもできます。

1. **Settings | Build, Execution, Deployment | Compiler** に移動します。
2. **Compiler** ページで **Build project automatically** を選択します。
3. 変更を適用します。

これで、クラスファイルを変更したりファイルを保存（<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>）したりすると、IntelliJ IDEA は自動的にプロジェクトの増分ビルドを実行します。

### アプリケーションの更新

アプリケーションに、名前の文字数をカウントする機能を追加してみましょう。

1. `Main.kt` ファイルに、入力を読み取るコードを追加します。[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数を使用して入力値を読み取り、それを `name` 変数に代入します。

   ```kotlin
   fun main() {
       // 入力値を読み取る
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. Gradle を使用してこのアプリを実行するには、`build.gradle.kts` ファイルで使用する入力として `System.in` を指定し、Gradle の変更をロードします。

   ```kotlin
   kotlin {
       //...
       targets.withType<KotlinNativeTarget>().configureEach {
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

3. 空白を取り除き、文字数をカウントします。

   * [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 関数を使用して、名前の中の空スペースを削除します。
   * スコープ関数 [`let`](scope-functions.md#let) を使用して、オブジェクトのコンテキスト内で関数を実行します。
   * [文字列テンプレート](strings.md#string-templates)を使用して、ドル記号と波括弧で囲むことで `${it.length}` 名前の長さを文字列に挿入します。`it` は[ラムダパラメータ](coding-conventions.md#lambda-parameters)のデフォルト名です。

   ```kotlin
   fun main() {
       // 入力値を読み取る
       println("Hello, enter your name:")
       val name = readln()
       // 名前の文字数をカウントする
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. アプリケーションを実行します。
5. 名前を入力して結果を確認します。

   ![アプリケーションの出力](native-output-gutter-2.png){width=500}

次に、名前の中のユニークな（重複しない）文字だけをカウントしてみましょう。

1. `Main.kt` ファイルで、`String` に対する新しい[拡張関数](extensions.md#extension-functions) `.countDistinctCharacters()` を宣言します。

   * [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 関数を使用して名前を小文字に変換します。
   * [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 関数を使用して、入力文字列を文字のリストに変換します。
   * [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 関数を使用して、名前の中の重複しない文字のみを選択します。
   * [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 関数を使用して、重複しない文字をカウントします。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. `.countDistinctCharacters()` 関数を使用して、名前の中のユニークな文字数をカウントします。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 入力値を読み取る
       println("Hello, enter your name:")
       val name = readln()
       // 名前の文字数をカウントする
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // ユニークな文字数を出力する
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. アプリケーションを実行します。
4. 名前を入力して結果を確認します。

   ![アプリケーションの出力](native-output-gutter-3.png){width=500}

## Gradle を使用する

このセクションでは、[Gradle](https://gradle.org) を使用して手動で Kotlin/Native アプリケーションを作成する方法を学びます。Gradle は Kotlin/Native および Kotlin マルチプラットフォームプロジェクトのデフォルトのビルドシステムであり、Java、Android、その他のエコシステムでも一般的に使用されています。

Kotlin/Native プロジェクトをビルドする際、Kotlin Gradle プラグインは以下のアーティファクトをダウンロードします。

* メインの Kotlin/Native バンドル。これには `konanc`、`cinterop`、`jsinterop` などのさまざまなツールが含まれています。デフォルトでは、Kotlin/Native バンドルは単純な Gradle 依存関係として [Maven Central](https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/) リポジトリからダウンロードされます。
* `llvm` など、`konanc` 自体に必要な依存関係。これらはカスタムロジックを使用して JetBrains の CDN からダウンロードされます。

メインバンドルのダウンロードソースは、Gradle ビルドスクリプトの `repositories {}` ブロックで変更できます。

### プロジェクトファイルの作成

1. まず、互換性のあるバージョンの [Gradle](https://gradle.org/install/) をインストールします。利用可能な Gradle バージョンと Kotlin Gradle プラグイン (KGP) の互換性を確認するには、[互換性表](gradle-configure-project.md#apply-the-plugin)を参照してください。
2. 空のプロジェクトディレクトリを作成します。その中に、以下の内容で `build.gradle(.kts)` ファイルを作成します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       // メインバンドルをダウンロードするソースを指定
       // デフォルトでは Maven Central が使用される
       mavenCentral()
   }

   kotlin {
       macosArm64()    // macOS の場合
       // linuxArm64() // Linux の場合
       // mingwX64()   // Windows の場合
   
       targets.withType<KotlinNativeTarget>().configureEach {
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
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       // メインバンドルをダウンロードするソースを指定
       // デフォルトでは Maven Central が使用される
       mavenCentral()
   }

   kotlin {
       macosArm64()    // macOS の場合
       // linuxArm64() // Linux の場合
       // mingwX64()   // Windows の場合
   
       targets.withType(KotlinNativeTarget).configureEach {
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

   コードをコンパイルするターゲットを定義するために、`macosArm64`、`iosArm64`、`linuxArm64`、`mingwX64` などの異なる[ターゲット名](native-target-support.md)を使用できます。
   ターゲット名は、プロジェクト内のソースパスやタスク名を生成するために使用されます。

3. プロジェクトディレクトリに空の `settings.gradle(.kts)` ファイルを作成します。
4. `src/nativeMain/kotlin` ディレクトリを作成し、その中に以下の内容の `hello.kt` ファイルを作成します。

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

慣例により、すべてのソースは `src/<platform name>[Main|Test]/kotlin` ディレクトリに配置されます。ここで `Main` はソースコード用、`Test` はテスト用です。この場合、`<platform name>` は `native` です。

### プロジェクトのビルドと実行

1. プロジェクトのルートディレクトリから、使用するターゲットの `<yourTargetName>Binaries` ビルドコマンドを実行します。例えば：

   ```bash
   ./gradlew macosArm64Binaries
   ```

   このコマンドは、`build/bin/<yourTargetName>` ディレクトリを作成し、その中に `debugExecutable` と `releaseExecutable` の 2 つのディレクトリを作成します。これらには対応するバイナリファイルが含まれています。

   デフォルトでは、バイナリファイルの名前はプロジェクトディレクトリと同じになります。

2. プロジェクトを実行するには、使用するターゲットの `build/bin/<yourTargetName>/debugExecutable/<project_name>.kexe` コマンドを実行します。例えば：

   ```bash
   build/bin/macosArm64/DebugExecutable/hello.kexe
   ```

ターミナルに "Hello, Kotlin/Native!" と表示されます。

### IDE でプロジェクトを開く

これで、Gradle をサポートする任意の IDE でプロジェクトを開くことができます。IntelliJ IDEA を使用する場合：

1. **File** | **Open** を選択します。
2. プロジェクトディレクトリを選択して **Open** をクリックします。
   IntelliJ IDEA は、それが Kotlin/Native プロジェクトであるかどうかを自動的に検出します。

プロジェクトに問題が発生した場合、IntelliJ IDEA は **Build** タブにエラーメッセージを表示します。

## コマンドラインコンパイラを使用する

このセクションでは、コマンドラインツールの Kotlin コンパイラを使用して Kotlin/Native アプリケーションを作成する方法を学びます。

### コンパイラのダウンロードとインストール

コンパイラをインストールするには：

1. Kotlin の [GitHub リリース](%kotlinLatestUrl%) ページに移動し、**Assets** セクションまでスクロールします。
2. 名前に `kotlin-native` が含まれているファイルを探し、使用しているオペレーティングシステムに適したものをダウンロードします（例：`kotlin-native-prebuilt-linux-x86_64-%kotlinVersion%.tar.gz`）。
3. アーカイブを任意のディレクトリに展開します。
4. シェルのプロファイルを開き、コンパイラの `/bin` ディレクトリへのパスを `PATH` 環境変数に追加します。

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> コンパイラの出力には依存関係や仮想マシンの要件はありませんが、コンパイラ自体には Java 1.8 以上のランタイムが必要です。[JDK 8 (JAVA SE 8) 以降のバージョン](https://www.oracle.com/java/technologies/downloads/)でサポートされています。
>
{style="note"}

### プログラムの作成

作業ディレクトリを選択し、`hello.kt` という名前のファイルを作成します。以下のコードで更新してください。

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### コンソールからのコードのコンパイル

アプリケーションをコンパイルするには、ダウンロードしたコンパイラを使用して次のコマンドを実行します。

```bash
kotlinc-native hello.kt -o hello
```

`-o` オプションの値は出力ファイルの名前を指定します。そのため、この呼び出しは macOS および Linux では `hello.kexe` バイナリファイルを（Windows では `hello.exe` を）生成します。

利用可能なオプションの全リストについては、[Kotlin コンパイラオプション](compiler-reference.md)を参照してください。

### プログラムの実行

プログラムを実行するには、コマンドラインツールでバイナリファイルが含まれているディレクトリに移動し、次のコマンドを実行します。

<tabs>
<tab title="macOS and Linux">

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

アプリケーションが標準出力に "Hello, Kotlin/Native" を出力します。

## 次のステップ

* ネイティブ HTTP クライアントを作成し C ライブラリと相互運用する方法を説明した [C 相互運用と libcurl を使用したアプリの作成](native-app-with-c-and-libcurl.md) チュートリアルを完了してください。
* [実際の Kotlin/Native プロジェクト向けに Gradle ビルドスクリプトを作成する方法](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)について学んでください。
* [ドキュメント](gradle.md)で Gradle ビルドシステムについてさらに詳しく読んでください。