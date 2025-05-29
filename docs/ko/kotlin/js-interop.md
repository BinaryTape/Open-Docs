[//]: # (title: Kotlin에서 JavaScript 코드 사용하기)

Kotlin은 Java 플랫폼과의 쉬운 상호 운용을 위해 처음 설계되었습니다. Kotlin은 Java 클래스를 Kotlin 클래스로, Java는 Kotlin 클래스를 Java 클래스로 간주합니다.

하지만 JavaScript는 동적 타입 언어이므로 컴파일 시 타입 검사를 수행하지 않습니다. Kotlin에서는 `dynamic` 타입을 통해 JavaScript와 자유롭게 상호작용할 수 있습니다. Kotlin 타입 시스템의 모든 기능을 사용하려면, Kotlin 컴파일러와 주변 도구에서 이해할 수 있는 JavaScript 라이브러리에 대한 외부 선언을 생성할 수 있습니다.

## 인라인 JavaScript

`js()` 함수를 사용하여 JavaScript 코드를 Kotlin 코드에 인라인으로 포함할 수 있습니다. 예를 들어:

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

`js` 함수의 매개변수는 컴파일 시점에 파싱되어 JavaScript 코드로 "있는 그대로" 변환되므로, 문자열 상수여야 합니다. 따라서 다음 코드는 올바르지 않습니다:

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

> Kotlin 컴파일러가 JavaScript 코드를 파싱하므로, 모든 ECMAScript 기능이 지원되지 않을 수 있습니다. 이 경우 컴파일 오류가 발생할 수 있습니다.
>
{style="note"}

`js()`를 호출하면 컴파일 시점에 타입 안전성을 제공하지 않는 `dynamic` 타입의 결과가 반환된다는 점에 유의하세요.

## external 변경자

Kotlin에게 특정 선언이 순수 JavaScript로 작성되었다고 알리려면, 해당 선언을 `external` 변경자로 표시해야 합니다. 컴파일러가 이러한 선언을 보면, 해당 클래스, 함수 또는 프로퍼티의 구현이 외부(개발자에 의해 또는 [npm 의존성](js-project-setup.md#npm-dependencies)을 통해)에서 제공된다고 가정하므로, 해당 선언으로부터 JavaScript 코드를 생성하려고 시도하지 않습니다. 이것이 `external` 선언이 본문(body)을 가질 수 없는 이유이기도 합니다. 예를 들어:

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}

external val window: Window
```

`external` 변경자는 중첩 선언에 의해 상속된다는 점에 유의하세요. 이것이 예제의 `Node` 클래스에서 멤버 함수와 프로퍼티 앞에 `external` 변경자가 없는 이유입니다.

`external` 변경자는 패키지 레벨 선언에서만 허용됩니다. 비-`external` 클래스의 `external` 멤버를 선언할 수 없습니다.

### 클래스의 (정적) 멤버 선언하기

JavaScript에서는 프로토타입 또는 클래스 자체에 멤버를 정의할 수 있습니다.

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin에는 그러한 문법이 없습니다. 하지만 Kotlin에는 [컴패니언 객체](object-declarations.md#companion-objects)가 있습니다. Kotlin은 `external` 클래스의 컴패니언 객체를 특별한 방식으로 처리합니다. 즉, 객체를 예상하는 대신 컴패니언 객체의 멤버를 클래스 자체의 멤버로 가정합니다. 위 예제의 `MyClass`는 다음과 같이 설명할 수 있습니다:

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 선택적 매개변수 선언하기

선택적 매개변수를 가지는 JavaScript 함수에 대한 외부 선언을 작성하는 경우, `definedExternally`를 사용하세요. 이는 기본값 생성을 JavaScript 함수 자체에 위임합니다:

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

이 외부 선언을 통해 `myFunWithOptionalArgs`를 하나의 필수 인자와 두 개의 선택적 인자로 호출할 수 있으며, 이 경우 기본값은 `myFunWithOptionalArgs`의 JavaScript 구현에 의해 계산됩니다.

### JavaScript 클래스 확장하기

JavaScript 클래스를 마치 Kotlin 클래스인 것처럼 쉽게 확장할 수 있습니다. `external open` 클래스를 정의한 다음 비-`external` 클래스로 확장하기만 하면 됩니다. 예를 들어:

```kotlin
open external class Foo {
    open fun run()
    fun stop()
}

class Bar : Foo() {
    override fun run() {
        window.alert("Running!")
    }

    fun restart() {
        window.alert("Restarting")
    }
}
```

몇 가지 제한 사항이 있습니다:

- 외부 기본 클래스의 함수가 시그니처로 오버로드된 경우, 파생 클래스에서 이를 오버라이드할 수 없습니다.
- 기본 인자가 있는 함수를 오버라이드할 수 없습니다.
- 비-`external` 클래스는 `external` 클래스에 의해 확장될 수 없습니다.

### 외부 인터페이스

JavaScript에는 인터페이스 개념이 없습니다. 함수가 매개변수로 `foo`와 `bar` 두 메서드를 지원하기를 기대할 때, 해당 메서드를 실제로 가지고 있는 객체를 전달하기만 하면 됩니다.

정적 타입 Kotlin에서 이 개념을 표현하기 위해 인터페이스를 사용할 수 있습니다:

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

외부 인터페이스의 일반적인 사용 사례는 설정 객체를 설명하는 것입니다. 예를 들어:

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

    // etc
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

외부 인터페이스에는 몇 가지 제약 사항이 있습니다:

- `is` 검사의 오른쪽에 사용할 수 없습니다.
- 실체화된(reified) 타입 인자로 전달될 수 없습니다.
- 클래스 리터럴 표현식(`I::class`와 같은)에서 사용할 수 없습니다.
- 외부 인터페이스로의 `as` 캐스트는 항상 성공합니다.
  외부 인터페이스로의 캐스트는 "외부 인터페이스로의 안전하지 않은 캐스트(Unchecked cast to external interface)" 컴파일 시간 경고를 발생시킵니다. 이 경고는 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 어노테이션으로 억제할 수 있습니다.

  IntelliJ IDEA는 또한 `@Suppress` 어노테이션을 자동으로 생성할 수 있습니다. 전구 아이콘 또는 Alt-Enter를 통해 인텐션(intentions) 메뉴를 열고, "외부 인터페이스로의 안전하지 않은 캐스트(Unchecked cast to external interface)" 검사 옆의 작은 화살표를 클릭하세요. 여기서 억제 범위를 선택할 수 있으며, IDE가 그에 따라 파일에 어노테이션을 추가할 것입니다.

## 캐스트

캐스트가 불가능할 경우 `ClassCastException`을 발생시키는 ["안전하지 않은" 캐스트 연산자](typecasts.md#unsafe-cast-operator) `as` 외에도, Kotlin/JS는 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)를 제공합니다. `unsafeCast`를 사용할 때, 런타임에는 _전혀 타입 검사가 수행되지 않습니다_. 예를 들어, 다음 두 메서드를 고려해 보세요:

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

이들은 그에 따라 컴파일됩니다:

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 동등성

Kotlin/JS는 다른 플랫폼과 비교하여 동등성 검사에 대한 고유한 의미를 가집니다.

Kotlin/JS에서 Kotlin의 [참조 동등성](equality.md#referential-equality) 연산자(`===`)는 항상 JavaScript의 [엄격한 동등성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) 연산자(`===`)로 변환됩니다.

JavaScript `===` 연산자는 두 값이 동일한지 뿐만 아니라 두 값의 타입도 동일한지 확인합니다:

```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // Prints 'yes' on Kotlin/JS
    // Prints 'no' on other platforms
}
```

또한 Kotlin/JS에서 [`Byte`, `Short`, `Int`, `Float`, `Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript) 숫자 타입은 모두 런타임에 JavaScript의 `Number` 타입으로 표현됩니다. 따라서 이 다섯 가지 타입의 값은 구별할 수 없습니다:

```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Prints 'true' on Kotlin/JS
    // Prints 'false' on other platforms
}
```

> Kotlin의 동등성에 대한 더 자세한 정보는 [동등성](equality.md) 문서를 참조하세요.
>
{style="tip"}