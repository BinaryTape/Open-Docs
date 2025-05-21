---
title: "C 구조체 및 공용체 유형 매핑 - 튜토리얼"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   이 튜토리얼은 <strong>Kotlin과 C 매핑</strong> 시리즈의 두 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">C의 기본 데이터 타입 매핑</a><br/>
       <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>C의 `struct` 및 `union` 타입 매핑</strong><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">함수 포인터 매핑</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">C의 문자열 매핑</a><br/>
</p>

:::

:::caution
C 라이브러리 가져오기는 [Experimental](components-stability#stability-levels-explained)입니다. Cinterop 툴에 의해 C 라이브러리에서 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit 및 POSIX)는 일부 API에 대해서만 옵트인을 요구합니다.

:::

Kotlin에서 보이는 C `struct` 및 `union` 선언을 살펴보고, Kotlin/Native 및 [multiplatform](gradle-configure-project#targeting-multiple-platforms) Gradle 빌드의 고급 C interop 관련 사용 사례를 살펴보겠습니다.

이 튜토리얼에서는 다음 내용을 배웁니다.

* [`struct` 및 `union` 타입이 매핑되는 방법](#mapping-struct-and-union-c-types)
* [Kotlin에서 `struct` 및 `union` 타입을 사용하는 방법](#use-struct-and-union-types-from-kotlin)

## `struct` 및 `union` C 타입 매핑

Kotlin이 `struct` 및 `union` 타입을 매핑하는 방식을 이해하기 위해 C에서 선언하고 Kotlin에서 어떻게 표현되는지 살펴보겠습니다.

[이전 튜토리얼](mapping-primitive-data-types-from-c)에서 필요한 파일이 있는 C 라이브러리를 이미 만들었습니다.
이번 단계에서는 `interop.def` 파일에서 `---` 구분자 뒤의 선언을 업데이트합니다.

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

`interop.def` 파일은 IDE에서 애플리케이션을 컴파일, 실행 또는 여는 데 필요한 모든 것을 제공합니다.

## C 라이브러리에 대해 생성된 Kotlin API 검사

C `struct` 및 `union` 타입이 Kotlin/Native에 어떻게 매핑되는지 확인하고 프로젝트를 업데이트해 보겠습니다.

1. `src/nativeMain/kotlin`에서 [이전 튜토리얼](mapping-primitive-data-types-from-c)의 `hello.kt` 파일을 다음 내용으로 업데이트합니다.

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

2. 컴파일러 오류를 방지하려면 빌드 프로세스에 interop을 추가합니다. 이를 위해 `build.gradle(.kts)` 빌드 파일을 다음 내용으로 업데이트합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs> 

3. IntelliJ IDEA의 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 명령을 사용하여 C 함수, `struct` 및 `union`에 대해 생성된 다음 API로 이동합니다.

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

기술적으로 Kotlin 측에서는 `struct` 및 `union` 타입 간에 차이가 없습니다. cinterop 툴은 `struct` 및 `union` C 선언 모두에 대해 Kotlin 타입을 생성합니다.

생성된 API에는 `kotlinx.cinterop`에서의 위치를 반영하여 `CValue<T>` 및 `CValuesRef<T>`에 대한 정규화된 패키지 이름이 포함되어 있습니다. `CValue<T>`는 값으로 전달되는 구조체 매개변수를 나타내고, `CValuesRef<T>?`는 구조체 또는 `union`에 대한 포인터를 전달하는 데 사용됩니다.

## Kotlin에서 `struct` 및 `union` 타입 사용

Kotlin에서 C `struct` 및 `union` 타입을 사용하는 것은 생성된 API 덕분에 간단합니다. 유일한 문제는 이러한 타입의 새 인스턴스를 만드는 방법입니다.

`MyStruct` 및 `MyUnion`을 매개변수로 사용하는 생성된 함수를 살펴보겠습니다. 값으로 전달되는 매개변수는 `kotlinx.cinterop.CValue<T>`로 표현되고, 포인터 타입 매개변수는 `kotlinx.cinterop.CValuesRef<T>?`를 사용합니다.

Kotlin은 이러한 타입을 만들고 작업하기 위한 편리한 API를 제공합니다. 실제로 사용하는 방법을 살펴보겠습니다.

### CValue&lt;T&gt; 생성

`CValue<T>` 타입은 값으로 전달되는 매개변수를 C 함수 호출에 전달하는 데 사용됩니다. `CValue<T>` 인스턴스를 만들려면 `cValue` 함수를 사용합니다. 이 함수는 내부 C 타입을 제자리에서 초기화하기 위해 [수신기가 있는 람다 함수](lambdas#function-literals-with-receiver)를 필요로 합니다. 이 함수는 다음과 같이 선언됩니다.

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() `->` Unit): CValue<T>
```

다음은 `cValue`를 사용하고 값으로 전달되는 매개변수를 전달하는 방법입니다.

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

### `struct` 및 `union`을 CValuesRef&lt;T&gt;로 생성

`CValuesRef<T>` 타입은 Kotlin에서 C 함수의 포인터 타입 매개변수를 전달하는 데 사용됩니다. 네이티브 메모리에 `MyStruct` 및 `MyUnion`을 할당하려면 `kotlinx.cinterop.NativePlacement` 타입에 대해 다음 확장 함수를 사용합니다.

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement`는 `malloc` 및 `free`와 유사한 함수가 있는 네이티브 메모리를 나타냅니다. `NativePlacement`에는 몇 가지 구현이 있습니다.

* 전역 구현은 `kotlinx.cinterop.nativeHeap`이지만 사용 후 메모리를 해제하려면 `nativeHeap.free()`를 호출해야 합니다.
* 더 안전한 대안은 `memScoped()`입니다. 이 함수는 짧은 기간 동안의 메모리 범위를 생성하여 블록 끝에서 모든 할당이 자동으로 해제됩니다.

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() `->` R): R
  ```

`memScoped()`를 사용하면 포인터로 함수를 호출하는 코드가 다음과 같이 보일 수 있습니다.

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

여기서 `memScoped {}` 블록 내에서 사용할 수 있는 `ptr` 확장 속성은 `MyStruct` 및 `MyUnion` 인스턴스를 네이티브 포인터로 변환합니다.

메모리는 `memScoped {}` 블록 내에서 관리되므로 블록 끝에서 자동으로 해제됩니다. 할당 해제된 메모리에 액세스하지 않도록 이 범위 밖에서 포인터를 사용하지 마십시오. 더 오래 지속되는 할당(예: C 라이브러리의 캐싱)이 필요한 경우 `Arena()` 또는 `nativeHeap`을 사용하는 것이 좋습니다.

### CValue&lt;T&gt;와 CValuesRef&lt;T&gt; 간의 변환

때로는 한 함수 호출에서 `struct`를 값으로 전달한 다음 다른 함수에서 동일한 `struct`를 참조로 전달해야 할 수 있습니다.

이를 위해 `NativePlacement`가 필요하지만 먼저 `CValue<T>`가 포인터로 변환되는 방식을 살펴보겠습니다.

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

여기서 다시 `memScoped {}`의 `ptr` 확장 속성은 `MyStruct` 인스턴스를 네이티브 포인터로 변환합니다.
이러한 포인터는 `memScoped {}` 블록 내에서만 유효합니다.

포인터를 다시 값으로 전달되는 변수로 바꾸려면 `.readValue()` 확장 함수를 호출합니다.

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

Kotlin 코드에서 C 선언을 사용하는 방법을 배웠으므로 프로젝트에서 사용해 보십시오.
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

모든 것이 예상대로 작동하는지 확인하려면 [IDE에서](native-get-started#build-and-run-the-application) `runDebugExecutableNative` Gradle 작업을 실행하거나 다음 명령을 사용하여 코드를 실행합니다.

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

시리즈의 다음 파트에서는 Kotlin과 C 간에 함수 포인터가 매핑되는 방식을 배웁니다.

**[다음 파트로 진행](mapping-function-pointers-from-c)**

### 참고

더욱 고급 시나리오를 다루는 [C와의 상호 운용성](native-c-interop) 문서에서 자세히 알아보십시오.