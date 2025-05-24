---
title: "Kotlin コマンドラインコンパイラ"
---
Kotlin の各リリースには、コンパイラーのスタンドアロンバージョンが付属しています。最新バージョンは、手動またはパッケージマネージャーからダウンロードできます。

:::note
コマンドラインコンパイラーのインストールは、Kotlin を使用する上で必須ではありません。
一般的なアプローチは、[IntelliJ IDEA](https://www.jetbrains.com/idea/) や [Android Studio](https://developer.android.com/studio) などの、公式に Kotlin をサポートする IDE またはコードエディターを使用して Kotlin アプリケーションを作成することです。
これらは、すぐに使用できる完全な Kotlin サポートを提供します。

[IDE で Kotlin を始める方法](getting-started) を学びましょう。

:::

## コンパイラーのインストール

### 手動インストール

Kotlin コンパイラーを手動でインストールするには:

1. 最新バージョン (`kotlin-compiler-2.1.20.zip`) を [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) からダウンロードします。
2. スタンドアロンコンパイラーをディレクトリに解凍し、必要に応じて `bin` ディレクトリをシステムパスに追加します。
`bin` ディレクトリには、Windows、macOS、Linux で Kotlin をコンパイルして実行するために必要なスクリプトが含まれています。

:::note
Windows で Kotlin コマンドラインコンパイラーを使用する場合は、手動でインストールすることをお勧めします。

:::

### SDKMAN!

macOS、Linux、Cygwin、FreeBSD、Solaris などの UNIX ベースのシステムに Kotlin をインストールする簡単な方法は、
[SDKMAN!](https://sdkman.io) です。Bash および ZSH シェルでも動作します。[SDKMAN! のインストール方法](https://sdkman.io/install) を学びましょう。

SDKMAN! 経由で Kotlin コンパイラーをインストールするには、ターミナルで次のコマンドを実行します。

```bash
sdk install kotlin
```

### Homebrew

または、macOS では、[Homebrew](https://brew.sh/) 経由でコンパイラーをインストールできます。

```bash
brew update
brew install kotlin
```

### Snap package

Ubuntu 16.04 以降で [Snap](https://snapcraft.io/) を使用している場合は、コマンドラインからコンパイラーをインストールできます。

```bash
sudo snap install --classic kotlin
```

## アプリケーションの作成と実行

1. `"Hello, World!"` を表示する、Kotlin の簡単なコンソール JVM アプリケーションを作成します。
   コードエディターで、次のコードを含む `hello.kt` という名前の新しいファイルを作成します。

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. Kotlin コンパイラーを使用してアプリケーションをコンパイルします。

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` オプションは、生成されたクラスファイルの出力パスを示します。これは、ディレクトリまたは **.jar** ファイルのいずれかです。
   * `-include-runtime` オプションは、Kotlin ランタイムライブラリを含めることによって、結果の **.jar** ファイルを自己完結型で実行可能にします。

   利用可能なすべてのオプションを表示するには、次を実行します。

   ```bash
   kotlinc -help
   ```

3. アプリケーションを実行します。

   ```bash
   java -jar hello.jar
   ```

## ライブラリのコンパイル

他の Kotlin アプリケーションで使用されるライブラリを開発している場合は、Kotlin ランタイムを含めずに **.jar** ファイルをビルドできます。

```bash
kotlinc hello.kt -d hello.jar
```

このようにコンパイルされたバイナリは Kotlin ランタイムに依存するため、
コンパイルされたライブラリが使用されるときは常に、Kotlin ランタイムがクラスパスに存在することを確認する必要があります。

また、`kotlin` スクリプトを使用して、Kotlin コンパイラーによって生成されたバイナリを実行することもできます。

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` は、Kotlin コンパイラーが `hello.kt` という名前のファイルに対して生成するメインクラス名です。

## REPL の実行

パラメーターなしでコンパイラーを実行して、インタラクティブシェルを表示できます。このシェルでは、有効な Kotlin コードを入力して、結果を確認できます。

<img src="/img/kotlin-shell.png" alt="Shell" width="500"/>

## スクリプトの実行

Kotlin をスクリプト言語として使用できます。
Kotlin スクリプトは、トップレベルの実行可能コードを含む Kotlin ソースファイル (`.kts`) です。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file `->` file.isDirectory() }
folders?.forEach { folder `->` println(folder) }
```

スクリプトを実行するには、対応するスクリプトファイルとともに、コンパイラーに `-script` オプションを渡します。

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin は、外部プロパティの追加、静的または動的な依存関係の提供など、スクリプトのカスタマイズに対する実験的なサポートを提供します。
カスタマイズは、いわゆる _スクリプト定義_ (適切なサポートコードを含むアノテーション付きの Kotlin クラス) によって定義されます。
スクリプトのファイル名拡張子は、適切な定義を選択するために使用されます。
[Kotlin カスタムスクリプト](custom-script-deps-tutorial) の詳細をご覧ください。

適切に準備されたスクリプト定義は、適切な jar がコンパイルクラスパスに含まれている場合、自動的に検出および適用されます。
または、コンパイラーに `-script-templates` オプションを渡すことで、定義を手動で指定できます。

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support) を参照してください。