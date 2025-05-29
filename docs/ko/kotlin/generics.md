[//]: # (title: 제네릭: in, out, where)

Kotlin의 클래스는 Java와 마찬가지로 타입 파라미터를 가질 수 있습니다:

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

이러한 클래스의 인스턴스를 생성하려면 단순히 타입 인자를 제공하면 됩니다:

```kotlin
val box: Box<Int> = Box<Int>(1)
```

하지만 파라미터가 예를 들어 생성자 인자로부터 추론될 수 있다면, 타입 인자를 생략할 수 있습니다:

```kotlin
val box = Box(1) // 1의 타입은 Int이므로, 컴파일러는 이를 Box<Int>로 파악합니다.
```

## 분산

Java 타입 시스템에서 가장 까다로운 측면 중 하나는 와일드카드 타입입니다 (참고: [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)).
Kotlin에는 이들이 없습니다. 대신 Kotlin에는 선언-지점 분산(declaration-site variance)과 타입 프로젝션(type projection)이 있습니다.

### Java의 분산과 와일드카드

Java가 이러한 미스터리한 와일드카드를 왜 필요로 하는지 생각해 봅시다. 첫째, Java의 제네릭 타입은 _불공변(invariant)_합니다. 즉, `List<String>`은 `List<Object>`의 하위 타입이 _아닙니다_. 만약 `List`가 _불공변_하지 않았다면, 다음 코드가 컴파일은 되지만 런타임에 예외를 발생시켜 Java의 배열과 다를 바 없었을 것입니다:

```java
// 자바
List<String> strs = new ArrayList<String>();

// Java는 컴파일 시점에 여기서 타입 불일치를 보고합니다.
List<Object> objs = strs;

// 만약 그렇지 않았다면?
// 우리는 Integer를 String 리스트에 넣을 수 있었을 것입니다.
objs.add(1);

// 그리고 런타임에 Java는 ClassCastException을 던질 것입니다: Integer를 String으로 캐스트할 수 없습니다.
String s = strs.get(0); 
```

Java는 런타임 안전성을 보장하기 위해 이러한 것들을 금지합니다. 하지만 여기에는 함의(implications)가 있습니다. 예를 들어, `Collection` 인터페이스의 `addAll()` 메서드를 생각해 봅시다. 이 메서드의 시그니처는 무엇일까요? 직관적으로는 다음과 같이 작성할 것입니다:

```java
// 자바
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

하지만 그렇게 하면 (완전히 안전한) 다음 작업을 수행할 수 없을 것입니다:

```java
// 자바

// 다음 코드는 addAll의 순진한 선언으로는 컴파일되지 않을 것입니다:
// Collection<String>은 Collection<Object>의 하위 타입이 아닙니다.
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

이것이 `addAll()`의 실제 시그니처가 다음과 같은 이유입니다:

```java
// 자바
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_와일드카드 타입 인자_ `? extends E`는 이 메서드가 `E`의 객체들 _또는 `E`의 하위 타입_의 컬렉션을 허용하며, 단순히 `E` 자체만을 허용하지 않음을 나타냅니다. 이는 `E`를 항목들에서 안전하게 _읽을_ 수 있지만(이 컬렉션의 요소들은 `E`의 서브클래스 인스턴스입니다), `E`의 알려지지 않은 하위 타입에 어떤 객체들이 부합하는지 알 수 없으므로 여기에 _쓸_ 수 없음을 의미합니다. 이러한 제약의 대가로, `Collection<String>`이 `Collection<? extends Object>`의 하위 타입이라는 원하는 동작을 얻게 됩니다. 다시 말해, _extends_ 경계(_상위_ 경계)가 있는 와일드카드는 타입을 _공변(covariant)_하게 만듭니다.

이것이 작동하는 이유를 이해하는 핵심은 아주 간단합니다: 컬렉션에서 항목을 _가져오기만_ 할 수 있다면, `String` 컬렉션을 사용하고 거기서 `Object`를 읽는 것은 괜찮습니다. 반대로, 컬렉션에 항목을 _넣기만_ 할 수 있다면, `Object` 컬렉션을 가져와 `String`을 넣는 것도 괜찮습니다: Java에는 `List<? super String>`이 있는데, 이는 `String` 또는 그 상위 타입(supertype)을 허용합니다.

후자는 _반공변(contravariance)_이라고 불리며, `List<? super String>`에 대해 `String`을 인자로 받는 메서드만 호출할 수 있습니다 (예를 들어, `add(String)` 또는 `set(int, String)`을 호출할 수 있습니다). `List<T>`에서 `T`를 반환하는 것을 호출하면 `String`이 아니라 `Object`를 얻게 됩니다.

Joshua Bloch는 그의 저서 [Effective Java, 3판](http://www.oracle.com/technetwork/java/effectivejava-136174.html)에서 이 문제를 잘 설명합니다 (항목 31: "API 유연성을 높이기 위해 경계 있는 와일드카드를 사용하라"). 그는 오직 _읽기만_ 하는 객체를 _생산자(Producers)_라고 명명하고, 오직 _쓰기만_ 하는 객체를 _소비자(Consumers)_라고 명명합니다. 그는 다음과 같이 권장합니다:

>"최대한의 유연성을 위해, 생산자 또는 소비자를 나타내는 입력 파라미터에 와일드카드 타입을 사용하세요."

그런 다음 그는 다음 기억술을 제안합니다: _PECS_는 _Producer-Extends, Consumer-Super_를 의미합니다.

> 생산자-객체, 예를 들어 `List<? extends Foo>`를 사용하는 경우, 이 객체에 `add()` 또는 `set()`을 호출할 수 없지만, 이것이 _불변_하다는 의미는 아닙니다. 예를 들어, `clear()`는 파라미터를 전혀 받지 않으므로 리스트에서 모든 항목을 제거하는 `clear()`를 호출하는 것을 막지 못합니다.
>
> 와일드카드(또는 다른 분산 타입)가 보장하는 유일한 것은 _타입 안전성_입니다. 불변성(immutability)은 완전히 다른 이야기입니다.
>
{style="note"}

### 선언-지점 분산

`T`를 파라미터로 받는 메서드는 없고, 오직 `T`를 반환하는 메서드만 있는 제네릭 인터페이스 `Source<T>`가 있다고 가정해 봅시다:

```java
// 자바
interface Source<T> {
    T nextT();
}
```

그렇다면, `Source<String>` 인스턴스에 대한 참조를 `Source<Object>` 타입의 변수에 저장하는 것은 완벽하게 안전할 것입니다. 호출할 소비자 메서드가 없기 때문입니다. 하지만 Java는 이를 알지 못하며, 여전히 금지합니다:

```java
// 자바
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Java에서는 허용되지 않음
    // ...
}
```

이를 해결하려면 `Source<? extends Object>` 타입의 객체를 선언해야 합니다. 이는 무의미합니다. 왜냐하면 이전과 동일한 모든 메서드를 해당 변수에 호출할 수 있으므로, 더 복잡한 타입으로 인해 추가되는 가치가 없기 때문입니다. 하지만 컴파일러는 이를 알지 못합니다.

Kotlin에는 이러한 종류의 내용을 컴파일러에게 설명하는 방법이 있습니다. 이것을 _선언-지점 분산_이라고 합니다: `Source`의 _타입 파라미터_ `T`에 어노테이션을 달아 `Source<T>`의 멤버로부터 오직 _반환(생산)_되기만 하고, 절대 소비되지 않도록 보장할 수 있습니다. 이를 위해 `out` 변경자를 사용합니다:

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // T가 out 파라미터이므로 이것은 괜찮습니다.
    // ...
}
```

