[//]: # (title: Kotlin/Native ライブラリ)

## ライブラリのコンパイル

プロジェクトのビルドファイルまたはKotlin/Nativeコンパイラを使用して、ライブラリの `*.klib` アーティファクトを生成できます。

### Gradleビルドファイルの使用

Gradleビルドファイルで [Kotlin/Nativeターゲット](native-target-support.md) を指定することで、`*.klib` ライブラリアーティファクトをコンパイルできます。

1.  `build.gradle(.kts)` ファイルで、少なくとも1つのKotlin/Nativeターゲットを宣言します。例:

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
 
    kotlin {
        macosArm64()    // on macOS
        // linuxArm64() // on Linux
        // mingwX64()   // on Windows
    }
    ```

2.  `<target>Klib` タスクを実行します。例:

    ```bash
    ./gradlew macosArm64Klib
    ```

Gradleは、そのターゲットのソースファイルを自動的にコンパイルし、プロジェクトの `build/libs` ディレクトリに `.klib` アーティファクトを生成します。

### Kotlin/Nativeコンパイラの使用

Kotlin/Nativeコンパイラでライブラリを生成するには:

1.  [Kotlin/Nativeコンパイラをダウンロードしてインストールします。](native-get-started.md#download-and-install-the-compiler)
2.  Kotlin/Nativeソースファイルをライブラリにコンパイルするには、`-produce library` または `-p library` オプションを使用します。

    ```bash
    kotlinc-native foo.kt -p library -o bar
    ```

    このコマンドは、`foo.kt` ファイルの内容を `bar` という名前のライブラリにコンパイルし、`bar.klib` アーティファクトを生成します。

3.  別のファイルをライブラリにリンクするには、`-library <name>` または `-l <name>` オプションを使用します。例:

    ```bash
    kotlinc-native qux.kt -l bar
    ```
   
    このコマンドは、`qux.kt` ソースファイルと `bar.klib` ライブラリの内容をコンパイルし、最終的な実行可能バイナリ `program.kexe` を生成します。

## klibユーティリティ

**klib** ライブラリ管理ユーティリティを使用すると、以下の構文でライブラリを検査できます。

```bash
klib <command> <library path> [<option>]
```

現在、以下のコマンドが利用可能です。

| コマンド                      | 説明                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | ライブラリに関する一般情報。                                                                                                                                                                                                                                                                                                                                 |
| `dump-abi`                    | ライブラリのABIスナップショットをダンプします。スナップショットの各行は1つの宣言に対応します。宣言にABI非互換の変更が発生した場合、スナップショットの対応する行でそれが確認できます。                                                                                                                                       |
| `dump-ir`                     | ライブラリ宣言の中間表現 (IR) を出力にダンプします。デバッグ目的でのみ使用してください。                                                                                                                                                                                                                                                                       |
| `dump-ir-signatures`          | すべての非プライベートなライブラリ宣言と、このライブラリによって消費されるすべての非プライベートな宣言のIRシグネチャをダンプします（2つの別々のリストとして）。このコマンドは純粋にIR内のデータに依存します。                                                                                                                                       |
| `dump-ir-inlinable-functions` | ライブラリ内のインライン化可能な関数のIRを出力にダンプします。デバッグ目的でのみ使用してください。                                                                                                                                                                                                                                                           |
| `dump-metadata`               | すべてのライブラリ宣言のメタデータを出力にダンプします。デバッグ目的でのみ使用してください。                                                                                                                                                                                                                                                                   |
| `dump-metadata-signatures`    | ライブラリのメタデータに基づいて、すべての非プライベートなライブラリ宣言のIRシグネチャをダンプします。ほとんどの場合、IRに基づいてシグネチャをレンダリングする `dump-ir-signatures` コマンドと同じ出力になります。ただし、コンパイル中にIR変換コンパイラプラグイン（Composeなど）が使用される場合、パッチが適用された宣言は異なるシグネチャを持つ可能性があります。 |

上記のすべてのダンプコマンドは、シグネチャをダンプする際にどのIRシグネチャバージョンをレンダリングするかをklibユーティリティに指示する追加の `-signature-version {N}` 引数を受け入れます。指定しない場合、ライブラリによってサポートされている最新バージョンが使用されます。例:

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

さらに、`dump-metadata` コマンドは、klibユーティリティに出力内のすべての宣言のIRシグネチャを出力するように指示する `-print-signatures {true|false}` 引数を受け入れます。

## ライブラリの作成と使用

1.  ソースコードを `kotlinizer.kt` に配置してライブラリを作成します。

    ```kotlin
    package kotlinizer

    val String.kotlinized
        get() = "Kotlin $this"
    ```

2.  ライブラリを `.klib` にコンパイルします。

    ```bash
    kotlinc-native kotlinizer.kt -p library -o kotlinizer
    ```

3.  作成されたライブラリを現在のディレクトリで確認します。

    ```bash
    ls kotlinizer.klib
    ```

4.  ライブラリに関する一般情報を確認します。

    ```bash
    klib info kotlinizer.klib
    ```

5.  `use.kt` ファイルに短いプログラムを作成します。

    ```kotlin
    import kotlinizer.*

    fun main(args: Array<String>) {
        println("Hello, ${"world".kotlinized}!")
    }
    ```

6.  `use.kt` ソースファイルをライブラリにリンクして、プログラムをコンパイルします。

    ```bash
    kotlinc-native use.kt -l kotlinizer -o kohello
    ```

7.  プログラムを実行します。

    ```bash
    ./kohello.kexe
    ```

出力に `Hello, Kotlin world!` と表示されるはずです。

## ライブラリの検索シーケンス

> ライブラリの検索メカニズムは間もなく変更されます。このセクションの更新に注意し、非推奨のフラグへの依存は避けてください。
> 
{style="note"}

`-library foo` オプションが指定された場合、コンパイラは以下の順序で `foo` ライブラリを検索します。

1.  現在のコンパイルディレクトリ、または絶対パス。
2.  デフォルトリポジトリにインストールされているライブラリ。

    > デフォルトのリポジトリは `~/.konan` です。`konan.data.dir` Gradle プロパティを設定することで変更できます。
    > 
    > または、`-Xkonan-data-dir` コンパイラオプションを使用して、`cinterop` および `konanc` ツールを介してディレクトリへのカスタムパスを設定することもできます。
    > 
    {style="note"}

3.  `$installation/klib` ディレクトリにインストールされているライブラリ。

## ライブラリのフォーマット

Kotlin/Nativeライブラリは、事前に定義されたディレクトリ構造を含むzipファイルであり、以下のレイアウトを持ちます。

`foo.klib` を `foo/` として展開すると、以下のようになります。

```text
- foo/
  - $component_name/
    - ir/
      - シリアライズされた Kotlin IR。
    - targets/
      - $platform/
        - kotlin/
          - LLVM ビットコードにコンパイルされた Kotlin。
        - native/
          - 追加のネイティブオブジェクトのビットコードファイル。
      - $another_platform/
        - 複数のプラットフォーム固有の Kotlin とネイティブのペアが存在する場合があります。
    - linkdata/
      - シリアライズされたリンケージメタデータを含む ProtoBuf ファイルのセット。
    - resources/
      - 画像などの一般的なリソース。（まだ使用されていません）。
    - manifest - ライブラリを記述するJavaプロパティ形式のファイル。
```

レイアウトの例は、Kotlin/Nativeコンパイラのインストールの `klib/common/stdlib` ディレクトリで見つけることができます。

## klibでの相対パスの使用

ソースファイルのシリアライズされたIR表現は、klibライブラリの [一部](#library-format) です。これには、適切なデバッグ情報を生成するためのファイルのパスが含まれます。デフォルトでは、保存されるパスは絶対パスです。

`-Xklib-relative-path-base` コンパイラオプションを使用すると、フォーマットを変更し、アーティファクト内で相対パスのみを使用できます。これを機能させるには、ソースファイルの1つまたは複数のベースパスを引数として渡します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base はソースファイルのベースパスです
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base はソースファイルのベースパスです
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## 次のステップ

[cinteropツールを使用して `*.klib` アーティファクトを生成する方法を学びましょう](native-definition-file.md)