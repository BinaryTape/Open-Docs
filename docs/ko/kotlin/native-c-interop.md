[//]: # (title: C와의 상호 운용성)

> C 라이브러리 임포트는 [실험적](components-stability.md#stability-levels-explained)입니다.
> C 라이브러리에서 cinterop 도구로 생성된 모든 Kotlin 선언에는
> `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
> 
> Kotlin/Native에 포함된 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는
> 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
> 
{style="warning"}

이 문서는 Kotlin의 C와의 상호 운용성에 대한 일반적인 측면을 다룹니다. Kotlin/Native에는 cinterop 도구가 포함되어 있으며,
이 도구를 사용하여 외부 C 라이브러리와 상호 작용하는 데 필요한 모든 것을 빠르게 생성할 수 있습니다.

이 도구는 C 헤더를 분석하고 C 타입, 함수, 상수를 Kotlin으로 직관적으로 매핑합니다.
생성된 스텁은 IDE로 임포트(import)하여 코드 완성 및 탐색 기능을 활성화할 수 있습니다.

> Kotlin은 Objective-C와의 상호 운용성도 제공합니다. Objective-C 라이브러리 또한 cinterop 도구를 통해 임포트됩니다.
> 자세한 내용은 [Swift/Objective-C interop](native-objc-interop.md)을 참조하세요.
>
{style="tip"}

## 프로젝트 설정

C 라이브러리를 사용해야 하는 프로젝트를 작업할 때의 일반적인 워크플로우는 다음과 같습니다:

1. [정의 파일](native-definition-file.md)을 생성하고 구성합니다. 이 파일은 cinterop 도구가 Kotlin [바인딩](#bindings)에 무엇을 포함해야 하는지 설명합니다.
2. Gradle 빌드 파일에 cinterop이 빌드 프로세스에 포함되도록 구성합니다.
3. 프로젝트를 컴파일하고 실행하여 최종 실행 파일을 생성합니다.

> 실습 경험을 위해 [C interop을 사용하여 앱 생성](native-app-with-c-and-libcurl.md) 튜토리얼을 완료하세요.
>
{style="note"}

많은 경우 C 라이브러리와의 사용자 정의 상호 운용성을 구성할 필요가 없습니다. 대신
[플랫폼 라이브러리](native-platform-libs.md)라고 불리는 플랫폼 표준화된 바인딩에서 사용할 수 있는 API를 사용할 수 있습니다. 예를 들어,
Linux/macOS 플랫폼의 POSIX, Windows 플랫폼의 Win32 또는 macOS/iOS의 Apple 프레임워크는 이러한 방식으로 사용할 수 있습니다.

## 바인딩

### 기본 상호 운용 타입

지원되는 모든 C 타입은 Kotlin에 해당하는 표현식을 가집니다:

*   부호 있는, 부호 없는 정수 및 부동 소수점 타입은 동일한 너비를 가진 해당 Kotlin 타입에 매핑됩니다.
*   포인터와 배열은 `CPointer<T>?`에 매핑됩니다.
*   열거형(Enum)은 휴리스틱 및 [정의 파일 설정](native-definition-file.md#configure-enums-generation)에 따라 Kotlin 열거형 또는 정수 값으로 매핑될 수 있습니다.
*   구조체(Struct)와 유니온(Union)은 점 표기법, 즉 `someStructInstance.field1`을 통해 필드에 접근할 수 있는 타입에 매핑됩니다.
*   `typedef`는 `typealias`로 표현됩니다.

또한, 모든 C 타입은 이 타입의 lvalue를 나타내는 Kotlin 타입을 가집니다. 즉, 단순한 불변의 자체 포함된 값보다는 메모리에 위치한 값을 나타냅니다. C++ 참조와 유사한 개념으로 생각하세요. 구조체(및 구조체에 대한 `typedef`)의 경우, 이 표현식이 주된 것이며 구조체 자체와 동일한 이름을 가집니다. Kotlin 열거형의 경우 `${type}.Var`로 이름이 지정되고, `CPointer<T>`의 경우 `CPointerVar<T>`, 대부분의 다른 타입의 경우 `${type}Var`로 이름이 지정됩니다.

두 가지 표현식을 모두 가지는 타입의 경우, lvalue를 가진 타입은 값에 접근하기 위한 가변 `.value` 속성을 가집니다.

#### 포인터 타입

`CPointer<T>`의 타입 인자 `T`는 위에 설명된 lvalue 타입 중 하나여야 합니다. 예를 들어, C 타입
`struct S*`는 `CPointer<S>`에, `int8_t*`는 `CPointer<int_8tVar>`에, `char**`는 `CPointer<CPointerVar<ByteVar>>`에 매핑됩니다.

C 널 포인터는 Kotlin의 `null`로 표현되며, 포인터 타입 `CPointer<T>`는 널을 허용하지 않지만, `CPointer<T>?`는 널을 허용합니다. 이 타입의 값은 `null` 처리에 관련된 모든 Kotlin 연산, 예를 들어 `?:`, `?.`, `!!` 등을 지원합니다:

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

배열 또한 `CPointer<T>`에 매핑되므로, 인덱스로 값에 접근하기 위한 `[]` 연산자를 지원합니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`의 `.pointed` 속성은 이 포인터가 가리키는 `T` 타입의 lvalue를 반환합니다. 역 연산은 `.ptr`이며, lvalue를 가져와서 그것에 대한 포인터를 반환합니다.

`void*`는 `COpaquePointer`에 매핑됩니다. 이는 다른 모든 포인터 타입의 상위 타입인 특수 포인터 타입입니다.
따라서 C 함수가 `void*`를 인자로 받는다면, Kotlin 바인딩은 모든 `CPointer`를 허용합니다.

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

C와 마찬가지로, 이러한 `.reinterpret` 캐스트는 안전하지 않으며 애플리케이션에서 미묘한 메모리 문제로 이어질 수 있습니다.

또한, `.toLong()` 및 `.toCPointer<T>()` 확장 메서드를 통해 `CPointer<T>?`와 `Long` 간의 안전하지 않은 캐스트를 사용할 수 있습니다:

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 결과의 타입이 컨텍스트에서 알려져 있다면, 타입 추론 덕분에 타입 인자를 생략할 수 있습니다.
> 
{style="tip"}

### 메모리 할당

네이티브 메모리는 `NativePlacement` 인터페이스를 사용하여 할당할 수 있습니다. 예를 들어:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val byteVar = placement.alloc<ByteVar>()
```

또는:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val bytePtr = placement.allocArray<ByteVar>(5)
```

가장 논리적인 배치는 `nativeHeap` 객체에 있습니다. 이것은 `malloc`을 사용하여 네이티브 메모리를 할당하는 것에 해당하며, 할당된 메모리를 해제하기 위한 추가적인 `.free()` 연산을 제공합니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`는 메모리를 수동으로 해제해야 합니다. 그러나 어휘적 범위(lexical scope)에 수명(lifetime)이 바인딩된 메모리를 할당하는 것이 종종 유용합니다. 이러한 메모리가 자동으로 해제된다면 도움이 됩니다.

이를 해결하기 위해 `memScoped { }`를 사용할 수 있습니다. 중괄호 안에서 임시 배치는 암시적 수신자(implicit receiver)로 사용할 수 있으므로, alloc 및 allocArray를 사용하여 네이티브 메모리를 할당할 수 있으며, 할당된 메모리는 스코프를 벗어난 후 자동으로 해제됩니다.

예를 들어, 포인터 매개변수를 통해 값을 반환하는 C 함수는 다음과 같이 사용될 수 있습니다:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 바인딩에 포인터 전달

C 포인터는 `CPointer<T>` 타입에 매핑되지만, C 함수 포인터 타입 매개변수는 `CValuesRef<T>`에 매핑됩니다. 그러한 매개변수의 값으로 `CPointer<T>`를 전달할 때, 그것은 C 함수에 그대로 전달됩니다.
그러나 포인터 대신 값의 시퀀스를 전달할 수 있습니다. 이 경우 시퀀스는 "값으로" 전달됩니다. 즉, C 함수는 해당 시퀀스의 임시 복사본에 대한 포인터를 받으며, 이는 함수가 반환될 때까지만 유효합니다.

포인터 매개변수의 `CValuesRef<T>` 표현식은 명시적인 네이티브 메모리 할당 없이 C 배열 리터럴을 지원하도록 설계되었습니다. C 값의 불변하는 자체 포함 시퀀스를 구성하기 위해 다음 메서드가 제공됩니다:

*   `${type}Array.toCValues()`, 여기서 `type`은 Kotlin 기본 타입입니다.
*   `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`, 여기서 `type`은 기본 타입 또는 포인터입니다.

예를 들어:

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

Kotlin 문자열과 C 문자열을 수동으로 변환하는 데 사용할 수 있는 몇 가지 도구도 있습니다:

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

포인터를 얻으려면 `.cstr`을 네이티브 메모리에 할당해야 합니다. 예를 들어:

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

모든 경우에 C 문자열은 UTF-8로 인코딩되어 있다고 가정합니다.

자동 변환을 건너뛰고 바인딩에서 원시 포인터가 사용되도록 하려면 `.def` 파일에
[`noStringConversion` 속성](native-definition-file.md#set-up-string-conversion)을 추가하세요:

```c
noStringConversion = LoadCursorA LoadCursorW
```

이러한 방식으로 `CPointer<ByteVar>` 타입의 모든 값은 `const char*` 타입의 인수로 전달될 수 있습니다. Kotlin 문자열을 전달해야 한다면 다음과 같은 코드를 사용할 수 있습니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 스코프 로컬 포인터

`memScoped {}` 내에서 사용할 수 있는 `CValues<T>.ptr` 확장 속성을 사용하여 `CValues<T>` 인스턴스에 대한 C 표현식의 스코프 안정적인 포인터를 생성할 수 있습니다. 이는 특정 `MemScope`에 수명(lifetime)이 바인딩된 C 포인터를 요구하는 API를 사용할 수 있도록 합니다. 예를 들어:

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

이 예시에서 C API `new_menu()`에 전달되는 모든 값은 해당 값이 속한 가장 안쪽 `memScope`의 수명을 가집니다. 제어 흐름이 `memScoped` 스코프를 벗어나면 C 포인터는 유효하지 않게 됩니다.

### 값으로 구조체 전달 및 수신

C 함수가 구조체/유니온 `T`를 값으로 받거나 반환할 때, 해당하는 인수 타입 또는 반환 타입은 `CValue<T>`로 표현됩니다.

`CValue<T>`는 불투명(opaque) 타입이므로, 적절한 Kotlin 속성으로 구조체 필드에 접근할 수 없습니다. API가 구조체를 불투명 핸들로 사용하는 경우 이는 괜찮을 수 있습니다. 그러나 필드 접근이 필요한 경우, 다음 변환 메서드를 사용할 수 있습니다:

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)은 (lvalue인) `T`를 `CValue<T>`로 변환합니다. 따라서 `CValue<T>`를 구성하려면 `T`를 할당하고 채운 다음 `CValue<T>`로 변환할 수 있습니다.
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)은 일시적으로 `CValue<T>`를 메모리에 저장한 다음, 배치된 값 `T`를 수신자로 사용하여 전달된 람다를 실행합니다. 따라서 단일 필드를 읽으려면 다음 코드를 사용할 수 있습니다:

    ```kotlin
    val fieldValue = structValue.useContents { field }
    ```
    
*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)은 제공된 `initialize` 함수를 적용하여 `T`를 메모리에 할당하고 그 결과를 `CValue<T>`로 변환합니다.
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)은 기존 `CValue<T>`의 수정된 사본을 생성합니다. 원본 값은 메모리에 배치되고, `modify()` 함수를 사용하여 변경된 다음, 새로운 `CValue<T>`로 다시 변환됩니다.
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)은 `CValues<T>`를 `AutofreeScope`에 배치하고, 할당된 메모리에 대한 포인터를 반환합니다. 할당된 메모리는 `AutofreeScope`가 해제될 때 자동으로 해제됩니다.

### 콜백

Kotlin 함수를 C 함수 포인터로 변환하려면 `staticCFunction(::kotlinFunction)`을 사용할 수 있습니다. 함수 참조 대신 람다를 제공하는 것도 가능합니다. 함수나 람다는 어떤 값도 캡처해서는 안 됩니다.

#### 콜백에 사용자 데이터 전달

종종 C API는 콜백에 일부 사용자 데이터를 전달할 수 있도록 합니다. 이러한 데이터는 일반적으로 콜백을 구성할 때 사용자가 제공합니다. 예를 들어, `void*`로 일부 C 함수에 전달되거나 구조체에 작성됩니다. 그러나 Kotlin 객체에 대한 참조는 C로 직접 전달될 수 없습니다. 따라서 콜백을 구성하기 전에 래핑하고, 콜백 자체에서 언래핑해야 Kotlin에서 C를 통해 Kotlin으로 안전하게 이동할 수 있습니다. 이러한 래핑은 `StableRef` 클래스로 가능합니다.

참조를 래핑하려면:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

여기서 `voidPtr`는 `COpaquePointer`이며 C 함수로 전달될 수 있습니다.

참조를 언래핑하려면:

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

여기서 `kotlinReference`는 원래 래핑된 참조입니다.

생성된 `StableRef`는 메모리 누수를 방지하기 위해 최종적으로 `.dispose()` 메서드를 사용하여 수동으로 해제해야 합니다:

```kotlin
stableRef.dispose()
```

그 후에는 유효하지 않게 되므로 `voidPtr`는 더 이상 언래핑될 수 없습니다.

### 매크로

상수로 확장되는 모든 C 매크로는 Kotlin 속성으로 표현됩니다.

매개변수 없는 매크로는 컴파일러가 타입을 추론할 수 있는 경우에 지원됩니다:

```c
int foo(int);
#define FOO foo(42)
```

이 경우 `FOO`는 Kotlin에서 사용할 수 있습니다.

다른 매크로를 지원하려면 지원되는 선언으로 래핑하여 수동으로 노출할 수 있습니다. 예를 들어,
함수형 매크로 `FOO`는 라이브러리에 [사용자 정의 선언을 추가하여](native-definition-file.md#add-custom-declarations) 함수 `foo()`로 노출될 수 있습니다:

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 이식성

때때로 C 라이브러리에는 `long` 또는 `size_t`와 같이 플랫폼에 따라 달라지는 타입의 함수 매개변수나 구조체 필드가 있습니다. Kotlin 자체는 암시적 정수 캐스트나 C 스타일 정수 캐스트(예: `(size_t) intValue`)를 제공하지 않으므로, 이러한 경우 이식성 있는 코드를 더 쉽게 작성할 수 있도록 `convert` 메서드가 제공됩니다:

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

여기서 `type1`과 `type2`는 각각 부호 있는 또는 부호 없는 정수 타입이어야 합니다.

`.convert<${type}>`는 `type`에 따라 `.toByte`, `.toShort`, `.toInt`, `.toLong`, `.toUByte`,
`.toUShort`, `.toUInt` 또는 `.toULong` 메서드 중 하나와 동일한 의미를 가집니다.

`convert` 사용 예시:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

또한, 타입 매개변수는 자동으로 추론될 수 있으므로 일부 경우에 생략될 수 있습니다.

### 객체 고정

Kotlin 객체는 고정될(pin) 수 있습니다. 즉, 메모리 내에서의 위치가 고정이 해제될 때까지 안정적으로 유지되며, 이러한 객체의 내부 데이터에 대한 포인터는 C 함수로 전달될 수 있습니다.

몇 가지 접근 방식이 있습니다:

*   객체를 고정하고, 블록을 실행하며, 정상 및 예외 경로에서 고정을 해제하는 [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 서비스 함수를 사용합니다:

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

    여기서 `pinned`는 특수 타입 `Pinned<T>`의 객체입니다. 이는 고정된 배열 본체의 주소를 얻을 수 있는 `addressOf`와 같은 유용한 확장 기능을 제공합니다.

*   내부적으로 유사한 기능을 가지지만, 특정 경우에 상용구(boilerplate) 코드를 줄이는 데 도움이 될 수 있는 [`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 함수를 사용합니다:

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

    여기서 `buffer.refTo(0)`는 `recv()` 함수에 들어가기 전에 배열을 고정하고, 배열의 0번째 요소 주소를 함수에 전달하며, 함수를 종료한 후 배열의 고정을 해제하는 `CValuesRef` 타입입니다.

### 전방 선언

전방 선언을 임포트하려면 `cnames` 패키지를 사용합니다. 예를 들어, `library.package`를 가진 C 라이브러리에 선언된 `cstructName` 전방 선언을 임포트하려면 특별한 전방 선언 패키지를 사용합니다:
`import cnames.structs.cstructName`.

두 개의 cinterop 라이브러리를 고려해 보세요: 하나는 구조체의 전방 선언을 가지고 있고 다른 하나는 다른 패키지에 실제 구현을 가지고 있습니다:

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

두 라이브러리 간에 객체를 전달하려면 Kotlin 코드에서 명시적 `as` 캐스트를 사용합니다:

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 다음 단계

다음 튜토리얼을 완료하여 Kotlin과 C 사이에 타입, 함수, 상수가 어떻게 매핑되는지 알아보세요:

*   [C의 기본 데이터 타입 매핑](mapping-primitive-data-types-from-c.md)
*   [C의 구조체 및 유니온 타입 매핑](mapping-function-pointers-from-c.md)
*   [C의 함수 포인터 매핑](mapping-function-pointers-from-c.md)
*   [C의 문자열 매핑](mapping-strings-from-c.md)