[//]: # (title: Kotlin/Native 디버깅)

현재 Kotlin/Native 컴파일러는 DWARF 2 명세와 호환되는 디버그 정보를 생성하므로, 최신 디버거 도구는 다음 작업을 수행할 수 있습니다:
- 중단점
- 단계 실행
- 타입 정보 검사
- 변수 검사

> DWARF 2 명세를 지원한다는 것은 디버거 도구가 Kotlin을 C89로 인식한다는 것을 의미합니다. 이는 DWARF 5 명세 이전에는 명세에 Kotlin 언어 타입에 대한 식별자가 없기 때문입니다.
>
{style="note"}

## Kotlin/Native 컴파일러로 디버그 정보 포함 바이너리 생성하기

Kotlin/Native 컴파일러로 바이너리를 생성하려면 명령줄에서 `-g` 옵션을 사용하세요.

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

## 중단점

최신 디버거는 중단점을 설정하는 여러 방법을 제공합니다. 각 도구별 상세 내용은 아래를 참조하세요.

### lldb

- 이름으로

    ```bash
    (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
    Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

_``-n``은 선택 사항이며, 이 플래그는 기본적으로 적용됩니다._
- 위치로 (파일 이름, 줄 번호)

    ```bash
    (lldb) b -f hello.kt -l 1
    Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

- 주소로

    ```bash
    (lldb) b -a 0x00000001000012e4
    Breakpoint 2: address = 0x00000001000012e4
    ```

- 정규식으로, 람다 등 생성된 아티팩트(이름에 `#` 기호가 사용된 경우)를 디버깅하는 데 유용할 수 있습니다.

    ```bash
    3: regex = 'main\(', locations = 1
      3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
    ```

### gdb

- 정규식으로

    ```bash
    (gdb) rbreak main(
    Breakpoint 1 at 0x1000109b4
    struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
    ```

- 이름으로 __사용 불가__. `:`는 위치별 중단점의 구분자이기 때문입니다.

    ```bash
    (gdb) b kfun:main(kotlin.Array<kotlin.String>)
    No source file named kfun.
    Make breakpoint pending on future shared library load? (y or [n]) y
    Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
    ```

- 위치로

    ```bash
    (gdb) b hello.kt:1
    Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
    ```

- 주소로

    ```bash
    (gdb) b *0x100001704
    Note: breakpoint 2 also set at pc 0x100001704.
    Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
    ```

## 단계 실행

함수 단계 실행은 C/C++ 프로그램과 거의 동일하게 작동합니다.

## 변수 검사

`var` 변수에 대한 변수 검사는 원시 타입(primitive type)의 경우 별도 설정 없이 작동합니다.
비원시 타입의 경우 `konan_lldb.py`에 lldb용 사용자 지정 pretty printer가 있습니다:

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

객체 변수(`var`)의 표현을 얻는 것은 내장 런타임 함수 `Konan_DebugPrint`를 사용해서도 가능합니다(이 접근 방식은 gdb에서도 명령 구문 모듈을 사용하여 작동합니다).

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

## 알려진 문제

- Python 바인딩의 성능.