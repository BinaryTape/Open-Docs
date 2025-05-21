---
title: 속성
---
## 프로퍼티 선언

Kotlin 클래스에서 프로퍼티는 `var` 키워드를 사용하여 변경 가능하게 선언하거나 `val` 키워드를 사용하여 읽기 전용으로 선언할 수 있습니다.

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

프로퍼티를 사용하려면 간단히 해당 이름으로 참조하면 됩니다:

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlin에는 'new' 키워드가 없습니다.
    result.name = address.name // 접근자가 호출됩니다.
    result.street = address.street
    // ...
    return result
}
```

## Getter와 Setter

프로퍼티를 선언하는 전체 구문은 다음과 같습니다:

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

초기화, getter 및 setter는 선택 사항입니다. 프로퍼티 타입은 초기화 또는 getter의 반환 타입에서 추론할 수 있는 경우 선택 사항입니다.
아래에 표시된 대로:

```kotlin
var initialized = 1 // 타입은 Int이며, 기본 getter 및 setter를 가집니다.
// var allByDefault // ERROR: 명시적 초기화가 필요하며, 기본 getter 및 setter가 암시됩니다.
```

읽기 전용 프로퍼티 선언의 전체 구문은 변경 가능한 프로퍼티와 두 가지 방식으로 다릅니다: `var` 대신 `val`로 시작하고 setter를 허용하지 않습니다:

```kotlin
val simple: Int? // 타입은 Int이며, 기본 getter를 가지며, 생성자에서 초기화해야 합니다.
val inferredType = 1 // 타입은 Int이며, 기본 getter를 가집니다.
```

프로퍼티에 대한 사용자 정의 접근자를 정의할 수 있습니다. 사용자 정의 getter를 정의하면 프로퍼티에 접근할 때마다 호출됩니다 (이러한 방식으로 계산된 프로퍼티를 구현할 수 있습니다). 다음은 사용자 정의 getter의 예입니다:

```kotlin

class Rectangle(val width: Int, val height: Int) {
    val area: Int // getter의 반환 타입에서 추론할 수 있으므로 프로퍼티 타입은 선택 사항입니다.
        get() = this.width * this.height
}

fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```

getter에서 타입을 추론할 수 있는 경우 프로퍼티 타입을 생략할 수 있습니다:

```kotlin
val area get() = this.width * this.height
```

사용자 정의 setter를 정의하면 초기화를 제외하고 프로퍼티에 값을 할당할 때마다 호출됩니다.
사용자 정의 setter는 다음과 같습니다:

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 문자열을 파싱하고 다른 프로퍼티에 값을 할당합니다.
    }
```

관례에 따라 setter 매개변수의 이름은 `value`이지만, 원하는 경우 다른 이름을 선택할 수 있습니다.

접근자에 어노테이션을 달거나 가시성을 변경해야 하지만 기본 구현을 변경하고 싶지 않은 경우,
본문을 정의하지 않고 접근자를 정의할 수 있습니다:

```kotlin
var setterVisibility: String = "abc"
    private set // setter는 private이며 기본 구현을 가집니다.

var setterWithAnnotation: Any? = null
    @Inject set // setter에 Inject 어노테이션을 답니다.
```

### Backing Fields (뒷받침 필드)

Kotlin에서 필드는 메모리에서 값을 보유하기 위해 프로퍼티의 일부로만 사용됩니다. 필드는 직접 선언할 수 없습니다.
그러나 프로퍼티에 뒷받침 필드가 필요한 경우 Kotlin은 자동으로 제공합니다. 이 뒷받침 필드는
`field` 식별자를 사용하여 접근자에서 참조할 수 있습니다:

```kotlin
var counter = 0 // 초기화 프로그램은 뒷받침 필드를 직접 할당합니다.
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: 실제 이름 'counter'를 사용하면 setter가 재귀적이 됩니다.
    }
```

`field` 식별자는 프로퍼티의 접근자에서만 사용할 수 있습니다.

뒷받침 필드는 하나 이상의 접근자의 기본 구현을 사용하거나, 사용자 정의 접근자가 `field` 식별자를 통해 참조하는 경우 프로퍼티에 대해 생성됩니다.

예를 들어, 다음 경우에는 뒷받침 필드가 없습니다:

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### Backing Properties (뒷받침 프로퍼티)

