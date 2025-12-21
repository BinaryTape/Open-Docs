[//]: # (title: C 언어의 기본 데이터 타입 매핑 – 튜토리얼)

<tldr>
    <p>이 튜토리얼은 **Kotlin과 C 매핑** 튜토리얼 시리즈의 첫 번째 부분입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> **C 언어의 기본 데이터 타입 매핑**<br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">C 언어의 구조체 및 유니온 타입 매핑</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">C 언어의 함수 포인터 매핑</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">C 언어의 문자열 매핑</a><br/>
    </p>
</tldr>

> C 라이브러리 임포트는 [베타](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 단계입니다. cinterop 툴이 C 라이브러리에서 생성하는 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native에 포함된 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

어떤 C 데이터 타입이 Kotlin/Native에서 보이는지, 그리고 그 반대의 경우도 살펴보고 Kotlin/Native 및 [멀티플랫폼](gradle-configure-project.md#targeting-multiple-platforms) Gradle 빌드의 고급 C interop 관련 사용 사례를 검토해 보겠습니다.

이 튜토리얼에서는 다음을 수행합니다:

*   [C 언어의 데이터 타입 알아보기](#types-in-c-language)
*   [익스포트(export)에 해당 타입을 사용하는 C 라이브러리 생성](#create-a-c-library)
*   [C 라이브러리에서 생성된 Kotlin API 검사](#inspect-generated-kotlin-apis-for-a-c-library)

명령줄을 사용해서 Kotlin 라이브러리를 직접 생성하거나, 스크립트 파일(예: `.sh` 또는 `.bat` 파일)을 통해 생성할 수 있습니다. 하지만 이 방법은 수백 개의 파일과 라이브러리를 가진 대규모 프로젝트에는 잘 확장되지 않습니다. 빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리 및 전이적 종속성을 가진 라이브러리를 다운로드하고 캐싱하는 것은 물론, 컴파일러와 테스트를 실행함으로써 프로세스를 단순화할 수 있습니다. Kotlin/Native는 [Kotlin 멀티플랫폼 플러그인](gradle-configure-project.md#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

## C 언어의 타입

C 프로그래밍 언어에는 다음과 같은 [데이터 타입](https://en.wikipedia.org/wiki/C_data_types)이 있습니다.

*   기본 타입: `char`, `int`, `float`, `double` (한정자 `signed`, `unsigned`, `short`, `long` 포함)
*   구조체, 유니온, 배열
*   포인터
*   함수 포인터

또한 더 구체적인 타입들이 있습니다.

*   불리언(Boolean) 타입 ([C99](https://en.wikipedia.org/wiki/C99)에서)
*   `size_t` 및 `ptrdiff_t` (그리고 `ssize_t`)
*   고정 너비 정수 타입 (예: `int32_t` 또는 `uint64_t`) ([C99](https://en.wikipedia.org/wiki/C99)에서)

C 언어에는 다음과 같은 타입 한정자도 있습니다: `const`, `volatile`, `restrict`, `atomic`.

어떤 C 데이터 타입이 Kotlin에서 보이는지 살펴보겠습니다.

## C 라이브러리 생성

이 튜토리얼에서는 `lib.c` 소스 파일을 생성하지 않습니다. 이 파일은 C 라이브러리를 컴파일하고 실행하려는 경우에만 필요합니다. 이 설정을 위해서는 [cinterop 툴](native-c-interop.md)을 실행하는 데 필요한 `.h` 헤더 파일만 있으면 됩니다.

cinterop 툴은 각 `.h` 파일 세트에 대해 Kotlin/Native 라이브러리(`.klib` 파일)를 생성합니다. 생성된 라이브러리는 Kotlin/Native에서 C로의 호출을 연결하는 데 도움을 줍니다. 이 라이브러리에는 `.h` 파일의 정의에 해당하는 Kotlin 선언이 포함되어 있습니다.

C 라이브러리를 생성하려면:

1.  향후 프로젝트를 위한 빈 폴더를 생성합니다.
2.  그 안에 다음 내용으로 `lib.h` 파일을 생성하여 C 함수가 Kotlin으로 어떻게 매핑되는지 확인합니다.

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   이 파일에는 `extern "C"` 블록이 없는데, 이 예제에서는 필요하지 않지만 C++와 오버로드된 함수를 사용하는 경우에는 필요할 수 있습니다. 자세한 내용은 이 [Stackoverflow 스레드](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)를 참조하세요.

3.  다음 내용으로 `lib.def` [정의 파일](native-definition-file.md)을 생성합니다.

   ```c
   headers = lib.h
   ```

4.  cinterop 툴이 생성한 코드에 매크로 또는 다른 C 정의를 포함하는 것이 도움이 될 수 있습니다. 이렇게 하면 메서드 본문도 컴파일되어 바이너리에 완전히 포함됩니다. 이 기능을 사용하면 C 컴파일러 없이도 실행 가능한 예제를 생성할 수 있습니다.

   이를 위해 `---` 구분자 뒤에 `lib.h` 파일의 C 함수에 대한 구현을 새로운 `interop.def` 파일에 추가합니다.

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 파일은 IDE에서 애플리케이션을 컴파일, 실행 또는 여는 데 필요한 모든 것을 제공합니다.

## Kotlin/Native 프로젝트 생성

> 자세한 첫 번째 단계와 새로운 Kotlin/Native 프로젝트를 생성하고 IntelliJ IDEA에서 여는 방법에 대한 지침은 [Kotlin/Native 시작하기](native-get-started.md#using-gradle) 튜토리얼을 참조하세요.
>
{style="tip"}

프로젝트 파일을 생성하려면:

1.  프로젝트 폴더 안에 다음 내용으로 `build.gradle(.kts)` Gradle 빌드 파일을 생성합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon 기반 macOS
        // macosX64("native") {   // x86_64 플랫폼 기반 macOS
        // linuxArm64("native") { // ARM64 플랫폼 기반 Linux 
        // linuxX64("native") {   // x86_64 플랫폼 기반 Linux
        // mingwX64("native") {   // Windows 기반
            val main by compilations.getting
            val interop by main.cinterops.creating
        
            binaries {
                executable()
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon 기반 macOS
        // macosX64("native") {   // x86_64 플랫폼 기반 macOS
        // linuxArm64("native") { // ARM64 플랫폼 기반 Linux
        // linuxX64("native") {   // x86_64 플랫폼 기반 Linux
        // mingwX64("native") {   // Windows 기반
            compilations.main.cinterops {
                interop 
            }
        
            binaries {
                executable()
            }
        }
    }
    
    wrapper {
        gradleVersion = '%gradleVersion%'
        distributionType = 'BIN'
    }
    ```

    </tab>
    </tabs>

   이 프로젝트 파일은 C interop을 추가 빌드 단계로 구성합니다.
   다양한 구성 방법을 알아보려면 [멀티플랫폼 Gradle DSL 참조](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)를 확인하세요.

2.  `interop.def`, `lib.h`, `lib.def` 파일을 `src/nativeInterop/cinterop` 디렉토리로 이동합니다.
3.  `src/nativeMain/kotlin` 디렉토리를 생성합니다. 이 곳에 모든 소스 파일을 배치해야 하며, 이는 구성 대신 컨벤션(관례)을 사용하는 Gradle의 권장 사항을 따릅니다.

   기본적으로 C의 모든 심볼은 `interop` 패키지로 임포트됩니다.

4.  `src/nativeMain/kotlin` 안에 다음 내용으로 `hello.kt` 스텁(stub) 파일을 생성합니다.

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
      
        ints(/* fix me*/)
        uints(/* fix me*/)
        doubles(/* fix me*/)
    }
    ```

Kotlin 측면에서 C 기본 타입 선언이 어떻게 보이는지 배운 후 이 코드를 완성할 것입니다.

## C 라이브러리용으로 생성된 Kotlin API 검사

C 기본 타입이 Kotlin/Native로 어떻게 매핑되는지 살펴보고 예제 프로젝트를 그에 따라 업데이트해 보겠습니다.

IntelliJ IDEA의 [선언으로 이동](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 명령(<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수에 대한 다음 생성된 API로 이동합니다.

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 타입은 직접 매핑되는데, `char` 타입은 일반적으로 8비트 부호 있는(signed) 값이므로 `kotlin.Byte`로 매핑됩니다.

| C                  | Kotlin        |
|:-------------------|:--------------|
| `char`             | `kotlin.Byte` |
| `unsigned char`    | `kotlin.UByte`|
| `short`            | `kotlin.Short`|
| `unsigned short`   | `kotlin.UShort`|
| `int`              | `kotlin.Int`  |
| `unsigned int`     | `kotlin.UInt` |
| `long long`        | `kotlin.Long` |
| `unsigned long long`| `kotlin.ULong`|
| `float`            | `kotlin.Float`|
| `double`           | `kotlin.Double`|

## Kotlin 코드 업데이트

이제 C 정의를 확인했으니 Kotlin 코드를 업데이트할 수 있습니다. `hello.kt` 파일의 최종 코드는 다음과 같습니다.

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")
  
    ints(1, 2, 3, 4)
    uints(5u, 6u, 7u, 8u)
    doubles(9.0f, 10.0)
}
```

모든 것이 예상대로 작동하는지 확인하기 위해 [IDE에서](native-get-started.md#build-and-run-the-application) `runDebugExecutableNative` Gradle 태스크를 실행하거나 다음 명령을 사용하여 코드를 실행합니다.

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

시리즈의 다음 부분에서는 구조체 및 유니온 타입이 Kotlin과 C 사이에 어떻게 매핑되는지 배울 것입니다.

**[다음 파트로 진행하기](mapping-struct-union-types-from-c.md)**

### 더 보기

더 고급 시나리오를 다루는 [C와의 상호 운용성](native-c-interop.md) 문서를 통해 자세히 알아보세요.