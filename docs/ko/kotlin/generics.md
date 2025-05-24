---
title: "제네릭: in, out, where"
---
클래스는 Kotlin에서 Java처럼 타입 매개변수를 가질 수 있습니다.

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

이러한 클래스의 인스턴스를 생성하려면 간단히 타입 인수를 제공하세요.

```kotlin
val box: Box<Int> = Box<Int>(1)
```

그러나 매개변수를 추론할 수 있는 경우(예: 생성자 인수에서),
타입 인수를 생략할 수 있습니다.

```kotlin
val box = Box(1) // 1은 Int 타입이므로 컴파일러는 이것이 Box<Int>임을 알아냅니다.
```

## 분산 (Variance)

Java 타입 시스템의 가장 까다로운 측면 중 하나는 와일드카드 타입입니다 ( [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html) 참조).
Kotlin에는 이러한 것이 없습니다. 대신 Kotlin은 선언 지점 분산 및 타입 프로젝션을 제공합니다.

### Java의 분산 및 와일드카드

Java에 이러한 신비한 와일드카드가 필요한 이유에 대해 생각해 봅시다. 먼저 Java의 제네릭 타입은 _무변성_입니다.
즉, `List<String>`은 `List<Object>`의 하위 타입이 _아닙니다_. `List`가 _무변성_이 아니었다면 Java 배열보다 나을 것이 없었을 것입니다.
다음 코드가 컴파일되지만 런타임 시 예외를 발생시키기 때문입니다.

```java
// Java
List<String> strs = new ArrayList<String>();

// Java는 여기서 컴파일 타임에 타입 불일치를 보고합니다.
List<Object> objs = strs;

// 만약 그렇지 않다면?
// Integer를 String 목록에 넣을 수 있습니다.
objs.add(1);

// 그리고 런타임 시 Java는 다음을 throw합니다.
// ClassCastException: Integer를 String으로 캐스팅할 수 없습니다.
String s = strs.get(0); 
```

Java는 런타임 안전을 보장하기 위해 이러한 것을 금지합니다. 그러나 이는 영향을 미칩니다. 예를 들어,
`Collection` 인터페이스의 `addAll()` 메서드를 생각해 보세요. 이 메서드의 서명은 무엇일까요? 직관적으로는
다음과 같이 작성할 것입니다.

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

그러나 그렇게 하면 다음을 수행할 수 없습니다(이는 완전히 안전함).

```java
// Java

// 다음은 addAll의 단순한 선언으로 컴파일되지 않습니다.
// Collection<String>은 Collection<Object>의 하위 타입이 아닙니다.
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

그렇기 때문에 `addAll()`의 실제 서명은 다음과 같습니다.

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_와일드카드 타입 인수_ `? extends E`는 이 메서드가 `E` 타입의 객체 컬렉션을 허용함을 나타냅니다.
`E` _또는_ `E`_의 하위 타입_이지, `E` 자체가 아닙니다. 이는 항목에서 안전하게 `E`를 _읽을_ 수 있음을 의미합니다.
(이 컬렉션의 요소는 E의 하위 클래스의 인스턴스입니다.) 그러나 _쓰기_는 할 수 없습니다.
알 수 없는 `E`의 하위 타입에 해당하는 객체를 알 수 없기 때문입니다.
이 제한에 대한 대가로 원하는 동작을 얻을 수 있습니다. `Collection<String>`은 `Collection<? extends Object>`의 하위 타입_입니다_.
다시 말해, _extends_ 바운드 (상한)가 있는 와일드카드는 타입을 _공변적으로_ 만듭니다.

이것이 작동하는 이유를 이해하는 핵심은 매우 간단합니다. 컬렉션에서 항목을 _가져오기만_ 할 수 있다면
`String` 컬렉션을 사용하여 거기에서 `Object`를 읽는 것은 괜찮습니다. 반대로 컬렉션에 항목을 _넣기만_ 할 수 있다면
`Object` 컬렉션을 가져와서 거기에 `String`을 넣는 것은 괜찮습니다. Java에는
`List<? super String>`이 있으며, 이는 `String` 또는 그 슈퍼타입을 허용합니다.

후자를 _반공변성_이라고 하며, `List<? super String>`에서는 `String`을 인수로 사용하는 메서드만 호출할 수 있습니다.
(예를 들어, `add(String)` 또는 `set(int, String)`을 호출할 수 있습니다.) `List<T>`에서 `T`를 반환하는 것을 호출하면
`String`이 아니라 `Object`를 얻습니다.

Joshua Bloch는 그의 책 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html)에서 이 문제를 잘 설명합니다.
(항목 31: "API 유연성을 높이기 위해 바운드된 와일드카드를 사용하세요"). 그는 오직
_읽기만 하는_ 객체를 _생산자_ 라고 하고, 오직 _쓰기만 하는_ 객체를 _소비자_ 라고 부릅니다. 그는 다음과 같이 권장합니다.

:::note
"최대한의 유연성을 위해 생산자 또는 소비자를 나타내는 입력 매개변수에 와일드카드 타입을 사용하세요."

그런 다음 그는 다음과 같은 기억법을 제안합니다. _PECS_는 _Producer-Extends, Consumer-Super_를 나타냅니다.

예를 들어, `List<? extends Foo>`와 같은 생산자 객체를 사용하는 경우 이 객체에서 `add()` 또는 `set()`을 호출할 수 없습니다.
그러나 이것이 _불변_임을 의미하지는 않습니다. 예를 들어, `clear()`를 호출하여 목록에서 모든 항목을 제거하는 것을 막을 수는 없습니다.
`clear()`는 매개변수를 전혀 사용하지 않기 때문입니다.

와일드카드 (또는 다른 유형의 분산)에 의해 보장되는 유일한 것은 _타입 안전성_입니다. 불변성은 완전히 다른 문제입니다.

:::

### 선언 지점 분산

`T`를 매개변수로 사용하는 메서드는 없고, `T`를 반환하는 메서드만 있는 제네릭 인터페이스 `Source<T>`가 있다고 가정해 보겠습니다.

```java
// Java
interface Source<T> {
    T nextT();
}
```

그렇다면 `Source<String>` 인스턴스에 대한 참조를
`Source<Object>` 타입의 변수에 저장하는 것이 완전히 안전합니다. 호출할 소비자 메서드가 없기 때문입니다. 그러나 Java는 이것을 알지 못하고 여전히 금지합니다.

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Java에서는 허용되지 않습니다.
    // ...
}
```