이러한 _암시적 뒷받침 필드_ 체계에 맞지 않는 작업을 수행하려는 경우, 언제든지
_뒷받침 프로퍼티_를 사용할 수 있습니다:

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 타입 매개변수가 추론됩니다.
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

:::note
JVM에서: 기본 getter 및 setter가 있는 private 프로퍼티에 대한 접근은 함수 호출 오버헤드를 피하기 위해 최적화됩니다.

:::

## Compile-time Constants (컴파일 시간 상수)

읽기 전용 프로퍼티의 값을 컴파일 시간에 알 수 있는 경우 `const` 수정자를 사용하여 _컴파일 시간 상수_로 표시합니다.
이러한 프로퍼티는 다음 요구 사항을 충족해야 합니다:

* 최상위 프로퍼티이거나 [`object` 선언](object-declarations#object-declarations-overview) 또는 _[컴패니언 객체](object-declarations#companion-objects)_의 멤버여야 합니다.
* `String` 타입 또는 primitive 타입의 값으로 초기화해야 합니다.
* 사용자 정의 getter일 수 없습니다.

컴파일러는 상수의 사용을 인라인하여 상수 참조를 실제 값으로 대체합니다. 그러나 필드는 제거되지 않으므로 [리플렉션](reflection)을 사용하여 상호 작용할 수 있습니다.

이러한 프로퍼티는 어노테이션에도 사용할 수 있습니다:

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## Late-initialized Properties and Variables (늦게 초기화되는 프로퍼티 및 변수)

일반적으로 널이 될 수 없는 타입으로 선언된 프로퍼티는 생성자에서 초기화해야 합니다.
그러나 그렇게 하는 것이 편리하지 않은 경우가 많습니다. 예를 들어, 프로퍼티는 종속성
주입을 통해 초기화하거나 단위 테스트의 설정 메서드에서 초기화할 수 있습니다. 이러한 경우 생성자에서 널이 될 수 없는 초기화 프로그램을 제공할 수 없지만,
클래스 본문 내에서 프로퍼티를 참조할 때 null 검사를 피하고 싶을 수 있습니다.

이러한 경우를 처리하기 위해 `lateinit` 수정자로 프로퍼티를 표시할 수 있습니다:

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 직접 역참조
    }
}
```

이 수정자는 클래스 본문 내에서 선언된 `var` 프로퍼티 (기본 생성자가 아닌 경우,
그리고 프로퍼티에 사용자 정의 getter 또는 setter가 없는 경우)와 최상위 프로퍼티 및 지역 변수에 사용할 수 있습니다.
프로퍼티 또는 변수의 타입은 널이 될 수 없어야 하며, primitive 타입이 아니어야 합니다.

초기화되기 전에 `lateinit` 프로퍼티에 접근하면 접근되는 프로퍼티와 초기화되지 않았다는 사실을 명확하게 식별하는 특수 예외가 발생합니다.

### Checking whether a lateinit var is initialized (`lateinit var`가 초기화되었는지 확인)

`lateinit var`가 이미 초기화되었는지 확인하려면 [해당 프로퍼티에 대한 참조](reflection#property-references)에서 `.isInitialized`를 사용하십시오:

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

이 검사는 동일한 타입, 외부 타입 중 하나 또는 동일한 파일의 최상위 레벨에서 선언될 때 어휘적으로 접근할 수 있는 프로퍼티에만 사용할 수 있습니다.

## Overriding Properties (프로퍼티 오버라이딩)

[프로퍼티 오버라이딩](inheritance#overriding-properties)을 참조하십시오.

## Delegated Properties (위임된 프로퍼티)

가장 일반적인 종류의 프로퍼티는 단순히 뒷받침 필드에서 읽거나 (쓰기) 쓰지만, 사용자 정의 getter 및 setter를 사용하면 프로퍼티를 사용하여 프로퍼티의 모든 종류의 동작을 구현할 수 있습니다.
첫 번째 종류의 단순성과 두 번째 종류의 다양성 사이 어딘가에, 프로퍼티가 할 수 있는 일에 대한 공통 패턴이 있습니다. 몇 가지 예: lazy 값, 주어진 키로 맵에서 읽기, 데이터베이스에 접근, 접근 시 리스너에 알림.

이러한 일반적인 동작은 [위임된 프로퍼티](delegated-properties)를 사용하여 라이브러리로 구현할 수 있습니다.