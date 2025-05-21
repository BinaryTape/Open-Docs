---
title: "인라인 value 클래스"
---
때로는 값을 클래스로 래핑하여 도메인 특정 유형을 만드는 것이 유용합니다. 그러나 추가적인 힙 할당으로 인해 런타임 오버헤드가 발생합니다. 또한 래핑된 유형이 기본형인 경우, 기본형은 일반적으로 런타임에 의해 고도로 최적화되지만 래퍼는 특별한 처리를 받지 못하므로 성능 저하가 심각합니다.

이러한 문제를 해결하기 위해 Kotlin은 _인라인 클래스(inline class)_라는 특수한 종류의 클래스를 도입했습니다. 인라인 클래스는 [값 기반 클래스](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes)의 하위 집합입니다. ID가 없으며 값만 보유할 수 있습니다.

인라인 클래스를 선언하려면 클래스 이름 앞에 `value` 수정자를 사용합니다.

```kotlin
value class Password(private val s: String)
```

JVM 백엔드용 인라인 클래스를 선언하려면 클래스 선언 앞에 `@JvmInline` 어노테이션과 함께 `value` 수정자를 사용합니다.

```kotlin
// JVM 백엔드용
@JvmInline
value class Password(private val s: String)
```

인라인 클래스는 기본 생성자에서 초기화된 단일 속성을 가져야 합니다. 런타임 시 인라인 클래스의 인스턴스는 이 단일 속성을 사용하여 표현됩니다(런타임 표현에 대한 자세한 내용은 [아래](#representation) 참조).

```kotlin
// 'Password' 클래스의 실제 인스턴스화는 발생하지 않습니다.
// 런타임에 'securePassword'는 'String'만 포함합니다.
val securePassword = Password("Don't try this in production") 
```

이것이 인라인 클래스의 주요 기능이며, *인라인*이라는 이름의 영감이 되었습니다. 클래스의 데이터는 해당 사용 위치에 *인라인*됩니다(콘텐츠가 [인라인 함수](inline-functions)의 호출 위치에 인라인되는 방식과 유사).

## 멤버

인라인 클래스는 일반 클래스의 일부 기능을 지원합니다. 특히 속성 및 함수를 선언하고, `init` 블록과 [보조 생성자](classes#secondary-constructors)를 가질 수 있습니다.

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
    name1.greet() // `greet()` 함수는 정적 메서드로 호출됩니다.
    println(name2.length) // 속성 getter는 정적 메서드로 호출됩니다.
}
```

인라인 클래스 속성은 [backing fields](properties#backing-fields)를 가질 수 없습니다. 간단한 계산 가능한 속성( `lateinit`/위임된 속성 없음)만 가질 수 있습니다.

## 상속

인라인 클래스는 인터페이스에서 상속할 수 있습니다.

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
    println(name.prettyPrint()) // 여전히 정적 메서드로 호출됩니다.
}
```

인라인 클래스가 클래스 계층 구조에 참여하는 것은 금지되어 있습니다. 즉, 인라인 클래스는 다른 클래스를 확장할 수 없으며 항상 `final`입니다.

## 표현

생성된 코드에서 Kotlin 컴파일러는 각 인라인 클래스에 대한 *래퍼*를 유지합니다. 인라인 클래스 인스턴스는 런타임 시 래퍼 또는 기본 유형으로 표현될 수 있습니다. 이는 `Int`가 기본 `int` 또는 래퍼 `Integer`로 [표현될 수 있는](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine) 방식과 유사합니다.

Kotlin 컴파일러는 가장 성능이 좋고 최적화된 코드를 생성하기 위해 래퍼 대신 기본 유형을 사용하는 것을 선호합니다. 그러나 때로는 래퍼를 유지해야 합니다. 경험 법칙으로 인라인 클래스는 다른 유형으로 사용될 때마다 박싱됩니다.

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
    
    asInline(f)    // 언박싱: Foo 자체로 사용됩니다.
    asGeneric(f)   // 박싱: 제네릭 유형 T로 사용됩니다.
    asInterface(f) // 박싱: 유형 I로 사용됩니다.
    asNullable(f)  // 박싱: Foo?로 사용됩니다. Foo와는 다릅니다.
    
    // 아래에서 'f'는 먼저 박싱되고('id'로 전달되는 동안) 언박싱됩니다('id'에서 반환될 때).
    // 결국 'c'는 'f'처럼 언박싱된 표현(단지 '42')을 포함합니다.
    val c = id(f)  
}
```

인라인 클래스는 기본 값과 래퍼로 모두 표현될 수 있으므로 [참조 동등성](equality#referential-equality)은 무의미하며 따라서 금지됩니다.

인라인 클래스는 기본 유형으로 제네릭 유형 매개변수를 가질 수도 있습니다. 이 경우 컴파일러는 이를 `Any?` 또는 일반적으로 유형 매개변수의 상한으로 매핑합니다.

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 컴파일러는 fun compute-<hashcode>(s: Any?)를 생성합니다.
```

### 이름 장식(Mangling)

인라인 클래스는 기본 유형으로 컴파일되므로 예기치 않은 플랫폼 서명 충돌과 같은 다양한 모호한 오류가 발생할 수 있습니다.

```kotlin
@JvmInline
value class UInt(val x: Int)

// JVM에서 'public final void compute(int x)'로 표현됩니다.
fun compute(x: Int) { }

// JVM에서 'public final void compute(int x)'로도 표현됩니다!
fun compute(x: UInt) { }
```

이러한 문제를 완화하기 위해 인라인 클래스를 사용하는 함수는 함수 이름에 일부 안정적인 해시 코드를 추가하여 _이름 장식(mangled)_됩니다. 따라서 `fun compute(x: UInt)`는 `public final void compute-<hashcode>(int x)`로 표현되어 충돌 문제를 해결합니다.

### Java 코드에서 호출

Java 코드에서 인라인 클래스를 허용하는 함수를 호출할 수 있습니다. 이렇게 하려면 이름 장식을 수동으로 비활성화해야 합니다. 함수 선언 앞에 `@JvmName` 어노테이션을 추가합니다.

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## 인라인 클래스 vs 타입 별칭

언뜻 보기에 인라인 클래스는 [타입 별칭](type-aliases)과 매우 유사해 보입니다. 실제로 둘 다 새 유형을 도입하는 것처럼 보이고 런타임 시 기본 유형으로 표현됩니다.

그러나 중요한 차이점은 타입 별칭은 기본 유형(및 동일한 기본 유형을 가진 다른 타입 별칭)과 *할당 호환*되지만 인라인 클래스는 그렇지 않다는 것입니다.

다시 말해, 인라인 클래스는 타입 별칭과 달리 진정으로 _새로운_ 유형을 도입합니다. 타입 별칭은 기존 유형에 대한 대체 이름(별칭)만 도입합니다.

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

    acceptString(nameAlias) // OK: 기본 유형 대신 별칭을 전달합니다.
    acceptString(nameInlineClass) // Not OK: 기본 유형 대신 인라인 클래스를 전달할 수 없습니다.

    // 그리고 그 반대도 마찬가지입니다.
    acceptNameTypeAlias(string) // OK: 별칭 대신 기본 유형을 전달합니다.
    acceptNameInlineClass(string) // Not OK: 인라인 클래스 대신 기본 유형을 전달할 수 없습니다.
}
```

## 인라인 클래스 및 위임

인터페이스를 사용하여 인라인 클래스의 인라인된 값에 대한 위임을 통한 구현이 허용됩니다.

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
    println(my.foo()) // "foo"를 출력합니다.
}
```