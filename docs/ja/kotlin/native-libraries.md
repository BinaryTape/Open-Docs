[//]: # (title: Kotlin/Native ライブラリ)

## ライブラリのコンパイル

プロジェクトのビルドファイルまたは Kotlin/Native コンパイラを使用して、ライブラリの `*.klib` アーティファクトを生成できます。

### Gradle ビルドファイルの使用

Gradle ビルドファイルで [Kotlin/Native ターゲット](native-target-support.md)を指定することで、`*.klib` ライブラリ アーティファクトをコンパイルできます。

1. `build.gradle(.kts)` ファイルで、少なくとも 1 つの Kotlin/Native ターゲットを宣言します。例：

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
 
   kotlin {
       macosArm64()    // macOS の場合
       // linuxArm64() // Linux の場合
       // mingwX64()   // Windows の場合
   }
   ```

2. `<target>Klib` タスクを実行します。例：

   ```bash
   ./gradlew macosArm64Klib
   ```

Gradle は自動的にそのターゲットのソースファイルをコンパイルし、プロジェクトの `build/libs` ディレクトリに `.klib` アーティファクトを生成します。

### Kotlin/Native コンパイラの使用

Kotlin/Native コンパイラを使用してライブラリを生成するには：

1. [Kotlin/Native コンパイラをダウンロードしてインストールします。](native-get-started.md#download-and-install-the-compiler)
2. Kotlin/Native ソースファイルをライブラリにコンパイルするには、`-produce library` または `-p library` オプションを使用します：

   ```bash
   kotlinc-native foo.kt -p library -o bar
   ```

   このコマンドは、`foo.kt` ファイルの内容を `bar` という名前のライブラリにコンパイルし、`bar.klib` アーティファクトを生成します。

3. 別のファイルをライブラリにリンクするには、`-library <name>` または `-l <name>` オプションを使用します。例：

   ```bash
   kotlinc-native qux.kt -l bar
   ```
   
   このコマンドは、`qux.kt` ソースファイルと `bar.klib` ライブラリをコンパイルし、最終的な実行可能バイナリ `program.kexe` を生成します。

## klib ユーティリティ

**klib** ライブラリ管理ユーティリティを使用すると、次の構文でライブラリを検査できます：

```bash
klib <command> <library path> [<option>]
```

現在、以下のコマンドが利用可能です：

| コマンド                       | 説明                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | ライブラリに関する全般的な情報。                                                                                                                                                                                                                                                                                                                         |
| `dump-abi`                    | ライブラリの ABI スナップショットをダンプします。スナップショットの各行は 1 つの宣言に対応します。宣言に ABI 非互換の変更が発生した場合、スナップショットの対応する行で確認できます。                                                                                                                                       |
| `dump-ir`                     | ライブラリ宣言の中間表現 (IR) を出力にダンプします。デバッグ目的でのみ使用してください。                                                                                                                                                                                                                                                    |
| `dump-ir-signatures`          | すべての非公開（non-private）ライブラリ宣言と、このライブラリによって消費されるすべての非公開宣言の IR シグネチャを（2 つの個別のリストとして）ダンプします。このコマンドは純粋に IR 内のデータに依存します。                                                                                                                                                                    |
| `dump-ir-inlinable-functions` | ライブラリ内のインライン化可能関数の IR を出力にダンプします。デバッグ目的でのみ使用してください。                                                                                                                                                                                                                                                                    |
| `dump-metadata`               | すべてのライブラリ宣言のメタデータを出力にダンプします。デバッグ目的でのみ使用してください。                                                                                                                                                                                                                                                                        |
| `dump-metadata-signatures`    | ライブラリのメタデータに基づいて、すべての非公開ライブラリ宣言の IR シグネチャをダンプします。ほとんどの場合、出力は IR に基づいてシグネチャをレンダリングする `dump-ir-signatures` コマンドと同じになります。ただし、コンパイル中に IR 変換を行うコンパイラプラグイン（Compose など）が使用されている場合、パッチが適用された宣言は異なるシグネチャを持つ可能性があります。 |

上記のすべてのダンプコマンドは、追加の `-signature-version {N}` 引数を受け取ります。これは、シグネチャをダンプする際にどの IR シグネチャバージョンをレンダリングするかを klib ユーティリティに指示します。指定されない場合は、ライブラリでサポートされている最新のバージョンが使用されます。例：

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

さらに、`dump-metadata` コマンドは `-print-signatures {true|false}` 引数を受け取ります。これは、出力内のすべての宣言に対して IR シグネチャを出力するように klib ユーティリティに指示します。

## ライブラリの作成と使用

1. ソースコードを `kotlinizer.kt` に配置してライブラリを作成します：

   ```kotlin
   package kotlinizer

   val String.kotlinized
       get() = "Kotlin $this"
   ```

2. ライブラリを `.klib` にコンパイルします：

   ```bash
   kotlinc-native kotlinizer.kt -p library -o kotlinizer
   ```

3. 現在のディレクトリにライブラリが作成されたことを確認します：

   ```bash
   ls kotlinizer.klib
   ```

4. ライブラリの全般的な情報を確認します：

   ```bash
   klib info kotlinizer.klib
   ```

5. `use.kt` ファイルに短いプログラムを作成します：

   ```kotlin
   import kotlinizer.*

   fun main(args: Array<String>) {
       println("Hello, ${"world".kotlinized}!")
   }
   ```

6. `use.kt` ソースファイルをライブラリにリンクして、プログラムをコンパイルします：

   ```bash
   kotlinc-native use.kt -l kotlinizer -o kohello
   ```

7. プログラムを実行します：

   ```bash
   ./kohello.kexe
   ```

出力に `Hello, Kotlin world!` と表示されるはずです。

## ライブラリの検索順序

> ライブラリの検索メカニズムは間もなく変更される予定です。このセクションの更新を待ち、非推奨のフラグに依存しないようにしてください。
> 
{style="note"}

`-library foo` オプションが指定された場合、コンパイラは以下の順序で `foo` ライブラリを検索します：

1. 現在のコンパイルディレクトリ、または絶対パス。
2. デフォルトのリポジトリにインストールされたライブラリ。

   > デフォルトのリポジトリは `~/.konan` です。`konan.data.dir` Gradle プロパティを設定することで変更できます。
   > 
   > あるいは、`-Xkonan-data-dir` コンパイラオプションを使用して、`cinterop` および `kotlinc` ツール経由でディレクトリへのカスタムパスを構成することもできます。
   > 
   {style="note"}

3. `$installation/klib` ディレクトリにインストールされたライブラリ。

## ライブラリ形式

Kotlin/Native ライブラリは、事前定義されたディレクトリ構造を持つ zip ファイルであり、次のようなレイアウトになっています：

`foo.klib` を `foo/` として展開すると、以下のようになります：

```text
- foo/
  - $component_name/
    - ir/
      - シリアル化された Kotlin IR。
    - targets/
      - $platform/
        - kotlin/
          - LLVM ビットコードにコンパイルされた Kotlin。
        - native/
          - 追加のネイティブオブジェクトのビットコードファイル。
      - $another_platform/
        - 複数のプラットフォーム固有の kotlin と native のペアが存在する場合があります。
    - linkdata/
      - シリアル化されたリンケージメタデータを含む ProtoBuf ファイルのセット。
    - resources/
      - 画像などの一般的なリソース。（まだ使用されていません）。
    - manifest - ライブラリを記述する Java プロパティ形式のファイル。
```

Kotlin/Native コンパイラをインストールしたディレクトリの `klib/common/stdlib` に、レイアウトの例があります。

## klib での相対パスの使用

ソースファイルのシリアル化された IR 表現は、`klib` ライブラリの[一部](#library-format)です。これには、適切なデバッグ情報を生成するためのファイルのパスが含まれています。デフォルトでは、保存されるパスは絶対パスです。

`-Xklib-relative-path-base` コンパイラオプションを使用すると、形式を変更してアーティファクト内で相対パスのみを使用できます。これを機能させるには、ソースファイルの 1 つまたは複数のベースパスを引数として渡します：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base はソースファイルのベースパス
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
        // $base はソースファイルのベースパス
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## 次のステップ

[cinterop ツールを使用して `*.klib` アーティファクトを生成する方法を学ぶ](native-definition-file.md)