---
title: "C와의 상호 운용성"
---
:::note
C 라이브러리 가져오기는 [Experimental](components-stability#stability-levels-explained)입니다.
cinterop 도구가 C 라이브러리에서 생성하는 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit 및 POSIX)는
일부 API에 대해서만 옵트인을 요구합니다.

이 문서는 Kotlin과 C의 상호 운용성에 대한 일반적인 측면을 다룹니다. Kotlin/Native는 cinterop 도구와 함께 제공되며,
이 도구를 사용하여 외부 C 라이브러리와 상호 작용하는 데 필요한 모든 것을 빠르게 생성할 수 있습니다.

이 도구는 C 헤더를 분석하고 C 타입, 함수 및 상수를 Kotlin으로 직접 매핑합니다.
생성된 스텁은 IDE로 가져와 코드 완성 및 탐색을 활성화할 수 있습니다.

Kotlin은 Objective-C와의 상호 운용성도 제공합니다. Objective-C 라이브러리는 cinterop 도구를 통해 가져옵니다.
자세한 내용은 [Swift/Objective-C interop](native-objc-interop)을 참조하세요.

## 프로젝트 설정

C 라이브러리를 사용해야 하는 프로젝트 작업 시 일반적인 워크플로는 다음과 같습니다.

1. [정의 파일](native-definition-file)을 생성하고 구성합니다. 이는 cinterop 도구가 Kotlin [바인딩](#bindings)에
   포함해야 하는 항목을 설명합니다.
2. Gradle 빌드 파일이 빌드 프로세스에 cinterop를 포함하도록 구성합니다.
3. 프로젝트를 컴파일하고 실행하여 최종 실행 파일을 생성합니다.

실제 경험을 위해 [C interop을 사용하여 앱 만들기](native-app-with-c-and-libcurl) 튜토리얼을 완료하세요.

:::

대부분의 경우 C 라이브러리와의 사용자 지정 상호 운용성을 구성할 필요가 없습니다. 대신, 사용 가능한 API를 사용할 수 있습니다.
플랫폼 표준 바인딩을 [플랫폼 라이브러리](native-platform-libs)라고 합니다. 예를 들어,
Linux/macOS 플랫폼의 POSIX, Windows 플랫폼의 Win32 또는 macOS/iOS의 Apple 프레임워크를 이러한 방식으로 사용할 수 있습니다.

## 바인딩

### 기본 interop 타입

지원되는 모든 C 타입은 Kotlin에 해당 표현을 갖습니다.

* 부호 있는 정수형, 부호 없는 정수형 및 부동 소수점 타입은 동일한 너비의 Kotlin 대응 타입에 매핑됩니다.
* 포인터와 배열은 `CPointer<T>?`에 매핑됩니다.
* 열거형은 휴리스틱과
  [정의 파일 설정](native-definition-file#configure-enums-generation)에 따라 Kotlin 열거형 또는 정수 값에 매핑될 수 있습니다.
* 구조체와 공용체는 점 표기법을 통해 필드를 사용할 수 있는 타입에 매핑됩니다(예: `someStructInstance.field1`).
* `typedef`는 `typealias`로 표현됩니다.

또한 모든 C 타입에는 이 타입의 lvalue를 나타내는 Kotlin 타입, 즉 단순한 변경 불가능한 자체 포함 값이 아닌 메모리에 있는 값이 있습니다.
C++ 참조를 유사한 개념으로 생각하세요. 구조체(및 구조체에 대한 `typedef`s)의 경우 이 표현이 주요 표현이며 구조체 자체와 동일한 이름을 갖습니다. Kotlin 열거형의 경우 `${type}.Var`로 이름이 지정됩니다. `CPointer<T>`의 경우 `CPointerVar<T>`입니다. 그리고 대부분의 다른 타입의 경우 `${type}Var`입니다.

두 표현이 모두 있는 타입의 경우 lvalue가 있는 타입에는 값에 액세스하기 위한 변경 가능한 `.value` 속성이 있습니다.

#### 포인터 타입

`CPointer<T>`의 타입 인수 `T`는 위에 설명된 lvalue 타입 중 하나여야 합니다. 예를 들어, C 타입
`struct S*`는 `CPointer<S>`에 매핑되고, `int8_t*`는 `CPointer<int_8tVar>`에 매핑되고, `char**`는
`CPointer<CPointerVar<ByteVar>>`에 매핑됩니다.

C null 포인터는 Kotlin의 `null`로 표현되고, 포인터 타입 `CPointer<T>`는 nullable이 아니지만
`CPointer<T>?`는 nullable입니다. 이 타입의 값은 `?:`, `?.`, `!!` 등과 같이 `null` 처리에 관련된 모든 Kotlin 연산을 지원합니다.

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

배열도 `CPointer<T>`에 매핑되므로 인덱스로 값에 액세스하기 위한 `[]` 연산자를 지원합니다.

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>`의 `.pointed` 속성은 이 포인터가 가리키는 타입 `T`의 lvalue를 반환합니다. 역연산은
`.ptr`이며, lvalue를 가져와 해당 포인터를 반환합니다.

`void*`는 모든 포인터 타입의 슈퍼타입인 특수 포인터 타입인 `COpaquePointer`에 매핑됩니다.
따라서 C 함수가 `void*`를 취하면 Kotlin 바인딩은 모든 `CPointer`를 허용합니다.

포인터( `COpaquePointer` 포함) 캐스팅은 `.reinterpret<T>`로 수행할 수 있습니다(예:).

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

C와 마찬가지로 이러한 `.reinterpret` 캐스트는 안전하지 않으며 애플리케이션에서 미묘한 메모리 문제를 일으킬 수 있습니다.

또한 `.toLong()` 및 `.toCPointer<T>()`에서 제공하는 `CPointer<T>?`와 `Long` 간의 안전하지 않은 캐스트도 있습니다.
확장 메서드:

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

:::tip
타입 추론 덕분에 컨텍스트에서 결과의 타입을 알 수 있는 경우 타입 인수를 생략할 수 있습니다.

:::

### 메모리 할당

네이티브 메모리는 `NativePlacement` 인터페이스를 사용하여 할당할 수 있습니다(예:).

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

가장 논리적인 배치는 `nativeHeap` 객체에 있습니다. 이는 `malloc`으로 네이티브 메모리를 할당하는 것에 해당하며
할당된 메모리를 해제하기 위한 추가 `.free()` 연산을 제공합니다.

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap`은 메모리를 수동으로 해제해야 합니다. 그러나 수명 주기가 어휘 범위에 바인딩된 메모리를 할당하는 것이 유용한 경우가 많습니다.
이러한 메모리가 자동으로 해제되는 경우에 유용합니다.

이를 해결하기 위해 `memScoped { }`를 사용할 수 있습니다. 중괄호 안에서 임시 배치를 암시적으로 사용할 수 있습니다.
수신기이므로 alloc 및 allocArray를 사용하여 네이티브 메모리를 할당할 수 있으며 할당된 메모리는
스코프를 벗어난 후 자동으로 해제됩니다.

예를 들어 포인터 매개변수를 통해 값을 반환하는 C 함수는 다음과 같이 사용할 수 있습니다.

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

C 포인터는 `CPointer<T> type`에 매핑되지만 C 함수 포인터 타입 매개변수는 `CValuesRef<T>`에 매핑됩니다.
`CPointer<T>`를 이러한 매개변수의 값으로 전달하면 C 함수에 있는 그대로 전달됩니다.
그러나 포인터 대신 값 시퀀스를 전달할 수 있습니다. 이 경우 시퀀스는 "값으로" 전달됩니다.
즉, C 함수는 해당 시퀀스의 임시 복사본에 대한 포인터를 받으며 함수가 반환될 때까지만 유효합니다.

포인터 매개변수의 `CValuesRef<T>` 표현은 명시적인 네이티브 없이 C 배열 리터럴을 지원하도록 설계되었습니다.
메모리 할당. C 값의 변경 불가능한 자체 포함 시퀀스를 구성하기 위해 다음 메서드가 제공됩니다.

* `${type}Array.toCValues()`, 여기서 `type`은 Kotlin 기본 타입입니다.
* `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`, 여기서 `type`은 기본 타입 또는 포인터입니다.

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

다른 포인터와 달리 `const char*` 타입의 매개변수는 Kotlin `String`으로 표현됩니다. 따라서
C 문자열을 예상하는 바인딩에 모든 Kotlin 문자열을 전달합니다.

Kotlin과 C 문자열 간에 수동으로 변환하는 데 사용할 수 있는 몇 가지 도구도 있습니다.

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`.

포인터를 얻으려면 `.cstr`를 네이티브 메모리에 할당해야 합니다(예:).

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

모든 경우에 C 문자열은 UTF-8로 인코딩되어야 합니다.

자동 변환을 건너뛰고 바인딩에서 원시 포인터가 사용되도록 하려면
`.def` 파일에 [`noStringConversion` 속성](native-definition-file#set-up-string-conversion)을 추가합니다.

```c
noStringConversion = LoadCursorA LoadCursorW
```

이러한 방식으로 `CPointer<ByteVar>` 타입의 모든 값을 `const char*` 타입의 인수로 전달할 수 있습니다. Kotlin 문자열이
전달되어야 하는 경우 다음과 같은 코드를 사용할 수 있습니다.

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 스코프 로컬 포인터

`memScoped {}` 아래에서 사용할 수 있는 `CValues<T>.ptr`
확장 속성을 사용하여 `CValues<T>` 인스턴스에 대한 C 표현의 스코프 안정 포인터를 만들 수 있습니다. 이를 통해 특정 `MemScope`에 바인딩된 수명 주기가 있는 C 포인터가 필요한 API를 사용할 수 있습니다. 예를 들어:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value `->` items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

이 예에서 C API `new_menu()`에 전달된 모든 값은 속한 가장 안쪽의 `memScope`의 수명 주기를 갖습니다.
컨트롤 흐름이 `memScoped` 스코프를 벗어나면 C 포인터는 유효하지 않게 됩니다.

### 값으로 구조체 전달 및 수신

C 함수가 struct/union `T`를 값으로 취하거나 반환하는 경우 해당 인수 타입 또는 반환 타입은
`CValue<T>`로 표현됩니다.

`CValue<T>`는 불투명한 타입이므로 적절한 Kotlin 속성으로 구조체 필드에 액세스할 수 없습니다.
API가 구조체를 불투명한 핸들로 사용하는 경우 괜찮을 수 있습니다. 그러나 필드 액세스가 필요한 경우 다음이 있습니다.
변환 방법을 사용할 수 있습니다.

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  (lvalue) `T`를 `CValue<T>`로 변환합니다. 따라서 `CValue<T>`를 구성하려면
  `T`를 할당하고 채운 다음 `CValue<T>`로 변환할 수 있습니다.
* [`CValue<T>.useContents(block: T.() `->` R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  `CValue<T>`를 메모리에 임시로 저장한 다음 전달된 람다를 이 배치된 값 `T`와 함께 수신기로 실행합니다.
  따라서 단일 필드를 읽으려면 다음 코드를 사용할 수 있습니다.

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  제공된 `initialize` 함수를 적용하여 메모리에 `T`를 할당하고 결과를 `CValue<T>`로 변환합니다.
* [`fun CValue<T>.copy(modify: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  기존 `CValue<T>`의 수정된 복사본을 만듭니다. 원래 값은 메모리에 배치되고 `modify()`를 사용하여 변경됩니다.
  함수를 호출한 다음 새 `CValue<T>`로 다시 변환합니다.
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  `CValues<T>`를 `AutofreeScope`에 배치하여 할당된 메모리에 대한 포인터를 반환합니다. 할당된 메모리는
  `AutofreeScope`가 폐기되면 자동으로 해제됩니다.

### 콜백

Kotlin 함수를 C 함수에 대한 포인터로 변환하려면 `staticCFunction(::kotlinFunction)`을 사용할 수 있습니다. 또한
함수 참조 대신 람다를 제공할 수도 있습니다. 함수 또는 람다는 값을 캡처해서는 안 됩니다.

#### 사용자 데이터를 콜백에 전달

종종 C API를 통해 일부 사용자 데이터를 콜백에 전달할 수 있습니다. 이러한 데이터는 일반적으로 사용자가 콜백을 구성할 때 제공합니다.
예를 들어 `void*`로 일부 C 함수에 전달되거나 구조체에 기록됩니다. 그러나
Kotlin 객체에 대한 참조는 C에 직접 전달할 수 없습니다. 따라서 콜백을 구성하기 전에 래핑한 다음 래핑 해제가 필요합니다.
콜백 자체에서 안전하게 Kotlin에서 C 세계를 통해 Kotlin으로 이동합니다. 이러한 래핑은
`StableRef` 클래스.

참조를 래핑하려면:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

여기서 `voidPtr`은 `COpaquePointer`이며 C 함수에 전달할 수 있습니다.

참조를 래핑 해제하려면:

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

여기서 `kotlinReference`는 원래 래핑된 참조입니다.

생성된 `StableRef`는 메모리 누수를 방지하기 위해 `.dispose()` 메서드를 사용하여 수동으로 폐기해야 합니다.

```kotlin
stableRef.dispose()
```

그 후에는 유효하지 않게 되므로 더 이상 `voidPtr`을 래핑 해제할 수 없습니다.

### 매크로

상수로 확장되는 모든 C 매크로는 Kotlin 속성으로 표현됩니다.

컴파일러가 타입을 추론할 수 있는 경우 매개변수가 없는 매크로가 지원됩니다.

```c
int foo(int);
#define FOO foo(42)
```

이 경우 `FOO`는 Kotlin에서 사용할 수 있습니다.

다른 매크로를 지원하려면 지원되는 선언으로 래핑하여 수동으로 노출할 수 있습니다. 예를 들어
함수와 유사한 매크로 `FOO`는
라이브러리에 [사용자 지정 선언 추가](native-definition-file#add-custom-declarations)하여 함수 `foo()`로 노출됩니다.

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 이식성

경우에 따라 C 라이브러리에는 플랫폼 종속적인 타입의 함수 매개변수 또는 구조체 필드가 있습니다(예: `long` 또는
`size_t`). Kotlin 자체는 암시적 정수 캐스트 또는 C 스타일 정수 캐스트(예:
`(size_t) intValue`), 따라서 이러한 경우에 이식 가능한 코드를 더 쉽게 작성할 수 있도록 `convert` 메서드가 제공됩니다.

```kotlin
fun $.convert<$>(): $
```

여기서 `type1`과 `type2`는 부호 있는 또는 부호 없는 정수 타입이어야 합니다.

`.convert<${type}>`는 `type`에 따라 `.toByte`, `.toShort`, `.toInt`, `.toLong`, `.toUByte`,
`.toUShort`, `.toUInt` 또는 `.toULong` 메서드 중 하나와 동일한 의미 체계를 갖습니다.

`convert` 사용 예:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

또한 타입 매개변수를 자동으로 추론할 수 있으므로 일부 경우에는 생략할 수 있습니다.

### 객체 고정

Kotlin 객체를 고정할 수 있습니다. 즉, 메모리 내 위치가 고정 해제될 때까지 안정적으로 유지되고
이러한 객체의 내부 데이터에 대한 포인터를 C 함수에 전달할 수 있습니다.

취할 수 있는 몇 가지 방법이 있습니다.

* [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 서비스 함수를 사용합니다.
  객체를 고정하고 블록을 실행하고 정상 및 예외 경로에서 고정 해제합니다.

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned `->`
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

  여기서 `pinned`는 특수 타입 `Pinned<T>`의 객체입니다. 고정된 배열 본문의 주소를 가져올 수 있는 `addressOf`와 같은 유용한 확장을 제공합니다.

* [`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 함수를 사용합니다. 이 함수는
  후드에서 유사한 기능을 수행하지만 특정 경우에는 상용구 코드를 줄이는 데 도움이 될 수 있습니다.

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

  여기서 `buffer.refTo(0)`는 `recv()` 함수에 들어가기 전에 배열을 고정하는 `CValuesRef` 타입을 갖습니다.
  함수에 zeroth 요소의 주소를 전달하고 종료 후 배열을 고정 해제합니다.

### 전방 선언

전방 선언을 가져오려면 `cnames` 패키지를 사용하세요. 예를 들어 `library.package`가 있는 C 라이브러리에서 선언된 `cstructName` 전방 선언을 가져오려면 특수 전방 선언 패키지를 사용하세요.
`import cnames.structs.cstructName`.

구조체의 전방 선언이 있는 cinterop 라이브러리와 다른 패키지에 실제 구현이 있는 cinterop 라이브러리 두 개를 고려하세요.

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

두 라이브러리 간에 객체를 전송하려면 Kotlin 코드에서 명시적 `as` 캐스트를 사용하세요.

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 다음 단계

다음 튜토리얼을 완료하여 타입, 함수 및 상수가 Kotlin과 C 간에 매핑되는 방법을 알아보세요.

* [C에서 기본 데이터 타입 매핑](mapping-primitive-data-types-from-c)
* [C에서 구조체 및 공용체 타입 매핑](mapping-function-pointers-from-c)
* [C에서 함수 포인터 매핑](mapping-function-pointers-from-c)
* [C에서 문자열 매핑](mapping-strings-from-c)
  ```