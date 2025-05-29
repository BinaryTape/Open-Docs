[//]: # (title: Kotlin コマンドラインコンパイラ)

Kotlinの各リリースには、コンパイラのスタンドアロン版が同梱されています。最新版は手動で、またはパッケージマネージャー経由でダウンロードできます。

> コマンドラインコンパイラのインストールは、Kotlinを使用するための必須ステップではありません。
> 一般的なアプローチは、[IntelliJ IDEA](https://www.jetbrains.com/idea/) や [Android Studio](https://developer.android.com/studio) など、公式のKotlinサポートが組み込まれたIDEやコードエディターを使用してKotlinアプリケーションを記述することです。
> これらはすぐに完全なKotlinサポートを提供します。
> 
> [IDEでKotlinを始める](getting-started.md)方法についてはこちらをご覧ください。
> 
{style="note"}

## コンパイラのインストール

### 手動インストール

Kotlinコンパイラを手動でインストールするには：

1.  最新版 (`kotlin-compiler-%kotlinVersion%.zip`) を[GitHub Releases](%kotlinLatestUrl%)からダウンロードします。
2.  スタンドアロンコンパイラを任意のディレクトリに解凍し、必要に応じて`bin`ディレクトリをシステムパスに追加します。
    `bin`ディレクトリには、Windows、macOS、LinuxでKotlinをコンパイルおよび実行するために必要なスクリプトが含まれています。

> WindowsでKotlinコマンドラインコンパイラを使用する場合は、手動でインストールすることをお勧めします。
> 
{style="note"}

### SDKMAN!

macOS、Linux、Cygwin、FreeBSD、SolarisなどのUNIXベースシステムにKotlinをインストールするより簡単な方法は、
[SDKMAN!](https://sdkman.io)を使用することです。これはBashシェルやZSHシェルでも機能します。[SDKMAN!のインストール方法](https://sdkman.io/install)について学びましょう。

SDKMAN!経由でKotlinコンパイラをインストールするには、ターミナルで以下のコマンドを実行します。

```bash
sdk install kotlin
```

### Homebrew

あるいは、macOSでは[Homebrew](https://brew.sh/)経由でコンパイラをインストールできます。

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

1.  `"Hello, World!"`と表示するシンプルなコンソールJVMアプリケーションをKotlinで作成します。
    コードエディターで、`hello.kt`という名前の新しいファイルを作成し、以下のコードを記述します。

    ```kotlin
    fun main() {
        println("Hello, World!")
    }
    ```

2.  Kotlinコンパイラを使用してアプリケーションをコンパイルします。

    ```bash
    kotlinc hello.kt -include-runtime -d hello.jar
    ```

    *   `-d`オプションは、生成されたクラスファイルの出力パスを示します。これはディレクトリまたは **.jar** ファイルのいずれかです。
    *   `-include-runtime`オプションは、Kotlinランタイムライブラリを含めることで、結果の **.jar** ファイルを自己完結型で実行可能にします。

    利用可能なすべてのオプションを確認するには、以下を実行します。

    ```bash
    kotlinc -help
    ```

3.  アプリケーションを実行します。

    ```bash
    java -jar hello.jar
    ```

## ライブラリのコンパイル

他のKotlinアプリケーションで使用されるライブラリを開発している場合、Kotlinランタイムを含めずに **.jar** ファイルをビルドできます。

```bash
kotlinc hello.kt -d hello.jar
```

この方法でコンパイルされたバイナリはKotlinランタイムに依存するため、
コンパイルされたライブラリが使用される際には常に、ランタイムがクラスパスに存在することを確認する必要があります。

また、`kotlin`スクリプトを使用して、Kotlinコンパイラによって生成されたバイナリを実行することもできます。

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt`は、`hello.kt`という名前のファイルに対してKotlinコンパイラが生成するメインクラス名です。

## REPLの実行

パラメーターなしでコンパイラを実行すると、インタラクティブシェルが起動します。このシェルでは、有効なKotlinコードを入力して結果を確認できます。

<img src="kotlin-shell.png" alt="Shell" width="500"/>

## スクリプトの実行

Kotlinをスクリプト言語として使用できます。
Kotlinスクリプトは、トップレベルの実行可能コードを持つKotlinソースファイル（`.kts`）です。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

スクリプトを実行するには、対応するスクリプトファイルとともに`-script`オプションをコンパイラに渡します。

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlinは、外部プロパティの追加、静的または動的な依存関係の提供など、スクリプトのカスタマイズに対する実験的なサポートを提供します。
カスタマイズは、_スクリプト定義_と呼ばれる、適切なサポートコードを持つアノテーション付きKotlinクラスによって定義されます。
スクリプトのファイル名拡張子は、適切な定義を選択するために使用されます。
[Kotlinカスタムスクリプト](custom-script-deps-tutorial.md)について詳しく学びましょう。

適切に準備されたスクリプト定義は、適切なjarがコンパイルクラスパスに含まれている場合、自動的に検出され適用されます。あるいは、`-script-templates`オプションをコンパイラに渡すことで、定義を手動で指定することもできます。

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)を参照してください。