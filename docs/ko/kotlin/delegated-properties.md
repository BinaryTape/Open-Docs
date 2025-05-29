[//]: # (title: 위임된 프로퍼티)

일부 일반적인 종류의 프로퍼티는 필요할 때마다 수동으로 구현할 수 있지만,
한 번 구현하여 라이브러리에 추가한 다음 나중에 재사용하는 것이 더 유용합니다. 예를 들면 다음과 같습니다:

*   _지연 초기화(Lazy)_ 프로퍼티: 값은 첫 접근 시에만 계산됩니다.
*   _관찰 가능한(Observable)_ 프로퍼티: 이 프로퍼티의 변경 사항에 대해 리스너에게 알립니다.
*   각 프로퍼티에 대해 별도의 필드 대신 _맵(map)_에 프로퍼티를 저장합니다.

이러한 (및 기타) 경우를 처리하기 위해 Kotlin은 _위임된 프로퍼티(delegated properties)_를 지원합니다:

```kotlin
class Example {
    var p: String by Delegate()
}
```

문법은 다음과 같습니다: `val/var <property name>: <Type> by <expression>`. `by` 뒤의 표현식은 _델리게이트(delegate)_입니다. 왜냐하면 프로퍼티에 해당하는 `get()` (및 `set()`)이 델리게이트의 `getValue()` 및 `setValue()` 메서드에 위임되기 때문입니다.
프로퍼티 델리게이트는 인터페이스를 구현할 필요는 없지만, `getValue()` 함수(및 `var`의 경우 `setValue()`)를 제공해야 합니다.

예를 들면 다음과 같습니다:

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

`Delegate` 인스턴스에 위임된 `p`에서 읽을 때, `Delegate`의 `getValue()` 함수가 호출됩니다.
첫 번째 매개변수는 `p`를 읽는 객체이며, 두 번째 매개변수는 `p` 자체에 대한 설명(예: 이름)을 담고 있습니다.

```kotlin
val e = Example()
println(e.p)
```

다음과 같이 출력됩니다:

```
Example@33a17727, thank you for delegating 'p' to me!
```

마찬가지로, `p`에 값을 할당할 때 `setValue()` 함수가 호출됩니다. 처음 두 매개변수는 동일하며, 세 번째는 할당되는 값을 담고 있습니다:

```kotlin
e.p = "NEW"
```

다음과 같이 출력됩니다:
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

위임된 객체에 대한 요구 사항 명세는 [아래](#property-delegate-requirements)에서 찾을 수 있습니다.

함수나 코드 블록 내에서 위임된 프로퍼티를 선언할 수 있습니다. 클래스의 멤버일 필요는 없습니다.
아래에서 [예시](#local-delegated-properties)를 찾을 수 있습니다.

## 표준 델리게이트

Kotlin 표준 라이브러리는 여러 유용한 종류의 델리게이트를 위한 팩토리 메서드를 제공합니다.

### 지연 초기화 프로퍼티

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)는 람다를 인수로 받아 `Lazy<T>` 인스턴스를 반환하는 함수로, 지연 초기화 프로퍼티를 구현하기 위한 델리게이트 역할을 할 수 있습니다.
`get()`에 대한 첫 호출은 `lazy()`에 전달된 람다를 실행하고 결과를 기억합니다.
이후 `get()` 호출은 기억된 결과를 단순히 반환합니다.

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

기본적으로 지연 초기화 프로퍼티의 평가는 *동기화(synchronized)*됩니다. 값은 하나의 스레드에서만 계산되지만, 모든 스레드는 동일한 값을 보게 됩니다. 여러 스레드가 동시에 실행할 수 있도록 초기화 델리게이트의 동기화가 필요하지 않은 경우, `lazy()`에 `LazyThreadSafetyMode.PUBLICATION`을 매개변수로 전달하세요.

프로퍼티를 사용하는 스레드와 동일한 스레드에서 항상 초기화가 발생한다고 확신한다면, `LazyThreadSafetyMode.NONE`을 사용할 수 있습니다. 이는 스레드 안전성 보장 및 관련 오버헤드를 발생시키지 않습니다.

### 관찰 가능한 프로퍼티

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html)은 두 개의 인수를 받습니다: 초기 값과 수정 핸들러입니다.

핸들러는 프로퍼티에 값을 할당할 때마다 (*할당이 수행된 _후_*) 호출됩니다. 세 가지 매개변수가 있습니다: 할당되는 프로퍼티, 이전 값, 그리고 새 값입니다:

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

할당을 가로채고 이를 *거부(veto)*하려면 `observable()` 대신 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html)를 사용하세요.
`vetoable`에 전달되는 핸들러는 새 프로퍼티 값이 할당되기 *전에* 호출됩니다.

