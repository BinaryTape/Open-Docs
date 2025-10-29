[//]: # (title: Kotlinコマンドラインコンパイラ)

Kotlinの各リリースには、スタンドアロンバージョンのコンパイラが同梱されています。最新バージョンは手動で、またはパッケージマネージャー経由でダウンロードできます。

> コマンドラインコンパイラのインストールは、Kotlinを使用するために必須の手順ではありません。
> 一般的なアプローチとしては、[IntelliJ IDEA](https://www.jetbrains.com/idea/)や[Android Studio](https://developer.android.com/studio)など、公式Kotlinサポートが付属するIDEまたはコードエディターを使用してKotlinアプリケーションを記述します。
> これらは、Kotlinのフルサポートをすぐに利用できる状態で提供します。
>
> [IDEでKotlinを始める方法](getting-started.md)をご覧ください。
>
{style="note"}

## コンパイラのインストール

### 手動インストール

Kotlinコンパイラを手動でインストールするには：

1.  [GitHub Releases](%kotlinLatestUrl%)から最新バージョン（`kotlin-compiler-%kotlinVersion%.zip`）をダウンロードします。
2.  ダウンロードしたスタンドアロンコンパイラを任意のディレクトリに解凍し、必要に応じて`bin`ディレクトリをシステムパスに追加します。
    `bin`ディレクトリには、Windows、macOS、LinuxでKotlinをコンパイルおよび実行するために必要なスクリプトが含まれています。

> WindowsでKotlinコマンドラインコンパイラを使用したい場合は、手動でインストールすることをお勧めします。
>
{style="note"}

### SDKMAN!

macOS、Linux、Cygwin、FreeBSD、SolarisなどのUNIX系システムにKotlinをインストールする簡単な方法は、[SDKMAN!](https://sdkman.io)を使用することです。これはBashおよびZSHシェルでも動作します。[SDKMAN!のインストール方法](https://sdkman.io/install)をご覧ください。

SDKMAN!経由でKotlinコンパイラをインストールするには、ターミナルで次のコマンドを実行します。

```bash
sdk install kotlin
```

### Homebrew

または、macOSでは[Homebrew](https://brew.sh/)経由でコンパイラをインストールできます。

```bash
brew update
brew install kotlin
```

### Snapパッケージ

Ubuntu 16.04以降で[Snap](https://snapcraft.io/)を使用している場合、コマンドラインからコンパイラをインストールできます。

```bash
sudo snap install --classic kotlin
```

## アプリケーションの作成と実行

1.  `"Hello, World!"`を表示するシンプルなコンソールJVMアプリケーションをKotlinで作成します。
    コードエディターで、`hello.kt`という新しいファイルを作成し、以下のコードを記述します。

    ```kotlin
    fun main() {
        println("Hello, World!")
    }
    ```

2.  Kotlinコンパイラを使用してアプリケーションをコンパイルします。

    ```bash
    kotlinc hello.kt -include-runtime -d hello.jar
    ```

    *   `-d`オプションは、生成されるクラスファイルの出力パスを指定します。これはディレクトリまたは**.jar**ファイルのいずれかです。
    *   `-include-runtime`オプションは、Kotlinランタイムライブラリを含めることで、結果の**.jar**ファイルを自己完結型で実行可能にします。

    利用可能なすべてのオプションを見るには、次を実行します。

    ```bash
    kotlinc -help
    ```

3.  アプリケーションを実行します。

    ```bash
    java -jar hello.jar
    ```

> Kotlin/Nativeアプリケーションをコンパイルするには、[Kotlin/Nativeコンパイラ](native-get-started.md#using-the-command-line-compiler)を使用します。
>
{style="note"}

## ライブラリのコンパイル

他のKotlinアプリケーションで使用されるライブラリを開発している場合、Kotlinランタイムを含めずに**.jar**ファイルをビルドできます。

```bash
kotlinc hello.kt -d hello.jar
```

このようにコンパイルされたバイナリはKotlinランタイムに依存するため、コンパイルされたライブラリが使用される際には常にクラスパスに存在することを確認する必要があります。

`kotlin`スクリプトを使用して、Kotlinコンパイラによって生成されたバイナリを実行することもできます。

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt`は、Kotlinコンパイラが`hello.kt`というファイルに対して生成するメインクラス名です。

> Kotlin/Nativeライブラリをコンパイルするには、[Kotlin/Nativeコンパイラ](native-libraries.md#using-kotlin-native-compiler)を使用します。
>
{style="note"}

## REPLの実行

対話型シェルを利用するには、コンパイラを[`-Xrepl`コンパイラオプション](compiler-reference.md#xrepl)とともに実行します。このシェルでは、任意の有効なKotlinコードを入力して結果を確認できます。

## スクリプトの実行

Kotlinをスクリプト言語として使用できます。
Kotlinスクリプトは、トップレベルの実行可能コードを含むKotlinソースファイル（`.kts`）です。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

スクリプトを実行するには、対応するスクリプトファイルを指定して、`-script`オプションをコンパイラに渡します。

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlinは、外部プロパティの追加、静的または動的依存関係の提供など、スクリプトのカスタマイズに対する実験的なサポートを提供します。
カスタマイズは、_スクリプト定義_と呼ばれる、適切なサポートコードを持つアノテーション付きKotlinクラスによって定義されます。
スクリプトのファイル名拡張子は、適切な定義を選択するために使用されます。[Kotlinカスタムスクリプト](custom-script-deps-tutorial.md)の詳細をご覧ください。

適切に準備されたスクリプト定義は、適切なjarがコンパイルクラスパスに含まれている場合に自動的に検出され、適用されます。または、`-script-templates`オプションをコンパイラに渡すことで、手動で定義を指定することもできます。

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

追加の詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)を参照してください。