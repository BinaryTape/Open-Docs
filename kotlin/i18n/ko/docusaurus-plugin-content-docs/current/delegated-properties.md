---
title: "위임된 속성"
---
몇 가지 일반적인 종류의 프로퍼티의 경우, 필요할 때마다 직접 구현할 수도 있지만, 한 번 구현하여 라이브러리에 추가하고 나중에 재사용하는 것이 더 유용합니다. 예를 들면 다음과 같습니다.

* _Lazy_ 프로퍼티: 값은 처음 접근할 때만 계산됩니다.
* _Observable_ 프로퍼티: 이 프로퍼티의 변경 사항에 대해 리스너에게 알림이 전달됩니다.
* 각 프로퍼티에 대해 별도의 필드 대신 _map_ 에 프로퍼티를 저장합니다.

이러한 (및 기타) 경우를 처리하기 위해 코틀린은 _위임된 프로퍼티(delegated properties)_ 를 지원합니다.

```kotlin
class Example {
    var p: String by Delegate()
}
```

구문은 `val/var <프로퍼티 이름>: <Type> by <expression>`입니다. `by` 뒤의 표현식은 _delegate_ 입니다.
프로퍼티에 해당하는 `get()` (및 `set()`)이 해당 `getValue()` 및 `setValue()` 메서드에 위임되기 때문입니다.
프로퍼티 delegate는 인터페이스를 구현할 필요는 없지만 `getValue()` 함수 (그리고 `var`의 경우 `setValue()`)를 제공해야 합니다.

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

`Delegate`의 인스턴스에 위임하는 `p`에서 읽을 때 `Delegate`의 `getValue()` 함수가 호출됩니다.
첫 번째 매개변수는 `p`를 읽는 객체이고 두 번째 매개변수는 `p` 자체에 대한 설명을 담고 있습니다.
(예를 들어 이름을 가져올 수 있습니다.)

```kotlin
val e = Example()
println(e.p)
```

다음이 출력됩니다.

```
Example@33a17727, thank you for delegating 'p' to me!
```

마찬가지로 `p`에 할당하면 `setValue()` 함수가 호출됩니다. 처음 두 매개변수는 동일하고
세 번째 매개변수는 할당되는 값을 담고 있습니다.

```kotlin
e.p = "NEW"
```

다음이 출력됩니다.
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

위임된 객체에 대한 요구 사항 사양은 [아래](#property-delegate-requirements)에서 확인할 수 있습니다.

함수 또는 코드 블록 내에서 위임된 프로퍼티를 선언할 수 있습니다. 클래스의 멤버일 필요는 없습니다.
아래에서 [예제](#local-delegated-properties)를 찾을 수 있습니다.

## 표준 delegate

Kotlin 표준 라이브러리는 여러 유용한 종류의 delegate에 대한 팩토리 메서드를 제공합니다.

### Lazy 프로퍼티

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)는 람다를 가져와서 lazy 프로퍼티를 구현하기 위한 delegate로 사용할 수 있는 `Lazy<T>` 인스턴스를 반환하는 함수입니다.
`get()`에 대한 첫 번째 호출은 `lazy()`에 전달된 람다를 실행하고 결과를 기억합니다.
이후의 `get()` 호출은 단순히 기억된 결과를 반환합니다.

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

기본적으로 lazy 프로퍼티의 평가는 *synchronized* 됩니다. 값은 하나의 스레드에서만 계산되지만 모든 스레드가
동일한 값을 보게 됩니다. 초기화 delegate의 동기화가 여러 스레드가 동시에 실행하도록 허용하는 데 필요하지 않은 경우
`LazyThreadSafetyMode.PUBLICATION`을 `lazy()`에 대한 매개변수로 전달합니다.

초기화가 프로퍼티를 사용하는 스레드와 항상 동일한 스레드에서 발생할 것이라고 확신하는 경우
`LazyThreadSafetyMode.NONE`을 사용할 수 있습니다. 스레드 안전성을 보장하지 않으며 관련 오버헤드를 발생시키지 않습니다.

### Observable 프로퍼티

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html)
두 개의 인수를 사용합니다. 초기 값과 수정에 대한 핸들러입니다.

핸들러는 프로퍼티에 할당할 때마다 호출됩니다 (*할당이 수행된 후*). 세 가지
매개변수가 있습니다. 할당되는 프로퍼티, 이전 값 및 새 값입니다.

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new `->`
        println("$old `->` $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

할당을 가로채서 *거부*하려면 `observable()` 대신 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html)을 사용합니다.
`vetoable`에 전달된 핸들러는 새 프로퍼티 값이 할당되기 *전에* 호출됩니다.