일반적인 규칙은 다음과 같습니다: 클래스 `C`의 타입 파라미터 `T`가 `out`으로 선언되면, `C`의 멤버에서는 _out_ 위치에만 나타날 수 있지만, 그 대가로 `C<Base>`는 `C<Derived>`의 상위 타입이 될 수 있습니다.

다시 말해, 클래스 `C`는 파라미터 `T`에 대해 _공변_하며, `T`는 _공변_ 타입 파라미터라고 말할 수 있습니다. `C`를 `T`들의 _생산자_로, `T`들의 _소비자_가 아닌 것으로 생각할 수 있습니다.

`out` 변경자는 _분산 어노테이션(variance annotation)_이라고 불리며, 타입 파라미터 선언 지점에서 제공되므로 _선언-지점 분산_을 제공합니다. 이는 타입 사용에 있는 와일드카드가 타입을 공변하게 만드는 Java의 _사용-지점 분산(use-site variance)_과 대조됩니다.

`out` 외에도 Kotlin은 보완적인 분산 어노테이션인 `in`을 제공합니다. 이는 타입 파라미터를 _반공변_하게 만들며, 오직 소비될 수만 있고 절대 생산될 수 없음을 의미합니다. 반공변 타입의 좋은 예시는 `Comparable`입니다:

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0은 Double 타입이며, 이는 Number의 하위 타입입니다.
    // 따라서 x를 Comparable<Double> 타입의 변수에 할당할 수 있습니다.
    val y: Comparable<Double> = x // 좋습니다!
}
```

_in_과 _out_이라는 단어는 자명해 보이며(C#에서 이미 꽤 오랫동안 성공적으로 사용되어 왔듯이), 따라서 위에 언급된 기억술은 실제로 필요하지 않습니다. 사실 더 높은 추상화 수준에서 다시 표현될 수 있습니다:

**[실존주의적](https://en.wikipedia.org/wiki/Existentialism) 변환: 소비자는 `in`, 생산자는 `out`!** :-)

## 타입 프로젝션

### 사용-지점 분산: 타입 프로젝션

타입 파라미터 `T`를 `out`으로 선언하고 사용 지점에서 서브타이핑 문제로 인한 어려움을 피하는 것은 매우 쉽지만, 일부 클래스는 실제로 `T`만 반환하도록 제한될 수 _없습니다_! 좋은 예시로 `Array`가 있습니다:

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

이 클래스는 `T`에 대해 공변도 반공변도 될 수 없습니다. 그리고 이는 특정 비유연성을 부과합니다. 다음 함수를 고려해 보세요:

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

이 함수는 한 배열에서 다른 배열로 항목을 복사하기 위한 것입니다. 실제로 적용해 봅시다:

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 타입은 Array<Int>이지만 Array<Any>가 예상되었습니다.
```

