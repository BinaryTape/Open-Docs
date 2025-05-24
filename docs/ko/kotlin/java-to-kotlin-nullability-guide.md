---
title: "Java 및 Kotlin의 Null 가능성"
description: "Nullable 구조를 Java에서 Kotlin으로 마이그레이션하는 방법을 알아봅니다. 이 가이드에서는 Kotlin의 Nullable 유형 지원, Kotlin이 Java의 Nullable 어노테이션을 처리하는 방법 등을 다룹니다."
---
_Nullability_는 변수가 `null` 값을 가질 수 있는 기능입니다.
변수가 `null`을 포함할 때, 변수를 역참조하려고 시도하면 `NullPointerException`이 발생합니다.
null 포인터 예외를 받을 확률을 최소화하기 위해 코드를 작성하는 방법은 다양합니다.

이 가이드에서는 null 가능 변수를 처리하는 Java와 Kotlin의 접근 방식의 차이점을 다룹니다.
Java에서 Kotlin으로 마이그레이션하고 실제 Kotlin 스타일로 코드를 작성하는 데 도움이 될 것입니다.

이 가이드의 첫 번째 부분에서는 가장 중요한 차이점인 Kotlin의 nullable 타입 지원과
Kotlin이 [Java 코드의 타입을 처리하는 방법](#platform-types)을 다룹니다. 두 번째 부분은
[함수 호출 결과 확인](#checking-the-result-of-a-function-call)부터 특정 차이점을 설명하기 위해 몇 가지 구체적인 사례를 살펴봅니다.

[Kotlin의 null 안전성에 대해 자세히 알아보세요](null-safety).

## Nullable 타입 지원

Kotlin과 Java 타입 시스템의 가장 중요한 차이점은 Kotlin이 [nullable 타입](null-safety)을 명시적으로 지원한다는 것입니다.
이는 어떤 변수가 `null` 값을 가질 수 있는지 나타내는 방법입니다.
변수가 `null`일 수 있다면 `NullPointerException`을 일으킬 수 있으므로 변수에 대해 메서드를 호출하는 것은 안전하지 않습니다.
Kotlin은 컴파일 시 이러한 호출을 금지하여 발생 가능한 예외를 많이 방지합니다.
런타임 시 nullable 타입의 객체와 non-nullable 타입의 객체는 동일하게 처리됩니다.
nullable 타입은 non-nullable 타입에 대한 래퍼가 아닙니다. 모든 검사는 컴파일 시에 수행됩니다.
즉, Kotlin에서 nullable 타입으로 작업하는 데 거의 런타임 오버헤드가 없습니다.

:::note
[내장 함수](https://en.wikipedia.org/wiki/Intrinsic_function) 검사가 생성되더라도 오버헤드는 최소화됩니다.

:::

Java에서는 null 검사를 작성하지 않으면 메서드가 `NullPointerException`을 throw할 수 있습니다.

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
}
```

이 호출은 다음과 같은 출력을 갖습니다.

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

Kotlin에서는 명시적으로 nullable로 표시하지 않는 한 모든 일반 타입은 기본적으로 non-nullable입니다.
`a`가 `null`이 될 것으로 예상하지 않으면 `stringLength()` 함수를 다음과 같이 선언합니다.

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```

파라미터 `a`는 `String` 타입을 가지며, Kotlin에서 이는 항상 `String` 인스턴스를 포함해야 하며 `null`을 포함할 수 없음을 의미합니다.
Kotlin에서 nullable 타입은 물음표 `?`로 표시됩니다(예: `String?`).
컴파일러는 `stringLength()`의 모든 인수가 `null`이 아니어야 한다는 규칙을 적용하므로 런타임 시 `NullPointerException`이 발생하는 것은 불가능합니다(만약 `a`가 `String`인 경우).

`null` 값을 `stringLength(a: String)` 함수에 전달하려고 하면 컴파일 시간 오류인 "Null can not be a value of a non-null type String"이 발생합니다.

<img src="/img/passing-null-to-function.png" alt="Passing null to a non-nullable function error" width="700" style={{verticalAlign: 'middle'}}/>

`null`을 포함한 모든 인수로 이 함수를 사용하려면 인수 타입 `String?` 뒤에 물음표를 사용하고 함수 본문 내에서 인수의 값이 `null`이 아닌지 확인합니다.

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```

검사가 성공적으로 통과되면 컴파일러는 컴파일러가 검사를 수행하는 범위에서 변수를 non-nullable 타입 `String`인 것처럼 취급합니다.

이 검사를 수행하지 않으면 코드가 컴파일되지 않고 다음 메시지가 표시됩니다.
"Only [safe (?.)](null-safety#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions#nullable-receiver) of type String?".

더 짧게 동일하게 작성할 수 있습니다. [safe-call 연산자 ?. (If-not-null shorthand)](idioms#if-not-null-shorthand)를 사용하십시오.
이 연산자를 사용하면 null 검사와 메서드 호출을 단일 작업으로 결합할 수 있습니다.

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```

## 플랫폼 타입

Java에서는 변수가 `null`이 될 수 있는지 여부를 나타내는 어노테이션을 사용할 수 있습니다.
이러한 어노테이션은 표준 라이브러리의 일부가 아니지만 별도로 추가할 수 있습니다.
예를 들어 JetBrains 어노테이션 `@Nullable` 및 `@NotNull`(`org.jetbrains.annotations` 패키지에서) 또는 Eclipse의 어노테이션(`org.eclipse.jdt.annotation`)을 사용할 수 있습니다.
Kotlin은 [Kotlin 코드에서 Java 코드를 호출할 때](java-interop#nullability-annotations) 이러한 어노테이션을 인식하고 어노테이션에 따라 타입을 처리합니다.

Java 코드에 이러한 어노테이션이 없으면 Kotlin은 Java 타입을 _플랫폼 타입_으로 취급합니다.
그러나 Kotlin에는 이러한 타입에 대한 nullability 정보가 없으므로 컴파일러는 해당 타입에 대한 모든 작업을 허용합니다.
다음과 같은 이유로 null 검사를 수행할지 여부를 결정해야 합니다.

* Java에서와 마찬가지로 `null`에 대해 작업을 수행하려고 하면 `NullPointerException`이 발생합니다.
* 컴파일러는 non-nullable 타입의 값에 대해 null-safe 작업을 수행할 때 일반적으로 수행하는 불필요한 null 검사를 강조 표시하지 않습니다.

[null 안전성 및 플랫폼 타입과 관련된 Kotlin에서 Java 호출](java-interop#null-safety-and-platform-types)에 대해 자세히 알아보세요.

## Definitely non-nullable 타입 지원

Kotlin에서 `@NotNull`을 인수로 포함하는 Java 메서드를 오버라이드하려면 Kotlin의 definitely non-nullable 타입이 필요합니다.

예를 들어 Java에서 다음과 같은 `load()` 메서드를 고려해 보세요.

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

Kotlin에서 `load()` 메서드를 성공적으로 오버라이드하려면 `T1`을 definitely non-nullable(`T1 & Any`)로 선언해야 합니다.

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

[definitely non-nullable](generics#definitely-non-nullable-types)인 제네릭 타입에 대해 자세히 알아보세요.

## 함수 호출 결과 확인

`null`을 확인해야 하는 가장 일반적인 상황 중 하나는 함수 호출에서 결과를 얻을 때입니다.

다음 예제에는 두 개의 클래스인 `Order`와 `Customer`가 있습니다. `Order`에는 `Customer` 인스턴스에 대한 참조가 있습니다.
`findOrder()` 함수는 `Order` 클래스의 인스턴스를 반환하거나, 주문을 찾을 수 없는 경우 `null`을 반환합니다.
목표는 검색된 주문의 고객 인스턴스를 처리하는 것입니다.

다음은 Java의 클래스입니다.

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

Java에서 함수를 호출하고 결과에 대해 if-not-null 검사를 수행하여 필요한 속성의 역참조를 진행합니다.

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```

위의 Java 코드를 Kotlin 코드로 직접 변환하면 다음과 같습니다.

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// Direct conversion
if (order != null){
    processCustomer(order.customer)
}
```

[safe-call 연산자 `?.` (If-not-null shorthand)](idioms#if-not-null-shorthand)를
표준 라이브러리의 [scope 함수](scope-functions)와 함께 사용합니다.
`let` 함수는 일반적으로 이를 위해 사용됩니다.

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```

다음은 동일한 내용의 더 짧은 버전입니다.

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```

## null 대신 기본값

`null` 검사는 null 검사가 성공한 경우 [기본값 설정](functions#default-arguments)과 함께 자주 사용됩니다.

null 검사가 있는 Java 코드:

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```

Kotlin에서 동일한 내용을 표현하려면 [Elvis 연산자 (If-not-null-else shorthand)](null-safety#elvis-operator)를 사용합니다.

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```

## 값 또는 null을 반환하는 함수

Java에서는 목록 요소로 작업할 때 주의해야 합니다. 요소를 사용하기 전에 항상 해당 인덱스에 요소가 있는지 확인해야 합니다.

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```

Kotlin 표준 라이브러리는 이름이 `null` 값을 반환할 수 있는지 여부를 나타내는 함수를 제공하는 경우가 많습니다.
이것은 특히 컬렉션 API에서 일반적입니다.

```kotlin
fun main() {

    // Kotlin
    // The same code as in Java:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // Can throw IndexOutOfBoundsException if the collection is empty
    //numbers.get(5)     // Exception!

    // More abilities:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null

}
```

## 집계 연산

요소가 없는 경우 가장 큰 요소 또는 `null`을 가져와야 하는 경우 Java에서는
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용합니다.

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```

Kotlin에서는 [집계 연산](collection-aggregate)을 사용합니다.

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```

[Java 및 Kotlin의 컬렉션](java-to-kotlin-collections-guide)에 대해 자세히 알아보세요.

## 안전하게 타입 캐스팅

타입을 안전하게 캐스팅해야 하는 경우 Java에서는 `instanceof` 연산자를 사용한 다음 작동 방식을 확인합니다.

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```

Kotlin에서 예외를 방지하려면 실패 시 `null`을 반환하는 [safe cast 연산자](typecasts#safe-nullable-cast-operator) `as?`를 사용합니다.

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // Prints `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // Returns -1 because `x` is null
}
```

:::note
위의 Java 예제에서 함수 `getStringLength()`는 primitive 타입 `int`의 결과를 반환합니다.
`null`을 반환하게 하려면 [_boxed_ 타입](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`를 사용할 수 있습니다.
그러나 이러한 함수가 음수 값을 반환한 다음 값을 확인하는 것이 더 효율적입니다.
어쨌든 검사를 수행하겠지만 이 방법으로는 추가 boxing이 수행되지 않습니다.

:::

## 다음 단계

* 다른 [Kotlin 관용구](idioms)를 살펴보세요.
* [Java-to-Kotlin (J2K) 변환기](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 알아보세요.
* 다른 마이그레이션 가이드를 확인하세요.
  * [Java 및 Kotlin의 문자열](java-to-kotlin-idioms-strings)
  * [Java 및 Kotlin의 컬렉션](java-to-kotlin-collections-guide)

좋아하는 관용구가 있다면 언제든지 pull request를 보내서 공유해 주세요!