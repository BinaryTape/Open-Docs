[//]: # (title: Kotlin/Native 디버깅)

Kotlin/Native 컴파일러는 디버그 정보가 포함된 바이너리를 생성할 수 있으며, [크래시 리포트 심볼화를 위한](#debug-ios-applications) 디버그 심볼 파일도 생성할 수 있습니다.

디버그 정보는 [DWARF 2](https://dwarfstd.org/download.html) 명세와 호환되므로, LLDB 및 GDB와 같은 최신 디버거 도구는 다음을 수행할 수 있습니다:

*   [중단점 설정](#set-breakpoints)
*   [단계 실행 사용](#use-stepping)
*   [변수 및 타입 정보 검사](#inspect-variables)

> DWARF 2 명세를 지원한다는 것은 디버거 도구가 Kotlin을 C89로 인식한다는 것을 의미합니다. 이는 DWARF 5 명세 이전에는 명세에 Kotlin 언어 타입에 대한 식별자가 없기 때문입니다.
>
{style="note"}

## 디버그 정보가 포함된 바이너리 생성

IntelliJ IDEA, Android Studio 또는 Xcode에서 디버깅할 때, (빌드가 다르게 구성되지 않는 한) 디버그 정보가 포함된 바이너리가 자동으로 생성됩니다.

다음 방법으로 디버깅을 수동으로 활성화하고 디버그 정보가 포함된 바이너리를 생성할 수 있습니다:

*   **Gradle 태스크 사용**. 디버그 바이너리를 얻으려면 `linkDebug*` Gradle 태스크를 사용하십시오. 예를 들어:

    ```bash
    ./gradlew linkDebugFrameworkNative
    ```

    이 태스크들은 바이너리 타입(예: `linkDebugSharedNative`) 또는 대상(예: `linkDebugExecutableMacosArm64`)에 따라 달라집니다.

*   **명령줄 컴파일러 사용**. 명령줄에서 `-g` 옵션을 사용하여 Kotlin/Native 바이너리를 컴파일하십시오:

    ```bash
    kotlinc-native hello.kt -g -o terminator
    ```

그런 다음 디버거 도구를 실행하십시오. 예를 들어:

```bash
lldb terminator.kexe
```

디버거 출력:

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

## 중단점 설정

최신 디버거는 중단점을 설정하는 여러 방법을 제공합니다. 아래에서 도구별 분류를 확인하십시오:

### LLDB

*   이름으로:

    ```bash
    (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
    Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

    `-n`은 선택 사항이며, 기본적으로 적용됩니다.

*   위치로 (파일 이름, 줄 번호):

    ```bash
    (lldb) b -f hello.kt -l 1
    Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

*   주소로:

    ```bash
    (lldb) b -a 0x00000001000012e4
    Breakpoint 2: address = 0x00000001000012e4
    ```

*   정규식으로. 람다와 같이 생성된 아티팩트(이름에 `#` 기호가 사용된 경우)를 디버깅할 때 유용할 수 있습니다:

    ```bash
    (lldb) b -r main\(
    3: regex = 'main\(', locations = 1
      3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
    ```

### GDB

*   정규식으로:

    ```bash
    (gdb) rbreak main(
    Breakpoint 1 at 0x1000109b4
    struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
    ```

*   이름으로 __사용 불가__. `:`이 위치 기반 중단점의 구분자이기 때문입니다:

    ```bash
    (gdb) b kfun:main(kotlin.Array<kotlin.String>)
    No source file named kfun.
    Make breakpoint pending on future shared library load? (y or [n]) y
    Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
    ```

*   위치로:

    ```bash
    (gdb) b hello.kt:1
    Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
    ```

*   주소로:

    ```bash
    (gdb) b *0x100001704
    Note: breakpoint 2 also set at pc 0x100001704.
    Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
    ```

## 단계 실행

단계 실행 기능은 대부분 C/C++ 프로그램과 동일하게 작동합니다.

## 변수 검사

`var` 변수에 대한 변수 검사는 기본 및 비기본 타입 모두에서 즉시 작동합니다:

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

## iOS 애플리케이션 디버깅

iOS 애플리케이션 디버깅은 때때로 크래시 리포트를 자세히 분석하는 것을 포함합니다. 크래시 리포트에는 일반적으로 메모리 주소를 읽을 수 있는 소스 코드 위치로 변환하는 과정인 심볼화(symbolication)가 필요합니다.

Kotlin 코드의 주소(예: Kotlin 코드에 해당하는 스택 트레이스 요소)를 심볼화하려면 특별한 디버그 심볼(`.dSYM`) 파일이 필요합니다. 이 파일은 크래시 리포트의 메모리 주소를 함수나 줄 번호와 같은 소스 코드의 실제 위치에 매핑합니다.

Kotlin/Native 컴파일러는 Apple 플랫폼에서 기본적으로 릴리스(최적화된) 바이너리에 대한 `.dSYM` 파일을 생성합니다. Xcode에서 빌드할 때, IDE는 표준 위치에서 `.dSYM` 파일을 찾아 심볼화를 위해 자동으로 사용합니다. Xcode는 IntelliJ IDEA 템플릿으로 생성된 프로젝트에서 `.dSYM` 파일을 자동으로 감지합니다.

다른 플랫폼에서는 `-Xadd-light-debug` 컴파일러 옵션을 사용하여 생성된 바이너리에 디버그 정보를 추가할 수 있습니다 (이는 바이너리 크기를 증가시킵니다):

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

크래시 리포트에 대한 자세한 내용은 [Apple 문서](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs)를 참조하십시오.

## 알려진 문제

*   Python 바인딩 성능.
*   디버거 도구에서 표현식 평가는 지원되지 않으며, 현재 구현 계획이 없습니다.