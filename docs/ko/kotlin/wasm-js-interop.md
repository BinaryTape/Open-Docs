[//]: # (title: JavaScript와의 상호 운용성)

Kotlin/Wasm을 사용하면 Kotlin에서 JavaScript 코드를 사용하고 JavaScript에서 Kotlin 코드를 사용할 수 있습니다.

[Kotlin/JS](js-overview.md)와 마찬가지로 Kotlin/Wasm 컴파일러도 JavaScript와의 상호 운용성을 제공합니다. Kotlin/JS 상호 운용성에 익숙하다면 Kotlin/Wasm 상호 운용성이 유사하다는 것을 알 수 있습니다. 하지만 고려해야 할 주요 차이점이 있습니다.

> Kotlin/Wasm은 [알파](components-stability.md)입니다. 언제든지 변경될 수 있습니다. 프로덕션 이전 시나리오에서 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)에 피드백을 주시면 감사하겠습니다.
>
{style="note"}

## Kotlin에서 JavaScript 코드 사용하기

`external` 선언, JavaScript 코드 스니펫이 포함된 함수, `@JsModule` 어노테이션을 사용하여 Kotlin에서 JavaScript 코드를 사용하는 방법을 알아봅니다.

### 외부 선언

외부 JavaScript 코드는 기본적으로 Kotlin에서 보이지 않습니다.
Kotlin에서 JavaScript 코드를 사용하려면 `external` 선언으로 해당 API를 기술할 수 있습니다.

#### JavaScript 함수

다음 JavaScript 함수를 고려해 보십시오.

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

이를 Kotlin에서 `external` 함수로 선언할 수 있습니다.

```kotlin
external fun greet(name: String)
```

외부 함수는 본문이 없으며, 일반적인 Kotlin 함수처럼 호출할 수 있습니다.

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 속성

다음 전역 JavaScript 변수를 고려해 보십시오.

```javascript
let globalCounter = 0;
```

이를 Kotlin에서 `external` `var` 또는 `val` 속성을 사용하여 선언할 수 있습니다.

```kotlin
external var globalCounter: Int
```

이러한 속성은 외부에서 초기화됩니다. 이 속성들은 Kotlin 코드에서 `= value` 초기화자를 가질 수 없습니다.

#### JavaScript 클래스

다음 JavaScript 클래스를 고려해 보십시오.

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

이를 Kotlin에서 외부 클래스로 사용할 수 있습니다.

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 클래스 내부의 모든 선언은 암시적으로 외부로 간주됩니다.

#### 외부 인터페이스

Kotlin에서 JavaScript 객체의 형태를 기술할 수 있습니다. 다음 JavaScript 함수와 반환되는 값을 고려해 보십시오.

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

`external interface User` 타입을 사용하여 Kotlin에서 해당 형태를 기술하는 방법을 살펴보십시오.

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

외부 인터페이스는 런타임 타입 정보를 갖지 않으며 컴파일 타임 전용 개념입니다.
따라서 외부 인터페이스는 일반 인터페이스와 비교하여 일부 제약 사항을 가집니다.
* `is` 검사의 우측에 사용할 수 없습니다.
* 클래스 리터럴 표현식(예: `User::class`)에서 사용할 수 없습니다.
* reified 타입 인수로 전달할 수 없습니다.
* `as`를 사용하여 외부 인터페이스로 캐스팅하는 것은 항상 성공합니다.

#### 외부 객체

객체를 담고 있는 다음 JavaScript 변수를 고려해 보십시오.

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

이를 Kotlin에서 외부 객체로 사용할 수 있습니다.

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 외부 타입 계층

일반 클래스 및 인터페이스와 유사하게, 다른 외부 클래스를 확장하고 외부 인터페이스를 구현하도록 외부 선언을 선언할 수 있습니다.
하지만 동일한 타입 계층에서 외부 선언과 비(非)외부 선언을 혼합할 수 없습니다.

### JavaScript 코드가 포함된 Kotlin 함수

`= js("code")` 본문을 가진 함수를 정의하여 Kotlin/Wasm 코드에 JavaScript 스니펫을 추가할 수 있습니다.

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

JavaScript 문 블록을 실행하고 싶다면 문자열 내부의 코드를 중괄호 `{}`로 감싸십시오.

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

