---
title: "Kotlin에서 JavaScript 코드 사용하기"
---
Kotlin은 Java 플랫폼과의 쉬운 상호 운용을 위해 처음 설계되었습니다. Kotlin은 Java 클래스를 Kotlin 클래스로 간주하고, Java는 Kotlin 클래스를 Java 클래스로 간주합니다.

그러나 JavaScript는 동적 타입 언어이므로 컴파일 시 타입 검사를 수행하지 않습니다. [dynamic](dynamic-type) 타입을 통해 Kotlin에서 JavaScript와 자유롭게 통신할 수 있습니다. Kotlin 타입 시스템의 모든 기능을 사용하려면 Kotlin 컴파일러와 주변 도구가 이해할 수 있는 JavaScript 라이브러리에 대한 외부 선언을 생성할 수 있습니다.

## Inline JavaScript

[`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 함수를 사용하여 JavaScript 코드를 Kotlin 코드에 인라인할 수 있습니다.
예를 들어:

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

`js`의 매개변수는 컴파일 시에 파싱되어 JavaScript 코드로 "있는 그대로" 번역되기 때문에 문자열 상수여야 합니다. 따라서 다음 코드는 올바르지 않습니다.

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

:::note
JavaScript 코드는 Kotlin 컴파일러에 의해 파싱되므로 일부 ECMAScript 기능은 지원되지 않을 수 있습니다.
이 경우 컴파일 오류가 발생할 수 있습니다.

:::

`js()`를 호출하면 컴파일 시 타입 안전성을 제공하지 않는 [`dynamic`](dynamic-type) 타입의 결과가 반환됩니다.

## external modifier

특정 선언이 순수한 JavaScript로 작성되었다는 것을 Kotlin에 알리려면 `external` modifier로 표시해야 합니다.
컴파일러가 이러한 선언을 발견하면 해당 클래스, 함수 또는 속성에 대한 구현이 외부(개발자 또는 [npm dependency](js-project-setup#npm-dependencies)를 통해)에서 제공된다고 가정하고 선언에서 JavaScript 코드를 생성하려고 시도하지 않습니다. 이것이 `external` 선언에 본문이 없는 이유이기도 합니다. 예를 들어:

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

`external` modifier는 중첩된 선언에 상속됩니다. 이것이 예제의 `Node` 클래스에서 멤버 함수 및 속성 앞에 `external` modifier가 없는 이유입니다.

`external` modifier는 패키지 수준 선언에서만 허용됩니다. non-`external` 클래스의 `external` 멤버를 선언할 수 없습니다.

### Declare (static) members of a class

JavaScript에서는 프로토타입 또는 클래스 자체에 멤버를 정의할 수 있습니다.

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin에는 이러한 구문이 없습니다. 그러나 Kotlin에는 [`companion`](object-declarations#companion-objects) objects가 있습니다. Kotlin은 `external` 클래스의 companion object를 특별한 방식으로 처리합니다. 객체를 예상하는 대신 companion object의 멤버가 클래스 자체의 멤버라고 가정합니다. 위의 예제에서 `MyClass`는 다음과 같이 설명할 수 있습니다.

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### Declare optional parameters

선택적 매개변수가 있는 JavaScript 함수에 대한 외부 선언을 작성하는 경우 `definedExternally`를 사용하십시오.
이렇게 하면 기본값 생성이 JavaScript 함수 자체에 위임됩니다.

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

이 외부 선언을 사용하면 하나의 필수 인수와 두 개의 선택적 인수를 사용하여 `myFunWithOptionalArgs`를 호출할 수 있으며, 여기서 기본값은 `myFunWithOptionalArgs`의 JavaScript 구현에 의해 계산됩니다.

### Extend JavaScript classes

JavaScript 클래스를 Kotlin 클래스인 것처럼 쉽게 확장할 수 있습니다. `external open` 클래스를 정의하고 non-`external` 클래스로 확장하십시오. 예를 들어:

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

몇 가지 제한 사항이 있습니다.

- external base 클래스의 함수가 시그니처별로 오버로드되면 파생 클래스에서 재정의할 수 없습니다.
- 기본 인수가 있는 함수를 재정의할 수 없습니다.
- Non-external 클래스는 external 클래스에 의해 확장될 수 없습니다.

### external interfaces

JavaScript에는 인터페이스 개념이 없습니다. 함수가 매개변수가 두 개의 메서드 `foo`와 `bar`를 지원할 것으로 예상하는 경우 실제로 이러한 메서드가 있는 객체를 전달합니다.

인터페이스를 사용하여 정적으로 타입이 지정된 Kotlin에서 이 개념을 표현할 수 있습니다.

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

external interface의 일반적인 사용 사례는 설정 객체를 설명하는 것입니다. 예를 들어:

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) `->` Unit

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
        complete = { (xhr, data) `->`
            window.alert("Request complete")
        }
    })
}
```

External interface에는 몇 가지 제한 사항이 있습니다.

- `is` 검사의 오른쪽에 사용할 수 없습니다.
- Reified 타입 인수로 전달할 수 없습니다.
- 클래스 리터럴 표현식(예: `I::class`)에서 사용할 수 없습니다.
- External interface에 대한 `as` 캐스트는 항상 성공합니다.
    External interface로 캐스팅하면 "Unchecked cast to external interface" 컴파일 시간 경고가 발생합니다. 경고는 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` annotation으로 억제할 수 있습니다.

    IntelliJ IDEA는 `@Suppress` annotation을 자동으로 생성할 수도 있습니다. 전구 아이콘 또는 Alt-Enter를 통해 intentions 메뉴를 열고 "Unchecked cast to external interface" 검사 옆에 있는 작은 화살표를 클릭하십시오. 여기서 억제 범위를 선택하면 IDE가 해당 annotation을 파일에 추가합니다.

### Casts

캐스트가 불가능한 경우 `ClassCastException`을 throw하는 ["unsafe" cast operator](typecasts#unsafe-cast-operator) `as` 외에도 Kotlin/JS는 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)도 제공합니다. `unsafeCast`를 사용하는 경우 런타임 중에 _타입 검사가 전혀 수행되지 않습니다_. 예를 들어 다음 두 가지 방법을 고려하십시오.

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

다음과 같이 컴파일됩니다.

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## Equality

Kotlin/JS는 다른 플랫폼과 비교하여 동등성 검사에 대한 특정 의미 체계를 가지고 있습니다.

Kotlin/JS에서 Kotlin [referential equality](equality#referential-equality) operator(`===`)는 항상 JavaScript [strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) operator(`===`)로 변환됩니다.

JavaScript `===` operator는 두 값이 같은지 뿐만 아니라
이 두 값의 타입이 같은지 확인합니다.

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

또한 Kotlin/JS에서 [`Byte`, `Short`, `Int`, `Float`, 및 `Double`](js-to-kotlin-interop#kotlin-types-in-javascript) 숫자 타입은
런타임에 `Number` JavaScript 타입으로 모두 표현됩니다. 따라서 이러한 다섯 가지 타입의 값은 구별할 수 없습니다.

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Prints 'true' on Kotlin/JS
    // Prints 'false' on other platforms
}
 ```

:::tip
Kotlin의 동등성에 대한 자세한 내용은 [Equality](equality) 문서를 참조하십시오.

:::