[//]: # (title: C의 원시 데이터 타입 매핑 – 튜토리얼)

<tldr>
    <p>이 문서는 <strong>Kotlin과 C 매핑</strong> 튜토리얼 시리즈의 첫 번째 파트입니다.</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>C의 원시 데이터 타입 매핑</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">C의 struct 및 union 타입 매핑</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">함수 포인터 매핑</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">C의 문자열 매핑</a><br/>
    </p>
</tldr>

> C 라이브러리 임포트 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. `cinterop` 도구가 C 라이브러리에서 생성한 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native에 포함된 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="warning"}

이 튜토리얼에서는 Kotlin/Native에서 어떤 C 데이터 타입이 보이는지, 그리고 그 반대도 마찬가지인지 알아보고, Kotlin/Native 및 [멀티플랫폼](gradle-configure-project.md#targeting-multiple-platforms) Gradle 빌드의 고급 C 상호 운용성 관련 사용 사례를 살펴봅니다.

이 튜토리얼에서는 다음을 수행합니다:

*   [C 언어의 데이터 타입에 대해 알아봅니다](#types-in-c-language)
*   [해당 타입들을 익스포트(export)에 사용하는 C 라이브러리를 생성합니다](#create-a-c-library)
*   [C 라이브러리에서 생성된 Kotlin API를 검사합니다](#inspect-generated-kotlin-apis-for-a-c-library)

명령줄을 사용하여 직접 또는 스크립트 파일(`.sh` 또는 `.bat` 파일 등)을 통해 Kotlin 라이브러리를 생성할 수 있습니다. 하지만 이 방법은 수백 개의 파일과 라이브러리가 있는 대규모 프로젝트에는 잘 확장되지 않습니다. 빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리와 전이적 의존성을 포함하는 라이브러리를 다운로드하고 캐싱하며, 컴파일러와 테스트를 실행하여 프로세스를 단순화합니다. Kotlin/Native는 [Kotlin 멀티플랫폼 플러그인](gradle-configure-project.md#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

## C 언어의 타입

C 프로그래밍 언어는 다음 [데이터 타입](https://en.wikipedia.org/wiki/C_data_types)을 가집니다:

*   기본 타입: `char, int, float, double` (수정자 `signed, unsigned, short, long`과 함께)
*   구조체, 유니온, 배열
*   포인터
*   함수 포인터

더 구체적인 타입도 있습니다:

*   부울 타입([C99](https://en.wikipedia.org/wiki/C99)에서)
*   `size_t` 및 `ptrdiff_t` (`ssize_t`도 포함)
*   고정 너비 정수 타입, 예를 들어 `int32_t` 또는 `uint64_t` ([C99](https://en.wikipedia.org/wiki/C99)에서)

C 언어에는 다음과 같은 타입 한정자도 있습니다: `const`, `volatile`, `restrict`, `atomic`.

Kotlin에서 어떤 C 데이터 타입이 보이는지 알아봅시다.

## C 라이브러리 생성

이 튜토리얼에서는 `lib.c` 소스 파일을 생성하지 않습니다. 이 파일은 C 라이브러리를 컴파일하고 실행하려는 경우에만 필요합니다. 이 설정에서는 [cinterop 도구](native-c-interop.md)를 실행하는 데 필요한 `.h` 헤더 파일만 있으면 됩니다.

`cinterop` 도구는 각 `.h` 파일 세트에 대해 Kotlin/Native 라이브러리(`.klib` 파일)를 생성합니다. 생성된 라이브러리는 Kotlin/Native에서 C로의 호출을 연결하는 데 도움을 줍니다. 이 라이브러리에는 `.h` 파일의 정의에 해당하는 Kotlin 선언이 포함됩니다.

C 라이브러리를 생성하려면:

1.  나중에 사용할 프로젝트용으로 빈 폴더를 생성합니다.
2.  그 안에 다음 내용을 가진 `lib.h` 파일을 생성하여 C 함수가 Kotlin으로 어떻게 매핑되는지 확인합니다:

    ```c
    #ifndef LIB2_H_INCLUDED
    #define LIB2_H_INCLUDED

    void ints(char c, short d, int e, long f);
    void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
    void doubles(float a, double b);
    
    #endif
    ```

    이 파일에는 `extern "C"` 블록이 없습니다. 이 예제에서는 필요하지 않지만 C++와 오버로드된 함수를 사용하는 경우 필요할 수 있습니다. 자세한 내용은 이 [Stackoverflow 스레드](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)를 참조하세요.

3.  다음 내용을 가진 `lib.def` [정의 파일](native-definition-file.md)을 생성합니다:

    ```c
    headers = lib.h
    ```

4.  `cinterop` 도구가 생성한 코드에 매크로 또는 다른 C 정의를 포함하는 것이 유용할 수 있습니다. 이 방법을 사용하면 메서드 바디도 컴파일되어 바이너리에 완전히 포함됩니다. 이 기능을 통해 C 컴파일러 없이도 실행 가능한 예제를 생성할 수 있습니다.

5.  이를 위해 `lib.h` 파일의 C 함수 구현을 `---` 구분자 뒤에 새로운 `interop.def` 파일에 추가합니다:

    ```c
    
    ---
    
    void ints(char c, short d, int e, long f) { }
    void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
    void doubles(float a, double b) { }
    ```

`interop.def` 파일은 IDE에서 애플리케이션을 컴파일, 실행 또는 여는 데 필요한 모든 것을 제공합니다.

## Kotlin/Native 프로젝트 생성

> [Kotlin/Native 시작하기](native-get-started.md#using-gradle) 튜토리얼에서 자세한 첫 단계와 새로운 Kotlin/Native 프로젝트를 생성하고 IntelliJ IDEA에서 여는 방법에 대한 지침을 참조하세요.
>
{style="tip"}

프로젝트 파일을 생성하려면:

1.  프로젝트 폴더에 다음 내용을 가진 `build.gradle(.kts)` Gradle 빌드 파일을 생성합니다:

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
        // mingwX64("native") {   // Windows
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
        // mingwX64("native") {   // Windows
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

    이 프로젝트 파일은 C 상호 운용성을 추가 빌드 단계로 구성합니다. 다양한 구성 방법에 대해 알아보려면 [멀티플랫폼 Gradle DSL 참조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)를 확인하세요.

2.  여러분의 `interop.def`, `lib.h`, `lib.def` 파일을 `src/nativeInterop/cinterop` 디렉토리로 이동합니다.
3.  `src/nativeMain/kotlin` 디렉토리를 생성합니다. 이 디렉토리는 Gradle의 권장 사항에 따라 설정을 사용하는 대신 컨벤션(관례)을 사용하여 모든 소스 파일을 배치해야 하는 곳입니다.

    기본적으로 C의 모든 심볼은 `interop` 패키지로 임포트됩니다.

4.  `src/nativeMain/kotlin`에 다음 내용을 가진 `hello.kt` 스텁 파일을 생성합니다:

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

C 원시 타입 선언이 Kotlin 측에서 어떻게 보이는지 학습하면서 코드를 나중에 완성할 것입니다.

## C 라이브러리에 대해 생성된 Kotlin API 검사

C 원시 타입이 Kotlin/Native로 어떻게 매핑되는지 확인하고 그에 따라 예제 프로젝트를 업데이트해 봅시다.

IntelliJ IDEA의 [선언으로 이동](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 명령(<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수에 대해 생성된 다음 API로 이동합니다:

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 타입은 직접 매핑됩니다. 단, `char` 타입은 일반적으로 8비트 부호 있는 값이기 때문에 `kotlin.Byte`로 매핑됩니다:

| C                  | Kotlin        |
|--------------------|---------------|
| char               | kotlin.Byte   |
| unsigned char      | kotlin.UByte  |
| short              | kotlin.Short  |
| unsigned short     | kotlin.UShort |
| int                | kotlin.Int    |
| unsigned int       | kotlin.UInt   |
| long long          | kotlin.Long   |
| unsigned long long | kotlin.ULong  |
| float              | kotlin.Float  |
| double             | kotlin.Double |

## Kotlin 코드 업데이트

C 정의를 확인했으니 이제 Kotlin 코드를 업데이트할 수 있습니다. `hello.kt` 파일의 최종 코드는 다음과 같을 수 있습니다:

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

모든 것이 예상대로 작동하는지 확인하려면 [IDE](native-get-started.md#build-and-run-the-application)에서 `runDebugExecutableNative` Gradle 작업을 실행하거나 다음 명령을 사용하여 코드를 실행하세요:

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

시리즈의 다음 파트에서는 Kotlin과 C 사이에서 struct 및 union 타입이 어떻게 매핑되는지 배울 것입니다:

**[다음 파트로 진행하기](mapping-struct-union-types-from-c.md)**

### 참고 자료

더 고급 시나리오를 다루는 [C와의 상호 운용성](native-c-interop.md) 문서에서 더 자세히 알아보세요.