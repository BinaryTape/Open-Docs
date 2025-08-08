[//]: # (title: 위임된 프로퍼티)

일부 일반적인 종류의 프로퍼티는 필요할 때마다 수동으로 구현할 수도 있지만, 한 번 구현하여 라이브러리에 추가하고 나중에 재사용하는 것이 더 유용합니다. 예를 들어:

*   _지연(lazy)_ 프로퍼티: 값은 첫 접근 시에만 계산됩니다.
*   _관찰 가능(observable)_ 프로퍼티: 이 프로퍼티의 변경 사항에 대해 리스너에게 알립니다.
*   각 프로퍼티에 대해 별도의 필드를 사용하는 대신 _맵(map)_ 에 프로퍼티를 저장합니다.

이러한 (및 다른) 경우를 다루기 위해 Kotlin은 _위임된 프로퍼티_ 를 지원합니다.

```kotlin
class Example {
    var p: String by Delegate()
}
```

문법은 다음과 같습니다: `val/var <property name>: <Type> by <expression>`. `by` 뒤의 표현식은 _델리게이트_ 입니다. 이는 프로퍼티에 해당하는 `get()` (및 `set()`)이 해당 `getValue()` 및 `setValue()` 메서드로 위임되기 때문입니다. 프로퍼티 델리게이트는 인터페이스를 구현할 필요는 없지만, `getValue()` 함수를 제공해야 하며 (`var`의 경우 `setValue()`도 제공해야 합니다).

예를 들어:

```kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```

`Delegate` 인스턴스에 위임하는 `p`에서 값을 읽을 때, `Delegate`의 `getValue()` 함수가 호출됩니다. 첫 번째 파라미터는 `p`를 읽어오는 객체이며, 두 번째 파라미터는 `p` 자체에 대한 설명을 담고 있습니다 (예를 들어, 그 이름을 가져올 수 있습니다).

```kotlin
val e = Example()
println(e.p)
```

이것은 다음을 출력합니다:

```
Example@33a17727, thank you for delegating 'p' to me!
```

마찬가지로 `p`에 값을 할당할 때 `setValue()` 함수가 호출됩니다. 첫 두 파라미터는 동일하며, 세 번째는 할당되는 값을 담고 있습니다:

```kotlin
e.p = "NEW"
```

이것은 다음을 출력합니다:
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

위임된 객체의 요구사항에 대한 명세는 [아래](#property-delegate-requirements)에서 찾을 수 있습니다.

함수나 코드 블록 내부에 위임된 프로퍼티를 선언할 수 있습니다. 클래스의 멤버일 필요는 없습니다. 아래에서 [예제](#local-delegated-properties)를 찾을 수 있습니다.

## 표준 델리게이트

Kotlin 표준 라이브러리는 몇 가지 유용한 종류의 델리게이트에 대한 팩토리 메서드를 제공합니다.

### 지연(lazy) 프로퍼티

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)는 람다를 인수로 받아 `Lazy<T>` 인스턴스를 반환하는 함수이며, 지연 프로퍼티 구현을 위한 델리게이트 역할을 할 수 있습니다. `get()`에 대한 첫 호출은 `lazy()`에 전달된 람다를 실행하고 그 결과를 기억합니다. 이후의 `get()` 호출은 단순히 기억된 결과를 반환합니다.

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main() {
    println(lazyValue)
    println(lazyValue)
}
```
{kotlin-runnable="true"}

기본적으로 지연 프로퍼티의 평가는 *동기화됩니다*: 값은 하나의 스레드에서만 계산되지만, 모든 스레드는 동일한 값을 보게 됩니다. 여러 스레드가 동시에 실행할 수 있도록 초기화 델리게이트의 동기화가 필요하지 않은 경우, `lazy()`에 `LazyThreadSafetyMode.PUBLICATION`을 파라미터로 전달하십시오.

프로퍼티를 사용하는 스레드와 동일한 스레드에서 초기화가 항상 발생한다고 확신한다면, `LazyThreadSafetyMode.NONE`을 사용할 수 있습니다. 이는 스레드 안정성 보장이나 관련 오버헤드를 발생시키지 않습니다.

### 관찰 가능(observable) 프로퍼티

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html)은 두 가지 인수를 받습니다: 초기 값과 수정 사항에 대한 핸들러입니다.

핸들러는 프로퍼티에 값을 할당할 때마다 호출됩니다 (*할당이 수행된 후*). 세 가지 파라미터가 있습니다: 할당되는 프로퍼티, 이전 값, 그리고 새 값입니다:

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```
{kotlin-runnable="true"}

할당을 가로채고 *거부(veto)* 하고 싶다면, `observable()` 대신 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html)을 사용하십시오. `vetoable`에 전달된 핸들러는 새 프로퍼티 값이 할당되기 *전에* 호출됩니다.

## 다른 프로퍼티로 위임

프로퍼티는 자신의 게터와 세터를 다른 프로퍼티에 위임할 수 있습니다. 이러한 위임은 최상위 프로퍼티와 클래스 프로퍼티(멤버 및 확장) 모두에 사용할 수 있습니다. 델리게이트 프로퍼티는 다음 중 하나일 수 있습니다:
*   최상위 프로퍼티
*   동일 클래스의 멤버 또는 확장 프로퍼티
*   다른 클래스의 멤버 또는 확장 프로퍼티

프로퍼티를 다른 프로퍼티에 위임하려면, 델리게이트 이름에 `::` 한정자(qualifier)를 사용합니다. 예를 들어, `this::delegate` 또는 `MyClass::delegate`와 같이 사용합니다.

```kotlin
var topLevelInt: Int = 0
class ClassWithDelegate(val anotherClassInt: Int)

class MyClass(var memberInt: Int, val anotherClassInstance: ClassWithDelegate) {
    var delegatedToMember: Int by this::memberInt
    var delegatedToTopLevel: Int by ::topLevelInt
    
    val delegatedToAnotherClass: Int by anotherClassInstance::anotherClassInt
}
var MyClass.extDelegated: Int by ::topLevelInt
```

이것은 예를 들어 프로퍼티 이름을 이전 버전과 호환되는 방식으로 변경하고 싶을 때 유용할 수 있습니다: 새 프로퍼티를 도입하고, 이전 프로퍼티에 `@Deprecated` 어노테이션을 붙인 다음, 구현을 위임합니다.

```kotlin
class MyClass {
   var newName: Int = 0
   @Deprecated("Use 'newName' instead", ReplaceWith("newName"))
   var oldName: Int by this::newName
}
fun main() {
   val myClass = MyClass()
   // Notification: 'oldName: Int' is deprecated.
   // Use 'newName' instead
   myClass.oldName = 42
   println(myClass.newName) // 42
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## 맵에 프로퍼티 저장

한 가지 일반적인 사용 사례는 프로퍼티의 값을 맵에 저장하는 것입니다. 이는 JSON 파싱이나 다른 동적 작업을 수행하는 애플리케이션에서 자주 발생합니다. 이 경우, 맵 인스턴스 자체를 위임된 프로퍼티의 델리게이트로 사용할 수 있습니다.

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

이 예시에서 생성자는 맵을 인수로 받습니다:

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

위임된 프로퍼티는 이 맵에서 프로퍼티 이름과 연결된 문자열 키를 통해 값을 가져옵니다:

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}

fun main() {
    val user = User(mapOf(
        "name" to "John Doe",
        "age"  to 25
    ))
//sampleStart
    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25
//sampleEnd
}
```
{kotlin-runnable="true"}

이는 읽기 전용 `Map` 대신 `MutableMap`을 사용하는 경우 `var` 프로퍼티에도 적용됩니다:

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 지역 위임된 프로퍼티

지역 변수를 위임된 프로퍼티로 선언할 수 있습니다. 예를 들어, 지역 변수를 지연(lazy)되도록 만들 수 있습니다:

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 변수는 첫 접근 시에만 계산됩니다. `someCondition`이 실패하면, 해당 변수는 전혀 계산되지 않습니다.

## 프로퍼티 델리게이트 요구사항

*읽기 전용* 프로퍼티(`val`)의 경우, 델리게이트는 다음 파라미터를 가진 연산자 함수 `getValue()`를 제공해야 합니다:

*   `thisRef`는 *프로퍼티 소유자*와 동일한 타입이거나 그 슈퍼타입이어야 합니다 (확장 프로퍼티의 경우, 확장되는 타입이어야 합니다).
*   `property`는 `KProperty<*>` 타입이거나 그 슈퍼타입이어야 합니다.

`getValue()`는 프로퍼티와 동일한 타입(또는 그 서브타입)을 반환해야 합니다.

```kotlin
class Resource

class Owner {
    val valResource: Resource by ResourceDelegate()
}

class ResourceDelegate {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return Resource()
    }
}
```

*가변* 프로퍼티(`var`)의 경우, 델리게이트는 추가적으로 다음 파라미터를 가진 연산자 함수 `setValue()`를 제공해야 합니다:

*   `thisRef`는 *프로퍼티 소유자*와 동일한 타입이거나 그 슈퍼타입이어야 합니다 (확장 프로퍼티의 경우, 확장되는 타입이어야 합니다).
*   `property`는 `KProperty<*>` 타입이거나 그 슈퍼타입이어야 합니다.
*   `value`는 프로퍼티와 동일한 타입(또는 그 슈퍼타입)이어야 합니다.
 
```kotlin
class Resource

class Owner {
    var varResource: Resource by ResourceDelegate()
}

class ResourceDelegate(private var resource: Resource = Resource()) {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return resource
    }
    operator fun setValue(thisRef: Owner, property: KProperty<*>, value: Any?) {
        if (value is Resource) {
            resource = value
        }
    }
}
```

`getValue()` 및/또는 `setValue()` 함수는 델리게이트 클래스의 멤버 함수로 또는 확장 함수로 제공될 수 있습니다. 후자는 이러한 함수를 원래 제공하지 않는 객체에 프로퍼티를 위임해야 할 때 유용합니다. 두 함수 모두 `operator` 키워드로 표시되어야 합니다.

Kotlin 표준 라이브러리의 `ReadOnlyProperty` 및 `ReadWriteProperty` 인터페이스를 사용하여 새 클래스를 만들지 않고 익명 객체로 델리게이트를 생성할 수 있습니다. 이들은 필요한 메서드를 제공합니다: `getValue()`는 `ReadOnlyProperty`에 선언되어 있으며; `ReadWriteProperty`는 이를 확장하여 `setValue()`를 추가합니다. 이는 `ReadOnlyProperty`가 예상되는 모든 곳에 `ReadWriteProperty`를 전달할 수 있음을 의미합니다.

```kotlin
fun resourceDelegate(resource: Resource = Resource()): ReadWriteProperty<Any?, Resource> =
    object : ReadWriteProperty<Any?, Resource> {
        var curValue = resource 
        override fun getValue(thisRef: Any?, property: KProperty<*>): Resource = curValue
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: Resource) {
            curValue = value
        }
    }

val readOnlyResource: Resource by resourceDelegate()  // ReadWriteProperty as val
var readWriteResource: Resource by resourceDelegate()
```

## 위임된 프로퍼티의 번역 규칙

내부적으로 Kotlin 컴파일러는 일부 종류의 위임된 프로퍼티에 대해 보조 프로퍼티를 생성한 다음 이들에게 위임합니다.

> 최적화를 위해 컴파일러는 여러 경우에 보조 프로퍼티를 *생성하지 않습니다*.[#optimized-cases-for-delegated-properties]
> [다른 프로퍼티로 위임](#translation-rules-when-delegating-to-another-property) 예시에서 최적화에 대해 알아보세요.
>
{style="note"}

예를 들어, `prop` 프로퍼티에 대해 숨겨진 프로퍼티 `prop$delegate`를 생성하며, 접근자 코드는 단순히 이 추가 프로퍼티에 위임합니다:

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler instead:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlin 컴파일러는 `prop`에 대한 모든 필요한 정보를 인수에 제공합니다: 첫 번째 인수 `this`는 외부 클래스 `C`의 인스턴스를 참조하며, `this::prop`은 `prop` 자체를 설명하는 `KProperty` 타입의 리플렉션 객체입니다.

### 위임된 프로퍼티에 대한 최적화된 경우

델리게이트가 다음 중 하나인 경우 `$delegate` 필드는 생략됩니다:
*   참조된 프로퍼티:

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

*   이름 있는 객체:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

*   동일 모듈 내에 백킹 필드와 기본 게터를 가진 최종 `val` 프로퍼티:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

*   상수 표현식, enum 엔트리, `this`, `null`. `this`의 예시:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 다른 프로퍼티로 위임 시 번역 규칙

다른 프로퍼티로 위임할 때, Kotlin 컴파일러는 참조된 프로퍼티에 대한 즉각적인 접근을 생성합니다. 이는 컴파일러가 `prop$delegate` 필드를 생성하지 않음을 의미합니다. 이러한 최적화는 메모리 절약에 도움이 됩니다.

예를 들어, 다음 코드를 살펴보십시오:

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 변수의 프로퍼티 접근자는 위임된 프로퍼티의 `getValue` 및 `setValue` 연산자를 건너뛰고 `impl` 변수를 직접 호출하므로, `KProperty` 참조 객체가 필요하지 않습니다.

위 코드에 대해 컴파일러는 다음 코드를 생성합니다:

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // This method is needed only for reflection
}
```

## 델리게이트 제공

`provideDelegate` 연산자를 정의하여 프로퍼티 구현이 위임될 객체를 생성하는 로직을 확장할 수 있습니다. `by`의 오른쪽에 사용된 객체가 `provideDelegate`를 멤버 또는 확장 함수로 정의하는 경우, 해당 함수가 프로퍼티 델리게이트 인스턴스를 생성하기 위해 호출됩니다.

`provideDelegate`의 가능한 사용 사례 중 하나는 프로퍼티 초기화 시 일관성을 확인하는 것입니다.

예를 들어, 바인딩 전에 프로퍼티 이름을 확인하려면 다음과 같이 작성할 수 있습니다:

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}
    
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
            thisRef: MyUI,
            prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        // create delegate
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate`의 파라미터는 `getValue`의 파라미터와 동일합니다:

*   `thisRef`는 _프로퍼티 소유자_와 동일한 타입이거나 그 슈퍼타입이어야 합니다 (확장 프로퍼티의 경우, 확장되는 타입이어야 합니다);
*   `property`는 `KProperty<*>` 타입이거나 그 슈퍼타입이어야 합니다.

`MyUI` 인스턴스 생성 중 각 프로퍼티에 대해 `provideDelegate` 메서드가 호출되며, 즉시 필요한 유효성 검사를 수행합니다.

프로퍼티와 델리게이트 간의 바인딩을 가로챌 수 있는 이 기능이 없다면, 동일한 기능을 달성하기 위해 프로퍼티 이름을 명시적으로 전달해야 하는데, 이는 그다지 편리하지 않습니다:

```kotlin
// Checking the property name without "provideDelegate" functionality
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
    checkProperty(this, propertyName)
    // create delegate
}
```

생성된 코드에서 `provideDelegate` 메서드는 보조 `prop$delegate` 프로퍼티를 초기화하기 위해 호출됩니다. 프로퍼티 선언 `val prop: Type by MyDelegate()`에 대한 생성된 코드를 (`provideDelegate` 메서드가 없을 때) [위](#translation-rules-for-delegated-properties)의 생성된 코드와 비교해 보십시오:

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler 
// when the 'provideDelegate' function is available:
class C {
    // calling "provideDelegate" to create the additional "delegate" property
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

`provideDelegate` 메서드는 보조 프로퍼티의 생성에만 영향을 미치며 게터 또는 세터에 대해 생성된 코드에는 영향을 미치지 않습니다.

표준 라이브러리의 `PropertyDelegateProvider` 인터페이스를 사용하면 새 클래스를 만들지 않고도 델리게이트 제공자를 생성할 수 있습니다.

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider