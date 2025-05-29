[//]: # (title: Kotlin/Nativeのデバッグ)

現在、Kotlin/NativeコンパイラはDWARF 2仕様に準拠したデバッグ情報を生成するため、最新のデバッガツールは以下の操作を実行できます。
- ブレークポイント
- ステッピング
- 型情報の検査
- 変数の検査

>DWARF 2仕様をサポートするということは、デバッガツールがKotlinをC89として認識することを意味します。これは、DWARF 5仕様以前には、仕様にKotlin言語タイプ用の識別子がないためです。
>
{style="note"}

## Kotlin/Nativeコンパイラでデバッグ情報付きバイナリを生成する

Kotlin/Nativeコンパイラでバイナリを生成するには、コマンドラインで``-g``オプションを使用します。

```bash
0:b-debugger-fixes:minamoto@unit-703(0)# cat - > hello.kt
fun main(args: Array<String>) {
  println("Hello world")
  println("I need your clothes, your boots and your motocycle")
}
0:b-debugger-fixes:minamoto@unit-703(0)# dist/bin/konanc -g hello.kt -o terminator
KtFile: hello.kt
0:b-debugger-fixes:minamoto@unit-703(0)# lldb terminator.kexe
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
   3      println("I need your clothes, your boots and your motocycle")
   4    }
(lldb) n
Hello world
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x00000001000012f0 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:3
   1    fun main(args: Array<String>) {
   2      println("Hello world")
-> 3      println("I need your clothes, your boots and your motocycle")
   4    }
(lldb)
```

## ブレークポイント

最新のデバッガは、ブレークポイントを設定するいくつかの方法を提供します。ツールごとの詳細については以下を参照してください。

### lldb

- 名前で

    ```bash
    (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
    Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

_``-n``はオプションです。このフラグはデフォルトで適用されます_
- ロケーション (ファイル名、行番号) で

    ```bash
    (lldb) b -f hello.kt -l 1
    Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

- アドレスで

    ```bash
    (lldb) b -a 0x00000001000012e4
    Breakpoint 2: address = 0x00000001000012e4
    ```

- 正規表現で。ラムダなどの生成された成果物 (名前に`#`記号が使用されている場合) のデバッグに役立つ場合があります。

    ```bash
    3: regex = 'main\(', locations = 1
      3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
    ```

### gdb

- 正規表現で

    ```bash
    (gdb) rbreak main(
    Breakpoint 1 at 0x1000109b4
    struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
    ```

- 名前で __使用不可__。`:`がロケーションによるブレークポイントの区切り文字であるため。
    
    ```bash
    (gdb) b kfun:main(kotlin.Array<kotlin.String>)
    No source file named kfun.
    Make breakpoint pending on future shared library load? (y or [n]) y
    Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
    ```

- ロケーションで

    ```bash
    (gdb) b hello.kt:1
    Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
    ```

- アドレスで

    ```bash
    (gdb) b *0x100001704
    Note: breakpoint 2 also set at pc 0x100001704.
    Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
    ```

## ステッピング

ステッピング機能は、C/C++プログラムの場合とほぼ同じように動作します。

## 変数の検査

`var`変数の検査は、プリミティブ型に対してはそのまま動作します。
非プリミティブ型の場合、`konan_lldb.py`にlldb用のカスタムのpretty printerがあります。

```bash
λ cat main.kt | nl
     1  fun main(args: Array<String>) {
     2      var x = 1
     3      var y = 2
     4      var p = Point(x, y)
     5      println("p = $p")
     6  }
       
     7  data class Point(val x: Int, val y: Int)

λ lldb ./program.kexe -o 'b main.kt:5' -o
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b main.kt:5
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 289 at main.kt:5, address = 0x000000000040af11
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
(ObjHeader *) p = 0x00000000007643d8
(lldb) command script import dist/tools/konan_lldb.py
(lldb) fr var
(int) x = 1
(int) y = 2
(ObjHeader *) p = [x: ..., y: ...]
(lldb) p p
(ObjHeader *) $2 = [x: ..., y: ...]
(lldb) script lldb.frame.FindVariable("p").GetChildMemberWithName("x").Dereference().GetValue()
'1'
(lldb) 
```

オブジェクト変数 (`var`) の表現の取得は、組み込みのランタイム関数`Konan_DebugPrint`を使用しても可能です (このアプローチは、コマンド構文のモジュールを使用することでgdbでも機能します)。

```bash
0:b-debugger-fixes:minamoto@unit-703(0)# cat ../debugger-plugin/1.kt | nl -p
     1  fun foo(a:String, b:Int) = a + b
     2  fun one() = 1
     3  fun main(arg:Array<String>) {
     4    var a_variable = foo("(a_variable) one is ", 1)
     5    var b_variable = foo("(b_variable) two is ", 2)
     6    var c_variable = foo("(c_variable) two is ", 3)
     7    var d_variable = foo("(d_variable) two is ", 4)
     8    println(a_variable)
     9    println(b_variable)
    10    println(c_variable)
    11    println(d_variable)
    12  }
0:b-debugger-fixes:minamoto@unit-703(0)# lldb ./program.kexe -o 'b -f 1.kt -l 9' -o r
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b -f 1.kt -l 9
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 463 at 1.kt:9, address = 0x0000000100000dbf
(lldb) r
(a_variable) one is 1
Process 80496 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000dbf program.kexe`kfun:main(kotlin.Array<kotlin.String>) at 1.kt:9
   6      var c_variable = foo("(c_variable) two is ", 3)
   7      var d_variable = foo("(d_variable) two is ", 4)
   8      println(a_variable)
-> 9      println(b_variable)
   10     println(c_variable)
   11     println(d_variable)
   12   }

Process 80496 launched: './program.kexe' (x86_64)
(lldb) expression -- (int32_t)Konan_DebugPrint(a_variable)
(a_variable) one is 1(int32_t) $0 = 0
(lldb)

```

## 既知の問題

- Pythonバインディングのパフォーマンス。