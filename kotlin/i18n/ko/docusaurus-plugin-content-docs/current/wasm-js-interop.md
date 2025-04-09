---
title: "JavaScript와의 상호 운용성"
---
Kotlin/Wasm에서는 Kotlin에서 JavaScript 코드를 사용하고 JavaScript에서 Kotlin 코드를 사용할 수 있습니다.

[Kotlin/JS](js-overview)와 마찬가지로 Kotlin/Wasm 컴파일러도 JavaScript와의 상호 운용성을 제공합니다. Kotlin/JS 상호 운용성에 익숙하다면 Kotlin/Wasm 상호 운용성이 유사하다는 것을 알 수 있습니다. 그러나 고려해야 할 중요한 차이점이 있습니다.

:::note
Kotlin/Wasm은 [Alpha](components-stability) 버전입니다. 언제든지 변경될 수 있습니다. 프로덕션 환경 이전 단계에서 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에서 피드백을 보내주시면 감사하겠습니다.

:::

## Kotlin에서 JavaScript 코드 사용하기

`external` 선언, JavaScript 코드 스니펫이 포함된 함수 및 `@JsModule` 어노테이션을 사용하여 Kotlin에서 JavaScript 코드를 사용하는 방법을 알아봅니다.

### External 선언

External JavaScript 코드는 기본적으로 Kotlin에서 표시되지 않습니다.
Kotlin에서 JavaScript 코드를 사용하려면 `external` 선언을 사용하여 해당 API를 설명할 수 있습니다.

#### JavaScript 함수

다음 JavaScript 함수를 고려해 보세요.

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

Kotlin에서 `external` 함수로 선언할 수 있습니다.

```kotlin
external fun greet(name: String)
```

External 함수에는 본문이 없으며 일반 Kotlin 함수로 호출할 수 있습니다.

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 속성

다음과 같은 전역 JavaScript 변수를 고려해 보세요.

```javascript
let globalCounter = 0;
```

External `var` 또는 `val` 속성을 사용하여 Kotlin에서 선언할 수 있습니다.

```kotlin
external var globalCounter: Int
```

이러한 속성은 외부에서 초기화됩니다. Kotlin 코드에서 속성에 `= value` 초기화자를 사용할 수 없습니다.

#### JavaScript 클래스

다음 JavaScript 클래스를 고려해 보세요.

```javascript
class Rectangle {
    constructor (height, width) {
        this.height = height;
        this.width = width;
    }

    area () {
        return this.height * this.width;
    }
}
```

Kotlin에서 external 클래스로 사용할 수 있습니다.

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 클래스 내부의 모든 선언은 암시적으로 external로 간주됩니다.

#### External 인터페이스

Kotlin에서 JavaScript 객체의 형태를 설명할 수 있습니다. 다음 JavaScript 함수와 해당 반환 값을 고려해 보세요.

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

`external interface User` 유형을 사용하여 Kotlin에서 해당 형태를 설명하는 방법을 확인하세요.

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

External 인터페이스에는 런타임 유형 정보가 없으며 컴파일 시간 전용 개념입니다.
따라서 external 인터페이스에는 일반 인터페이스에 비해 몇 가지 제한 사항이 있습니다.
* `is` 검사의 오른쪽에 사용할 수 없습니다.
* 클래스 리터럴 식(예: `User::class`)에서 사용할 수 없습니다.
* 구체화된 유형 인수로 전달할 수 없습니다.
* `as`를 사용하여 external 인터페이스로 캐스팅하면 항상 성공합니다.

#### External 객체

객체를 보유하는 다음 JavaScript 변수를 고려해 보세요.

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

Kotlin에서 external 객체로 사용할 수 있습니다.

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### External 유형 계층 구조

일반 클래스 및 인터페이스와 유사하게 external 선언이 다른 external 클래스를 확장하고 external 인터페이스를 구현하도록 선언할 수 있습니다.
그러나 동일한 유형 계층 구조에서 external 선언과 non-external 선언을 혼합할 수는 없습니다.

### JavaScript 코드가 포함된 Kotlin 함수

`= js("code")` 본문으로 함수를 정의하여 JavaScript 스니펫을 Kotlin/Wasm 코드에 추가할 수 있습니다.

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

JavaScript 문의 블록을 실행하려면 문자열 내부에서 코드를 중괄호 `{}`로 묶습니다.

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