여기서 우리는 동일한 익숙한 문제에 부딪힙니다: `Array<T>`는 `T`에 대해 _불공변_하며, 따라서 `Array<Int>`나 `Array<Any>` 중 어느 것도 서로의 하위 타입이 아닙니다. 왜 아닐까요? 다시 말하지만, 이는 `copy` 함수가 예상치 못한 동작을 할 수 있기 때문입니다. 예를 들어, `from`에 `String`을 쓰려고 시도할 수 있으며, 만약 실제로 `Int` 배열을 전달하면 나중에 `ClassCastException`이 발생할 것입니다.

`copy` 함수가 `from`에 _쓰는_ 것을 금지하려면 다음을 수행할 수 있습니다:

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

이것은 _타입 프로젝션_으로, `from`이 단순한 배열이 아니라 제한된(_투영된_) 배열임을 의미합니다. 이 경우에는 `get()`만 호출할 수 있음을 의미하는, 타입 파라미터 `T`를 반환하는 메서드만 호출할 수 있습니다. 이것이 _사용-지점 분산_에 대한 우리의 접근 방식이며, Java의 `Array<? extends Object>`에 해당하면서 약간 더 간단합니다.

`in`을 사용하여 타입도 투영할 수 있습니다:

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>`은 Java의 `Array<? super String>`에 해당합니다. 이는 `fill()` 함수에 `String`, `CharSequence`, 또는 `Object` 배열을 전달할 수 있음을 의미합니다.

### 스타-프로젝션

때로는 타입 인자에 대해 아무것도 모른다고 말하고 싶지만, 여전히 안전한 방식으로 사용하고 싶을 때가 있습니다. 여기서 안전한 방법은 해당 제네릭 타입의 구체적인 모든 인스턴스화가 해당 프로젝션의 하위 타입이 되도록 제네릭 타입의 프로젝션을 정의하는 것입니다.

Kotlin은 이를 위해 소위 _스타-프로젝션(star-projection)_ 구문을 제공합니다:

- `Foo<out T : TUpper>`의 경우, `T`가 상위 경계 `TUpper`를 가진 공변 타입 파라미터일 때, `Foo<*>`는 `Foo<out TUpper>`와 동일합니다. 이는 `T`가 알 수 없을 때 `Foo<*>`에서 `TUpper` 타입의 값을 안전하게 _읽을_ 수 있음을 의미합니다.
- `Foo<in T>`의 경우, `T`가 반공변 타입 파라미터일 때, `Foo<*>`는 `Foo<in Nothing>`과 동일합니다. 이는 `T`가 알 수 없을 때 `Foo<*>`에 안전하게 _쓸_ 수 있는 것이 없음을 의미합니다.
- `Foo<T : TUpper>`의 경우, `T`가 상위 경계 `TUpper`를 가진 불공변 타입 파라미터일 때, `Foo<*>`는 값을 읽을 때는 `Foo<out TUpper>`와, 값을 쓸 때는 `Foo<in Nothing>`과 동일합니다.

제네릭 타입이 여러 타입 파라미터를 가질 경우, 각 파라미터는 독립적으로 투영될 수 있습니다. 예를 들어, 타입이 `interface Function<in T, out U>`로 선언되었다면 다음 스타-프로젝션을 사용할 수 있습니다:

* `Function<*, String>`은 `Function<in Nothing, String>`을 의미합니다.
* `Function<Int, *>`은 `Function<Int, out Any?>`을 의미합니다.
* `Function<*, *>`은 `Function<in Nothing, out Any?>`을 의미합니다.

> 스타-프로젝션은 Java의 로우 타입(raw types)과 매우 유사하지만, 안전합니다.
>
{style="note"}

## 제네릭 함수

클래스만이 타입 파라미터를 가질 수 있는 유일한 선언이 아닙니다. 함수도 가질 수 있습니다. 타입 파라미터는 함수의 이름 _앞_에 위치합니다:

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // extension function
    // ...
}
```

