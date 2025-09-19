[//]: # (title: Kotlin/Nativeのデバッグ)

Kotlin/Nativeコンパイラは、デバッグ情報付きバイナリを生成するだけでなく、[クラッシュレポートをシンボリケートする](#debug-ios-applications)ためのデバッグシンボルファイルも作成できます。

デバッグ情報は[DWARF 2](https://dwarfstd.org/download.html)仕様と互換性があるため、LLDBやGDBのような最新のデバッガツールは以下の操作を実行できます。

* [ブレークポイントを設定する](#set-breakpoints)
* [ステッピングを使用する](#use-stepping)
* [変数と型情報を検査する](#inspect-variables)

> DWARF 2仕様をサポートするということは、デバッガツールがKotlinをC89として認識することを意味します。これは、DWARF 5仕様以前には、仕様にKotlin言語の型を識別するものが存在しないためです。
>
{style="note"}

## デバッグ情報付きバイナリを生成する

IntelliJ IDEA、Android Studio、またはXcodeでデバッグする場合、デバッグ情報付きバイナリは自動的に生成されます (ビルド設定が異なる場合を除く)。

手動でデバッグを有効にし、デバッグ情報を含むバイナリを生成するには、以下の方法があります。

* **Gradleタスクを使用する**。デバッグバイナリを取得するには、`linkDebug*` Gradleタスクを使用します。例:

  ```bash
  ./gradlew linkDebugFrameworkNative
  ```

  タスクはバイナリの種類 (例: `linkDebugSharedNative`) やターゲット (例: `linkDebugExecutableMacosArm64`) によって異なります。

* **コマンドラインコンパイラを使用する**。コマンドラインで、`-g`オプションを指定してKotlin/Nativeバイナリをコンパイルします:

  ```bash
  kotlinc-native hello.kt -g -o terminator
  ```

次に、デバッガツールを起動します。例:

```bash
lldb terminator.kexe
```

デバッガの出力:

```bash
$ cat - > hello.kt
fun main(args: Array<String>) {
  println("Hello world")
  println("I need your clothes, your boots and your motorcycle")
}
$ dist/bin/konanc -g hello.kt -o terminator
KtFile: hello.kt
$ lldb terminator.kexe
(lldb) target create "terminator.kexe"
Current executable set to 'terminator.kexe' (x86_64).
(lldb) b kfun:main(kotlin.Array<kotlin.String>)
Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
(lldb) r
Process 28473 launched: '/Users/minamoto/ws/.git-trees/debugger-fixes/terminator.kexe' (x86_64)
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x00000001000012e4 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:2
   1    fun main(args: Array<String>) {
-> 2      println("Hello world")
   3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb) n
Hello world
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x00000001000012f0 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:3
   1    fun main(args: Array<String>) {
   2      println("Hello world")
-> 3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb)
```

## ブレークポイントを設定する

最新のデバッガはブレークポイントを設定するいくつかの方法を提供しています。ツールごとの内訳については以下を参照してください:

### LLDB

* 名前で:

  ```bash
  (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
  Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

  `-n`はオプションです。このフラグはデフォルトで適用されます。

* 場所で (ファイル名、行番号):

  ```bash
  (lldb) b -f hello.kt -l 1
  Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

* アドレスで:

  ```bash
  (lldb) b -a 0x00000001000012e4
  Breakpoint 2: address = 0x00000001000012e4
  ```

* 正規表現で。ラムダなどの生成された成果物のデバッグに役立つ場合があります (名前に`#`記号が使用されている場合):

  ```bash
  (lldb) b -r main\(
  3: regex = 'main\(', locations = 1
    3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
  ```

### GDB

* 正規表現で:

  ```bash
  (gdb) rbreak main(
  Breakpoint 1 at 0x1000109b4
  struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
  ```

* 名前では _使用不可_ です。`:`が場所によるブレークポイントの区切り文字であるためです:

  ```bash
  (gdb) b kfun:main(kotlin.Array<kotlin.String>)
  No source file named kfun.
  Make breakpoint pending on future shared library load? (y or [n]) y
  Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
  ```

* 場所で:

  ```bash
  (gdb) b hello.kt:1
  Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
  ```

* アドレスで:

  ```bash
  (gdb) b *0x100001704
  Note: breakpoint 2 also set at pc 0x100001704.
  Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
  ```

## ステッピングを使用する

関数のステップ実行は、C/C++プログラムの場合とほぼ同じように機能します。

## 変数を検査する

`var`変数に対する変数検査は、プリミティブ型と非プリミティブ型の両方でそのまま機能します。

```bash
$ cat -n main.kt
     1  fun main(args: Array<String>) {
     2      var x = 1
     3      var y = 2
     4      var p = Point(x, y)
     5      println("p = $p")
     6  }
     7 
     8  data class Point(val x: Int, val y: Int)

$ lldb ./program.kexe -o 'b main.kt:5' -o
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b main.kt:5
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 289 at main.kt:5
(lldb) r
Process 4985 stopped
* thread #1, name = 'program.kexe', stop reason = breakpoint 1.1
    frame #0: program.kexe`kfun:main(kotlin.Array<kotlin.String>) at main.kt:5
   2        var x = 1
   3        var y = 2
   4        var p = Point(x, y)
-> 5        println("p = $p")
   6    }
   7   
   8    data class Point(val x: Int, val y: Int)

Process 4985 launched: './program.kexe' (x86_64)
(lldb) fr var
(int) x = 1
(int) y = 2
(ObjHeader *) p = Point(x=1, y=2)

(lldb) v p->x
(int32_t) p->x = 1
```

## iOSアプリケーションをデバッグする

iOSアプリケーションのデバッグでは、詳細なクラッシュレポートの分析が必要になる場合があります。クラッシュレポートは通常、メモリアドレスを読み取り可能なソースコードの場所へ変換するプロセスであるシンボリケーションを必要とします。

Kotlinコード内のアドレスをシンボリケートするには (例えば、Kotlinコードに対応するスタックトレース要素の場合)、特別なデバッグシンボル (`.dSYM`) ファイルが必要です。このファイルは、クラッシュレポート内のメモリアドレスを、関数や行番号など、ソースコード内の実際の位置にマッピングします。

Kotlin/Nativeコンパイラは、デフォルトでAppleプラットフォーム上のリリース (最適化済み) バイナリ用に`.dSYM`ファイルを生成します。Xcodeでビルドする場合、IDEは標準的な場所で`.dSYM`ファイルを探し、シンボリケーションのためにそれらを自動的に使用します。Xcodeは、IntelliJ IDEAテンプレートから作成されたプロジェクト内の`.dSYM`ファイルを自動的に検出します。

他のプラットフォームでは、`-Xadd-light-debug`コンパイラオプションを使用して、生成されるバイナリにデバッグ情報を追加することができます (これらはサイズが増加します):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
</tabs>

クラッシュレポートの詳細については、[Appleのドキュメント](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs)を参照してください。

## 既知の問題

* Pythonバインディングのパフォーマンス。
* デバッガツールでの式評価はサポートされておらず、現在、実装の予定はありません。