## 다른 프로퍼티에 위임하기

프로퍼티는 자신의 getter와 setter를 다른 프로퍼티에 위임할 수 있습니다. 이러한 위임은 최상위 프로퍼티와 클래스 프로퍼티(멤버 및 확장) 모두에 대해 사용할 수 있습니다. 델리게이트 프로퍼티는 다음일 수 있습니다:
*   최상위 프로퍼티
*   동일 클래스의 멤버 또는 확장 프로퍼티
*   다른 클래스의 멤버 또는 확장 프로퍼티

프로퍼티를 다른 프로퍼티에 위임하려면 델리게이트 이름에 `::` 한정자를 사용하세요. 예를 들어 `this::delegate` 또는 `MyClass::delegate`입니다.

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

이는 예를 들어, 하위 호환성을 유지하면서 프로퍼티 이름을 바꾸고 싶을 때 유용할 수 있습니다: 새 프로퍼티를 도입하고, 이전 프로퍼티에 `@Deprecated` 어노테이션을 달고, 그 구현을 위임합니다.

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

## 맵에 프로퍼티 저장하기

일반적인 사용 사례 중 하나는 프로퍼티 값을 맵(map)에 저장하는 것입니다.
이는 JSON 파싱이나 다른 동적 작업 수행과 같은 애플리케이션에서 자주 발생합니다.
이 경우, 맵 인스턴스 자체를 위임된 프로퍼티의 델리게이트로 사용할 수 있습니다.

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

이 예제에서 생성자는 맵을 받습니다:

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

위임된 프로퍼티는 이 맵에서 문자열 키를 통해 값을 가져오며, 이 키는 프로퍼티 이름과 연결됩니다:

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

이는 읽기 전용 `Map` 대신 `MutableMap`을 사용하는 경우 `var` 프로퍼티에서도 작동합니다:

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 지역 위임된 프로퍼티

지역 변수를 위임된 프로퍼티로 선언할 수 있습니다.
예를 들어, 지역 변수를 지연 초기화할 수 있습니다:

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 변수는 첫 접근 시에만 계산됩니다.
`someCondition`이 실패하면 변수는 전혀 계산되지 않습니다.

## 프로퍼티 델리게이트 요구 사항

*읽기 전용* 프로퍼티(`val`)의 경우, 델리게이트는 다음 매개변수를 가진 연산자 함수 `getValue()`를 제공해야 합니다:

*   `thisRef`는 *프로퍼티 소유자*와 동일한 타입 또는 슈퍼타입이어야 합니다 (확장 프로퍼티의 경우 확장되는 타입이어야 합니다).
*   `property`는 `KProperty<*>` 타입 또는 그 슈퍼타입이어야 합니다.

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

*가변(mutable)* 프로퍼티(`var`)의 경우, 델리게이트는 추가적으로 다음 매개변수를 가진 연산자 함수 `setValue()`를 제공해야 합니다:

*   `thisRef`는 *프로퍼티 소유자*와 동일한 타입 또는 슈퍼타입이어야 합니다 (확장 프로퍼티의 경우 확장되는 타입이어야 합니다).
*   `property`는 `KProperty<*>` 타입 또는 그 슈퍼타입이어야 합니다.
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

`getValue()` 및/또는 `setValue()` 함수는 델리게이트 클래스의 멤버 함수로 또는 확장 함수로 제공될 수 있습니다.
후자는 이 함수들을 원래 제공하지 않는 객체에 프로퍼티를 위임해야 할 때 유용합니다.
두 함수 모두 `operator` 키워드로 마크되어야 합니다.

Kotlin 표준 라이브러리의 `ReadOnlyProperty` 및 `ReadWriteProperty` 인터페이스를 사용하여 새 클래스를 만들지 않고도 익명 객체로 델리게이트를 생성할 수 있습니다.
이들은 필수 메서드를 제공합니다: `getValue()`는 `ReadOnlyProperty`에 선언되어 있습니다. `ReadWriteProperty`는 이를 확장하고 `setValue()`를 추가합니다. 이는 `ReadOnlyProperty`가 예상되는 경우 `ReadWriteProperty`를 전달할 수 있음을 의미합니다.

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