제네릭 함수를 호출하려면, 호출 지점에서 함수의 이름 _뒤_에 타입 인자를 지정합니다:

```kotlin
val l = singletonList<Int>(1)
```

타입 인자는 컨텍스트에서 추론될 수 있다면 생략할 수 있으므로, 다음 예시도 작동합니다:

```kotlin
val l = singletonList(1)
```

## 제네릭 제약

주어진 타입 파라미터에 대체될 수 있는 모든 가능한 타입의 집합은 _제네릭 제약(generic constraints)_에 의해 제한될 수 있습니다.

### 상위 경계

가장 일반적인 제약 타입은 _상위 경계(upper bound)_이며, 이는 Java의 `extends` 키워드에 해당합니다:

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

콜론 뒤에 지정된 타입은 _상위 경계_로, `T`에 `Comparable<T>`의 하위 타입만 대체될 수 있음을 나타냅니다. 예를 들어:

```kotlin
sort(listOf(1, 2, 3)) // 좋습니다. Int는 Comparable<Int>의 하위 타입입니다.
sort(listOf(HashMap<Int, String>())) // 오류: HashMap<Int, String>은 Comparable<HashMap<Int, String>>의 하위 타입이 아닙니다.
```

기본 상위 경계(지정되지 않은 경우)는 `Any?`입니다. 꺾쇠괄호 안에 하나의 상위 경계만 지정할 수 있습니다. 만약 동일한 타입 파라미터에 두 개 이상의 상위 경계가 필요하다면, 별도의 _where_ 절이 필요합니다:

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

전달된 타입은 `where` 절의 모든 조건을 동시에 만족해야 합니다. 위 예시에서 `T` 타입은 `CharSequence`와 `Comparable` _둘 다_ 구현해야 합니다.

## 확실히 널-불가능 타입

제네릭 Java 클래스 및 인터페이스와의 상호 운용성을 쉽게 하기 위해, Kotlin은 제네릭 타입 파라미터를 **확실히 널-불가능(definitely non-nullable)**으로 선언하는 것을 지원합니다.

제네릭 타입 `T`를 확실히 널-불가능으로 선언하려면, `& Any`를 사용하여 타입을 선언합니다. 예를 들어: `T & Any`.

확실히 널-불가능 타입은 널 허용 [상위 경계](#upper-bounds)를 가져야 합니다.

확실히 널-불가능 타입을 선언하는 가장 일반적인 사용 사례는 `@NotNull`을 인자로 포함하는 Java 메서드를 오버라이드하려는 경우입니다. 예를 들어, `load()` 메서드를 고려해 보세요:

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

Kotlin에서 `load()` 메서드를 성공적으로 오버라이드하려면, `T1`이 확실히 널-불가능으로 선언되어야 합니다:

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1은 확실히 널-불가능합니다.
    override fun load(x: T1 & Any): T1 & Any
}
```

Kotlin만으로 작업할 때는 Kotlin의 타입 추론이 이를 처리해 주므로 확실히 널-불가능 타입을 명시적으로 선언할 필요는 없을 가능성이 높습니다.

## 타입 삭제

Kotlin이 제네릭 선언 사용에 대해 수행하는 타입 안전성 검사는 컴파일 시점에 이루어집니다. 런타임에는 제네릭 타입의 인스턴스가 실제 타입 인자에 대한 어떤 정보도 가지고 있지 않습니다. 타입 정보는 _삭제(erased)_되었다고 합니다. 예를 들어, `Foo<Bar>`와 `Foo<Baz?>`의 인스턴스는 단순히 `Foo<*>`로 삭제됩니다.

### 제네릭 타입 검사 및 캐스트

타입 삭제로 인해, 런타임에 제네릭 타입의 인스턴스가 특정 타입 인자로 생성되었는지 확인할 일반적인 방법은 없으며, 컴파일러는 `ints is List<Int>` 또는 `list is T` (타입 파라미터)와 같은 `is` 검사를 금지합니다. 하지만, 인스턴스를 스타-프로젝션된 타입에 대해 검사할 수 있습니다:

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 항목들은 Any? 타입으로 지정됩니다.
}
```