## 다른 프로퍼티에 위임

프로퍼티는 getter와 setter를 다른 프로퍼티에 위임할 수 있습니다. 이러한 위임은
최상위 및 클래스 프로퍼티(멤버 및 확장) 모두에 사용할 수 있습니다. delegate 프로퍼티는 다음 중 하나일 수 있습니다.
* 최상위 프로퍼티
* 동일한 클래스의 멤버 또는 확장 프로퍼티
* 다른 클래스의 멤버 또는 확장 프로퍼티

프로퍼티를 다른 프로퍼티에 위임하려면 delegate 이름에 `::` 한정자를 사용합니다. 예를 들어 `this::delegate` 또는
`MyClass::delegate`와 같습니다.

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

이는 예를 들어 이전 버전과의 호환성을 유지하면서 프로퍼티 이름을 바꾸려는 경우에 유용할 수 있습니다. 새 프로퍼티를 도입하고
이전 프로퍼티에 `@Deprecated` 어노테이션을 추가하고 해당 구현을 위임합니다.

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

## 맵에 프로퍼티 저장

일반적인 사용 사례 중 하나는 맵에 프로퍼티 값을 저장하는 것입니다.
이는 JSON을 파싱하거나 다른 동적 작업을 수행하는 것과 같은 애플리케이션에서 자주 발생합니다.
이 경우 맵 인스턴스 자체를 위임된 프로퍼티의 delegate로 사용할 수 있습니다.

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

이 예제에서 생성자는 맵을 사용합니다.

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