이것을 해결하려면 `Source<? extends Object>` 타입의 객체를 선언해야 합니다. 그렇게 하는 것은 의미가 없습니다.
이전과 마찬가지로 이러한 변수에서 동일한 메서드를 모두 호출할 수 있기 때문에 더 복잡한 타입으로 추가되는 값은 없습니다.
그러나 컴파일러는 그것을 알지 못합니다.

Kotlin에서는 이러한 종류의 것을 컴파일러에 설명할 수 있는 방법이 있습니다. 이를 _선언 지점 분산_이라고 합니다.
`Source<T>`의 멤버에서 _반환_(생산)되고 절대 소비되지 않도록 _타입 매개변수_ `T`에 주석을 달 수 있습니다.
이렇게 하려면 `out` 수정자를 사용합니다.

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 이것은 괜찮습니다. T는 out-매개변수이기 때문입니다.
    // ...
}
```

일반적인 규칙은 다음과 같습니다. 클래스 `C`의 타입 매개변수 `T`가 `out`으로 선언되면 `C`의 멤버에서 _out_ 위치에만 나타날 수 있습니다.
그러나 반환 시 `C<Base>`는 안전하게 `C<Derived>`의 슈퍼타입이 될 수 있습니다.

다시 말해, 클래스 `C`는 매개변수 `T`에서 _공변적_이거나 `T`가 _공변적_ 타입 매개변수라고 말할 수 있습니다.
`C`는 `T`의 _생산자_이지 `T`의 _소비자_가 아니라고 생각할 수 있습니다.

`out` 수정자는 _분산 주석_이라고 하며, 타입 매개변수 선언 사이트에 제공되므로
_선언 지점 분산_을 제공합니다.
이는 타입 사용 시 와일드카드가 타입을 공변적으로 만드는 Java의 _사용 지점 분산_과 대조됩니다.

`out` 외에도 Kotlin은 보완적인 분산 주석인 `in`을 제공합니다. 이는 타입 매개변수를 _반공변적으로_ 만들어 소비될 수만 있고 생성될 수는 없음을 의미합니다.
반공변 타입의 좋은 예는 `Comparable`입니다.

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0은 Number의 하위 타입인 Double 타입입니다.
    // 따라서 x를 Comparable<Double> 타입의 변수에 할당할 수 있습니다.
    val y: Comparable<Double> = x // OK!
}
```