객체를 반환하려면 중괄호 `{}`를 괄호 `()`로 묶습니다.

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm은 `js()` 함수 호출을 특별한 방식으로 처리하며 구현에는 몇 가지 제한 사항이 있습니다.
* `js()` 함수 호출에는 문자열 리터럴 인수가 제공되어야 합니다.
* `js()` 함수 호출은 함수 본문에서 유일한 표현식이어야 합니다.
* `js()` 함수는 패키지 수준 함수에서만 호출할 수 있습니다.
* [유형](#type-correspondence)은 `external fun`과 유사하게 제한됩니다.

Kotlin 컴파일러는 코드 문자열을 생성된 JavaScript 파일의 함수에 넣고 WebAssembly 형식으로 가져옵니다.
Kotlin 컴파일러는 이러한 JavaScript 스니펫을 확인하지 않습니다.
JavaScript 구문 오류가 있는 경우 JavaScript 코드를 실행할 때 보고됩니다.

:::note
`@JsFun` 어노테이션은 유사한 기능을 가지며 더 이상 사용되지 않을 수 있습니다.

:::

### JavaScript 모듈

기본적으로 external 선언은 JavaScript 전역 범위에 해당합니다. Kotlin 파일을
[`@JsModule` 어노테이션](js-modules#jsmodule-annotation)으로 어노테이션하면 그 안에 있는 모든 external 선언이 지정된 모듈에서 가져옵니다.

다음 JavaScript 코드 샘플을 고려해 보세요.

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

`@JsModule` 어노테이션을 사용하여 Kotlin에서 이 JavaScript 코드를 사용합니다.

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### 배열 상호 운용성

JavaScript의 `JsArray<T>`를 Kotlin의 기본 `Array` 또는 `List` 유형으로 복사할 수 있습니다. 마찬가지로 이러한 Kotlin 유형을 `JsArray<T>`로 복사할 수 있습니다.

`JsArray<T>`를 `Array<T>`로 또는 그 반대로 변환하려면 사용 가능한 [어댑터 함수](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt) 중 하나를 사용하세요.

다음은 일반 유형 간의 변환 예입니다.

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// .toJsArray()를 사용하여 List 또는 Array를 JsArray로 변환합니다.
val jsArray: JsArray<JsString> = list.toJsArray()

// .toArray() 및 .toList()를 사용하여 Kotlin 유형으로 다시 변환합니다.
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

유형화된 배열을 해당 Kotlin 배열(예: `IntArray` 및 `Int32Array`)로 변환하는 데 사용할 수 있는 유사한 어댑터 함수가 있습니다. 자세한 정보와 구현은 [`kotlinx-browser` 리포지토리](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)를 참조하세요.

다음은 유형화된 배열 간의 변환 예입니다.

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // .toInt32Array()를 사용하여 Kotlin IntArray를 JavaScript Int32Array로 변환합니다.
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // toIntArray()를 사용하여 JavaScript Int32Array를 다시 Kotlin IntArray로 변환합니다.
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## JavaScript에서 Kotlin 코드 사용하기

`@JsExport` 어노테이션을 사용하여 JavaScript에서 Kotlin 코드를 사용하는 방법을 알아봅니다.

### @JsExport 어노테이션이 있는 함수

Kotlin/Wasm 함수를 JavaScript 코드에서 사용할 수 있도록 하려면 `@JsExport` 어노테이션을 사용합니다.

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

`@JsExport` 어노테이션으로 표시된 Kotlin/Wasm 함수는 생성된 `.mjs` 모듈의 `default` 내보내기의 속성으로 표시됩니다.
그런 다음 JavaScript에서 이 함수를 사용할 수 있습니다.

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 컴파일러는 Kotlin 코드의 모든 `@JsExport` 선언에서 TypeScript 정의를 생성할 수 있습니다.
이러한 정의는 IDE 및 JavaScript 도구에서 코드 자동 완성 기능을 제공하고 유형 검사를 지원하며 JavaScript 및 TypeScript에서 Kotlin 코드를 더 쉽게 사용할 수 있도록 하는 데 사용할 수 있습니다.

Kotlin/Wasm 컴파일러는 `@JsExport` 어노테이션으로 표시된 모든 최상위 함수를 수집하고 `.d.ts` 파일에 TypeScript 정의를 자동으로 생성합니다.

TypeScript 정의를 생성하려면 `build.gradle.kts` 파일의 `wasmJs{}` 블록에서 `generateTypeScriptDefinitions()` 함수를 추가합니다.

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

:::note
Kotlin/Wasm에서 TypeScript 선언 파일 생성은 [Experimental](components-stability#stability-levels-explained) 기능입니다.
언제든지 삭제되거나 변경될 수 있습니다.

## 유형 대응

Kotlin/Wasm은 JavaScript interop 선언의 서명에서 특정 유형만 허용합니다.
이러한 제한 사항은 `external`, `= js("code")` 또는 `@JsExport`가 있는 선언에 동일하게 적용됩니다.

Kotlin 유형이 Javascript 유형에 어떻게 대응하는지 확인하세요.

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                          |
| `Float`, `Double`,                                         | `Number`                          |
| `Long`, `ULong`,                                           | `BigInt`                          |
| `Boolean`,                                                 | `Boolean`                         |
| `String`,                                                  | `String`                          |
| 반환 위치의 `Unit`                                  | `undefined`                       |
| 함수 유형(예: `(String) `->` Int`)               | Function                          |
| `JsAny` 및 하위 유형                                       | 모든 JavaScript 값              |
| `JsReference`                                              | Kotlin 객체에 대한 불투명 참조 |
| 기타 유형                                                | 지원되지 않음                     |

이러한 유형의 nullable 버전을 사용할 수도 있습니다.

### JsAny 유형

JavaScript 값은 Kotlin에서 `JsAny` 유형과 해당 하위 유형을 사용하여 표현됩니다.

Kotlin/Wasm 표준 라이브러리는 이러한 유형 중 일부에 대한 표현을 제공합니다.
* 패키지 `kotlin.js`:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`

`external` 인터페이스 또는 클래스를 선언하여 사용자 지정 `JsAny` 하위 유형을 만들 수도 있습니다.

### JsReference 유형

Kotlin 값은 `JsReference` 유형을 사용하여 불투명 참조로 JavaScript에 전달할 수 있습니다.

예를 들어 이 Kotlin 클래스 `User`를 JavaScript에 노출하려는 경우:

```kotlin
class User(var name: String)
```

`toJsReference()` 함수를 사용하여 `JsReference<User>`를 만들고 JavaScript에 반환할 수 있습니다.

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

이러한 참조는 JavaScript에서 직접 사용할 수 없으며 비어 있는 고정된 JavaScript 객체처럼 동작합니다.
이러한 객체에서 작동하려면 참조 값을 래핑 해제하는 `get()` 메서드를 사용하여 더 많은 함수를 JavaScript로 내보내야 합니다.

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

JavaScript에서 클래스를 만들고 이름을 변경할 수 있습니다.

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 유형 매개변수

JavaScript interop 선언에는 `JsAny` 또는 해당 하위 유형의 상한이 있는 경우 유형 매개변수가 있을 수 있습니다. 예를 들어:

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 예외 처리

Kotlin `try-catch` 표현식을 사용하여 JavaScript 예외를 catch할 수 있습니다.
그러나 Kotlin/Wasm에서 throw된 값에 대한 특정 세부 정보에 액세스하는 것은 기본적으로 불가능합니다.

JavaScript에서 원래 오류 메시지 및 스택 추적을 포함하도록 `JsException` 유형을 구성할 수 있습니다.
이렇게 하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가합니다.

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

이 동작은 특정 브라우저에서만 사용할 수 있는 `WebAssembly.JSTag` API에 따라 다릅니다.

* **Chrome:** 버전 115부터 지원
* **Firefox:** 버전 129부터 지원
* **Safari:** 아직 지원되지 않음

다음은 이 동작을 보여주는 예입니다.

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // 전체 JavaScript 스택 추적을 인쇄합니다.
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception` 컴파일러 옵션을 사용하면 `JsException` 유형이 JavaScript 오류에서 특정 세부 정보를 제공합니다.
이 컴파일러 옵션을 사용하지 않으면 `JsException`에는 JavaScript 코드를 실행하는 동안 예외가 throw되었다는 일반적인 메시지만 포함됩니다.

JavaScript `try-catch` 표현식을 사용하여 Kotlin/Wasm 예외를 catch하려고 하면
직접 액세스할 수 있는 메시지 및 데이터가 없는 일반 `WebAssembly.Exception`처럼 보입니다.

## Kotlin/Wasm과 Kotlin/JS 상호 운용성 차이점

<a name="differences"/>

Kotlin/Wasm 상호 운용성은 Kotlin/JS 상호 운용성과 유사하지만 고려해야 할 중요한 차이점이 있습니다.

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **External 열거형**      | external 열거형 클래스를 지원하지 않습니다.                                                                                                                                                                              | external 열거형 클래스를 지원합니다.                                                                                                                     |
| **유형 확장**     | non-external 유형이 external 유형을 확장하는 것을 지원하지 않습니다.                                                                                                                                                        | non-external 유형을 지원합니다.                                                                                                                        |
| **`JsName` 어노테이션** | external 선언에 어노테이션을 적용할 때만 효과가 있습니다.                                                                                                                                                           | 일반적인 non-external 선언의 이름을 변경하는 데 사용할 수 있습니다.                                                                                   |
| **`js()` 함수**       | `js("code")` 함수 호출은 패키지 수준 함수의 단일 표현식 본문으로 허용됩니다.                                                                                                                                                    | `js("code")` 함수는 모든 컨텍스트에서 호출할 수 있으며 `dynamic` 값을 반환합니다.                                                               |
| **모듈 시스템**      | ES 모듈만 지원합니다. `@JsNonModule` 어노테이션과 유사한 기능은 없습니다. 내보내기를 `default` 객체의 속성으로 제공합니다. 패키지 수준 함수만 내보낼 수 있습니다.                           | ES 모듈 및 레거시 모듈 시스템을 지원합니다. 명명된 ESM 내보내기를 제공합니다. 클래스 및 객체를 내보낼 수 있습니다.                                    |
| **유형**               | 모든 interop 선언(`external`, `= js("code")` 및 `@JsExport`)에 대해 더 엄격한 유형 제한을 적용합니다. [기본 제공 Kotlin 유형 및 `JsAny` 하위 유형](#type-correspondence)을 선택한 횟수를 허용합니다. | `external` 선언에서 모든 유형을 허용합니다. [`@JsExport`에서 사용할 수 있는 유형](js-to-kotlin-interop#kotlin-types-in-javascript)을 제한합니다. |
| **Long**                | 유형은 JavaScript `BigInt`에 해당합니다.                                                                                                                                                                            | JavaScript에서 사용자 지정 클래스로 표시됩니다.                                                                                                            |
| **배열**              | 아직 interop에서 직접 지원되지 않습니다. 대신 새 `JsArray` 유형을 사용할 수 있습니다.                                                                                                                                  | JavaScript 배열로 구현됩니다.                                                                                                                   |
| **기타 유형**         | Kotlin 객체를 JavaScript에 전달하려면 `JsReference<>`가 필요합니다.                                                                                                                                                      | external 선언에서 non-external Kotlin 클래스 유형을 사용할 수 있습니다.                                                                         |
| **예외 처리**  | `JsException` 및 `Throwable` 유형으로 JavaScript 예외를 catch할 수 있습니다.                                                                                                                                | `Throwable` 유형을 사용하여 JavaScript `Error`를 catch할 수 있습니다. `dynamic` 유형을 사용하여 JavaScript 예외를 catch할 수 있습니다.                            |
| **동적 유형**       | `dynamic` 유형을 지원하지 않습니다. 대신 `JsAny`를 사용합니다(아래 샘플 코드 참조).                                                                                                                                   | `dynamic` 유형을 지원합니다.                                                                                                                        |

유형이 지정되지 않았거나 느슨하게 유형이 지정된 객체와의 상호 운용성을 위한 Kotlin/JS [동적 유형](dynamic-type)은
Kotlin/Wasm에서는 지원되지 않습니다. `dynamic` 유형 대신 `JsAny` 유형을 사용할 수 있습니다.

```kotlin
// Kotlin/JS
fun processUser(user: dynamic, age: Int) {
    // ...
    user.profile.updateAge(age)
    // ...
}

// Kotlin/Wasm
private fun updateUserAge(user: JsAny, age: Int): Unit =
    js("{ user.profile.updateAge(age); }")

fun processUser(user: JsAny, age: Int) {
    // ...
    updateUserAge(user, age)
    // ...
}
```

:::

## 웹 관련 브라우저 API

[`kotlinx-browser` 라이브러리](https://github.com/kotlin/kotlinx-browser)는 독립 실행형
다음과 같은 JavaScript 브라우저 API를 제공하는 라이브러리입니다.
* 패키지 `org.khronos.webgl`:
  * `Int8Array`와 같은 유형화된 배열.
  * WebGL 유형.
* 패키지 `org.w3c.dom.*`:
  * DOM API 유형.
* 패키지 `kotlinx.browser`:
  * `window` 및 `document`와 같은 DOM API 전역 객체.

`kotlinx-browser` 라이브러리의 선언을 사용하려면 프로젝트의
빌드 구성 파일에서 종속성으로 추가합니다.

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```