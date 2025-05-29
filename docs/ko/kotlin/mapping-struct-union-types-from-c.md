[//]: # (title: C 언어의 struct 및 union 타입 매핑 – 튜토리얼)

<tldr>
    <p>이 문서는 <strong>Kotlin과 C 매핑</strong> 튜토리얼 시리즈의 두 번째 파트입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">C 언어의 기본 데이터 타입 매핑</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>C 언어의 struct 및 union 타입 매핑</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">함수 포인터 매핑</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">C 언어의 문자열 매핑</a><br/>
    </p>
</tldr>

> C 라이브러리 임포트는 [실험적 기능](components-stability.md#stability-levels-explained)입니다.
> cinterop 도구가 C 라이브러리에서 생성하는 모든 Kotlin 선언은 `@ExperimentalForeignApi` 어노테이션을
> 포함해야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는
> 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="warning"}

C struct 및 union 선언이 Kotlin에서 어떻게 보이는지 살펴보고, Kotlin/Native 및
[멀티플랫폼](gradle-configure-project.md#targeting-multiple-platforms) Gradle 빌드의 고급 C 상호 운용성 관련 사용 사례를
자세히 알아보겠습니다.

이 튜토리얼에서는 다음을 배웁니다.

* [struct 및 union 타입이 어떻게 매핑되는지](#mapping-struct-and-union-c-types)
* [Kotlin에서 struct 및 union 타입을 사용하는 방법](#use-struct-and-union-types-from-kotlin)

## C 언어의 struct 및 union 타입 매핑

Kotlin이 struct 및 union 타입을 어떻게 매핑하는지 이해하려면 C 언어에서 이를 선언하고 Kotlin에서 어떻게 표현되는지 살펴보겠습니다.

[이전 튜토리얼](mapping-primitive-data-types-from-c.md)에서 필요한 파일을 포함하는 C 라이브러리를 이미 생성했습니다.
이 단계를 위해 `---` 구분자 뒤에 `interop.def` 파일의 선언을 업데이트하세요.

```c

---

typedef struct {
  int a;
  double b;
} MyStruct;

void struct_by_value(MyStruct s) {}
void struct_by_pointer(MyStruct* s) {}

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u) {}
void union_by_pointer(MyUnion* u) {}
``` 

`interop.def` 파일은 애플리케이션을 컴파일, 실행 또는 IDE에서 여는 데 필요한 모든 것을 제공합니다.

## C 라이브러리의 생성된 Kotlin API 검사

C struct 및 union 타입이 Kotlin/Native로 어떻게 매핑되는지 확인하고 프로젝트를 업데이트해 봅시다.

1.  `src/nativeMain/kotlin`에서 [이전 튜토리얼](mapping-primitive-data-types-from-c.md)의 `hello.kt` 파일을
    다음 내용으로 업데이트하세요.

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")

        struct_by_value(/* fix me*/)
        struct_by_pointer(/* fix me*/)
        union_by_value(/* fix me*/)
        union_by_pointer(/* fix me*/)
    }
    ```

2.  컴파일러 오류를 피하려면 빌드 프로세스에 상호 운용성을 추가하세요. 이를 위해 `build.gradle(.kts)` 빌드 파일을
    다음 내용으로 업데이트하세요.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms 
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating {
                definitionFile.set(project.file("src/nativeInterop/cinterop/interop.def"))
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            compilations.main.cinterops {
                interop {   
                    definitionFile = project.file('src/nativeInterop/cinterop/interop.def')
                }
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    </tabs> 

3.  IntelliJ IDEA의 [선언으로 이동](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
    명령(<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수, struct, union에 대해 다음으로 생성된 API로 이동하세요.

    ```kotlin
    fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
    fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
    
    fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
    fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
    ```

기술적으로 Kotlin 측에서는 struct와 union 타입 간에 차이가 없습니다. cinterop 도구는 struct 및 union C 선언 모두에 대해 Kotlin 타입을 생성합니다.

생성된 API에는 `CValue<T>` 및 `CValuesRef<T>`에 대한 전체 자격을 갖춘 패키지 이름이 포함되어 있으며, 이는 `kotlinx.cinterop`에서의 위치를 반영합니다. `CValue<T>`는 값 전달 구조체 파라미터를 나타내고, `CValuesRef<T>?`는 구조체 또는 union에 대한 포인터를 전달하는 데 사용됩니다.

## Kotlin에서 struct 및 union 타입 사용하기

Kotlin에서 C struct 및 union 타입을 사용하는 것은 생성된 API 덕분에 간단합니다. 유일한 질문은 이러한 타입의 새 인스턴스를
어떻게 생성하는가입니다.

`MyStruct`와 `MyUnion`을 파라미터로 사용하는 생성된 함수를 살펴보겠습니다. 값 전달 파라미터는
`kotlinx.cinterop.CValue<T>`로 표현되며, 포인터 타입 파라미터는 `kotlinx.cinterop.CValuesRef<T>?`를 사용합니다.

Kotlin은 이러한 타입을 생성하고 작업하는 데 편리한 API를 제공합니다. 실제로 어떻게 사용하는지 알아보겠습니다.

### CValue&lt;T&gt; 생성

`CValue<T>` 타입은 C 함수 호출에 값 전달 파라미터를 전달하는 데 사용됩니다. `cValue` 함수를 사용하여
`CValue<T>` 인스턴스를 생성하세요. 이 함수는 기본 C 타입을 제자리에서 초기화하기 위해
[리시버를 가진 람다 함수](lambdas.md#function-literals-with-receiver)를 필요로 합니다. 함수는 다음과 같이 선언됩니다.

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

`cValue`를 사용하고 값 전달 파라미터를 전달하는 방법은 다음과 같습니다.

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue

@OptIn(ExperimentalForeignApi::class)
fun callValue() {

    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }
    struct_by_value(cStruct)

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    union_by_value(cUnion)
}
```

### struct 및 union을 CValuesRef&lt;T&gt;로 생성

`CValuesRef<T>` 타입은 Kotlin에서 C 함수의 포인터 타입 파라미터를 전달하는 데 사용됩니다. 네이티브 메모리에
`MyStruct` 및 `MyUnion`을 할당하려면 `kotlinx.cinterop.NativePlacement` 타입의 다음 확장 함수를 사용하세요.

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement`는 `malloc` 및 `free`와 유사한 함수를 가진 네이티브 메모리를 나타냅니다. `NativePlacement`의
몇 가지 구현체가 있습니다.

*   전역 구현체는 `kotlinx.cinterop.nativeHeap`이지만, 사용 후 메모리를 해제하려면 `nativeHeap.free()`를 호출해야 합니다.
*   더 안전한 대안은 `memScoped()`로, 모든 할당이 블록 끝에서 자동으로 해제되는 수명이 짧은 메모리 스코프를 생성합니다.

    ```kotlin
    fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
    ```

`memScoped()`를 사용하면 포인터로 함수를 호출하는 코드는 다음과 같습니다.

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ptr

@OptIn(ExperimentalForeignApi::class)
fun callRef() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_pointer(cStruct.ptr)

        val cUnion = alloc<MyUnion>()
        cUnion.b.a = 5
        cUnion.b.b = 2.7182

        union_by_pointer(cUnion.ptr)
    }
}
```

여기서 `memScoped {}` 블록 내에서 사용할 수 있는 `ptr` 확장 프로퍼티는 `MyStruct` 및 `MyUnion` 인스턴스를
네이티브 포인터로 변환합니다.

메모리가 `memScoped {}` 블록 내에서 관리되므로 블록 끝에서 자동으로 해제됩니다.
할당 해제된 메모리 접근을 방지하려면 이 스코프 밖에서 포인터를 사용하지 마세요. 더 오래 지속되는 할당이 필요한 경우(예: C 라이브러리에서 캐싱)
`Arena()` 또는 `nativeHeap` 사용을 고려하세요.

### CValue&lt;T&gt;와 CValuesRef&lt;T&gt; 간의 변환

때로는 한 함수 호출에서 struct를 값으로 전달하고, 다른 함수 호출에서는 동일한 struct를 참조로 전달해야 할 수 있습니다.

이를 수행하려면 `NativePlacement`가 필요하지만, 먼저 `CValue<T>`가 포인터로 어떻게 변환되는지 살펴보겠습니다.

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped

@OptIn(ExperimentalForeignApi::class)
fun callMix_ref() {
    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }

    memScoped {
        struct_by_pointer(cStruct.ptr)
    }
}
```

여기서도 `memScoped {}`의 `ptr` 확장 프로퍼티는 `MyStruct` 인스턴스를 네이티브 포인터로 변환합니다.
이 포인터는 `memScoped {}` 블록 내에서만 유효합니다.

포인터를 다시 값 전달 변수로 변환하려면 `.readValue()` 확장 함수를 호출하세요.

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.readValue

@OptIn(ExperimentalForeignApi::class)
fun callMix_value() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_value(cStruct.readValue())
    }
}
```

## Kotlin 코드 업데이트

이제 Kotlin 코드에서 C 선언을 사용하는 방법을 배웠으니, 프로젝트에서 사용해 보세요.
`hello.kt` 파일의 최종 코드는 다음과 같습니다.

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    memScoped {
        union_by_value(cUnion)
        union_by_pointer(cUnion.ptr)
    }

    memScoped {
        val cStruct = alloc<MyStruct> {
            a = 42
            b = 3.14
        }

        struct_by_value(cStruct.readValue())
        struct_by_pointer(cStruct.ptr)
    }
}
```

모든 것이 예상대로 작동하는지 확인하려면 [IDE에서](native-get-started.md#build-and-run-the-application)
`runDebugExecutableNative` Gradle 태스크를 실행하거나 다음 명령어를 사용하여 코드를 실행하세요.

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

시리즈의 다음 파트에서는 함수 포인터가 Kotlin과 C 간에 어떻게 매핑되는지 배웁니다.

**[다음 파트로 진행하기](mapping-function-pointers-from-c.md)**

### 함께 보기

더 고급 시나리오를 다루는 [C 언어와의 상호 운용성](native-c-interop.md) 문서에서 자세히 알아보세요.