마찬가지로, 인스턴스의 타입 인자가 이미 정적으로(컴파일 시점에) 확인된 경우, 타입의 비제네릭 부분을 포함하는 `is` 검사 또는 캐스트를 수행할 수 있습니다. 이 경우 꺾쇠괄호는 생략됩니다:

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // list는 ArrayList<String>으로 스마트-캐스트됩니다.
    }
}
```

동일한 구문이지만 타입 인자가 생략된 형태는 타입 인자를 고려하지 않는 캐스트에 사용될 수 있습니다: `list as ArrayList`.

제네릭 함수 호출의 타입 인자 또한 컴파일 시점에만 검사됩니다. 함수 본문 내에서는 타입 파라미터가 타입 검사에 사용될 수 없으며, 타입 파라미터로의 타입 캐스트(`foo as T`)는 비검사(unchecked)입니다. 유일한 예외는 [실체화된(reified) 타입 파라미터](inline-functions.md#reified-type-parameters)를 가진 인라인 함수인데, 이들은 각 호출 지점에서 실제 타입 인자가 인라인됩니다. 이는 타입 파라미터에 대한 타입 검사 및 캐스트를 가능하게 합니다. 하지만, 위에 설명된 제약은 검사 또는 캐스트 내부에서 사용되는 제네릭 타입의 인스턴스에는 여전히 적용됩니다. 예를 들어, `arg is T` 타입 검사에서 `arg`가 제네릭 타입 자체의 인스턴스라면, 해당 타입 인자는 여전히 삭제됩니다.

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 컴파일되지만 타입 안전성을 깨뜨립니다!
// 자세한 내용은 샘플을 확장하세요.

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 목록 항목이 String이 아니므로 ClassCastException이 발생합니다.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 비검사 캐스트

`foo as List<String>`과 같이 구체적인 타입 인자를 가진 제네릭 타입으로의 타입 캐스트는 런타임에 검사될 수 없습니다. 이러한 비검사 캐스트는 상위 수준 프로그램 로직에 의해 타입 안전성이 암시되지만 컴파일러가 직접 추론할 수 없을 때 사용될 수 있습니다. 아래 예시를 참조하세요.

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("문자열과 임의의 요소 간의 매핑을 읽습니다.")
}

// 이 파일에 Int를 가진 맵을 저장했습니다.
val intsFile = File("ints.dictionary")

// 경고: 비검사 캐스트: `Map<String, *>`를 `Map<String, Int>`로
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
마지막 줄의 캐스트에 대한 경고가 나타납니다. 컴파일러는 런타임에 이를 완전히 확인할 수 없으며, 맵의 값이 `Int`임을 보장하지 않습니다.

비검사 캐스트를 피하려면 프로그램 구조를 재설계할 수 있습니다. 위 예시에서는 `DictionaryReader<T>` 및 `DictionaryWriter<T>` 인터페이스를 다양한 타입에 대한 타입-안전 구현과 함께 사용할 수 있습니다. 호출 지점의 비검사 캐스트를 구현 세부 사항으로 이동시키기 위해 합리적인 추상화를 도입할 수 있습니다. [제네릭 분산](#variance)의 적절한 사용도 도움이 될 수 있습니다.

제네릭 함수의 경우, [실체화된 타입 파라미터](inline-functions.md#reified-type-parameters)를 사용하면 `arg`의 타입이 삭제되는 *자체* 타입 인자를 가지고 있지 않는 한 `arg as T`와 같은 캐스트가 검사됩니다.

비검사 캐스트 경고는 해당 경고가 발생하는 문장이나 선언에 `@Suppress("UNCHECKED_CAST")`로 [어노테이션](annotations.md)을 달아 억제할 수 있습니다:

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

> **JVM에서**: [배열 타입](arrays.md)(`Array<Foo>`)은 요소의 삭제된 타입에 대한 정보를 유지하며, 배열 타입으로의 타입 캐스트는 부분적으로 검사됩니다: 요소 타입의 널 허용성 및 실제 타입 인자는 여전히 삭제됩니다. 예를 들어, `foo as Array<List<String>?>` 캐스트는 `foo`가 널 허용 여부와 관계없이 어떤 `List<*>`를 담고 있는 배열인 경우 성공합니다.
>
{style="note"}

## 타입 인자를 위한 밑줄 연산자

밑줄 연산자 `_`는 타입 인자에 사용될 수 있습니다. 다른 타입이 명시적으로 지정될 때 인자의 타입을 자동으로 추론하는 데 사용합니다:

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