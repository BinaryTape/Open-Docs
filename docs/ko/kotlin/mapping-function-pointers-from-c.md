[//]: # (title: C의 함수 포인터 매핑 – 튜토리얼)

<tldr>
    <p>이 문서는 <strong>Kotlin과 C 매핑</strong> 튜토리얼 시리즈의 세 번째 부분입니다. 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">C의 기본 데이터 타입 매핑</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">C의 구조체 및 유니온 타입 매핑</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>C의 함수 포인터 매핑</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">C의 문자열 매핑</a><br/>
    </p>
</tldr>

> C 라이브러리 임포트는 [베타(Beta)](native-c-interop-stability.md) 버전입니다. cinterop 도구로 C 라이브러리에서 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

Kotlin에서 C 함수 포인터가 어떻게 보이는지 살펴보고, Kotlin/Native 및 [멀티플랫폼](gradle-configure-project.md#targeting-multiple-platforms) Gradle 빌드의 고급 C 상호 운용성(interop) 관련 사용 사례를 살펴보겠습니다.

이 튜토리얼에서는 다음을 수행합니다:

*   [Kotlin 함수를 C 함수 포인터로 전달하는 방법 배우기](#pass-kotlin-function-as-a-c-function-pointer)
*   [Kotlin에서 C 함수 포인터 사용하기](#use-the-c-function-pointer-from-kotlin)

## C의 함수 포인터 타입 매핑

Kotlin과 C 간의 매핑을 이해하기 위해, 함수 포인터를 매개변수로 받는 함수와 함수 포인터를 반환하는 두 가지 함수를 선언해 보겠습니다.

시리즈의 [첫 번째 부분](mapping-primitive-data-types-from-c.md)에서 이미 필요한 파일이 포함된 C 라이브러리를 생성했습니다. 이 단계에서는 `---` 구분자 뒤의 `interop.def` 파일에서 선언을 업데이트하세요:

```c 

---

int myFun(int i) {
  return i+1;
}

typedef int  (*MyFun)(int);

void accept_fun(MyFun f) {
  f(42);
}

MyFun supply_fun() {
  return myFun;
}
``` 

`interop.def` 파일은 애플리케이션을 IDE에서 컴파일, 실행 또는 열기 위해 필요한 모든 것을 제공합니다.

## C 라이브러리에 대해 생성된 Kotlin API 검사

C 함수 포인터가 Kotlin/Native에 어떻게 매핑되는지 확인하고 프로젝트를 업데이트해 보겠습니다:

1.  `src/nativeMain/kotlin`에서 [이전 튜토리얼](mapping-struct-union-types-from-c.md)의 `hello.kt` 파일을 다음 내용으로 업데이트하세요:

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi
    
    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
       
        accept_fun(/* fix me*/)
        val useMe = supply_fun()
    }
    ```

2.  IntelliJ IDEA의 [선언으로 이동(Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 명령 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)을 사용하여 다음 C 함수에 대해 생성된 API로 이동하세요:

    ```kotlin
    fun myFun(i: kotlin.Int): kotlin.Int
    fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
    fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
    ```

보시다시피, C 함수 포인터는 Kotlin에서 `CPointer<CFunction<...>>`를 사용하여 표현됩니다. `accept_fun()` 함수는 선택적 함수 포인터를 매개변수로 받고, `supply_fun()`은 함수 포인터를 반환합니다.

`CFunction<(Int) -> Int>`는 함수 시그니처를 나타내며, `CPointer<CFunction<...>>?`는 널러블(nullable) 함수 포인터를 나타냅니다. 모든 `CPointer<CFunction<...>>` 타입에는 [`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html) 연산자 확장 함수가 제공되어, 함수 포인터를 일반 Kotlin 함수처럼 호출할 수 있습니다.

## Kotlin 함수를 C 함수 포인터로 전달하기

이제 Kotlin 코드에서 C 함수를 사용해 볼 차례입니다. `accept_fun()` 함수를 호출하고 C 함수 포인터를 Kotlin 람다에 전달하세요:

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

이 호출은 Kotlin/Native의 `staticCFunction {}` 헬퍼 함수를 사용하여 Kotlin 람다 함수를 C 함수 포인터로 래핑합니다. 이 함수는 바인딩되지 않고 캡처하지 않는 람다 함수만 허용합니다. 예를 들어, 함수에서 로컬 변수를 캡처할 수 없고 전역적으로 보이는 선언만 캡처할 수 있습니다.

함수가 예외를 던지지 않는지 확인하세요. `staticCFunction {}`에서 예외를 던지면 비결정적 부작용이 발생합니다.

## Kotlin에서 C 함수 포인터 사용하기

다음 단계는 `supply_fun()` 호출에서 반환된 C 함수 포인터를 호출하는 것입니다:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke

@OptIn(ExperimentalForeignApi::class)
fun myFun2() {
    val functionFromC = supply_fun() ?: error("No function is returned")

    functionFromC(42)
}
```

Kotlin은 함수 포인터 반환 타입을 널러블 `CPointer<CFunction<>` 객체로 변환합니다. 먼저 명시적으로 `null`을 확인해야 하며, 그래서 위 코드에서 [엘비스 연산자(Elvis operator)](null-safety.md)가 사용되었습니다. cinterop 도구를 사용하면 C 함수 포인터를 일반 Kotlin 함수 호출처럼 호출할 수 있습니다: `functionFromC(42)`.

## Kotlin 코드 업데이트

이제 모든 정의를 살펴보았으니, 프로젝트에서 사용해 보세요.
`hello.kt` 파일의 코드는 다음과 같을 수 있습니다:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke
import kotlinx.cinterop.staticCFunction

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cFunctionPointer = staticCFunction<Int, Int> { it + 1 }
    accept_fun(cFunctionPointer)

    val funFromC = supply_fun() ?: error("No function is returned")
    funFromC(42)
}
```

모든 것이 예상대로 작동하는지 확인하려면, [IDE에서](native-get-started.md#build-and-run-the-application) `runDebugExecutableNative` Gradle 태스크를 실행하거나 다음 명령을 사용하여 코드를 실행하세요:

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

시리즈의 다음 부분에서는 Kotlin과 C 사이에 문자열이 어떻게 매핑되는지 알아봅니다:

**[다음 부분으로 진행하기](mapping-strings-from-c.md)**

### 더 보기

[C와의 상호 운용성(Interoperability with C)](native-c-interop.md) 문서에서 더 고급 시나리오에 대해 자세히 알아보세요.