_in_ 과 _out_ 이라는 단어는 자명한 것 같습니다 (C#에서 오랫동안 성공적으로 사용되었기 때문입니다).
따라서 위에서 언급한 기억법은 실제로 필요하지 않습니다. 사실 더 높은 수준의 추상화로 재구성할 수 있습니다.

**[존재론적](https://en.wikipedia.org/wiki/Existentialism) 변환: 소비자 in, 생산자 out!** :-)

## 타입 프로젝션

### 사용 지점 분산: 타입 프로젝션

타입 매개변수 `T`를 `out`으로 선언하고 사용 지점에서 서브타이핑 문제를 피하는 것은 매우 쉽습니다.
그러나 일부 클래스는 실제로 `T`만 반환하도록 제한할 수 _없습니다_!
이에 대한 좋은 예는 `Array`입니다.

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

이 클래스는 `T`에서 공변적도 반공변적도 될 수 없습니다. 그리고 이것은 특정 유연성을 부과합니다. 다음 함수를 고려하십시오.

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

이 함수는 한 배열에서 다른 배열로 항목을 복사하는 것입니다. 실제로 적용해 보겠습니다.

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 타입은 Array<Int>이지만 Array<Any>가 예상되었습니다.
```

여기서 동일한 익숙한 문제에 직면합니다. `Array<T>`는 `T`에서 _불변_이므로 `Array<Int>`도 `Array<Any>`도
다른 하나의 하위 타입이 아닙니다. 왜 안 될까요? 다시 말하지만, 이는 `copy`가 예기치 않은 동작을 할 수 있기 때문입니다. 예를 들어,
`from`에 `String`을 쓰려고 시도할 수 있으며 실제로 `Int` 배열을 전달하면 나중에 `ClassCastException`이 발생합니다.

`copy` 함수가 `from`에 _쓰지_ 못하도록 하려면 다음을 수행할 수 있습니다.

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

이것은 _타입 프로젝션_입니다. 즉, `from`은 단순한 배열이 아니라 제한된 (_투영된_) 배열입니다.
이 경우 타입 매개변수 `T`를 반환하는 메서드만 호출할 수 있습니다. 즉, `get()`만 호출할 수 있습니다.
이것은 _사용 지점 분산_에 대한 우리의 접근 방식이며, 약간 더 간단하면서도 Java의 `Array<? extends Object>`에 해당합니다.

`in`을 사용하여 타입을 투영할 수도 있습니다.

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>`은 Java의 `Array<? super String>`에 해당합니다. 이는 `String`, `CharSequence` 또는 `Object` 배열을
`fill()` 함수에 전달할 수 있음을 의미합니다.

### 스타 프로젝션

때로는 타입 인수에 대해 아무것도 모르지만 여전히 안전한 방법으로 사용하고 싶을 때가 있습니다.
여기서 안전한 방법은 제네릭 타입의 그러한 투영을 정의하는 것입니다. 즉, 해당 제네릭의 모든 구체적인 인스턴스화가
해당 투영의 하위 타입이 됩니다.

Kotlin은 이를 위해 소위 _스타-프로젝션_ 구문을 제공합니다.

- `Foo<out T : TUpper>`의 경우, 여기서 `T`는 상한이 `TUpper`인 공변 타입 매개변수입니다. `Foo<*>`는
  `Foo<out TUpper>`와 같습니다. 이는 `T`를 알 수 없을 때 `Foo<*>`에서 `TUpper` 값을 안전하게 _읽을_ 수 있음을 의미합니다.
- `Foo<in T>`의 경우, 여기서 `T`는 반공변 타입 매개변수입니다. `Foo<*>`는 `Foo<in Nothing>`과 같습니다. 이는
  `T`를 알 수 없을 때 안전한 방법으로 `Foo<*>`에 _쓸_ 수 있는 것이 없음을 의미합니다.
- `Foo<T : TUpper>`의 경우, 여기서 `T`는 상한이 `TUpper`인 불변 타입 매개변수입니다. `Foo<*>`는 값을 읽기 위해 `Foo<out TUpper>`와 같고, 값을 쓰기 위해 `Foo<in Nothing>`과 같습니다.

제네릭 타입에 여러 타입 매개변수가 있는 경우 각 매개변수를 독립적으로 투영할 수 있습니다.
예를 들어, 타입이 `interface Function<in T, out U>`로 선언된 경우 다음과 같은 스타-프로젝션을 사용할 수 있습니다.

* `Function<*, String>`은 `Function<in Nothing, String>`을 의미합니다.
* `Function<Int, *>`은 `Function<Int, out Any?>`를 의미합니다.
* `Function<*, *>`은 `Function<in Nothing, out Any?>`를 의미합니다.

:::note
스타-프로젝션은 Java의 원시 타입과 매우 유사하지만 안전합니다.

:::

## 제네릭 함수

타입 매개변수를 가질 수 있는 유일한 선언이 클래스인 것은 아닙니다. 함수도 가질 수 있습니다. 타입 매개변수는 함수 이름 _앞에_ 배치됩니다.

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 확장 함수
    // ...
}
```

제네릭 함수를 호출하려면 함수 이름 _뒤에_ 호출 사이트에서 타입 인수를 지정하세요.

```kotlin
val l = singletonList<Int>(1)
```

타입 인수를 컨텍스트에서 추론할 수 있는 경우 생략할 수 있으므로 다음 예제도 작동합니다.

```kotlin
val l = singletonList(1)
```

## 제네릭 제약

주어진 타입 매개변수에 대해 대체할 수 있는 모든 가능한 타입의 집합은 _제네릭 제약_에 의해 제한될 수 있습니다.

### 상한

가장 일반적인 타입의 제약은 _상한_이며, 이는 Java의 `extends` 키워드에 해당합니다.

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

콜론 뒤에 지정된 타입은 _상한_이며, `Comparable<T>`의 하위 타입만 `T`로 대체될 수 있음을 나타냅니다. 예를 들어:

```kotlin
sort(listOf(1, 2, 3)) // OK. Int는 Comparable<Int>의 하위 타입입니다.
sort(listOf(HashMap<Int, String>())) // 오류: HashMap<Int, String>은 Comparable<HashMap<Int, String>>의 하위 타입이 아닙니다.
```

기본 상한 (지정되지 않은 경우)은 `Any?`입니다. 꺾쇠괄호 안에 하나의 상한만 지정할 수 있습니다.
동일한 타입 매개변수에 둘 이상의 상한이 필요한 경우 별도의 _where_ 절이 필요합니다.

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

전달된 타입은 `where` 절의 모든 조건을 동시에 충족해야 합니다. 위의 예에서 `T` 타입은
`CharSequence` _와_ `Comparable` _모두_를 구현해야 합니다.

## 명확한 넌-널러블 타입

제네릭 Java 클래스 및 인터페이스와의 상호 운용성을 보다 쉽게 만들기 위해 Kotlin은 제네릭 타입 매개변수를
**명확한 넌-널러블**로 선언하는 것을 지원합니다.

제네릭 타입 `T`를 명확한 넌-널러블로 선언하려면 `& Any`로 타입을 선언하세요. 예: `T & Any`.

명확한 넌-널러블 타입은 널러블 [상한](#upper-bounds)을 가져야 합니다.

명확한 넌-널러블 타입을 선언하는 가장 일반적인 사용 사례는 인수로 `@NotNull`을 포함하는 Java 메서드를 재정의하려는 경우입니다.
예를 들어 `load()` 메서드를 생각해 보세요.

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

Kotlin에서 `load()` 메서드를 성공적으로 재정의하려면 `T1`을 명확한 넌-널러블로 선언해야 합니다.

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1은 명확한 넌-널러블입니다.
    override fun load(x: T1 & Any): T1 & Any
}
```

Kotlin에서만 작업하는 경우 Kotlin의 타입 추론이 이를 처리하므로 명확한 넌-널러블 타입을 명시적으로 선언할 필요가 없을 것입니다.

## 타입 소거

Kotlin이 제네릭 선언 사용에 대해 수행하는 타입 안전성 검사는 컴파일 시간에 수행됩니다.
런타임 시 제네릭 타입의 인스턴스는 실제 타입 인수에 대한 정보를 보유하지 않습니다.
타입 정보는 _소거_되었다고 합니다. 예를 들어 `Foo<Bar>` 및 `Foo<Baz?>`의 인스턴스는
단순히 `Foo<*>`로 소거됩니다.

### 제네릭 타입 검사 및 캐스트

타입 소거로 인해 제네릭 타입의 인스턴스가 런타임 시 특정 타입 인수로 생성되었는지 여부를 확인하는 일반적인 방법은 없습니다.
컴파일러는 `ints is List<Int>` 또는 `list is T` (타입 매개변수)와 같은 `is`-검사를 금지합니다.
그러나 인스턴스를 스타-투영된 타입에 대해 확인할 수 있습니다.

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 항목은 `Any?`로 타입이 지정됩니다.
}
```

마찬가지로, 인스턴스의 타입 인수가 정적으로 (컴파일 시간에) 검사된 경우
타입의 비-제네릭 부분을 포함하는 `is`-검사 또는 캐스트를 수행할 수 있습니다.
이 경우 꺾쇠괄호는 생략됩니다.

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list`는 `ArrayList<String>`으로 스마트 캐스트됩니다.
    }
}
```

타입 인수를 생략한 동일한 구문은 타입 인수를 고려하지 않는 캐스트에 사용할 수 있습니다. `list as ArrayList`.

제네릭 함수 호출의 타입 인수도 컴파일 시간에만 검사됩니다. 함수 본문 내에서
타입 매개변수를 타입 검사에 사용할 수 없으며 타입 매개변수로의 타입 캐스트 (`foo as T`)는 검사되지 않습니다.
유일한 예외는 [구체화된 타입 매개변수](inline-functions#reified-type-parameters)가 있는 인라인 함수입니다.
각 호출 사이트에서 실제 타입 인수가 인라인됩니다. 이를 통해 타입 매개변수에 대한 타입 검사 및 캐스트가 가능합니다.
그러나 위에서 설명한 제한 사항은 검사 또는 캐스트 내에서 사용되는 제네릭 타입의 인스턴스에 여전히 적용됩니다.
예를 들어, 타입 검사 `arg is T`에서 `arg`가 제네릭 타입 자체의 인스턴스인 경우 해당 타입 인수는 여전히 소거됩니다.

```kotlin

inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 컴파일은 되지만 타입 안전성을 깨뜨립니다!
// 자세한 내용은 샘플을 확장하세요.

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 목록 항목이 String이 아니므로 ClassCastException을 throw합니다.
}
```

### Unchecked 캐스트

`foo as List<String>`과 같은 구체적인 타입 인수를 가진 제네릭 타입으로의 타입 캐스트는 런타임 시 검사할 수 없습니다.
이러한 unchecked 캐스트는 타입 안전성이 높은 수준의 프로그램 로직에 의해 암시되지만
컴파일러에서 직접 추론할 수 없는 경우에 사용할 수 있습니다. 아래 예제를 참조하십시오.

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("문자열에서 임의의 요소로의 매핑을 읽습니다.")
}

// 이 파일에 `Int`가 있는 맵을 저장했습니다.
val intsFile = File("ints.dictionary")

// 경고: Unchecked 캐스트: `Map<String, *>`에서 `Map<String, Int>`로
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
마지막 줄의 캐스트에 대한 경고가 나타납니다. 컴파일러는 런타임 시 완전히 검사할 수 없으며
맵의 값이 `Int`인지 보장하지 않습니다.

unchecked 캐스트를 피하기 위해 프로그램 구조를 재설계할 수 있습니다. 위의 예에서
다른 타입에 대해 타입 안전 구현이 있는 `DictionaryReader<T>` 및 `DictionaryWriter<T>` 인터페이스를 사용할 수 있습니다.
합리적인 추상화를 도입하여 unchecked 캐스트를 호출 사이트에서 구현 세부 사항으로 이동할 수 있습니다.
[제네릭 분산](#variance)을 적절히 사용하면 도움이 될 수도 있습니다.

제네릭 함수의 경우 [구체화된 타입 매개변수](inline-functions#reified-type-parameters)를 사용하면
`arg as T`와 같은 캐스트가 검사됩니다. 단, `arg`의 타입에 소거된 _자체_ 타입 인수가 있는 경우는 제외됩니다.

unchecked 캐스트 경고는 발생한 문 또는
선언에 `@Suppress("UNCHECKED_CAST")`로 [주석을 달아](annotations) 억제할 수 있습니다.

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

:::note
**JVM에서**: [배열 타입](arrays) (`Array<Foo>`)은 요소의 소거된 타입에 대한 정보를 보유하며
배열 타입으로의 타입 캐스트는 부분적으로 검사됩니다.
요소 타입의 널 가능성 및 실제 타입 인수는 여전히 소거됩니다. 예를 들어
캐스트 `foo as Array<List<String>?>`는 `foo`가 널 가능 여부에 관계없이 `List<*>`를 보유하는 배열인 경우 성공합니다.

:::

## 타입 인수에 대한 밑줄 연산자

밑줄 연산자 `_`는 타입 인수에 사용할 수 있습니다. 다른 타입을 명시적으로 지정할 때 인수의 타입을 자동으로 추론하는 데 사용합니다.

```kotlin
abstract class SomeClass<T> {
    abstract fun execute() : T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run() : T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // SomeImplementation이 SomeClass<String>에서 파생되므로 T는 String으로 추론됩니다.
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // OtherImplementation이 SomeClass<Int>에서 파생되므로 T는 Int로 추론됩니다.
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```