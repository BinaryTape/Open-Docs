---
title: "C – 튜토리얼에서 문자열 매핑"
---
:::info
<p>
   이 튜토리얼은 <strong>Kotlin과 C 매핑</strong> 시리즈의 마지막 부분입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">C로부터 기본 데이터 타입 매핑하기</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">C로부터 구조체와 공용체 타입 매핑하기</a><br/>
      <img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">함수 포인터 매핑하기</a><br/>
      <img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>C로부터 문자열 매핑하기</strong><br/>
</p>

:::

:::caution
C 라이브러리 임포트는 [Experimental](components-stability#stability-levels-explained)입니다. cinterop 툴에 의해 C 라이브러리로부터 생성된 모든 Kotlin 선언은 `@ExperimentalForeignApi` 어노테이션을 가져야 합니다.

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는 일부 API에 대해서만 옵트인을 요구합니다.

:::
 
이 시리즈의 마지막 부분에서는 Kotlin/Native에서 C 문자열을 다루는 방법을 살펴보겠습니다.

이 튜토리얼에서는 다음 방법을 배웁니다.

* [Kotlin 문자열을 C로 전달하기](#pass-kotlin-strings-to-c)
* [Kotlin에서 C 문자열 읽기](#read-c-strings-in-kotlin)
* [Kotlin 문자열로 C 문자열 바이트 받기](#receive-c-string-bytes-from-kotlin)

## C 문자열 작업

C에는 전용 문자열 타입이 없습니다. 메서드 시그니처 또는 문서를 통해 주어진 `char *`가 특정 컨텍스트에서 C 문자열을 나타내는지 확인할 수 있습니다.

C 언어의 문자열은 null-terminated이므로, 문자열의 끝을 표시하기 위해 바이트 시퀀스의 끝에 후행 제로 문자 `\0`가 추가됩니다. 일반적으로 [UTF-8 인코딩 문자열](https://en.wikipedia.org/wiki/UTF-8)이 사용됩니다. UTF-8 인코딩은 가변 너비 문자를 사용하며 [ASCII](https://en.wikipedia.org/wiki/ASCII)와 하위 호환됩니다. Kotlin/Native는 기본적으로 UTF-8 문자 인코딩을 사용합니다.

Kotlin과 C 간에 문자열이 어떻게 매핑되는지 이해하려면 먼저 라이브러리 헤더를 만드십시오.
[시리즈의 첫 번째 부분](mapping-primitive-data-types-from-c)에서 필요한 파일로 C 라이브러리를 이미 만들었습니다. 이 단계를 위해:

1. C 문자열로 작동하는 다음 함수 선언으로 `lib.h` 파일을 업데이트하십시오.

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   이 예제는 C 언어에서 문자열을 전달하거나 받는 일반적인 방법을 보여줍니다. `return_string()` 함수의 반환 값을 주의해서 처리하십시오. 반환된 `char*`를 해제하려면 올바른 `free()` 함수를 사용해야 합니다.

2. `---` 구분자 뒤에 `interop.def` 파일의 선언을 업데이트합니다.

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

`interop.def` 파일은 애플리케이션을 컴파일, 실행 또는 IDE에서 열기 위해 필요한 모든 것을 제공합니다.

## C 라이브러리에 대해 생성된 Kotlin API 검사

C 문자열 선언이 Kotlin/Native로 어떻게 매핑되는지 살펴봅시다.

1. `src/nativeMain/kotlin`에서 [이전 튜토리얼](mapping-function-pointers-from-c)의 `hello.kt` 파일을 다음 내용으로 업데이트합니다.

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

2. IntelliJ IDEA의 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   명령 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 C 함수에 대해 생성된 다음 API로 이동합니다.

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

이러한 선언은 간단합니다. Kotlin에서 C `char *` 포인터는 매개변수의 경우 `str: CValuesRef<ByteVarOf>?`로, 반환 타입의 경우 `CPointer<ByteVarOf>?`로 매핑됩니다. Kotlin은 `char` 타입을 일반적으로 8비트 부호 있는 값인 `kotlin.Byte`로 나타냅니다.

생성된 Kotlin 선언에서 `str`은 `CValuesRef<ByteVarOf<Byte>>?`로 정의됩니다.
이 타입은 nullable이므로 `null`을 인자 값으로 전달할 수 있습니다.

## Kotlin 문자열을 C로 전달하기

Kotlin에서 API를 사용해 봅시다. 먼저 `pass_string()` 함수를 호출합니다.

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

`String.cstr` [extension property](extensions#extension-properties) 덕분에 Kotlin 문자열을 C로 전달하는 것은 간단합니다.
UTF-16 문자가 포함된 경우를 위한 `String.wcstr` 속성도 있습니다.

## Kotlin에서 C 문자열 읽기

이제 `return_string()` 함수에서 반환된 `char *`를 가져와서 Kotlin 문자열로 변환합니다.

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

Kotlin은 C `char *` 문자열을 Kotlin 문자열로 변환하기 위한 여러 확장 함수를 제공하며,
인코딩에 따라 다릅니다.

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8 문자열을 위한 표준 함수
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // 명시적으로 UTF-8 문자열을 변환합니다.
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // UTF-16 인코딩된 문자열을 변환합니다.
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // UTF-32 인코딩된 문자열을 변환합니다.
```

## Kotlin에서 C 문자열 바이트 받기

이번에는 `copy_string()` C 함수를 사용하여 지정된 버퍼에 C 문자열을 씁니다. 이 함수는 문자열을 써야 하는 메모리 위치에 대한 포인터와 허용된 버퍼 크기의 두 가지 인수를 사용합니다.

또한 함수는 성공 또는 실패 여부를 나타내는 값을 반환해야 합니다. `0`은 성공을 의미하고 제공된 버퍼가 충분히 크다고 가정합니다.

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned `->`
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

여기서 네이티브 포인터가 먼저 C 함수에 전달됩니다. `.usePinned` 확장 함수는 바이트 배열의 네이티브 메모리 주소를 일시적으로 고정합니다. C 함수는 바이트 배열을 데이터로 채웁니다. 다른 확장 함수인 `ByteArray.decodeToString()`은 UTF-8 인코딩을 가정하여 바이트 배열을 Kotlin 문자열로 변환합니다.

## Kotlin 코드 업데이트

이제 Kotlin 코드에서 C 선언을 사용하는 방법을 배웠으므로 프로젝트에서 사용해 보십시오.
최종 `hello.kt` 파일의 코드는 다음과 같을 수 있습니다.
 
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

    val copyFromC = ByteArray(255).usePinned { pinned `->`
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

모든 것이 예상대로 작동하는지 확인하려면 [IDE에서](native-get-started) `runDebugExecutableNative` Gradle 작업을 실행하거나
다음 명령을 사용하여 코드를 실행합니다.

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

더 고급 시나리오를 다루는 [C와의 상호 운용성](native-c-interop) 문서에서 자세히 알아보십시오.