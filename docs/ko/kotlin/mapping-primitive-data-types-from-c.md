---
title: "C에서 기본 데이터 타입 매핑하기 - 튜토리얼"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   이 튜토리얼은 <strong>Kotlin과 C 매핑</strong> 시리즈의 첫 번째 부분입니다.
</p>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>C의 기본 데이터 타입 매핑</strong><br/>
       <img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">C의 `struct` 및 `union` 타입 매핑</a><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">함수 포인터 매핑</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">C의 문자열 매핑</a><br/>
</p>

:::

:::tip
C 라이브러리 임포트는 [Experimental](components-stability#stability-levels-explained)입니다. `cinterop` 툴로 C 라이브러리에서 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는 일부 API에 대해서만 옵트인을 요구합니다.

Kotlin/Native에서 어떤 C 데이터 타입이 보이는지, 그 반대의 경우도 살펴보고, Kotlin/Native와 [multiplatform](gradle-configure-project#targeting-multiple-platforms) Gradle 빌드의 고급 C interop 관련 사용 사례를 검토해 보겠습니다.

이 튜토리얼에서는 다음을 수행합니다.

* [C 언어의 데이터 타입에 대해 알아봅니다](#types-in-c-language)
* [해당 타입을 내보내기에서 사용하는 C 라이브러리를 만듭니다](#create-a-c-library)
* [C 라이브러리에서 생성된 Kotlin API를 검사합니다](#inspect-generated-kotlin-apis-for-a-c-library)

명령줄을 사용하여 Kotlin 라이브러리를 직접 또는 스크립트 파일(`.sh` 또는 `.bat` 파일 등)을 사용하여 생성할 수 있습니다.
그러나 이 방법은 수백 개의 파일과 라이브러리가 있는 더 큰 프로젝트에는 적합하지 않습니다.
빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리 및 전이적 종속성이 있는 라이브러리를 다운로드하고 캐싱하여 프로세스를 단순화하고 컴파일러 및 테스트를 실행할 수 있습니다.
Kotlin/Native는 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

## Types in C language

C 프로그래밍 언어에는 다음과 같은 [데이터 타입](https://en.wikipedia.org/wiki/C_data_types)이 있습니다.

* 기본 타입: `char, int, float, double`과 수정자 `signed, unsigned, short, long`
* 구조체, 공용체, 배열
* 포인터
* 함수 포인터

더 구체적인 타입도 있습니다.

* Boolean 타입 ([C99](https://en.wikipedia.org/wiki/C99)에서 유래)
* `size_t` 및 `ptrdiff_t` (또한 `ssize_t`)
* `int32_t` 또는 `uint64_t`와 같은 고정 너비 정수 타입([C99](https://en.wikipedia.org/wiki/C99)에서 유래)

C 언어에는 `const`, `volatile`, `restrict`, `atomic`과 같은 타입 한정자도 있습니다.

Kotlin에서 어떤 C 데이터 타입을 볼 수 있는지 살펴봅시다.

## Create a C library

이 튜토리얼에서는 C 라이브러리를 컴파일하고 실행하려는 경우에만 필요한 `lib.c` 소스 파일을 만들지 않습니다. 이 설정에서는 [cinterop tool](native-c-interop)을 실행하는 데 필요한 `.h` 헤더 파일만 필요합니다.

`cinterop` 툴은 각 `.h` 파일 세트에 대해 Kotlin/Native 라이브러리(`.klib` 파일)를 생성합니다. 생성된 라이브러리는 Kotlin/Native에서 C로의 호출을 연결하는 데 도움이 됩니다. 여기에는 `.h` 파일의 정의에 해당하는 Kotlin 선언이 포함되어 있습니다.

C 라이브러리를 만들려면:

1. 향후 프로젝트를 위한 빈 폴더를 만듭니다.
2. 내부에서 다음 내용으로 `lib.h` 파일을 만들어 C 함수가 Kotlin으로 어떻게 매핑되는지 확인합니다.

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   이 파일에는 `extern "C"` 블록이 없습니다. 이 블록은 이 예제에서는 필요하지 않지만 C++ 및 오버로드된 함수를 사용하는 경우 필요할 수 있습니다. 자세한 내용은 이 [Stackoverflow thread](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)를 참조하십시오.

3. 다음 내용으로 `lib.def` [definition file](native-definition-file)을 만듭니다.

   ```c
   headers = lib.h
   ```

4. `cinterop` 툴에서 생성된 코드에 매크로 또는 기타 C 정의를 포함하는 것이 유용할 수 있습니다. 이렇게 하면 메서드 본문도 컴파일되어 바이너리에 완전히 포함됩니다. 이 기능을 사용하면 C 컴파일러 없이도 실행 가능한 예제를 만들 수 있습니다.

   이를 위해 `lib.h` 파일의 C 함수에 대한 구현을 `---` 구분 기호 뒤에 새 `interop.def` 파일에 추가합니다.

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 파일은 애플리케이션을 컴파일, 실행 또는 IDE에서 여는 데 필요한 모든 것을 제공합니다.

## Create a Kotlin/Native project

자세한 첫 번째 단계는 [Get started with Kotlin/Native](native-get-started#using-gradle) 튜토리얼을 참조하고 새 Kotlin/Native 프로젝트를 만들고 IntelliJ IDEA에서 여는 방법에 대한 지침을 참조하십시오.

:::

프로젝트 파일을 만들려면:

1. 프로젝트 폴더에서 다음 내용으로 `build.gradle(.kts)` Gradle 빌드 파일을 만듭니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms 
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating
        
            binaries {
                executable()
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
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
        gradleVersion = '8.10'
        distributionType = 'BIN'
    }
    ```

    </TabItem>
    </Tabs>

   프로젝트 파일은 C interop을 추가 빌드 단계로 구성합니다.
   다양한 구성 방법에 대해 알아보려면 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference)를 확인하십시오.

2. `interop.def`, `lib.h` 및 `lib.def` 파일을 `src/nativeInterop/cinterop` 디렉토리로 이동합니다.
3. `src/nativeMain/kotlin` 디렉토리를 만듭니다. 구성 대신 규칙을 사용하는 Gradle의 권장 사항에 따라 모든 소스 파일을 여기에 배치해야 합니다.

   기본적으로 C의 모든 심볼은 `interop` 패키지로 가져옵니다.

4. `src/nativeMain/kotlin`에서 다음 내용으로 `hello.kt` 스텁 파일을 만듭니다.

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

Kotlin 측에서 C 기본 타입 선언이 어떻게 보이는지 배우면서 나중에 코드를 완성할 것입니다.

## Inspect generated Kotlin APIs for a C library

C 기본 타입이 Kotlin/Native로 어떻게 매핑되는지 살펴보고 예제 프로젝트를 업데이트해 보겠습니다.

IntelliJ IDEA의 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
명령(<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수에 대해 생성된 다음 API로 이동합니다.

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

`char` 타입은 일반적으로 8비트 부호 있는 값이므로 `kotlin.Byte`로 매핑되는 것을 제외하고 C 타입은 직접 매핑됩니다.

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

## Update Kotlin code

이제 C 정의를 보았으므로 Kotlin 코드를 업데이트할 수 있습니다. `hello.kt` 파일의 최종 코드는 다음과 같습니다.

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

모든 것이 예상대로 작동하는지 확인하려면 [IDE에서](native-get-started#build-and-run-the-application) `runDebugExecutableNative` Gradle 작업을 실행하거나 다음 명령을 사용하여 코드를 실행합니다.

```bash
./gradlew runDebugExecutableNative
```

## Next step

시리즈의 다음 부분에서는 struct 및 union 타입이 Kotlin과 C 간에 어떻게 매핑되는지 알아봅니다.

**[다음 부분으로 진행](mapping-struct-union-types-from-c)**

### See also

더 많은 고급 시나리오를 다루는 [Interoperability with C](native-c-interop) 문서에서 자세히 알아보십시오.