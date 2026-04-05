[//]: # (title: C의 구조체 및 공용체 타입 매핑하기 – 튜토리얼)

<tldr>
    <p>이 문서는 <strong>Kotlin과 C 매핑하기</strong> 튜토리얼 시리즈의 두 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">C의 원시 데이터 타입 매핑하기</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>C의 구조체 및 공용체 타입 매핑하기</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">C의 함수 포인터 매핑하기</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">C의 문자열 매핑하기</a><br/>
    </p>
</tldr>

> C 라이브러리 임포트는 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 단계입니다. cinterop 툴을 통해 C 라이브러리에서 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 추가되어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는 일부 API에 대해서만 명시적 동의(opt-in)가 필요합니다.
>
{style="note"}

어떤 C 구조체(struct) 및 공용체(union) 선언이 Kotlin에서 보이는지 알아보고, Kotlin/Native와 [멀티플랫폼](gradle-configure-project.md#targeting-multiple-platforms) Gradle 빌드의 고급 C 상호운용성(interop) 관련 사용 사례를 살펴보겠습니다.

이 튜토리얼에서는 다음 내용을 배우게 됩니다:

* [구조체 및 공용체 타입이 매핑되는 방식](#mapping-struct-and-union-c-types)
* [Kotlin에서 구조체 및 공용체 타입을 사용하는 방법](#use-struct-and-union-types-from-kotlin)

## C의 구조체 및 공용체 타입 매핑하기

Kotlin이 구조체와 공용체 타입을 어떻게 매핑하는지 이해하기 위해, C에서 이를 선언하고 Kotlin에서 어떻게 표현되는지 살펴보겠습니다.

[이전 튜토리얼](mapping-primitive-data-types-from-c.md)에서 필요한 파일들이 포함된 C 라이브러리를 이미 생성했습니다. 이번 단계에서는 `interop.def` 파일의 `---` 구분자 뒤에 있는 선언들을 업데이트하세요.

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

`interop.def` 파일은 애플리케이션을 컴파일, 실행하거나 IDE에서 여는 데 필요한 모든 정보를 제공합니다.

## C 라이브러리용으로 생성된 Kotlin API 검사하기

C 구조체와 공용체 타입이 Kotlin/Native로 어떻게 매핑되는지 확인하고 프로젝트를 업데이트해 보겠습니다.

1. `src/nativeMain/kotlin` 폴더에서 [이전 튜토리얼](mapping-primitive-data-types-from-c.md)의 `hello.kt` 파일을 다음 내용으로 업데이트합니다:

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

2. 컴파일러 오류를 방지하려면 빌드 프로세스에 상호운용성을 추가해야 합니다. 이를 위해 `build.gradle(.kts)` 빌드 파일을 다음 내용으로 업데이트하세요:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64()    // Apple Silicon 기반 macOS
        // linuxArm64() // ARM64 플랫폼 기반 Linux
        // linuxX64()   // x86_64 플랫폼 기반 Linux
        // mingwX64()   // Windows

        targets.withType<KotlinNativeTarget>().configureEach {
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
        macosArm64()    // Apple Silicon 기반 macOS
        // linuxArm64() // ARM64 플랫폼 기반 Linux
        // linuxX64()   // x86_64 플랫폼 기반 Linux
        // mingwX64()   // Windows

        targets.withType(KotlinNativeTarget).configureEach {
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

3. IntelliJ IDEA의 [선언으로 이동 (Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 명령(<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수, 구조체, 공용체에 대해 생성된 다음 API로 이동해 보세요:

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

기술적으로 Kotlin 측에서 구조체와 공용체 타입 사이에는 차이가 없습니다. cinterop 툴은 구조체와 공용체 C 선언 모두에 대해 Kotlin 타입을 생성합니다.

생성된 API에는 `kotlinx.cinterop`에서의 위치를 반영하는 `CValue<T>` 및 `CValuesRef<T>`의 전체 경로 패키지 이름이 포함됩니다. `CValue<T>`는 값에 의한(by-value) 구조체 파라미터를 나타내며, `CValuesRef<T>?`는 구조체 또는 공용체에 대한 포인터를 전달하는 데 사용됩니다.

## Kotlin에서 구조체 및 공용체 타입 사용하기

생성된 API 덕분에 Kotlin에서 C 구조체와 공용체 타입을 사용하는 것은 매우 간단합니다. 유일한 문제는 이러한 타입의 새로운 인스턴스를 생성하는 방법입니다.

`MyStruct` 및 `MyUnion`을 파라미터로 받는 생성된 함수들을 살펴보겠습니다. 값에 의한 파라미터는 `kotlinx.cinterop.CValue<T>`로 표현되며, 포인터 타입 파라미터는 `kotlinx.cinterop.CValuesRef<T>?`를 사용합니다.

Kotlin은 이러한 타입을 생성하고 작업하기 위한 편리한 API를 제공합니다. 실제로 어떻게 사용하는지 살펴보겠습니다.

### CValue&lt;T&gt; 생성하기

`CValue<T>` 타입은 C 함수 호출에 값에 의한 파라미터를 전달할 때 사용됩니다. `cValue` 함수를 사용하여 `CValue<T>` 인스턴스를 생성하세요. 이 함수는 해당 C 타입을 즉석에서 초기화하기 위해 [수신 객체가 있는 람다 함수 (lambda function with a receiver)](lambdas.md#function-literals-with-receiver)가 필요합니다. 함수는 다음과 같이 선언됩니다:

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

다음은 `cValue`를 사용하고 값에 의한 파라미터를 전달하는 방법입니다:

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

### CValuesRef&lt;T&gt;로 구조체 및 공용체 생성하기

`CValuesRef<T>` 타입은 Kotlin에서 C 함수의 포인터 타입 파라미터를 전달하는 데 사용됩니다. 네이티브 메모리에 `MyStruct` 및 `MyUnion`을 할당하려면 `kotlinx.cinterop.NativePlacement` 타입의 다음 확장 함수를 사용하세요:

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement`는 `malloc` 및 `free`와 유사한 기능을 가진 네이티브 메모리를 나타냅니다. `NativePlacement`에는 여러 구현이 있습니다:

* 전역 구현은 `kotlinx.cinterop.nativeHeap`이지만, 사용 후 메모리를 해제하려면 반드시 `nativeHeap.free()`를 호출해야 합니다.
* 더 안전한 대안은 `memScoped()`로, 블록 끝에서 모든 할당이 자동으로 해제되는 단기 메모리 범위를 생성합니다:

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

`memScoped()`를 사용하면 포인터로 함수를 호출하는 코드는 다음과 같습니다:

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

여기서 `memScoped {}` 블록 내에서 사용할 수 있는 `ptr` 확장 프로퍼티는 `MyStruct` 및 `MyUnion` 인스턴스를 네이티브 포인터로 변환합니다.

메모리는 `memScoped {}` 블록 내부에서 관리되므로 블록 끝에서 자동으로 해제됩니다. 할당 해제된 메모리에 접근하는 것을 방지하기 위해 이 범위 밖에서 포인터를 사용하는 것은 피해야 합니다. (예를 들어 C 라이브러리의 캐싱을 위해) 더 오래 유지되어야 하는 할당이 필요한 경우 `Arena()` 또는 `nativeHeap` 사용을 고려하세요.

### CValue&lt;T&gt;와 CValuesRef&lt;T&gt; 간의 변환

때로는 한 함수 호출에서는 구조체를 값으로 전달하고, 다른 호출에서는 동일한 구조체를 참조로 전달해야 할 때가 있습니다.

이를 위해 `NativePlacement`가 필요하지만, 먼저 `CValue<T>`가 포인터로 어떻게 변환되는지 살펴보겠습니다:

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

여기서도 `memScoped {}`의 `ptr` 확장 프로퍼티가 `MyStruct` 인스턴스를 네이티브 포인터로 변환합니다. 이 포인터들은 `memScoped {}` 블록 내부에서만 유효합니다.

포인터를 다시 값에 의한 변수로 변환하려면 `.readValue()` 확장 함수를 호출하세요:

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

## Kotlin 코드 업데이트하기

이제 Kotlin 코드에서 C 선언을 사용하는 방법을 배웠으므로, 프로젝트에서 이를 사용해 보세요. `hello.kt` 파일의 최종 코드는 다음과 같을 수 있습니다:

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

모든 것이 예상대로 작동하는지 확인하려면 [IDE에서](native-get-started.md#build-and-run-the-application) `runDebugExecutable<YourTargetName>` Gradle 태스크를 실행하거나 터미널에서 다음 명령어를 사용하세요. 이 예시의 경우 다음과 같습니다:

```bash
./gradlew runDebugExecutableMacosArm64
```

## 다음 단계

이 시리즈의 다음 파트에서는 Kotlin과 C 사이에서 함수 포인터가 어떻게 매핑되는지 배울 것입니다:

**[다음 파트로 진행하기](mapping-function-pointers-from-c.md)**

### 더 보기

더 고급 시나리오를 다루는 [C와의 상호운용성 (Interoperability with C)](native-c-interop.md) 문서에서 더 많은 내용을 배울 수 있습니다.