내부적으로 Kotlin 컴파일러는 특정 종류의 위임된 프로퍼티에 대해 보조 프로퍼티를 생성한 다음 이들에게 위임합니다.

> 최적화를 위해 컴파일러는 [몇 가지 경우에 보조 프로퍼티를 생성하지 _않습니다_](#optimized-cases-for-delegated-properties).
> [다른 프로퍼티에 위임하는 예시](#translation-rules-when-delegating-to-another-property)에서 최적화에 대해 알아보세요.
>
{style="note"}

예를 들어, `prop` 프로퍼티의 경우 숨겨진 `prop$delegate` 프로퍼티를 생성하며, 접근자 코드는 단순히 이 추가 프로퍼티에 위임합니다:

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 이 코드는 컴파일러에 의해 대신 생성됩니다:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlin 컴파일러는 인수에서 `prop`에 대한 모든 필요한 정보를 제공합니다: 첫 번째 인수 `this`는 외부 클래스 `C`의 인스턴스를 참조하며, `this::prop`은 `prop` 자체를 설명하는 `KProperty` 타입의 리플렉션 객체입니다.

### 위임된 프로퍼티에 대한 최적화 사례

`$delegate` 필드는 델리게이트가 다음 중 하나인 경우 생략됩니다:
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

*   동일 모듈에 백킹 필드와 기본 getter를 가진 final `val` 프로퍼티:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

*   상수 표현식, enum 엔트리, `this`, `null`. `this`의 예:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 다른 프로퍼티에 위임할 때의 번역 규칙

다른 프로퍼티에 위임할 때, Kotlin 컴파일러는 참조된 프로퍼티에 대한 즉각적인 접근을 생성합니다.
이는 컴파일러가 `prop$delegate` 필드를 생성하지 않는다는 의미입니다. 이 최적화는 메모리 절약에 도움이 됩니다.

예를 들어, 다음 코드를 살펴보세요:

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 변수의 프로퍼티 접근자는 위임된 프로퍼티의 `getValue` 및 `setValue` 연산자를 건너뛰고 `impl` 변수를 직접 호출하므로 `KProperty` 참조 객체가 필요하지 않습니다.

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

## 델리게이트 제공하기

`provideDelegate` 연산자를 정의함으로써, 프로퍼티 구현이 위임되는 객체를 생성하는 로직을 확장할 수 있습니다. `by` 오른쪽에 사용된 객체가 `provideDelegate`를 멤버 또는 확장 함수로 정의하는 경우, 해당 함수가 호출되어 프로퍼티 델리게이트 인스턴스를 생성합니다.

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

`provideDelegate`의 매개변수는 `getValue`의 매개변수와 동일합니다:

*   `thisRef`는 _프로퍼티 소유자_와 동일한 타입 또는 슈퍼타입이어야 합니다 (확장 프로퍼티의 경우 확장되는 타입이어야 합니다);
*   `property`는 `KProperty<*>` 타입 또는 그 슈퍼타입이어야 합니다.

`provideDelegate` 메서드는 `MyUI` 인스턴스 생성 중 각 프로퍼티에 대해 호출되며, 즉시 필요한 유효성 검사를 수행합니다.

프로퍼티와 해당 델리게이트 간의 바인딩을 가로채는 이 기능이 없었다면, 동일한 기능을 달성하기 위해 프로퍼티 이름을 명시적으로 전달해야 했을 것이며, 이는 그리 편리하지 않습니다:

```kotlin
// "provideDelegate" 기능 없이 프로퍼티 이름 확인하기
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

생성된 코드에서 `provideDelegate` 메서드는 보조 `prop$delegate` 프로퍼티를 초기화하기 위해 호출됩니다.
`val prop: Type by MyDelegate()` 프로퍼티 선언에 대한 생성된 코드와 (`provideDelegate` 메서드가 없을 때의) [위](#translation-rules-for-delegated-properties)에서 생성된 코드를 비교하세요:

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 'provideDelegate' 함수를 사용할 수 있을 때
// 컴파일러에 의해 생성되는 코드:
class C {
    // 추가 "delegate" 프로퍼티를 생성하기 위해 "provideDelegate" 호출
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

`provideDelegate` 메서드는 보조 프로퍼티 생성에만 영향을 미치며 getter 또는 setter에 대해 생성된 코드에는 영향을 미치지 않습니다.

표준 라이브러리의 `PropertyDelegateProvider` 인터페이스를 사용하면 새 클래스를 만들지 않고도 델리게이트 프로바이더를 생성할 수 있습니다.

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider