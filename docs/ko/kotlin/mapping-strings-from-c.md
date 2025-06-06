[//]: # (title: C에서 문자열 매핑하기 – 튜토리얼)

<tldr>
    <p>이 문서는 <strong>Kotlin과 C 매핑</strong> 튜토리얼 시리즈의 마지막 부분입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">C에서 기본 데이터 타입 매핑하기</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">C에서 구조체 및 유니온 타입 매핑하기</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">함수 포인터 매핑하기</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>C에서 문자열 매핑하기</strong><br/>
    </p>
</tldr>

> C 라이브러리 임포트는 [Experimental](components-stability.md#stability-levels-explained)입니다. cinterop 도구가 C 라이브러리에서 생성하는 모든 Kotlin 선언에는
> `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native에 포함된 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는
> 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="warning"}
 
이 시리즈의 마지막 부분에서는 Kotlin/Native에서 C 문자열을 다루는 방법을 살펴보겠습니다.

이 튜토리얼에서는 다음 방법을 배웁니다:

* [Kotlin 문자열을 C로 전달하기](#pass-kotlin-strings-to-c)
* [Kotlin에서 C 문자열 읽기](#read-c-strings-in-kotlin)
* [C 문자열 바이트를 Kotlin 문자열로 받기](#receive-c-string-bytes-from-kotlin)

## C 문자열 다루기

C에는 전용 문자열 타입이 없습니다. 메서드 시그니처나 문서를 통해 특정 컨텍스트에서 주어진 `char *`가 C 문자열을 나타내는지 식별할 수 있습니다.

C 언어의 문자열은 널 종료(null-terminated)이므로, 문자열의 끝을 표시하기 위해 바이트 시퀀스 끝에 널 문자 `\0`이 추가됩니다. 일반적으로 [UTF-8 인코딩된 문자열](https://en.wikipedia.org/wiki/UTF-8)이 사용됩니다. UTF-8 인코딩은 가변 너비 문자를 사용하며 [ASCII](https://en.wikipedia.org/wiki/ASCII)와 역호환됩니다. Kotlin/Native는 기본적으로 UTF-8 문자 인코딩을 사용합니다.

Kotlin과 C 간에 문자열이 어떻게 매핑되는지 이해하려면 먼저 라이브러리 헤더를 생성해야 합니다. [시리즈의 첫 번째 부분](mapping-primitive-data-types-from-c.md)에서 필요한 파일과 함께 C 라이브러리를 이미 생성했습니다. 이 단계에서는:

1. `lib.h` 파일을 다음 C 문자열 관련 함수 선언으로 업데이트하세요:

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   이 예시는 C 언어에서 문자열을 전달하거나 받는 일반적인 방법을 보여줍니다. `return_string()` 함수의 반환 값을 신중하게 처리하세요. 반환된 `char*`를 해제하려면 올바른 `free()` 함수를 사용해야 합니다.

2. `---` 구분자 뒤의 `interop.def` 파일에서 선언을 업데이트하세요:

   ```c
   ---
   
   void pass_string(char* str) {
   }
   
   char* return_string() {
     return "C string";
   }
   
   int copy_string(char* str, int size) {
       *str++ = 'C';
       *str++ = ' ';
       *str++ = 'K';
       *str++ = '/';
       *str++ = 'N';
       *str++ = 0;
       return 0;
   }
   ```

`interop.def` 파일은 IDE에서 애플리케이션을 컴파일, 실행 또는 열기 위해 필요한 모든 것을 제공합니다.

## C 라이브러리용으로 생성된 Kotlin API 검사하기

C 문자열 선언이 Kotlin/Native로 어떻게 매핑되는지 살펴보겠습니다:

1. `src/nativeMain/kotlin`에서 [이전 튜토리얼](mapping-function-pointers-from-c.md)의 `hello.kt` 파일을 다음 내용으로 업데이트하세요:

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
  
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       pass_string(/*fix me*/)
       val useMe = return_string()
       val useMe2 = copy_string(/*fix me*/)
   }
   ```

2. IntelliJ IDEA의 [선언으로 이동(Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 명령(<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수에 대해 다음으로 생성된 API로 이동하세요:

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

이러한 선언은 간단합니다. Kotlin에서 C의 `char *` 포인터는 파라미터의 경우 `str: CValuesRef<ByteVarOf>?`로, 반환 타입의 경우 `CPointer<ByteVarOf>?`로 매핑됩니다. Kotlin은 `char` 타입을 `kotlin.Byte`로 표현하는데, 이는 일반적으로 8비트 부호 있는 값이기 때문입니다.

생성된 Kotlin 선언에서 `str`은 `CValuesRef<ByteVarOf<Byte>>?`로 정의됩니다.
이 타입은 널 허용(nullable)이므로, 인자 값으로 `null`을 전달할 수 있습니다. 

## Kotlin 문자열을 C로 전달하기

Kotlin에서 API를 사용해 보겠습니다. 먼저 `pass_string()` 함수를 호출하세요:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cstr

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val str = "This is a Kotlin string"
    pass_string(str.cstr)
}
```

Kotlin 문자열을 C로 전달하는 것은 `String.cstr` [확장 프로퍼티](extensions.md#extension-properties) 덕분에 간단합니다.
UTF-16 문자가 포함된 경우에는 `String.wcstr` 프로퍼티도 있습니다.

## Kotlin에서 C 문자열 읽기

이제 `return_string()` 함수에서 반환된 `char *`를 가져와 Kotlin 문자열로 변환해 보겠습니다:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.toKString

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val stringFromC = return_string()?.toKString()

    println("Returned from C: $stringFromC")
}
```

여기서 `.toKString()` 확장 함수는 `return_string()` 함수에서 반환된 C 문자열을 Kotlin 문자열로 변환합니다.

Kotlin은 인코딩에 따라 C `char *` 문자열을 Kotlin 문자열로 변환하는 여러 확장 함수를 제공합니다:

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // Standard function for UTF-8 strings
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // Explicitly converts UTF-8 strings
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // Converts UTF-16 encoded strings
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // Converts UTF-32 encoded strings
```

## C 문자열 바이트를 Kotlin으로 받기

이번에는 `copy_string()` C 함수를 사용하여 C 문자열을 주어진 버퍼에 작성해 보겠습니다. 이 함수는 문자열이 작성될 메모리 위치에 대한 포인터와 허용된 버퍼 크기라는 두 가지 인자를 받습니다.

이 함수는 성공 또는 실패를 나타내는 값을 반환해야 합니다. `0`이 성공을 의미하고, 제공된 버퍼가 충분히 크다고 가정해 봅시다:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned ->
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

여기서는 먼저 네이티브 포인터가 C 함수로 전달됩니다. `.usePinned` 확장 함수는 바이트 배열의 네이티브 메모리 주소를 일시적으로 고정(pin)합니다. C 함수는 바이트 배열에 데이터를 채웁니다. 또 다른 확장 함수인 `ByteArray.decodeToString()`는 바이트 배열을 Kotlin 문자열로 변환하며, UTF-8 인코딩을 가정합니다. 

## Kotlin 코드 업데이트

이제 Kotlin 코드에서 C 선언을 사용하는 방법을 배웠으므로, 프로젝트에서 이를 사용해 보세요.
최종 `hello.kt` 파일의 코드는 다음과 같을 수 있습니다:
 
```kotlin
import interop.*
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val str = "This is a Kotlin string"
    pass_string(str.cstr)

    val useMe = return_string()?.toKString() ?: error("null pointer returned")
    println(useMe)

    val copyFromC = ByteArray(255).usePinned { pinned ->
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

모든 것이 예상대로 작동하는지 확인하려면 [IDE](native-get-started.md)에서 `runDebugExecutableNative` Gradle 태스크를 실행하거나 다음 명령을 사용하여 코드를 실행하세요:

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

더 심화된 시나리오를 다루는 [C와의 상호 운용성](native-c-interop.md) 문서에서 더 자세히 알아보세요.