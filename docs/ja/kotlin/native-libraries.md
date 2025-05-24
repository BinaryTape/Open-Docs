---
title: "Kotlin/Native ライブラリ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Kotlinコンパイラー固有の仕様

Kotlin/Nativeコンパイラーでライブラリーを作成するには、`-produce library`または`-p library`フラグを使用します。例：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

このコマンドは、`foo.kt`のコンパイルされた内容を含む`bar.klib`を生成します。

ライブラリーにリンクするには、`-library <name>`または`-l <name>`フラグを使用します。例：

```bash
$ kotlinc-native qux.kt -l bar
```

このコマンドは、`qux.kt`と`bar.klib`から`program.kexe`を生成します。

## cinteropツールの固有の仕様

**cinterop**ツールは、ネイティブライブラリー用の`.klib`ラッパーを主な出力として生成します。
たとえば、Kotlin/Nativeディストリビューションで提供されている単純な`libgit2.def`ネイティブライブラリー定義ファイルを使用します。

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

`libgit2.klib`が得られます。

詳細については、[C Interop](native-c-interop)を参照してください。

## klibユーティリティー

**klib**ライブラリー管理ユーティリティーを使用すると、ライブラリーの検査とインストールができます。

次のコマンドを使用できます。

* `content` – ライブラリーの内容を一覧表示します。

  ```bash
  $ klib contents <name>
  ```

* `info` – ライブラリーの簿記の詳細を検査します。

  ```bash
  $ klib info <name>
  ```

* `install` – ライブラリーをデフォルトの場所にインストールします。

  ```bash
  $ klib install <name>
  ```

* `remove` – ライブラリーをデフォルトのリポジトリーから削除します。

  ```bash
  $ klib remove <name>
  ```

上記のすべてのコマンドは、デフォルトとは異なるリポジトリーを指定するための追加の`-repository <directory>`引数を受け入れます。

```bash
$ klib <command> <name> -repository <directory>
```

## いくつかの例

まず、ライブラリーを作成しましょう。
小さなライブラリーのソースコードを`kotlinizer.kt`に配置します。

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

ライブラリーが現在のディレクトリーに作成されました。

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

次に、ライブラリーの内容を確認しましょう。

```bash
$ klib contents kotlinizer
```

`kotlinizer`をデフォルトのリポジトリーにインストールできます。

```bash
$ klib install kotlinizer
```

現在のディレクトリーから痕跡を削除します。

```bash
$ rm kotlinizer.klib
```

非常に短いプログラムを作成し、`use.kt`に配置します。

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

次に、作成したライブラリーにリンクしてプログラムをコンパイルします。

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

そして、プログラムを実行します。

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

お楽しみください！

## 高度なトピック

### ライブラリー検索順序

`-library foo`フラグが指定された場合、コンパイラーは次の順序で`foo`ライブラリーを検索します。

* 現在のコンパイルディレクトリーまたは絶対パス。
* `-repo`フラグで指定されたすべてのリポジトリー。
* デフォルトのリポジトリーにインストールされているライブラリー。

   > デフォルトのリポジトリーは`~/.konan`です。`kotlin.data.dir` Gradleプロパティーを設定することで変更できます。
   > 
   > または、`-Xkonan-data-dir`コンパイラーオプションを使用して、`cinterop`および`konanc`ツールを介してディレクトリーへのカスタムパスを構成できます。
   > 
   

* `$installation/klib`ディレクトリーにインストールされているライブラリー。

### ライブラリー形式

Kotlin/Nativeライブラリーは、定義済みのディレクトリー構造を含むzipファイルであり、次のレイアウトになっています。

`foo.klib`を`foo/`として解凍すると、次のようになります。

```text
  - foo/
    - $component_name/
      - ir/
        - Serialized Kotlin IR.
      - targets/
        - $platform/
          - kotlin/
            - Kotlin compiled to LLVM bitcode.
          - native/
            - Bitcode files of additional native objects.
        - $another_platform/
          - There can be several platform specific kotlin and native pairs.
      - linkdata/
        - A set of ProtoBuf files with serialized linkage metadata.
      - resources/
        - General resources such as images. (Not used yet).
      - manifest - A file in the java property format describing the library.
```

レイアウトの例は、インストールの`klib/stdlib`ディレクトリーにあります。

### klibでの相対パスの使用

:::note
klibでの相対パスの使用は、Kotlin 1.6.20以降で使用できます。

:::

ソースファイルのシリアライズされたIR表現は、`klib`ライブラリーの[一部](#library-format)です。これには、適切なデバッグ情報を生成するためのファイルのパスが含まれます。デフォルトでは、保存されているパスは絶対パスです。`-Xklib-relative-path-base`コンパイラーオプションを使用すると、形式を変更して、アーティファクトで相対パスのみを使用できます。機能させるには、ソースファイルの1つまたは複数のベースパスを引数として渡します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base is a base path of source files
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base is a base path of source files
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</TabItem>
</Tabs>