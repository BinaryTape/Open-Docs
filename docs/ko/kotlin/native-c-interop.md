[//]: # (title: C 언어와의 상호 운용성)

> C 라이브러리 임포트 기능은 [베타](native-c-interop-stability.md)입니다. `cinterop` 도구가 C 라이브러리에서 생성하는 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native에 포함된 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

이 문서는 Kotlin과 C 언어의 상호 운용에 대한 일반적인 내용을 다룹니다. Kotlin/Native는 `cinterop` 도구를 제공하여 외부 C 라이브러리와 상호 작용하는 데 필요한 모든 것을 빠르게 생성할 수 있습니다.

이 도구는 C 헤더를 분석하고 C 타입, 함수, 문자열을 Kotlin으로 직접적으로 매핑합니다. 생성된 스텁은 IDE로 임포트되어 코드 완성 및 탐색 기능을 사용할 수 있게 합니다.

> Kotlin은 Objective-C와의 상호 운용성도 제공합니다. Objective-C 라이브러리도 `cinterop` 도구를 통해 임포트됩니다. 더 자세한 내용은 [Swift/Objective-C 상호 운용](native-objc-interop.md)을 참조하세요.
>
{style="tip"}

## 프로젝트 설정

C 라이브러리를 사용해야 하는 프로젝트 작업 시 일반적인 워크플로우는 다음과 같습니다:

1.  [정의 파일](native-definition-file.md)을 생성하고 구성합니다. 이는 `cinterop` 도구가 Kotlin [바인딩스](#bindings)에 무엇을 포함해야 하는지 설명합니다.
2.  Gradle 빌드 파일에 `cinterop`을 빌드 프로세스에 포함하도록 구성합니다.
3.  최종 실행 파일을 생성하기 위해 프로젝트를 컴파일하고 실행합니다.

> 실습 경험을 위해 [C 상호 운용을 사용하는 앱 만들기](native-app-with-c-and-libcurl.md) 튜토리얼을 완료하세요.
>
{style="note"}

많은 경우, C 라이브러리와의 사용자 정의 상호 운용성을 구성할 필요가 없습니다. 대신, [플랫폼 라이브러리](native-platform-libs.md)라고 불리는 플랫폼 표준화 바인딩에서 사용 가능한 API를 사용할 수 있습니다. 예를 들어, Linux/macOS 플랫폼의 POSIX, Windows 플랫폼의 Win32, macOS/iOS의 Apple 프레임워크 등이 이러한 방식으로 사용 가능합니다.

## 바인딩스

### 기본 상호 운용 타입

지원되는 모든 C 타입은 Kotlin에서 해당 표현을 가집니다:

*   부호 있는, 부호 없는 정수, 부동 소수점 타입은 동일한 너비의 Kotlin 대응 타입으로 매핑됩니다.
*   포인터와 배열은 `CPointer<T>?`로 매핑됩니다.
*   열거형(Enum)은 휴리스틱(heuristics)과 [정의 파일 설정](native-definition-file.md#configure-enums-generation)에 따라 Kotlin 열거형 또는 정수 값으로 매핑될 수 있습니다.
*   구조체(Struct)와 공용체(Union)는 `someStructInstance.field1`과 같이 점 표기법을 통해 필드를 사용할 수 있는 타입으로 매핑됩니다.
*   `typedef`는 `typealias`로 표현됩니다.

또한, 모든 C 타입은 해당 타입의 lvalue를 나타내는 Kotlin 타입을 가집니다. 즉, 단순하고 불변적인 자체 포함 값 대신 메모리에 위치한 값을 나타냅니다. C++ 참조를 유사한 개념으로 생각할 수 있습니다. 구조체(및 구조체에 대한 `typedef`s)의 경우, 이 표현이 주요 표현이며 구조체 자체와 동일한 이름을 가집니다. Kotlin 열거형의 경우 `${type}.Var`로 명명되고, `CPointer<T>`의 경우 `CPointerVar<T>`로, 대부분의 다른 타입의 경우 `${type}Var`로 명명됩니다.

두 표현을 모두 가지는 타입의 경우, lvalue를 가진 타입은 값을 액세스하기 위한 변경 가능한 `.value` 속성을 가집니다.

#### 포인터 타입

`CPointer<T>`의 타입 인자 `T`는 위에서 설명한 lvalue 타입 중 하나여야 합니다. 예를 들어, C 타입 `struct S*`는 `CPointer<S>`로, `int8_t*`는 `CPointer<int_8tVar>`로, `char**`는 `CPointer<CPointerVar<ByteVar>>`로 매핑됩니다.

C null 포인터는 Kotlin의 `null`로 표현되며, 포인터 타입 `CPointer<T>`는 null을 허용하지 않지만 `CPointer<T>?`는 허용합니다. 이 타입의 값은 `null` 처리에 관련된 모든 Kotlin 연산을 지원합니다. 예를 들어 `?:`, `?.`, `!!` 등이 있습니다:

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

배열 또한 `CPointer<T>`로 매핑되므로, 인덱스로 값에 액세스하기 위한 `[]` 연산자를 지원합니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`의 `.pointed` 속성은 이 포인터가 가리키는 타입 `T`의 lvalue를 반환합니다. 역 연산은 `.ptr`이며, lvalue를 취하고 이에 대한 포인터를 반환합니다.

`void*`는 `COpaquePointer`로 매핑됩니다. 이는 다른 모든 포인터 타입의 슈퍼타입인 특별한 포인터 타입입니다. 따라서 C 함수가 `void*`를 인자로 받으면, Kotlin 바인딩은 모든 `CPointer`를 허용합니다.

포인터(`COpaquePointer` 포함) 캐스팅은 `.reinterpret<T>`를 사용하여 수행할 수 있습니다. 예를 들어:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr = bytePtr.reinterpret<IntVar>()
```

또는:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

C에서와 마찬가지로 이러한 `.reinterpret` 캐스트는 안전하지 않으며 애플리케이션에서 미묘한 메모리 문제로 이어질 수 있습니다.

또한, `.toLong()` 및 `.toCPointer<T>()` 확장 메서드를 통해 `CPointer<T>?`와 `Long` 사이의 안전하지 않은 캐스트를 사용할 수 있습니다:

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 결과 타입이 문맥상 명확하다면, 타입 추론 덕분에 타입 인자를 생략할 수 있습니다.
>
{style="tip"}

### 메모리 할당

네이티브 메모리는 `NativePlacement` 인터페이스를 사용하여 할당할 수 있습니다. 예를 들어:

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // See below for placement examples
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

가장 논리적인 배치는 `nativeHeap` 객체에 있습니다. 이는 `malloc`을 사용하여 네이티브 메모리를 할당하는 것에 해당하며, 할당된 메모리를 해제하기 위한 추가적인 `.free()` 연산을 제공합니다:

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`은 메모리를 수동으로 해제해야 합니다. 하지만, 어휘적 범위(lexical scope)에 수명(lifetime)이 바인딩된 메모리를 할당하는 것이 종종 유용합니다. 이러한 메모리가 자동으로 해제된다면 도움이 됩니다.

이를 해결하기 위해 `memScoped { }`를 사용할 수 있습니다. 중괄호(`{ }`) 안에서는 임시 배치가 암시적 리시버(implicit receiver)로 사용 가능하므로, `alloc` 및 `allocArray`를 사용하여 네이티브 메모리를 할당할 수 있으며, 할당된 메모리는 스코프를 벗어난 후 자동으로 해제됩니다.

예를 들어, 포인터 매개변수를 통해 값을 반환하는 C 함수는 다음과 같이 사용할 수 있습니다:

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*
import platform.posix.*

val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 바인딩에 포인터 전달

C 포인터는 `CPointer<T>` 타입으로 매핑되지만, C 함수 포인터 타입 매개변수는 `CValuesRef<T>`로 매핑됩니다. 이러한 매개변수의 값으로 `CPointer<T>`를 전달할 때, 이는 C 함수에 그대로 전달됩니다. 하지만, 포인터 대신 값 시퀀스(sequence)를 전달할 수 있습니다. 이 경우, 시퀀스는 "값으로" 전달됩니다. 즉, C 함수는 해당 시퀀스의 임시 복사본에 대한 포인터를 받으며, 이는 함수가 반환될 때까지만 유효합니다.

포인터 매개변수의 `CValuesRef<T>` 표현은 명시적인 네이티브 메모리 할당 없이 C 배열 리터럴을 지원하도록 설계되었습니다. 불변의 자체 포함된 C 값 시퀀스를 구성하려면 다음 메서드를 사용할 수 있습니다:

*   `${type}Array.toCValues()`, 여기서 `type`은 Kotlin 프리미티브 타입입니다.
*   `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`, 여기서 `type`은 프리미티브 또는 포인터입니다.

예시:

```c
// C:
void foo(int* elements, int count);
...
int elements[] = {1, 2, 3};
foo(elements, 3);
```

```kotlin
// Kotlin:

foo(cValuesOf(1, 2, 3), 3)
```

### 문자열

다른 포인터와 달리, `const char*` 타입의 매개변수는 Kotlin `String`으로 표현됩니다. 따라서 Kotlin 문자열을 C 문자열을 기대하는 바인딩에 전달할 수 있습니다.

Kotlin 문자열과 C 문자열을 수동으로 변환하는 데 사용할 수 있는 도구도 있습니다:

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

포인터를 얻으려면 `.cstr`이 네이티브 메모리에 할당되어야 합니다. 예를 들어:

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

모든 경우에 C 문자열은 UTF-8로 인코딩되어야 합니다.

자동 변환을 건너뛰고 바인딩에서 원시 포인터가 사용되도록 하려면 `.def` 파일에 [`noStringConversion` 속성](native-definition-file.md#set-up-string-conversion)을 추가하세요:

```c
noStringConversion = LoadCursorA LoadCursorW
```

이러한 방식으로 `CPointer<ByteVar>` 타입의 모든 값은 `const char*` 타입의 인자로 전달될 수 있습니다. Kotlin 문자열을 전달해야 한다면, 다음과 같은 코드를 사용할 수 있습니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 스코프 로컬 포인터

`memScoped {}`에서 사용 가능한 `CValues<T>.ptr` 확장 속성을 사용하여 `CValues<T>` 인스턴스에 대한 C 표현의 스코프 안정(scope-stable) 포인터를 생성할 수 있습니다. 이는 특정 `MemScope`에 수명(lifetime)이 바인딩된 C 포인터를 요구하는 API를 사용할 수 있게 합니다. 예를 들어:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value -> items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

이 예시에서 C API `new_menu()`에 전달된 모든 값은 해당 값이 속한 가장 안쪽 `memScope`의 수명을 가집니다. 제어 흐름이 `memScoped` 스코프를 벗어나면 C 포인터는 유효하지 않게 됩니다.

### 값으로 구조체 전달 및 수신

C 함수가 구조체/공용체 `T`를 값으로 받거나 반환할 때, 해당 인자 타입 또는 반환 타입은 `CValue<T>`로 표현됩니다.

`CValue<T>`는 불투명(opaque) 타입이므로, 적절한 Kotlin 속성으로는 구조체 필드에 액세스할 수 없습니다. API가 구조체를 불투명 핸들로 사용하는 경우에는 문제가 되지 않을 수 있습니다. 하지만 필드 액세스가 필요한 경우, 다음 변환 메서드를 사용할 수 있습니다:

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)는 (lvalue) `T`를 `CValue<T>`로 변환합니다. 따라서 `CValue<T>`를 구성하려면 `T`를 할당하고, 채운 다음, `CValue<T>`로 변환할 수 있습니다.
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)는 `CValue<T>`를 임시로 메모리에 저장한 다음, 이 배치된 `T` 값을 리시버로 사용하여 전달된 람다를 실행합니다. 따라서 단일 필드를 읽으려면 다음 코드를 사용할 수 있습니다:

    ```kotlin
    val fieldValue = structValue.useContents { field }
    ```

*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)는 제공된 `initialize` 함수를 적용하여 `T`를 메모리에 할당하고 그 결과를 `CValue<T>`로 변환합니다.
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)는 기존 `CValue<T>`의 수정된 복사본을 생성합니다. 원본 값은 메모리에 배치되고, `modify()` 함수를 사용하여 변경된 다음, 새로운 `CValue<T>`로 다시 변환됩니다.
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)는 `CValues<T>`를 `AutofreeScope`에 배치하고, 할당된 메모리에 대한 포인터를 반환합니다. 할당된 메모리는 `AutofreeScope`가 해제될 때 자동으로 해제됩니다.

### 콜백

Kotlin 함수를 C 함수에 대한 포인터로 변환하려면 `staticCFunction(::kotlinFunction)`을 사용할 수 있습니다. 함수 참조 대신 람다를 제공할 수도 있습니다. 함수나 람다는 어떤 값도 캡처해서는 안 됩니다.

#### 콜백에 사용자 데이터 전달

종종 C API는 콜백에 일부 사용자 데이터를 전달할 수 있도록 허용합니다. 이러한 데이터는 일반적으로 콜백을 구성할 때 사용자에 의해 제공됩니다. 예를 들어, `void*`로 일부 C 함수에 전달되거나(또는 구조체에 기록됩니다). 그러나 Kotlin 객체에 대한 참조는 C로 직접 전달될 수 없습니다. 따라서 C 세계를 통해 Kotlin에서 Kotlin으로 안전하게 이동하려면, 콜백을 구성하기 전에 래핑하고 콜백 자체에서 언래핑해야 합니다. 이러한 래핑은 `StableRef` 클래스를 사용하여 가능합니다.

참조를 래핑하려면:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

여기서 `voidPtr`은 `COpaquePointer`이며 C 함수에 전달될 수 있습니다.

참조를 언래핑하려면:

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

여기서 `kotlinReference`는 원래 래핑된 참조입니다.

메모리 누수를 방지하기 위해 생성된 `StableRef`는 최종적으로 `.dispose()` 메서드를 사용하여 수동으로 해제되어야 합니다:

```kotlin
stableRef.dispose()
```

그 후에는 유효하지 않게 되므로, `voidPtr`은 더 이상 언래핑할 수 없습니다.

### 매크로

상수로 확장되는 모든 C 매크로는 Kotlin 속성으로 표현됩니다.

매개변수가 없는 매크로는 컴파일러가 타입을 추론할 수 있는 경우에 지원됩니다:

```c
int foo(int);
#define FOO foo(42)
```

이 경우 `FOO`는 Kotlin에서 사용 가능합니다.

다른 매크로를 지원하려면, 지원되는 선언으로 래핑하여 수동으로 노출할 수 있습니다. 예를 들어, 함수와 유사한 매크로 `FOO`는 라이브러리에 [사용자 정의 선언을 추가](native-definition-file.md#add-custom-declarations)하여 함수 `foo()`로 노출될 수 있습니다:

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 이식성

때때로 C 라이브러리에는 `long` 또는 `size_t`와 같이 플랫폼 종속적인 타입의 함수 매개변수나 구조체 필드가 있습니다. Kotlin 자체는 암시적 정수 캐스트나 C-스타일 정수 캐스트(예: `(size_t) intValue`)를 제공하지 않으므로, 이러한 경우 이식 가능한 코드를 더 쉽게 작성할 수 있도록 `convert` 메서드가 제공됩니다:

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

여기서 `type1`과 `type2`는 각각 부호 있는 정수 타입 또는 부호 없는 정수 타입이어야 합니다.

`.convert<${type}>`는 `type`에 따라 `.toByte`, `.toShort`, `.toInt`, `.toLong`, `.toUByte`, `.toUShort`, `.toUInt` 또는 `.toULong` 메서드 중 하나와 동일한 의미를 가집니다.

`convert` 사용 예시:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

또한, 타입 매개변수는 자동으로 추론될 수 있으므로 일부 경우에는 생략될 수 있습니다.

### 객체 고정

Kotlin 객체는 고정(pinning)될 수 있습니다. 즉, 메모리 내 위치가 고정 해제될 때까지 안정적으로 유지되며, 이러한 객체의 내부 데이터에 대한 포인터는 C 함수에 전달될 수 있습니다.

취할 수 있는 몇 가지 접근 방식이 있습니다:

*   객체를 고정하고, 블록을 실행하며, 정상 및 예외 경로에서 고정 해제하는 [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 확장 함수를 사용합니다:

    ```kotlin
    import kotlinx.cinterop.*
    import platform.posix.*

    @OptIn(ExperimentalForeignApi::class)
    fun readData(fd: Int) {
        val buffer = ByteArray(1024)
        buffer.usePinned { pinned ->
            while (true) {
                val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
                if (length <= 0) {
                    break
                }
                // Now `buffer` has raw data obtained from the `recv()` call.
            }
        }
    }
    ```

    여기서 `pinned`는 특별한 타입인 `Pinned<T>`의 객체입니다. 이는 고정된 배열 본문의 주소를 얻을 수 있는 [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)와 같은 유용한 확장을 제공합니다.

*   내부적으로 유사한 기능을 가지지만, 특정 경우에 상용구 코드를 줄이는 데 도움이 될 수 있는 [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 확장 함수를 사용합니다:

    ```kotlin
    import kotlinx.cinterop.*
    import platform.posix.*
      
    @OptIn(ExperimentalForeignApi::class)
    fun readData(fd: Int) { 
        val buffer = ByteArray(1024)
        while (true) {
            val length = recv(fd, buffer.refTo(0), buffer.size.convert(), 0).toInt()

            if (length <= 0) {
                break
            }
            // Now `buffer` has raw data obtained from the `recv()` call.
        }
    }
    ```

    여기서 `buffer.refTo(0)`는 `recv()` 함수에 진입하기 전에 배열을 고정하고, 해당 배열의 0번째 요소 주소를 함수에 전달하며, 함수 종료 후 배열을 고정 해제하는 `CValuesRef` 타입입니다.

### 전방 선언

전방 선언을 임포트하려면 `cnames` 패키지를 사용합니다. 예를 들어, `library.package`를 가진 C 라이브러리에 선언된 `cstructName` 전방 선언을 임포트하려면, 특별한 전방 선언 패키지인 `import cnames.structs.cstructName`를 사용합니다.

구조체의 전방 선언을 가진 라이브러리와 다른 패키지에 실제 구현을 가진 두 개의 `cinterop` 라이브러리를 고려해 보세요:

```C
// First C library
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// Second C library
// Header:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// Implementation:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

두 라이브러리 간에 객체를 전송하려면 Kotlin 코드에서 명시적인 `as` 캐스트를 사용하세요:

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 다음 단계

다음 튜토리얼을 완료하여 Kotlin과 C 간에 타입, 함수, 문자열이 어떻게 매핑되는지 알아보세요:

*   [C에서 기본 데이터 타입 매핑](mapping-primitive-data-types-from-c.md)
*   [C에서 구조체 및 공용체 타입 매핑](mapping-struct-union-types-from-c.md)
*   [C에서 함수 포인터 매핑](mapping-function-pointers-from-c.md)
*   [C에서 문자열 매핑](mapping-strings-from-c.md)