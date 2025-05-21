---
title: "C에서 함수 포인터 매핑하기 - 튜토리얼"
---
:::info
<p>
   이 튜토리얼은 <strong>Kotlin과 C 매핑</strong> 시리즈의 세 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하십시오.
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">C의 기본 데이터 타입 매핑</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">C의 struct 및 union 타입 매핑</a><br/>
        <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>함수 포인터 매핑</strong><br/>
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">C의 문자열 매핑</a><br/>
</p>

:::

:::caution
C 라이브러리 임포트는 [Experimental](components-stability#stability-levels-explained)입니다. C 라이브러리에서 cinterop 도구로 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는 일부 API에 대해서만 옵트인을 요구합니다.

:::

이제 Kotlin에서 어떤 C 함수 포인터를 볼 수 있는지 살펴보고 Kotlin/Native 및 [multiplatform](gradle-configure-project#targeting-multiple-platforms) Gradle 빌드의 고급 C interop 관련 사용 사례를 살펴보겠습니다.

이 튜토리얼에서는 다음을 수행합니다.

* [Kotlin 함수를 C 함수 포인터로 전달하는 방법 알아보기](#pass-kotlin-function-as-a-c-function-pointer)
* [Kotlin에서 C 함수 포인터 사용](#use-the-c-function-pointer-from-kotlin)

## C에서 함수 포인터 타입 매핑

Kotlin과 C 간의 매핑을 이해하기 위해 함수 포인터를 매개변수로 사용하는 함수와 함수 포인터를 반환하는 함수 두 개를 선언해 보겠습니다.

시리즈의 [첫 번째 파트](mapping-primitive-data-types-from-c)에서 필요한 파일이 있는 C 라이브러리를 이미 만들었습니다. 이 단계를 위해 `interop.def` 파일에서 `---` 구분 기호 뒤에 있는 선언을 업데이트합니다.

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

`interop.def` 파일은 애플리케이션을 컴파일, 실행 또는 IDE에서 여는 데 필요한 모든 것을 제공합니다.

## C 라이브러리에 대해 생성된 Kotlin API 검사

C 함수 포인터가 Kotlin/Native에 어떻게 매핑되는지 확인하고 프로젝트를 업데이트해 보겠습니다.

1. `src/nativeMain/kotlin`에서 `hello.kt` 파일을 [이전 튜토리얼](mapping-struct-union-types-from-c)에서 다음 내용으로 업데이트합니다.

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

2. IntelliJ IDEA의 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 명령을 사용하여 C 함수에 대해 생성된 다음 API로 이동합니다.

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */
   ```

보시다시피 C 함수 포인터는 Kotlin에서 `CPointer<CFunction<...>>`를 사용하여 표현됩니다. `accept_fun()` 함수는 선택적 함수 포인터를 매개변수로 사용하는 반면, `supply_fun()`은 함수 포인터를 반환합니다.

`CFunction<(Int) `->` Int>`는 함수 시그니처를 나타내고, `CPointer<CFunction<...>>?`는 nullable 함수 포인터를 나타냅니다. 모든 `CPointer<CFunction<...>>` 타입에 대해 사용 가능한 `invoke` 연산자 확장 함수가 있으므로, 마치 일반 Kotlin 함수인 것처럼 함수 포인터를 호출할 수 있습니다.

## Kotlin 함수를 C 함수 포인터로 전달

이제 Kotlin 코드에서 C 함수를 사용해 볼 시간입니다. `accept_fun()` 함수를 호출하고 C 함수 포인터를 Kotlin 람다에 전달합니다.

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

이 호출은 Kotlin/Native의 `staticCFunction {}` 헬퍼 함수를 사용하여 Kotlin 람다 함수를 C 함수 포인터로 래핑합니다. 바인딩되지 않고 캡처하지 않는 람다 함수만 허용합니다. 예를 들어 함수의 로컬 변수를 캡처할 수 없고 전역적으로 보이는 선언만 캡처할 수 있습니다.

함수가 예외를 발생시키지 않는지 확인하십시오. `staticCFunction {}`에서 예외를 발생시키면 비결정적인 부작용이 발생합니다.

## Kotlin에서 C 함수 포인터 사용

다음 단계는 `supply_fun()` 호출에서 반환된 C 함수 포인터를 호출하는 것입니다.

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

Kotlin은 함수 포인터 반환 타입을 nullable `CPointer<CFunction<>` 객체로 변환합니다. 먼저 명시적으로 `null`을 확인해야 하므로 위 코드에서 [Elvis 연산자](null-safety)가 사용됩니다.
cinterop 도구를 사용하면 C 함수 포인터를 일반 Kotlin 함수 호출인 `functionFromC(42)`로 호출할 수 있습니다.

## Kotlin 코드 업데이트

이제 모든 정의를 확인했으므로 프로젝트에서 사용해 보십시오.
`hello.kt` 파일의 코드는 다음과 같을 수 있습니다.

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

모든 것이 예상대로 작동하는지 확인하려면 [IDE에서](native-get-started#build-and-run-the-application) `runDebugExecutableNative` Gradle 작업을 실행하거나 다음 명령을 사용하여 코드를 실행합니다.

```bash
./gradlew runDebugExecutableNative
```

## 다음 단계

시리즈의 다음 파트에서는 Kotlin과 C 간에 문자열이 매핑되는 방식을 배웁니다.

**[다음 파트로 진행](mapping-strings-from-c)**

### 참고

더욱 고급 시나리오를 다루는 [C와의 상호 운용성](native-c-interop) 문서에서 자세히 알아보세요.