[//]: # (title: 인라인 값 클래스)

가끔은 특정 도메인에 특화된 타입(domain-specific type)을 생성하기 위해 값을 클래스로 래핑(wrapping)하는 것이 유용할 때가 있습니다. 하지만 이 방식은 추가적인 힙 할당(heap allocations)으로 인해 런타임 오버헤드(runtime overhead)를 발생시킵니다. 더욱이 래핑된 타입이 기본(primitive) 타입이라면 성능 저하가 상당합니다. 기본 타입은 일반적으로 런타임에 의해 고도로 최적화되지만, 그 래퍼(wrapper)들은 특별한 처리를 받지 못하기 때문입니다.

이러한 문제를 해결하기 위해 코틀린은 _인라인 클래스 (inline class)_ 라는 특별한 종류의 클래스를 도입했습니다. 인라인 클래스는 [값 기반 클래스 (value-based classes)](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)의 하위 집합입니다. 이들은 식별자(identity)를 가지지 않으며 값만을 가질 수 있습니다.

인라인 클래스를 선언하려면 클래스 이름 앞에 `value` 변경자를 사용합니다:

```kotlin
value class Password(private val s: String)
```

JVM 백엔드용 인라인 클래스를 선언하려면 클래스 선언 앞에 `value` 변경자와 함께 `@JvmInline` 어노테이션을 사용합니다:

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

인라인 클래스는 주 생성자에서 초기화되는 단일 프로퍼티를 가져야 합니다. 런타임에 인라인 클래스의 인스턴스는 이 단일 프로퍼티를 사용하여 표현됩니다 ([런타임 표현에 대한 자세한 내용은 아래](#representation)를 참조하세요):

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

이것이 인라인 클래스의 주요 특징이며, *인라인*이라는 이름에 영감을 주었습니다. 클래스의 데이터가 사용되는 곳으로 *인라인(inlined)*되기 때문입니다 (이는 [인라인 함수 (inline functions)](inline-functions.md)의 내용이 호출 지점(call sites)으로 인라인되는 방식과 유사합니다).

## 멤버

인라인 클래스는 일반 클래스의 일부 기능을 지원합니다. 특히, 프로퍼티와 함수를 선언할 수 있으며, `init` 블록과 [보조 생성자 (secondary constructors)](classes.md#secondary-constructors)를 가질 수 있습니다:

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    init {
        require(fullName.isNotEmpty()) {
            "Full name shouldn't be empty"
        }
    }

    constructor(firstName: String, lastName: String) : this("$firstName $lastName") {
        require(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }

    val length: Int
        get() = fullName.length

    fun greet() {
        println("Hello, $fullName")
    }
}

fun main() {
    val name1 = Person("Kotlin", "Mascot")
    val name2 = Person("Kodee")
    name1.greet() // the `greet()` function is called as a static method
    println(name2.length) // property getter is called as a static method
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

인라인 클래스 프로퍼티는 [지원 필드 (backing fields)](properties.md#backing-fields)를 가질 수 없습니다. 오직 간단한 계산 가능한 프로퍼티(`lateinit`/위임(delegated) 프로퍼티는 불가능)만 가질 수 있습니다.

## 상속

인라인 클래스는 인터페이스를 상속할 수 있습니다:

```kotlin
interface Printable {
    fun prettyPrint(): String
}

@JvmInline
value class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // Still called as a static method
}
```

인라인 클래스가 클래스 계층에 참여하는 것은 금지됩니다. 즉, 인라인 클래스는 다른 클래스를 확장할 수 없으며 항상 `final`입니다.

## 표현

생성된 코드에서 코틀린 컴파일러는 각 인라인 클래스에 대한 *래퍼(wrapper)*를 유지합니다. 인라인 클래스 인스턴스는 런타임에 래퍼 또는 기본(underlying) 타입으로 표현될 수 있습니다. 이는 `Int`가 기본 `int` 또는 래퍼 `Integer`로 [표현될 수 있는](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 방식과 유사합니다.

코틀린 컴파일러는 가장 성능이 좋고 최적화된 코드를 생성하기 위해 래퍼 대신 기본(underlying) 타입을 사용하는 것을 선호합니다. 하지만 때로는 래퍼를 유지해야 할 필요가 있습니다. 일반적으로 인라인 클래스는 다른 타입으로 사용될 때마다 박싱(boxing)됩니다.

```kotlin
interface I

@JvmInline
value class Foo(val i: Int) : I

fun asInline(f: Foo) {}
fun <T> asGeneric(x: T) {}
fun asInterface(i: I) {}
fun asNullable(i: Foo?) {}

fun <T> id(x: T): T = x

fun main() {
    val f = Foo(42) 
    
    asInline(f)    // unboxed: used as Foo itself
    asGeneric(f)   // boxed: used as generic type T
    asInterface(f) // boxed: used as type I
    asNullable(f)  // boxed: used as Foo?, which is different from Foo
    
    // below, 'f' first is boxed (while being passed to 'id') and then unboxed (when returned from 'id') 
    // In the end, 'c' contains unboxed representation (just '42'), as 'f' 
    val c = id(f)  
}
```

인라인 클래스는 기본 값과 래퍼 둘 다로 표현될 수 있으므로, [참조 동일성 (referential equality)](equality.md#referential-equality)은 의미가 없으며 따라서 금지됩니다.

인라인 클래스는 기본 타입으로 제네릭 타입 파라미터를 가질 수도 있습니다. 이 경우 컴파일러는 이를 `Any?`로 매핑하거나, 일반적으로 타입 파라미터의 상한(upper bound)으로 매핑합니다.

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### 맹글링

인라인 클래스는 기본 타입으로 컴파일되므로, 예를 들어 예상치 못한 플랫폼 시그니처 충돌(platform signature clashes)과 같은 다양한 모호한 오류로 이어질 수 있습니다:

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

이러한 문제를 완화하기 위해 인라인 클래스를 사용하는 함수는 함수 이름에 안정적인 해시 코드를 추가하여 _맹글링(mangling)_됩니다. 따라서 `fun compute(x: UInt)`는 `public final void compute-<hashcode>(int x)`로 표현되어 충돌 문제를 해결합니다.

### 자바 코드에서 호출하기

자바 코드에서 인라인 클래스를 인자로 받는 함수를 호출할 수 있습니다. 이를 위해서는 함수 선언 앞에 `@JvmName` 어노테이션을 추가하여 맹글링(mangling)을 수동으로 비활성화해야 합니다:

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

기본적으로 코틀린은 인라인 클래스를 **언박싱된 표현 (unboxed representations)**으로 컴파일하므로, 자바에서 접근하기 어렵습니다. 자바에서 접근 가능한 **박싱된 표현 (boxed representations)**으로 인라인 클래스를 컴파일하는 방법을 알아보려면 [자바에서 코틀린 호출 (Calling Kotlin from Java)](java-to-kotlin-interop.md#inline-value-classes) 가이드를 참조하세요.

## 인라인 클래스 vs 타입 별칭

언뜻 보기에 인라인 클래스는 [타입 별칭 (type aliases)](type-aliases.md)과 매우 유사해 보입니다. 실제로 둘 다 새로운 타입을 도입하는 것처럼 보이며, 런타임에 기본(underlying) 타입으로 표현됩니다.

하지만 결정적인 차이점은 타입 별칭은 기본 타입과(*그리고 동일한 기본 타입을 가진 다른 타입 별칭과도*) *할당 호환(assignment-compatible)*되지만, 인라인 클래스는 그렇지 않다는 점입니다.

다시 말해, 인라인 클래스는 진정으로 _새로운_ 타입을 도입합니다. 이는 기존 타입에 대한 대안적인 이름(별칭)만을 도입하는 타입 별칭과는 다릅니다.

```kotlin
typealias NameTypeAlias = String

@JvmInline
value class NameInlineClass(val s: String)

fun acceptString(s: String) {}
fun acceptNameTypeAlias(n: NameTypeAlias) {}
fun acceptNameInlineClass(p: NameInlineClass) {}

fun main() {
    val nameAlias: NameTypeAlias = ""
    val nameInlineClass: NameInlineClass = NameInlineClass("")
    val string: String = ""

    acceptString(nameAlias) // OK: pass alias instead of underlying type
    acceptString(nameInlineClass) // Not OK: can't pass inline class instead of underlying type

    // And vice versa:
    acceptNameTypeAlias(string) // OK: pass underlying type instead of alias
    acceptNameInlineClass(string) // Not OK: can't pass underlying type instead of inline class
}
```

## 인라인 클래스와 위임

인터페이스를 사용하여 인라인 클래스의 인라인된 값에 대한 위임(delegation)을 통한 구현이 허용됩니다:

```kotlin
interface MyInterface {
    fun bar()
    fun foo() = "foo"
}

@JvmInline
value class MyInterfaceWrapper(val myInterface: MyInterface) : MyInterface by myInterface

fun main() {
    val my = MyInterfaceWrapper(object : MyInterface {
        override fun bar() {
            // body
        }
    })
    println(my.foo()) // prints "foo"
}