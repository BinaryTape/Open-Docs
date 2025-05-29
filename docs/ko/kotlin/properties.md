[//]: # (title: 프로퍼티)

## 프로퍼티 선언

Kotlin 클래스의 프로퍼티는 `var` 키워드를 사용하여 가변으로 선언하거나, `val` 키워드를 사용하여 읽기 전용으로 선언할 수 있습니다.

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

프로퍼티를 사용하려면 단순히 이름으로 참조하면 됩니다:

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // there's no 'new' keyword in Kotlin
    result.name = address.name // accessors are called
    result.street = address.street
    // ...
    return result
}
```

## 게터와 세터

프로퍼티를 선언하는 전체 구문은 다음과 같습니다:

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

초기화 식, 게터, 세터는 선택 사항입니다. 프로퍼티 타입은 아래에 나와 있듯이 초기화 식 또는 게터의 반환 타입으로부터 추론될 수 있다면 선택 사항입니다:

```kotlin
var initialized = 1 // has type Int, default getter and setter
// var allByDefault // ERROR: explicit initializer required, default getter and setter implied
```

읽기 전용 프로퍼티 선언의 전체 구문은 두 가지 방식으로 가변 프로퍼티와 다릅니다: `var` 대신 `val`로 시작하고 세터를 허용하지 않습니다:

```kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```

프로퍼티에 대한 커스텀 접근자를 정의할 수 있습니다. 커스텀 게터를 정의하면 프로퍼티에 접근할 때마다 호출됩니다(이런 방식으로 계산된 프로퍼티를 구현할 수 있습니다). 다음은 커스텀 게터의 예시입니다:

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // property type is optional since it can be inferred from the getter's return type
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

게터로부터 추론될 수 있다면 프로퍼티 타입을 생략할 수 있습니다:

```kotlin
val area get() = this.width * this.height
```

커스텀 세터를 정의하면 초기화를 제외하고 프로퍼티에 값을 할당할 때마다 호출됩니다. 커스텀 세터는 다음과 같습니다:

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // parses the string and assigns values to other properties
    }
```

관례적으로 세터 파라미터의 이름은 `value`이지만, 원한다면 다른 이름을 선택할 수 있습니다.

접근자에 애너테이션을 달거나 가시성을 변경해야 하지만, 기본 구현을 변경하고 싶지 않다면, 본문을 정의하지 않고 접근자를 정의할 수 있습니다:

```kotlin
var setterVisibility: String = "abc"
    private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
    @Inject set // annotate the setter with Inject
```

### 백킹 필드

Kotlin에서 필드는 프로퍼티의 일부로만 사용되어 메모리에 값을 저장합니다. 필드는 직접 선언할 수 없습니다. 하지만 프로퍼티에 백킹 필드가 필요한 경우 Kotlin이 자동으로 제공합니다. 이 백킹 필드는 접근자에서 `field` 식별자를 사용하여 참조할 수 있습니다:

```kotlin
var counter = 0 // the initializer assigns the backing field directly
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: Using actual name 'counter' would make setter recursive
    }
```

`field` 식별자는 프로퍼티의 접근자 안에서만 사용할 수 있습니다.

프로퍼티에 대한 백킹 필드는 접근자 중 적어도 하나의 기본 구현을 사용하거나, 커스텀 접근자가 `field` 식별자를 통해 이를 참조하는 경우에 생성됩니다.

예를 들어, 다음 경우에는 백킹 필드가 없습니다:

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 백킹 프로퍼티

이 _암시적 백킹 필드_ 스키마에 맞지 않는 작업을 수행하려면 언제든지 _백킹 프로퍼티_를 사용하는 방법으로 돌아갈 수 있습니다:

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // Type parameters are inferred
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> JVM에서는: 기본 게터와 세터를 가진 비공개 프로퍼티에 대한 접근은 함수 호출 오버헤드를 피하기 위해 최적화됩니다.
>
{style="note"}