객체를 반환하고 싶다면 중괄호 `{}`를 괄호 `()`로 감싸십시오.

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm은 `js()` 함수 호출을 특별한 방식으로 처리하며, 구현에는 몇 가지 제약 사항이 있습니다.
* `js()` 함수 호출은 문자열 리터럴 인수로 제공되어야 합니다.
* `js()` 함수 호출은 함수 본문의 유일한 표현식이어야 합니다.
* `js()` 함수는 패키지 수준 함수에서만 호출할 수 있습니다.
* 함수 반환 타입은 명시적으로 제공되어야 합니다.
* `external fun`과 유사하게 [타입](#type-correspondence)은 제한됩니다.

Kotlin 컴파일러는 코드 문자열을 생성된 JavaScript 파일의 함수에 넣고 WebAssembly 형식으로 임포트합니다.
Kotlin 컴파일러는 이러한 JavaScript 스니펫을 검증하지 않습니다.
JavaScript 구문 오류가 있는 경우 JavaScript 코드를 실행할 때 보고됩니다.

> `@JsFun` 어노테이션은 유사한 기능을 가지며 조만간 더 이상 사용되지 않을 가능성이 있습니다.
>
{style="note"}

### JavaScript 모듈

기본적으로 외부 선언은 JavaScript 전역 스코프에 해당합니다. Kotlin 파일을 [`@JsModule` 어노테이션](js-modules.md#jsmodule-annotation)으로 어노테이션하면 그 안에 있는 모든 외부 선언은 지정된 모듈에서 임포트됩니다.

다음 JavaScript 코드 예시를 고려해 보십시오.

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

`@JsModule` 어노테이션을 사용하여 Kotlin에서 이 JavaScript 코드를 사용하십시오.

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

JavaScript의 `JsArray<T>`를 Kotlin의 네이티브 `Array` 또는 `List` 타입으로 복사할 수 있으며, 마찬가지로 이러한 Kotlin 타입을 `JsArray<T>`로 복사할 수 있습니다.

`JsArray<T>`를 `Array<T>`로 또는 그 반대로 변환하려면 사용 가능한 [어댑터 함수](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt) 중 하나를 사용하십시오.

다음은 제네릭 타입 간의 변환 예시입니다.

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

유사한 어댑터 함수를 사용하여 타입이 지정된 배열을 해당 Kotlin 등가물(예: `IntArray` 및 `Int32Array`)로 변환할 수 있습니다. 자세한 정보 및 구현은 [`kotlinx-browser` 저장소](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)를 참조하십시오.

다음은 타입이 지정된 배열 간의 변환 예시입니다.

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## JavaScript에서 Kotlin 코드 사용하기

`@JsExport` 어노테이션을 사용하여 JavaScript에서 Kotlin 코드를 사용하는 방법을 알아봅니다.

### @JsExport 어노테이션이 포함된 함수

Kotlin/Wasm 함수를 JavaScript 코드에서 사용할 수 있도록 하려면 `@JsExport` 어노테이션을 사용하십시오.

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

`@JsExport` 어노테이션으로 표시된 Kotlin/Wasm 함수는 생성된 `.mjs` 모듈의 `default` export에서 속성으로 표시됩니다.
그런 다음 JavaScript에서 이 함수를 사용할 수 있습니다.

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 컴파일러는 Kotlin 코드의 모든 `@JsExport` 선언에서 TypeScript 정의를 생성할 수 있습니다.
이러한 정의는 IDE 및 JavaScript 도구에서 코드 자동 완성, 타입 검사 지원, JavaScript 및 TypeScript에서 Kotlin 코드 사용을 더 쉽게 만들기 위해 사용될 수 있습니다.

Kotlin/Wasm 컴파일러는 `@JsExport` 어노테이션으로 표시된 모든 최상위 함수를 수집하고 `.d.ts` 파일에 TypeScript 정의를 자동으로 생성합니다.

TypeScript 정의를 생성하려면 `build.gradle.kts` 파일의 `wasmJs{}` 블록에 `generateTypeScriptDefinitions()` 함수를 추가하십시오.

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

> Kotlin/Wasm에서 TypeScript 선언 파일 생성은 [실험적](components-stability.md#stability-levels-explained) 기능입니다. 언제든지 중단되거나 변경될 수 있습니다.
>
{style="warning"}

## 타입 대응

Kotlin/Wasm은 JavaScript 상호 운용성 선언의 시그니처에서 특정 타입만 허용합니다.
이러한 제한은 `external`, `= js("code")` 또는 `@JsExport`를 가진 선언에 균일하게 적용됩니다.

Kotlin 타입이 JavaScript 타입에 어떻게 대응하는지 살펴보십시오.

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                          |
| `Float`, `Double`,                                         | `Number`                          |
| `Long`, `ULong`,                                           | `BigInt`                          |
| `Boolean`,                                                 | `Boolean`                         |
| `String`,                                                  | `String`                          |
| 반환 위치의 `Unit`                                          | `undefined`                       |
| 함수 타입, 예: `(String) -> Int`                           | `Function`                        |
| `JsAny` 및 서브타입                                       | 모든 JavaScript 값              |
| `JsReference`                                              | Kotlin 객체에 대한 불투명한 참조 |
| 기타 타입                                                  | 지원되지 않음                     |

이러한 타입의 nullable 버전도 사용할 수 있습니다.

### JsAny 타입

JavaScript 값은 Kotlin에서 `JsAny` 타입 및 해당 서브타입을 사용하여 표현됩니다.

Kotlin/Wasm 표준 라이브러리는 이러한 타입 중 일부에 대한 표현을 제공합니다.
* `kotlin.js` 패키지:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`

`external` 인터페이스 또는 클래스를 선언하여 사용자 지정 `JsAny` 서브타입을 생성할 수도 있습니다.

### JsReference 타입

Kotlin 값은 `JsReference` 타입을 사용하여 불투명한 참조로 JavaScript에 전달될 수 있습니다.

예를 들어, 이 Kotlin 클래스 `User`를 JavaScript에 노출하고 싶다면:

```kotlin
class User(var name: String)
```

`toJsReference()` 함수를 사용하여 `JsReference<User>`를 생성하고 JavaScript로 반환할 수 있습니다.

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

이러한 참조는 JavaScript에서 직접 사용할 수 없으며 비어 있는 고정(frozen) JavaScript 객체처럼 작동합니다.
이러한 객체를 조작하려면 참조 값을 언랩(unwrap)하는 `get()` 메서드를 사용하여 더 많은 함수를 JavaScript로 export해야 합니다.

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

JavaScript에서 클래스를 생성하고 이름을 변경할 수 있습니다.

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 타입 매개변수

JavaScript 상호 운용성 선언은 `JsAny` 또는 해당 서브타입의 상한(upper bound)을 가지는 경우 타입 매개변수를 가질 수 있습니다. 예를 들어:

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 예외 처리

JavaScript 예외를 catch하기 위해 Kotlin의 `try-catch` 표현식을 사용할 수 있습니다.
하지만 Kotlin/Wasm에서 던져진 값에 대한 특정 세부 정보를 기본적으로 액세스하는 것은 불가능합니다.

`JsException` 타입이 JavaScript로부터 원본 오류 메시지 및 스택 트레이스를 포함하도록 구성할 수 있습니다.
그렇게 하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하십시오.

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

이 동작은 `WebAssembly.JSTag` API에 따라 달라지며, 이 API는 특정 브라우저에서만 사용할 수 있습니다.

* `Chrome`: 버전 115부터 지원
* `Firefox`: 버전 129부터 지원
* `Safari`: 아직 지원되지 않습니다.

다음은 이 동작을 보여주는 예시입니다.

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

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception` 컴파일러 옵션을 활성화하면 `JsException` 타입은 JavaScript 오류로부터 특정 세부 정보를 제공합니다.
이 컴파일러 옵션을 활성화하지 않으면 `JsException`은 JavaScript 코드를 실행하는 동안 예외가 발생했다는 일반적인 메시지만 포함합니다.

Kotlin/Wasm 예외를 catch하기 위해 JavaScript `try-catch` 표현식을 사용하려고 하면 직접 액세스할 수 있는 메시지 및 데이터 없이 일반적인 `WebAssembly.Exception`처럼 보입니다.

## Kotlin/Wasm과 Kotlin/JS 상호 운용성 차이점

Kotlin/Wasm 상호 운용성은 Kotlin/JS 상호 운용성과 유사성을 공유하지만, 고려해야 할 주요 차이점이 있습니다.

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **외부 Enum**      | 외부 enum 클래스를 지원하지 않습니다.                                                                                                                                                                              | 외부 enum 클래스를 지원합니다.                                                                                                                     |
| **타입 확장**     | 비(非)외부 타입이 외부 타입을 확장하는 것을 지원하지 않습니다.                                                                                                                                                        | 비(非)외부 타입을 지원합니다.                                                                                                                        |
| **`JsName` 어노테이션** | 외부 선언에 어노테이션을 적용할 때만 효과가 있습니다.                                                                                                                                                           | 일반 비(非)외부 선언의 이름을 변경하는 데 사용할 수 있습니다.                                                                                   |
| **`js()` 함수**       | `js("code")` 함수 호출은 패키지 수준 함수의 단일 표현식 본문으로 허용됩니다.                                                                                                                     | `js("code")` 함수는 모든 컨텍스트에서 호출할 수 있으며 `dynamic` 값을 반환합니다.                                                               |
| **모듈 시스템**      | ES 모듈만 지원합니다. `@JsNonModule` 어노테이션과 유사한 것이 없습니다. `default` 객체의 속성으로 export를 제공합니다. 패키지 수준 함수만 export할 수 있습니다.                           | ES 모듈 및 레거시 모듈 시스템을 지원합니다. 명명된 ESM export를 제공합니다. 클래스 및 객체 export를 허용합니다.                                    |
| **타입**               | 모든 상호 운용성 선언인 `external`, `= js("code")`, `@JsExport`에 대해 균일하게 더 엄격한 타입 제한을 적용합니다. 선택된 수의 [내장 Kotlin 타입 및 `JsAny` 서브타입](#type-correspondence)을 허용합니다. | `external` 선언에서는 모든 타입을 허용합니다. [`@JsExport`에서 사용할 수 있는 타입](js-to-kotlin-interop.md#kotlin-types-in-javascript)을 제한합니다. |
| **Long**                | 타입이 JavaScript `BigInt`에 대응됩니다.                                                                                                                                                                            | JavaScript에서 사용자 지정 클래스로 표시됩니다.                                                                                                            |
| **배열**              | 상호 운용성에서 아직 직접 지원되지 않습니다. 대신 새로운 `JsArray` 타입을 사용할 수 있습니다.                                                                                                                                  | JavaScript 배열로 구현됩니다.                                                                                                                   |
| **기타 타입**         | Kotlin 객체를 JavaScript에 전달하려면 `JsReference<>`가 필요합니다.                                                                                                                                                      | 외부 선언에서 비(非)외부 Kotlin 클래스 타입을 사용할 수 있습니다.                                                                         |
| **예외 처리**  | `JsException` 및 `Throwable` 타입으로 모든 JavaScript 예외를 catch할 수 있습니다.                                                                                                                                | `Throwable` 타입을 사용하여 JavaScript `Error`를 catch할 수 있습니다. `dynamic` 타입을 사용하여 모든 JavaScript 예외를 catch할 수 있습니다.                            |
| **동적 타입**       | `dynamic` 타입을 지원하지 않습니다. 대신 `JsAny` 타입을 사용하십시오(아래 샘플 코드 참조).                                                                                                                                   | `dynamic` 타입을 지원합니다.                                                                                                                        |

> Kotlin/Wasm에서는 타입이 지정되지 않았거나 느슨하게 타입이 지정된 객체와의 상호 운용을 위한 Kotlin/JS [동적 타입](dynamic-type.md)을 지원하지 않습니다. `dynamic` 타입 대신 `JsAny` 타입을 사용할 수 있습니다:
>
> ```kotlin
> // Kotlin/JS
> fun processUser(user: dynamic, age: Int) {
>     // ...
>     user.profile.updateAge(age)
>     // ...
> }
>
> // Kotlin/Wasm
> private fun updateUserAge(user: JsAny, age: Int): Unit =
>     js("{ user.profile.updateAge(age); }")
>
> fun processUser(user: JsAny, age: Int) {
>     // ...
>     updateUserAge(user, age)
>     // ...
> }
> ```
>
{style="note"}

## 웹 관련 브라우저 API

[`kotlinx-browser` 라이브러리](https://github.com/kotlin/kotlinx-browser)는 JavaScript 브라우저 API를 제공하는 독립형 라이브러리로, 다음을 포함합니다.
* `org.khronos.webgl` 패키지:
  * 타입이 지정된 배열, 예: `Int8Array`.
  * WebGL 타입.
* `org.w3c.dom.*` 패키지:
  * DOM API 타입.
* `kotlinx.browser` 패키지:
  * DOM API 전역 객체, 예: `window` 및 `document`.

`kotlinx-browser` 라이브러리의 선언을 사용하려면 프로젝트의 빌드 구성 파일에 종속성으로 추가하십시오.

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```