위임된 프로퍼티는 프로퍼티 이름과 연결된 문자열 키를 통해 이 맵에서 값을 가져옵니다.

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

    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25

}
```

읽기 전용 `Map` 대신 `MutableMap`을 사용하는 경우 `var`의 프로퍼티에도 작동합니다.

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 로컬 위임된 프로퍼티

로컬 변수를 위임된 프로퍼티로 선언할 수 있습니다.
예를 들어 로컬 변수를 lazy로 만들 수 있습니다.

```kotlin
fun example(computeFoo: () `->` Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 변수는 처음 접근할 때만 계산됩니다.
`someCondition`이 실패하면 변수는 전혀 계산되지 않습니다.

## 프로퍼티 delegate 요구 사항

*읽기 전용* 프로퍼티(`val`)의 경우 delegate는 다음 매개변수를 사용하여 연산자 함수 `getValue()`를 제공해야 합니다.

* `thisRef`는 *프로퍼티 소유자*와 동일한 유형이거나 상위 유형이어야 합니다 (확장 프로퍼티의 경우 확장되는 유형이어야 함).
* `property`는 `KProperty<*>` 유형 또는 해당 상위 유형이어야 합니다.

`getValue()`는 프로퍼티와 동일한 유형(또는 하위 유형)을 반환해야 합니다.

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

*변경 가능한* 프로퍼티(`var`)의 경우 delegate는 다음 매개변수를 사용하여 연산자 함수 `setValue()`를 추가로 제공해야 합니다.

* `thisRef`는 *프로퍼티 소유자*와 동일한 유형이거나 상위 유형이어야 합니다 (확장 프로퍼티의 경우 확장되는 유형이어야 함).
* `property`는 `KProperty<*>` 유형 또는 해당 상위 유형이어야 합니다.
* `value`는 프로퍼티와 동일한 유형(또는 상위 유형)이어야 합니다.
 
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

`getValue()` 및/또는 `setValue()` 함수는 delegate 클래스의 멤버 함수 또는 확장 함수로 제공될 수 있습니다.
후자는 원래 이러한 함수를 제공하지 않는 객체에 프로퍼티를 위임해야 할 때 유용합니다.
두 함수 모두 `operator` 키워드로 표시되어야 합니다.

Kotlin 표준 라이브러리의 `ReadOnlyProperty` 및 `ReadWriteProperty` 인터페이스를 사용하여 새 클래스를 만들지 않고도 익명 객체로 delegate를 만들 수 있습니다.
이러한 인터페이스는 필요한 메서드를 제공합니다. `getValue()`는 `ReadOnlyProperty`에 선언됩니다. `ReadWriteProperty`는
이를 확장하고 `setValue()`를 추가합니다. 즉, `ReadOnlyProperty`가 예상될 때마다 `ReadWriteProperty`를 전달할 수 있습니다.

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

## 위임된 프로퍼티에 대한 변환 규칙

내부적으로 Kotlin 컴파일러는 일부 종류의 위임된 프로퍼티에 대해 보조 프로퍼티를 생성한 다음 해당 프로퍼티에 위임합니다.

:::note
최적화 목적으로 컴파일러는 몇 가지 경우에 보조 프로퍼티를 [_생성하지 않습니다_](#optimized-cases-for-delegated-properties).
[다른 프로퍼티에 위임하는 경우](#translation-rules-when-delegating-to-another-property)의 예에서 최적화에 대해 알아보세요.

:::

예를 들어 프로퍼티 `prop`의 경우 숨겨진 프로퍼티 `prop$delegate`를 생성하고 접근자 코드는
이 추가 프로퍼티에 위임합니다.

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

Kotlin 컴파일러는 인수에 `prop`에 대한 필요한 모든 정보를 제공합니다. 첫 번째 인수 `this`는
외부 클래스 `C`의 인스턴스를 참조하고 `this::prop`은 `prop` 자체를 설명하는 `KProperty` 유형의 리플렉션 객체입니다.

### 위임된 프로퍼티에 대한 최적화된 사례

delegate가 다음인 경우 `$delegate` 필드가 생략됩니다.
* 참조된 프로퍼티:

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

* 명명된 객체:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

* 동일한 모듈에서 백업 필드와 기본 getter가 있는 final `val` 프로퍼티:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

* 상수 표현식, enum 항목, `this`, `null`. `this`의 예:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 다른 프로퍼티에 위임할 때의 변환 규칙

다른 프로퍼티에 위임할 때 Kotlin 컴파일러는 참조된 프로퍼티에 대한 즉각적인 접근을 생성합니다.
이는 컴파일러가 필드 `prop$delegate`를 생성하지 않음을 의미합니다. 이 최적화는 메모리 절약에 도움이 됩니다.

예를 들어 다음 코드를 살펴보겠습니다.

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 변수의 프로퍼티 접근자는 위임된 프로퍼티의 `getValue` 및 `setValue` 연산자를 건너뛰고 `impl` 변수를 직접 호출합니다.
따라서 `KProperty` 참조 객체가 필요하지 않습니다.

위의 코드의 경우 컴파일러는 다음 코드를 생성합니다.

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

## delegate 제공

`provideDelegate` 연산자를 정의하면 프로퍼티 구현이 위임되는 객체 생성을 위한 논리를 확장할 수 있습니다.
`by`의 오른쪽에 사용된 객체가 `provideDelegate`를 멤버 또는 확장 함수로 정의하는 경우
해당 함수가 호출되어 프로퍼티 delegate 인스턴스를 만듭니다.

`provideDelegate`의 가능한 사용 사례 중 하나는 초기화 시 프로퍼티의 일관성을 확인하는 것입니다.

예를 들어 바인딩하기 전에 프로퍼티 이름을 확인하려면 다음과 같이 작성할 수 있습니다.

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

`provideDelegate`의 매개변수는 `getValue`의 매개변수와 동일합니다.

* `thisRef`는 _프로퍼티 소유자_와 동일한 유형이거나 상위 유형이어야 합니다(확장 프로퍼티의 경우 확장되는 유형이어야 함).
* `property`는 `KProperty<*>` 유형 또는 해당 상위 유형이어야 합니다.

`provideDelegate` 메서드는 `MyUI` 인스턴스를 만드는 동안 각 프로퍼티에 대해 호출되며
필요한 유효성 검사를 즉시 수행합니다.

프로퍼티와 delegate 간의 바인딩을 가로채는 기능이 없으면 동일한 기능을 달성하기 위해
프로퍼티 이름을 명시적으로 전달해야 합니다. 이는 그다지 편리하지 않습니다.

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

생성된 코드에서 `provideDelegate` 메서드는 보조 `prop$delegate` 프로퍼티를 초기화하는 데 사용됩니다.
`val prop: Type by MyDelegate()` 프로퍼티 선언에 대해 생성된 코드를 `provideDelegate` 메서드가 없는 경우
[위](#translation-rules-for-delegated-properties)에서 생성된 코드와 비교합니다.

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

`provideDelegate` 메서드는 보조 프로퍼티 생성에만 영향을 미치고 getter 또는 setter에 대해 생성된 코드에는 영향을 미치지 않습니다.

표준 라이브러리의 `PropertyDelegateProvider` 인터페이스를 사용하면 새 클래스를 만들지 않고도 delegate 제공자를 만들 수 있습니다.

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property `->`
    ReadOnlyProperty<Any?, Int> {_, property `->` 42 }
}
val delegate: Int by provider
```