## 컴파일 타임 상수

읽기 전용 프로퍼티의 값이 컴파일 타임에 알려져 있다면, `const` 한정자를 사용하여 _컴파일 타임 상수_로 표시합니다. 이러한 프로퍼티는 다음 요구 사항을 충족해야 합니다:

*   최상위 프로퍼티이거나, [`object` 선언](object-declarations.md#object-declarations-overview) 또는 _[컴패니언 객체](object-declarations.md#companion-objects)_의 멤버여야 합니다.
*   `String` 타입 또는 기본 타입 값으로 초기화되어야 합니다.
*   커스텀 게터일 수 없습니다.

컴파일러는 상수의 사용을 인라인하여 상수에 대한 참조를 실제 값으로 대체합니다. 하지만 필드는 제거되지 않으므로 [리플렉션](reflection.md)을 사용하여 상호작용할 수 있습니다.

이러한 프로퍼티는 애너테이션에서도 사용될 수 있습니다:

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTypeEM_DEPRECATED) fun foo() { ... }
```

## 지연 초기화 프로퍼티 및 변수

일반적으로 널 불가능 타입으로 선언된 프로퍼티는 생성자에서 초기화되어야 합니다. 그러나 그렇게 하는 것이 편리하지 않은 경우가 종종 있습니다. 예를 들어, 프로퍼티는 의존성 주입을 통해 또는 단위 테스트의 설정 메서드에서 초기화될 수 있습니다. 이러한 경우 생성자에서 널 불가능 초기화 식을 제공할 수 없지만, 클래스 본문 내에서 프로퍼티를 참조할 때 여전히 널 검사를 피하고 싶을 수 있습니다.

이러한 경우를 처리하기 위해 `lateinit` 한정자를 사용하여 프로퍼티를 표시할 수 있습니다:

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // dereference directly
    }
}
```

이 한정자는 클래스 본문 내에 선언된 `var` 프로퍼티(주 생성자에서는 안 되며, 프로퍼티에 커스텀 게터나 세터가 없을 때만 해당)는 물론, 최상위 프로퍼티 및 지역 변수에도 사용할 수 있습니다. 프로퍼티 또는 변수의 타입은 널 불가능이어야 하며, 기본 타입이 아니어야 합니다.

`lateinit` 프로퍼티가 초기화되기 전에 접근하면 접근되는 프로퍼티와 초기화되지 않았다는 사실을 명확하게 식별하는 특별한 예외가 발생합니다.

### lateinit var가 초기화되었는지 확인하기

`lateinit var`가 이미 초기화되었는지 확인하려면 해당 [프로퍼티에 대한 참조](reflection.md#property-references)에 `.isInitialized`를 사용하십시오:

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

이 검사는 동일한 타입, 외부 타입 중 하나 또는 동일한 파일의 최상위에서 선언되어 어휘적으로 접근 가능한 프로퍼티에 대해서만 사용할 수 있습니다.

## 프로퍼티 재정의

[프로퍼티 재정의](inheritance.md#overriding-properties)를 참조하십시오.

## 위임된 프로퍼티

가장 일반적인 종류의 프로퍼티는 단순히 백킹 필드에서 읽거나(그리고 아마도 쓰거나) 사용하지만, 커스텀 게터와 세터를 사용하면 프로퍼티가 어떤 종류의 동작이든 구현할 수 있도록 허용합니다. 첫 번째 종류의 단순성과 두 번째 종류의 다양성 중간에는 프로퍼티가 수행할 수 있는 일반적인 패턴이 있습니다. 몇 가지 예시: 지연 값, 주어진 키로 맵에서 읽기, 데이터베이스 접근, 접근 시 리스너에게 알림.

이러한 일반적인 동작은 [위임된 프로퍼티](delegated-properties.md)를 사용하여 라이브러리로 구현될 수 있습니다.