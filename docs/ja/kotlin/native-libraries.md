[//]: # (title: Kotlin/Nativeライブラリ)

## Kotlinコンパイラの詳細

Kotlin/Nativeコンパイラでライブラリを生成するには、`-produce library` または `-p library` フラグを使用します。例:

```bash
$ kotlinc-native foo.kt -p library -o bar
```

このコマンドは、`foo.kt` のコンパイル済みコンテンツを含む `bar.klib` を生成します。

ライブラリにリンクするには、`-library <name>` または `-l <name>` フラグを使用します。例:

```bash
$ kotlinc-native qux.kt -l bar
```

このコマンドは、`qux.kt` と `bar.klib` から `program.kexe` を生成します。

## cinteropツールの詳細

**cinterop** ツールは、主な出力としてネイティブライブラリの `.klib` ラッパーを生成します。
例えば、Kotlin/Nativeディストリビューションで提供されているシンプルな `libgit2.def` ネイティブライブラリ定義ファイルを使用すると、

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

`libgit2.klib` が得られます。

詳細は[C Interop](native-c-interop.md)を参照してください。

## klibユーティリティ

**klib** ライブラリ管理ユーティリティを使用すると、ライブラリの調査やインストールが可能です。

以下のコマンドが利用可能です:

*   `content` – ライブラリの内容を一覧表示します:

    ```bash
    $ klib contents <name>
    ```

*   `info` – ライブラリの管理情報を調べます:

    ```bash
    $ klib info <name>
    ```

*   `install` – ライブラリをデフォルトの場所にインストールします:

    ```bash
    $ klib install <name>
    ```

*   `remove` – ライブラリをデフォルトのリポジトリから削除します:

    ```bash
    $ klib remove <name>
    ```

上記のすべてのコマンドは、デフォルトとは異なるリポジトリを指定するために、追加の `-repository <directory>` 引数を受け入れます。

```bash
$ klib <command> <name> -repository <directory>
```

## いくつかの例

まず、ライブラリを作成しましょう。
小さなライブラリのソースコードを `kotlinizer.kt` に配置します:

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

ライブラリは現在のディレクトリに作成されました:

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

次に、ライブラリの内容を確認しましょう:

```bash
$ klib contents kotlinizer
```

`kotlinizer` をデフォルトのリポジトリにインストールできます:

```bash
$ klib install kotlinizer
```

現在のディレクトリからその痕跡をすべて削除します:

```bash
$ rm kotlinizer.klib
```

非常に短いプログラムを作成し、それを `use.kt` に配置します:

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

次に、作成したばかりのライブラリにリンクしてプログラムをコンパイルします:

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

そしてプログラムを実行します:

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

お楽しみください！

## 高度なトピック

### ライブラリの検索順序

`-library foo` フラグが指定された場合、コンパイラは `foo` ライブラリを以下の順序で検索します:

*   現在のコンパイルディレクトリ、または絶対パス。
*   `-repo` フラグで指定されたすべてのリポジトリ。
*   デフォルトのリポジトリにインストールされているライブラリ。

    > デフォルトのリポジトリは `~/.konan` です。`kotlin.data.dir` Gradleプロパティを設定することで変更できます。
    >
    > あるいは、`cinterop` および `konanc` ツールを介して、`-Xkonan-data-dir` コンパイラオプションを使用して、ディレクトリへのカスタムパスを設定することもできます。
    >
    {style="note"}

*   `$installation/klib` ディレクトリにインストールされているライブラリ。

### ライブラリのフォーマット

Kotlin/Nativeライブラリは、事前に定義されたディレクトリ構造を持つzipファイルであり、以下のレイアウトになっています:

`foo.klib` を `foo/` として展開すると、以下のようになります:

```text
  - foo/
    - $component_name/
      - ir/
        - シリアライズされたKotlin IR。
      - targets/
        - $platform/
          - kotlin/
            - LLVMビットコードにコンパイルされたKotlin。
          - native/
            - 追加のネイティブオブジェクトのビットコードファイル。
        - $another_platform/
          - 複数のプラットフォーム固有のKotlinとネイティブのペアが存在する可能性があります。
      - linkdata/
        - シリアライズされたリンケージメタデータを含むProtoBufファイルのセット。
      - resources/
        - 画像などの一般的なリソース。（まだ使用されていません）。
      - manifest - ライブラリを記述するJavaプロパティ形式のファイル。
```

レイアウトの例は、インストールされている `klib/stdlib` ディレクトリにあります。

### klibにおける相対パスの使用

> klibにおける相対パスの使用は、Kotlin 1.6.20以降で利用可能です。
>
{style="note"}

ソースファイルのシリアライズされたIR表現は、[klibライブラリの一部](#library-format)です。これには、適切なデバッグ情報を生成するためのファイルのパスが含まれます。デフォルトでは、格納されるパスは絶対パスです。
`-Xklib-relative-path-base` コンパイラオプションを使用すると、形式を変更し、成果物内で相対パスのみを使用できます。これを機能させるには、ソースファイルの1つまたは複数のベースパスを引数として渡します:

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