[//]: # (title: C와의 상호 운용성)

> C 라이브러리 임포트는 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 단계입니다. C 라이브러리에서 cinterop 툴에 의해 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 추가되어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

이 문서는 Kotlin과 C의 상호 운용성에 대한 전반적인 측면을 다룹니다. Kotlin/Native는 외부 C 라이브러리와 상호 작용하는 데 필요한 모든 것을 신속하게 생성할 수 있는 cinterop 툴을 제공합니다.

이 툴은 C 헤더를 분석하여 C 타입, 함수 및 문자열을 Kotlin으로 직관적으로 매핑합니다. 생성된 스텁(stub)은 IDE로 임포트하여 코드 완성 및 내비게이션 기능을 사용할 수 있습니다.

> Kotlin은 Objective-C와의 상호 운용성도 제공합니다. Objective-C 라이브러리 역시 cinterop 툴을 통해 임포트됩니다. 자세한 내용은 [Swift/Objective-C 상호 운용성](native-objc-interop.md)을 참조하세요.
>
{style="tip"}

## 프로젝트 설정하기

C 라이브러리를 사용해야 하는 프로젝트를 작업할 때의 일반적인 워크플로우는 다음과 같습니다:

1. [정의 파일(definition file)](native-definition-file.md)을 생성하고 설정합니다. 이 파일은 cinterop 툴이 Kotlin [바인딩](#bindings)에 무엇을 포함해야 하는지 설명합니다.
2. Gradle 빌드 파일에서 빌드 프로세스에 cinterop을 포함하도록 설정합니다.
3. 프로젝트를 컴파일하고 실행하여 최종 실행 파일을 생성합니다.

> 직접 실습해 보려면 [C 상호 운용성을 사용한 앱 만들기](native-app-with-c-and-libcurl.md) 튜토리얼을 완료하세요.
>
{style="note"}

대부분의 경우 C 라이브러리와의 커스텀 상호 운용성을 설정할 필요가 없습니다. 대신 [플랫폼 라이브러리](native-platform-libs.md)라고 불리는, 플랫폼에 표준화된 바인딩 API를 사용할 수 있습니다. 예를 들어 Linux/macOS의 POSIX, Windows의 Win32, macOS/iOS의 Apple 프레임워크는 이 방식으로 이미 제공되고 있습니다.

## 바인딩(Bindings)

### 기본 상호 운용 타입

지원되는 모든 C 타입은 Kotlin에서 그에 대응하는 표현을 가집니다:

* 부호 있는/없는 정수형 및 부동 소수점 타입은 동일한 크기의 Kotlin 대응 타입으로 매핑됩니다.
* 포인터와 배열은 `CPointer<T>?`로 매핑됩니다.
* Enum은 휴리스틱(heuristics) 및 [정의 파일 설정](native-definition-file.md#configure-enums-generation)에 따라 Kotlin enum 또는 정수 값으로 매핑될 수 있습니다.
* 구조체(Structs)와 공용체(Unions)는 도트 표기법(예: `someStructInstance.field1`)을 통해 필드에 접근할 수 있는 타입으로 매핑됩니다.
* `typedef`는 `typealias`로 표현됩니다.

또한, 모든 C 타입은 해당 타입의 lvalue를 나타내는 Kotlin 타입을 가집니다. 즉, 단순하고 불변인 자립적 값이 아니라 메모리에 위치한 값을 의미합니다. C++의 참조(reference)와 유사한 개념으로 생각하면 됩니다. 구조체(및 구조체에 대한 `typedef`)의 경우, 이 표현이 주요 표현이며 구조체 자체와 동일한 이름을 가집니다. Kotlin enum의 경우 `${type}.Var`로 명명되고, `CPointer<T>`의 경우 `CPointerVar<T>`, 대부분의 다른 타입의 경우 `${type}Var`로 명명됩니다.

두 가지 표현을 모두 가진 타입의 경우, lvalue를 가진 타입은 값에 접근하기 위한 가변 `.value` 프로퍼티를 가집니다.

#### 포인터 타입

`CPointer<T>`의 타입 인자 `T`는 위에서 설명한 lvalue 타입 중 하나여야 합니다. 예를 들어, C 타입 `struct S*`는 `CPointer<S>`로 매핑되고, `int8_t*`는 `CPointer<int_8tVar>`로, `char**`는 `CPointer<CPointerVar<ByteVar>>`로 매핑됩니다.

C의 null 포인터는 Kotlin의 `null`로 표현되며, 포인터 타입 `CPointer<T>`는 null을 허용하지 않지만 `CPointer<T>?`는 허용합니다. 이 타입의 값은 Kotlin의 `null` 처리와 관련된 모든 연산(예: `?:`, `?.`, `!!` 등)을 지원합니다:

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

배열 또한 `CPointer<T>`로 매핑되므로, 인덱스를 통해 값에 접근할 수 있는 `[]` 연산자를 지원합니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`의 `.pointed` 프로퍼티는 이 포인터가 가리키는 `T` 타입의 lvalue를 반환합니다. 반대 연산은 `.ptr`로, lvalue를 받아 그에 대한 포인터를 반환합니다.

`void*`는 다른 모든 포인터 타입의 상위 타입인 특수 포인터 타입 `COpaquePointer`로 매핑됩니다. 따라서 C 함수가 `void*`를 인자로 받는 경우, Kotlin 바인딩에서는 어떠한 `CPointer`든 허용합니다.

포인터 캐스팅(`COpaquePointer` 포함)은 `.reinterpret<T>`를 사용하여 수행할 수 있습니다. 예를 들어:

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

C와 마찬가지로, 이러한 `.reinterpret` 캐스트는 안전하지 않으며 애플리케이션에서 미묘한 메모리 문제를 일으킬 수 있습니다.

또한, `.toLong()` 및 `.toCPointer<T>()` 확장 메서드를 통해 `CPointer<T>?`와 `Long` 사이의 안전하지 않은 캐스트를 사용할 수 있습니다:

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 타입 추론 덕분에 문맥상 결과 타입을 알 수 있는 경우 타입 인자를 생략할 수 있습니다.
> 
{style="tip"}

### 메모리 할당

네이티브 메모리는 `NativePlacement` 인터페이스를 사용하여 할당할 수 있습니다. 예를 들어:

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // 아래의 배치 예시 참조
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

가장 논리적인 배치는 `nativeHeap` 객체 내에 하는 것입니다. 이는 `malloc`으로 네이티브 메모리를 할당하는 것과 대응되며, 할당된 메모리를 해제하기 위한 추가적인 `.free()` 연산을 제공합니다:

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`은 메모리를 수동으로 해제해야 합니다. 하지만 어휘적 스코프(lexical scope)에 묶인 수명을 가진 메모리를 할당하는 것이 유용할 때가 많습니다. 이러한 메모리가 자동으로 해제된다면 도움이 될 것입니다.

이를 위해 `memScoped { }`를 사용할 수 있습니다. 중괄호 안에서는 임시 배치가 암시적 수신 객체(implicit receiver)로 사용 가능하므로, `alloc` 및 `allocArray`로 네이티브 메모리를 할당할 수 있고, 할당된 메모리는 스코프를 벗어날 때 자동으로 해제됩니다.

예를 들어, 포인터 파라미터를 통해 값을 반환하는 C 함수는 다음과 같이 사용할 수 있습니다:

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

### 바인딩에 포인터 전달하기

C 포인터는 `CPointer<T>` 타입으로 매핑되지만, C 함수의 포인터 타입 파라미터는 `CValuesRef<T>`로 매핑됩니다. `CPointer<T>`를 이러한 파라미터의 값으로 전달하면, C 함수로 있는 그대로 전달됩니다. 그러나 포인터 대신 일련의 값(sequence of values)을 전달할 수도 있습니다. 이 경우 시퀀스는 "값에 의한 전달(by value)"로 처리됩니다. 즉, C 함수는 해당 시퀀스의 임시 복사본에 대한 포인터를 받으며, 이 포인터는 함수가 반환될 때까지만 유효합니다.

포인터 파라미터의 `CValuesRef<T>` 표현은 명시적인 네이티브 메모리 할당 없이 C 배열 리터럴을 지원하도록 설계되었습니다. 불변의 자립적인 C 값 시퀀스를 생성하기 위해 다음 메서드들이 제공됩니다:

* `${type}Array.toCValues()` (여기서 `type`은 Kotlin 프리미티브 타입)
* `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})` (여기서 `type`은 프리미티브 또는 포인터)

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

다른 포인터들과 달리 `const char*` 타입의 파라미터는 Kotlin `String`으로 표현됩니다. 따라서 C 문자열을 기대하는 바인딩에 어떤 Kotlin 문자열이든 전달할 수 있습니다.

또한 Kotlin 문자열과 C 문자열 사이를 수동으로 변환할 수 있는 도구들도 제공됩니다:

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`

포인터를 얻으려면 `.cstr`이 네이티브 메모리에 할당되어야 합니다. 예를 들어:

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

모든 경우에 C 문자열은 UTF-8로 인코딩된 것으로 간주됩니다.

자동 변환을 생략하고 바인딩에서 원시 포인터(raw pointers)가 사용되도록 하려면, `.def` 파일에 [`noStringConversion` 프로퍼티](native-definition-file.md#set-up-string-conversion)를 추가하세요:

```c
noStringConversion = LoadCursorA LoadCursorW
```

이렇게 하면 `CPointer<ByteVar>` 타입의 모든 값을 `const char*` 타입의 인자로 전달할 수 있습니다. 만약 Kotlin 문자열을 전달해야 한다면 다음과 같은 코드를 사용할 수 있습니다:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // ASCII 또는 UTF-8 버전용
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // UTF-16 버전용
}
```

### 스코프 로컬 포인터

`memScoped {}` 환경에서 사용 가능한 `CValues<T>.ptr` 확장 프로퍼티를 사용하여 `CValues<T>` 인스턴스에 대해 스코프 내에서 안정적인 C 표현 포인터를 생성할 수 있습니다. 이를 통해 특정 `MemScope`에 묶인 수명을 가진 C 포인터가 필요한 API를 사용할 수 있습니다. 예를 들어:

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

이 예제에서 C API `new_menu()`에 전달된 모든 값은 해당 값이 속한 가장 안쪽의 `memScope` 수명을 가집니다. 제어 흐름이 `memScoped` 스코프를 벗어나면 C 포인터는 유효하지 않게 됩니다.

### 구조체를 값으로 전달 및 받기

C 함수가 구조체/공용체 `T`를 값으로 받거나 반환할 때, 해당 인자 타입 또는 반환 타입은 `CValue<T>`로 표현됩니다.

`CValue<T>`는 불투명(opaque) 타입이므로 적절한 Kotlin 프로퍼티를 사용하여 구조체 필드에 직접 접근할 수 없습니다. API가 구조체를 불투명 핸들로 사용하는 경우에는 문제가 없으나, 필드 접근이 필요한 경우 다음과 같은 변환 메서드를 사용할 수 있습니다:

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  (lvalue) `T`를 `CValue<T>`로 변환합니다. 따라서 `CValue<T>`를 생성하려면 `T`를 할당하고 내용을 채운 다음 `CValue<T>`로 변환할 수 있습니다.
* [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  `CValue<T>`를 메모리에 임시로 저장한 다음, 이 배치된 값 `T`를 수신 객체로 하여 전달된 람다를 실행합니다. 단일 필드를 읽으려면 다음과 같은 코드를 사용할 수 있습니다:

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  제공된 `initialize` 함수를 적용하여 메모리에 `T`를 할당하고 결과를 `CValue<T>`로 변환합니다.
* [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  기존 `CValue<T>`의 수정된 복사본을 생성합니다. 원본 값을 메모리에 배치하고 `modify()` 함수를 사용하여 변경한 다음, 다시 새로운 `CValue<T>`로 변환합니다.
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  `CValues<T>`를 `AutofreeScope`에 배치하고 할당된 메모리에 대한 포인터를 반환합니다. 할당된 메모리는 `AutofreeScope`가 해제될 때 자동으로 해제됩니다.

### 콜백(Callbacks)

Kotlin 함수를 C 함수 포인터로 변환하려면 `staticCFunction(::kotlinFunction)`을 사용할 수 있습니다. 함수 참조 대신 람다를 제공하는 것도 가능합니다. 단, 해당 함수나 람다는 어떠한 값도 캡처(capture)해서는 안 됩니다.

#### 콜백에 사용자 데이터 전달하기

C API는 종종 콜백에 사용자 데이터를 전달할 수 있도록 허용합니다. 이러한 데이터는 일반적으로 사용자가 콜백을 설정할 때 제공됩니다. 예를 들어 `void*` 형식으로 C 함수에 전달되거나 구조체에 작성됩니다. 하지만 Kotlin 객체에 대한 참조는 C로 직접 전달할 수 없습니다. 따라서 Kotlin에서 C를 거쳐 다시 Kotlin으로 안전하게 전달되려면 콜백을 설정하기 전에 래핑(wrapping)하고 콜백 내부에서 다시 언래핑(unwrapping)하는 과정이 필요합니다. 이러한 래핑은 `StableRef` 클래스를 통해 가능합니다.

참조를 래핑하려면:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

여기서 `voidPtr`은 `COpaquePointer`이며 C 함수로 전달될 수 있습니다.

참조를 언래핑하려면:

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

여기서 `kotlinReference`는 원래 래핑되었던 참조입니다.

생성된 `StableRef`는 메모리 누수를 방지하기 위해 결국 `.dispose()` 메서드를 사용하여 수동으로 해제해야 합니다:

```kotlin
stableRef.dispose()
```

해제된 후에는 유효하지 않게 되므로 더 이상 `voidPtr`을 언래핑할 수 없습니다.

### 매크로(Macros)

상수로 확장되는 모든 C 매크로는 Kotlin 프로퍼티로 표현됩니다.

파라미터가 없는 매크로는 컴파일러가 타입을 추론할 수 있는 경우 지원됩니다:

```c
int foo(int);
#define FOO foo(42)
```

이 경우 `FOO`를 Kotlin에서 사용할 수 있습니다.

다른 매크로를 지원하려면 지원되는 선언으로 래핑하여 수동으로 노출할 수 있습니다. 예를 들어, 함수형 매크로 `FOO`는 라이브러리에 [커스텀 선언을 추가](native-definition-file.md#add-custom-declarations)하여 `foo()` 함수로 노출할 수 있습니다:

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 이식성(Portability)

때때로 C 라이브러리는 플랫폼에 따라 달라지는 타입(예: `long` 또는 `size_t`)의 함수 파라미터나 구조체 필드를 가집니다. Kotlin 자체는 암시적 정수 캐스트나 C 방식의 정수 캐스트(예: `(size_t) intValue`)를 제공하지 않으므로, 이러한 경우에 이식 가능한 코드를 더 쉽게 작성할 수 있도록 `convert` 메서드가 제공됩니다:

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

여기서 `type1`과 `type2`는 모두 부호가 있거나 없는 정수 타입이어야 합니다.

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

또한 타입 파라미터는 자동으로 추론될 수 있으므로 일부 경우 생략 가능합니다.

### 객체 피닝(Object pinning)

Kotlin 객체는 피닝(pinning)될 수 있습니다. 즉, 언피닝(unpinning)될 때까지 메모리 내 위치가 고정됨을 보장하며, 이러한 객체의 내부 데이터에 대한 포인터를 C 함수로 전달할 수 있습니다.

다음과 같은 두 가지 접근 방식을 사용할 수 있습니다:

* [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 확장 함수를 사용합니다. 이 함수는 객체를 피닝하고, 블록을 실행한 후, 정상 종료 또는 예외 발생 시 객체를 언피닝합니다:

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
              // 이제 `buffer`에는 `recv()` 호출로부터 얻은 원시 데이터가 들어 있습니다.
          }
      }
  }
  ```

  여기서 `pinned`는 특수 타입인 `Pinned<T>` 객체입니다. 이 객체는 피닝된 배열 본체의 주소를 얻을 수 있게 해주는 [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)와 같은 유용한 확장 기능을 제공합니다.

* 내부적으로 유사한 기능을 수행하지만 특정 경우 상용구 코드를 줄여주는 [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 확장 함수를 사용합니다:

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
          // 이제 `buffer`에는 `recv()` 호출로부터 얻은 원시 데이터가 들어 있습니다.
      }
  }
  ```

  여기서 `buffer.refTo(0)`는 `CValuesRef` 타입을 가지며, `recv()` 함수에 진입하기 전에 배열을 피닝하고 0번째 요소의 주소를 함수에 전달한 뒤, 종료 시 배열을 언피닝합니다.

### 전방 선언(Forward declarations)

전방 선언을 임포트하려면 `cnames` 패키지를 사용하세요. 예를 들어, `library.package`를 가진 C 라이브러리에 선언된 `cstructName` 전방 선언을 임포트하려면 특수한 전방 선언 패키지를 사용합니다: `import cnames.structs.cstructName`.

두 개의 cinterop 라이브러리가 있다고 가정해 봅시다. 하나는 구조체의 전방 선언을 가지고 있고, 다른 하나는 다른 패키지에 실제 구현을 가지고 있습니다:

```C
// 첫 번째 C 라이브러리
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// 두 번째 C 라이브러리
// 헤더:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// 구현:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

두 라이브러리 간에 객체를 전달하려면 Kotlin 코드에서 명시적인 `as` 캐스트를 사용하세요:

```kotlin
// Kotlin 코드:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 다음 단계

다음 튜토리얼을 통해 Kotlin과 C 간에 타입, 함수 및 문자열이 어떻게 매핑되는지 자세히 알아보세요:

* [C의 프리미티브 데이터 타입 매핑](mapping-primitive-data-types-from-c.md)
* [C의 구조체 및 공용체 타입 매핑](mapping-struct-union-types-from-c.md)
* [C의 함수 포인터 매핑](mapping-function-pointers-from-c.md)
* [C의 문자열 매핑](mapping-strings-from-c.md)