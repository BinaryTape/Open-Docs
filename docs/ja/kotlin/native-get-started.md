---
title: Kotlin/Nativeを始める
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

このチュートリアルでは、Kotlin/Nativeアプリケーションを作成する方法を学習します。最適なツールを選択し、次の方法でアプリケーションを作成します。

* **[IDE](#in-ide)を使用する**。ここでは、バージョン管理システムからプロジェクトテンプレートをクローンし、IntelliJ IDEAで使用できます。
* **[Gradleビルドシステム](#using-gradle)を使用する**。内部の仕組みをより深く理解するために、プロジェクトのビルドファイルを手動で作成します。
* **[コマンドラインツール](#using-the-command-line-compiler)を使用する**。標準のKotlinディストリビューションの一部として提供されるKotlin/Nativeコンパイラーを使用して、コマンドラインツールで直接アプリケーションを作成できます。

  コンソールのコンパイルは簡単でわかりやすいように思えるかもしれませんが、ファイルやライブラリが何百もある大規模なプロジェクトには適していません。このようなプロジェクトでは、IDEまたはビルドシステムを使用することをお勧めします。

Kotlin/Nativeを使用すると、Linux、macOS、Windowsなどの[さまざまなターゲット](native-target-support)向けにコンパイルできます。クロスプラットフォームコンパイル（あるプラットフォームを使用して別のプラットフォーム向けにコンパイルすること）も可能ですが、このチュートリアルでは、コンパイル元のプラットフォームをターゲットにします。

:::note
Macを使用しており、macOSまたはその他のAppleターゲット向けのアプリケーションを作成および実行する場合は、[Xcode Command Line Tools](https://developer.apple.com/download/)もインストールし、起動して、最初にライセンス条項に同意する必要があります。

:::

## IDEを使用する

このセクションでは、IntelliJ IDEAを使用してKotlin/Nativeアプリケーションを作成する方法を学習します。Community EditionとUltimate Editionの両方を使用できます。

### プロジェクトを作成する

1. [IntelliJ IDEA](https://www.jetbrains.com/idea/)の最新バージョンをダウンロードしてインストールします。
2. IntelliJ IDEAで**File** | **New** | **Project from Version Control**を選択し、次のURLを使用して、[プロジェクトテンプレート](https://github.com/Kotlin/kmp-native-wizard)をクローンします。

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```   

3. プロジェクト依存関係のバージョンカタログである`gradle/libs.versions.toml`ファイルを開きます。Kotlin/Nativeアプリケーションを作成するには、Kotlin Multiplatform Gradleプラグインが必要です。このプラグインのバージョンはKotlinと同じです。最新のKotlinバージョンを使用していることを確認してください。

   ```none
   [versions]
   kotlin = "2.1.20"
   ```

4. Gradleファイルをリロードする提案に従います。

   <img src="/img/load-gradle-changes.png" alt="Gradleの変更をロードするボタン" width="295" style={{verticalAlign: 'middle'}}/>

これらの設定の詳細については、[Multiplatform Gradle DSL reference](multiplatform-dsl-reference)を参照してください。

### アプリケーションをビルドして実行する

`src/nativeMain/kotlin/`ディレクトリにある`Main.kt`ファイルを開きます。

* `src`ディレクトリには、Kotlinソースファイルが含まれています。
* `Main.kt`ファイルには、[`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)関数を使用して「Hello, Kotlin/Native!」を出力するコードが含まれています。

gutterにある緑色のアイコンを押して、コードを実行します。

<img src="/img/native-run-gutter.png" alt="アプリケーションの実行" width="478" style={{verticalAlign: 'middle'}}/>

IntelliJ IDEAはGradleタスクを使用してコードを実行し、**Run**タブに出力結果を表示します。

<img src="/img/native-output-gutter-1.png" alt="アプリケーションの出力" width="331" style={{verticalAlign: 'middle'}}/>

初回実行後、IDEは上部に対応する実行構成を作成します。

<img src="/img/native-run-config.png" alt="Gradle実行構成" width="503" style={{verticalAlign: 'middle'}}/>
:::note
IntelliJ IDEA Ultimateユーザーは、コンパイルされたネイティブ実行可能ファイルをデバッグできる[Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)プラグインをインストールできます。また、インポートされたKotlin/Nativeプロジェクトの実行構成を自動的に作成します。

プロジェクトを自動的にビルドするように[IntelliJ IDEAを構成](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build)できます。

1. **Settings | Build, Execution, Deployment | Compiler**に移動します。
2. **Compiler**ページで、**Build project automatically**を選択します。
3. 変更を適用します。

これで、クラスファイルを変更したり、ファイルを保存したりすると（<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>）、IntelliJ IDEAはプロジェクトのインクリメンタルビルドを自動的に実行します。

### アプリケーションを更新する

名前の文字数をカウントする機能をアプリケーションに追加しましょう。

1. `Main.kt`ファイルで、入力を読み取るコードを追加します。[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)関数を使用して入力値を読み取り、`name`変数に割り当てます。

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. Gradleを使用してこのアプリを実行するには、`build.gradle.kts`ファイルで使用する入力として`System.in`を指定し、Gradleの変更をロードします。

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
   

3. 空白を削除し、文字をカウントします。

   * [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html)関数を使用して、名前の空白を削除します。
   * スコープ関数[`let`](scope-functions#let)を使用して、オブジェクトコンテキスト内で関数を実行します。
   * [文字列テンプレート](strings#string-templates)を使用して、ドル記号`$`を追加し、中括弧で囲んで`${it.length}`のようにすることで、名前の長さを文字列に挿入します。`it`は[ラムダパラメーター](coding-conventions#lambda-parameters)のデフォルト名です。

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. アプリケーションを実行します。
5. 名前を入力して、結果をお楽しみください。

   <img src="/img/native-output-gutter-2.png" alt="アプリケーションの出力" width="422" style={{verticalAlign: 'middle'}}/>

次に、名前の一意の文字のみをカウントしましょう。

1. `Main.kt`ファイルで、`String`の新しい[拡張関数](extensions#extension-functions)`.countDistinctCharacters()`を宣言します。

   * [`lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html)関数を使用して、名前を小文字に変換します。
   * [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html)関数を使用して、入力文字列を文字のリストに変換します。
   * [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html)関数を使用して、名前の一意の文字のみを選択します。
   * [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)関数を使用して、一意の文字をカウントします。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. `.countDistinctCharacters()`関数を使用して、名前の一意の文字をカウントします。

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. アプリケーションを実行します。
4. 名前を入力して、結果を確認します。

   <img src="/img/native-output-gutter-3.png" alt="アプリケーションの出力" width="422" style={{verticalAlign: 'middle'}}/>

## Gradleを使用する

このセクションでは、[Gradle](https://gradle.org)を使用してKotlin/Nativeアプリケーションを手動で作成する方法を学習します。これはKotlin/NativeおよびKotlin Multiplatformプロジェクトのデフォルトのビルドシステムであり、Java、Android、その他のエコシステムでも一般的に使用されています。

### プロジェクトファイルを作成する

1. まず、互換性のあるバージョンの[Gradle](https://gradle.org/install/)をインストールします。[互換性表](gradle-configure-project#apply-the-plugin)を参照して、利用可能なGradleバージョンとのKotlin Gradle plugin (KGP)の互換性を確認してください。
2. 空のプロジェクトディレクトリを作成します。その中に、次の内容の`build.gradle(.kts)`ファイルを作成します。

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "2.1.20"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // on macOS
       // linuxArm64("native") // on Linux
       // mingwX64("native")   // on Windows
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "8.10"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // on macOS
       // linuxArm64('native') // on Linux
       // mingwX64('native')   // on Windows
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '8.10'
       distributionType = 'BIN'
   }
   ```

   </TabItem>
   </Tabs>

   `macosArm64`、`iosArm64`、`linuxArm64`、`mingwX64`などのさまざまな[ターゲット名](native-target-support)を使用して、コードのコンパイル対象を定義できます。これらのターゲット名は、オプションでプラットフォーム名をパラメーターとして受け取ることができます。この場合、プラットフォーム名は`native`です。プラットフォーム名は、プロジェクト内のソースパスとタスク名を生成するために使用されます。

3. プロジェクトディレクトリに空の`settings.gradle(.kts)`ファイルを作成します。
4. `src/nativeMain/kotlin`ディレクトリを作成し、その中に次の内容の`hello.kt`ファイルを配置します。

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

慣例により、すべてのソースは`src/<target name>[Main|Test]/kotlin`ディレクトリにあります。`Main`はソースコード用、`Test`はテスト用です。`<target name>`は、ビルドファイルで指定されているターゲットプラットフォーム（この場合は`native`）に対応します。

### プロジェクトをビルドして実行する

1. ルートプロジェクトディレクトリから、ビルドコマンドを実行します。

   ```bash
   ./gradlew nativeBinaries
   ```

   このコマンドは、`build/bin/native`ディレクトリを作成し、その中に`debugExecutable`と`releaseExecutable`の2つのディレクトリを作成します。これらには、対応するバイナリファイルが含まれています。

   デフォルトでは、バイナリファイルの名前はプロジェクトディレクトリと同じです。

2. プロジェクトを実行するには、次のコマンドを実行します。

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

ターミナルに「Hello, Kotlin/Native!」と表示されます。

### IDEでプロジェクトを開く

これで、Gradleをサポートする任意のIDEでプロジェクトを開くことができます。IntelliJ IDEAを使用する場合：

1. **File** | **Open**を選択します。
2. プロジェクトディレクトリを選択し、**Open**をクリックします。
   IntelliJ IDEAは、Kotlin/Nativeプロジェクトであるかどうかを自動的に検出します。

プロジェクトに問題が発生した場合、IntelliJ IDEAは**Build**タブにエラーメッセージを表示します。

## コマンドラインコンパイラーを使用する

このセクションでは、コマンドラインツールでKotlinコンパイラーを使用してKotlin/Nativeアプリケーションを作成する方法を学習します。

### コンパイラーをダウンロードしてインストールする

コンパイラーをインストールするには：

1. Kotlinの[GitHub releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)ページに移動します。
2. 名前に`kotlin-native`が含まれるファイルを探し、オペレーティングシステムに適したファイル（たとえば、`kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`）をダウンロードします。
3. アーカイブを選択したディレクトリに解凍します。
4. シェルプロファイルを開き、コンパイラーの`/bin`ディレクトリへのパスを`PATH`環境変数に追加します。

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

コンパイラーの出力には依存関係や仮想マシンの要件はありませんが、コンパイラー自体にはJava 1.8以降のランタイムが必要です。これは[JDK 8 (JAVA SE 8) 以降のバージョン](https://www.oracle.com/java/technologies/downloads/)でサポートされています。

:::

### プログラムを作成する

作業ディレクトリを選択し、`hello.kt`という名前のファイルを作成します。次のコードで更新します。

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### コンソールからコードをコンパイルする

アプリケーションをコンパイルするには、ダウンロードしたコンパイラーで次のコマンドを実行します。

```bash
kotlinc-native hello.kt -o hello
```

`-o`オプションの値は出力ファイルの名前を指定するため、この呼び出しにより、macOSおよびLinuxでは`hello.kexe`バイナリファイルが生成されます（Windowsでは`hello.exe`）。

使用可能なオプションの完全なリストについては、[Kotlinコンパイラーオプション](compiler-reference)を参照してください。

### プログラムを実行する

プログラムを実行するには、コマンドラインツールで、バイナリファイルが含まれているディレクトリに移動し、次のコマンドを実行します。

<Tabs>
<TabItem value="macOS and Linux" label="macOS and Linux">

```none
./hello.kexe
```

</TabItem>
<TabItem value="Windows" label="Windows">

```none
./hello.exe
```

</TabItem>
</Tabs>

アプリケーションは「Hello, Kotlin/Native」を標準出力に出力します。

## 次は何をしますか？

* ネイティブHTTPクライアントを作成し、Cライブラリと相互運用する方法を説明する[C Interopおよびlibcurlを使用したアプリの作成](native-app-with-c-and-libcurl)チュートリアルを完了します。
* [実際のKotlin/NativeプロジェクトのGradleビルドスクリプトを作成する方法](multiplatform-dsl-reference)を学習します。
* [ドキュメント](gradle)でGradleビルドシステムの詳細をご覧ください。