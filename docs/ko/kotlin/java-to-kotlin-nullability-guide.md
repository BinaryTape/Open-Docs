[//]: # (title: Java 및 Kotlin의 널 가능성)
[//]: # (description: Java에서 Kotlin으로 널 가능성 구문을 마이그레이션하는 방법을 알아봅니다. 이 가이드는 Kotlin의 널 가능 타입 지원, Kotlin이 Java의 널 가능성 어노테이션을 처리하는 방법 등을 다룹니다.)

_널 가능성_은 변수가 `null` 값을 가질 수 있는 능력입니다.
변수가 `null`을 포함할 때, 변수를 역참조하려는 시도는 `NullPointerException`으로 이어집니다.
널 포인터 예외를 받을 가능성을 최소화하기 위해 코드를 작성하는 방법은 여러 가지가 있습니다.

이 가이드는 잠재적으로 널 가능성 변수를 다루는 자바와 코틀린의 접근 방식 간의 차이점을 다룹니다.
이를 통해 자바에서 코틀린으로 마이그레이션하고 코틀린다운 코드를 작성하는 데 도움이 될 것입니다.

이 가이드의 첫 번째 부분은 가장 중요한 차이점, 즉 코틀린의 널 가능 타입 지원과
코틀린이 [자바 코드의 타입](#platform-types)을 처리하는 방법을 다룹니다. 두 번째 부분은
[함수 호출 결과 확인](#checking-the-result-of-a-function-call)부터 시작하여 특정 차이점을 설명하기 위해 몇 가지 구체적인 사례를 검토합니다.

[코틀린의 널 안정성에 대해 자세히 알아보기](null-safety.md).

## 널 가능 타입 지원

코틀린과 자바의 타입 시스템 간의 가장 중요한 차이점은 코틀린이 [널 가능 타입](null-safety.md)을 명시적으로 지원한다는 점입니다.
이는 어떤 변수가 `null` 값을 가질 수 있는지를 나타내는 방법입니다.
변수가 `null`일 수 있다면, 이 변수에 대해 메서드를 호출하는 것은 안전하지 않습니다. `NullPointerException`이 발생할 수 있기 때문입니다.
코틀린은 컴파일 시점에 이러한 호출을 금지하여 수많은 잠재적 예외를 방지합니다.
런타임에는 널 가능 타입 객체와 널 불가능 타입 객체가 동일하게 처리됩니다:
널 가능 타입은 널 불가능 타입의 래퍼가 아닙니다. 모든 검사는 컴파일 시점에 수행됩니다.
즉, 코틀린에서 널 가능 타입을 다루는 데 런타임 오버헤드가 거의 없습니다.

> "거의"라고 말하는 이유는 [내장된](https://en.wikipedia.org/wiki/Intrinsic_function) 검사가 생성되기는 하지만,
> 그 오버헤드가 미미하기 때문입니다.
>
{style="note"}

자바에서는 널 검사를 수행하지 않으면 메서드가 `NullPointerException`을 발생시킬 수 있습니다:

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
}
```
{id="get-length-of-null-java"}

이 호출은 다음과 같은 출력을 보여줍니다:

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

코틀린에서는 명시적으로 널 가능 타입으로 표시하지 않는 한 모든 일반 타입은 기본적으로 널 불가능 타입입니다.
`a`가 `null`이 아니기를 기대한다면, `stringLength()` 함수를 다음과 같이 선언하세요:

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

매개변수 `a`는 `String` 타입인데, 코틀린에서는 항상 `String` 인스턴스를 포함해야 하며 `null`을 포함할 수 없음을 의미합니다.
코틀린의 널 가능 타입은 물음표 `?`로 표시됩니다. 예를 들어, `String?`과 같습니다.
컴파일러가 `stringLength()`의 모든 인수가 `null`이 아니어야 한다는 규칙을 강제하기 때문에 `a`가 `String` 타입인 경우 런타임에 `NullPointerException`이 발생하는 상황은 불가능합니다.

`null` 값을 `stringLength(a: String)` 함수에 전달하려고 시도하면 "Null can not be a value of a non-null type String"이라는 컴파일 시점 오류가 발생합니다:

![널 불가능 함수에 널을 전달하는 오류](passing-null-to-function.png){width=700}

`null`을 포함하여 어떤 인수로든 이 함수를 사용하고 싶다면, 인자 타입 `String?` 뒤에 물음표를 사용하고 함수 본문 내에서 인자의 값이 `null`이 아닌지 확인하세요:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

검사가 성공적으로 완료되면, 컴파일러는 해당 검사를 수행하는 스코프에서 변수를 마치 널 불가능 타입 `String`인 것처럼 취급합니다.

이 검사를 수행하지 않으면 코드는 다음 메시지와 함께 컴파일에 실패합니다:
"String? 타입의 [널 가능 리시버](extensions.md#nullable-receiver)에는 [안전 호출(?.)](null-safety.md#safe-call-operator) 또는 [널 불가능 단정(!!.) 호출](null-safety.md#not-null-assertion-operator)만 허용됩니다."

동일한 내용을 더 짧게 작성할 수 있습니다. [안전 호출 연산자 `?.` (널이 아닐 경우 단축 표기)](idioms.md#if-not-null-shorthand)를 사용하면
널 검사와 메서드 호출을 단일 연산으로 결합할 수 있습니다:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 플랫폼 타입

자바에서는 변수가 `null`일 수 있는지 없는지를 나타내는 어노테이션을 사용할 수 있습니다.
이러한 어노테이션은 표준 라이브러리의 일부가 아니지만, 별도로 추가할 수 있습니다.
예를 들어, JetBrains 어노테이션인 `@Nullable` 및 `@NotNull`(`org.jetbrains.annotations` 패키지)
또는 Eclipse 어노테이션(`org.eclipse.jdt.annotation`)을 사용할 수 있습니다.
코틀린은 [코틀린 코드에서 자바 코드를 호출](java-interop.md#nullability-annotations)할 때 이러한 어노테이션을 인식하고
어노테이션에 따라 타입을 처리합니다.

자바 코드에 이러한 어노테이션이 없다면, 코틀린은 자바 타입을 _플랫폼 타입_으로 처리합니다.
하지만 코틀린은 이러한 타입에 대한 널 가능성 정보를 가지고 있지 않으므로, 컴파일러는 해당 타입에 대한 모든 연산을 허용합니다.
널 검사를 수행할지 여부를 결정해야 합니다. 그 이유는 다음과 같습니다:

*   자바와 마찬가지로, `null`에 대해 연산을 수행하려고 시도하면 `NullPointerException`이 발생합니다.
*   널 불가능 타입 값에 대해 널 안정성 연산을 수행할 때 일반적으로 하는 것처럼, 컴파일러는 불필요한 널 검사를 강조 표시하지 않습니다.

[널 안정성 및 플랫폼 타입과 관련하여 코틀린에서 자바 호출](java-interop.md#null-safety-and-platform-types)에 대해 자세히 알아보세요.

## 확실히 널 불가능 타입 지원

코틀린에서 `@NotNull`을 인수로 포함하는 자바 메서드를 오버라이드하려면 코틀린의 확실히 널 불가능 타입이 필요합니다.

예를 들어, 자바의 `load()` 메서드를 살펴보세요:

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

코틀린에서 `load()` 메서드를 성공적으로 오버라이드하려면 `T1`을 확실히 널 불가능(`T1 & Any`)으로 선언해야 합니다:

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

[확실히 널 불가능한](generics.md#definitely-non-nullable-types) 제네릭 타입에 대해 자세히 알아보세요.

## 함수 호출 결과 확인

`null`을 확인해야 하는 가장 일반적인 상황 중 하나는 함수 호출에서 결과를 얻을 때입니다.

다음 예시에는 `Order`와 `Customer` 두 클래스가 있습니다. `Order`는 `Customer` 인스턴스에 대한 참조를 가지고 있습니다.
`findOrder()` 함수는 `Order` 클래스의 인스턴스를 반환하거나, 주문을 찾을 수 없는 경우 `null`을 반환합니다.
목표는 검색된 주문의 고객 인스턴스를 처리하는 것입니다.

다음은 자바의 클래스입니다:

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

자바에서는 함수를 호출하고 결과에 대해 널이 아닐 경우(if-not-null) 검사를 수행하여 필요한 프로퍼티의 역참조를 진행합니다:

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

위 자바 코드를 코틀린 코드로 직접 변환하면 다음과 같습니다:

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
{id="process-customer-if-not-null-kotlin"}

[안전 호출 연산자 `?.` (널이 아닐 경우 단축 표기)](idioms.md#if-not-null-shorthand)를
표준 라이브러리의 [스코프 함수](scope-functions.md) 중 하나와 함께 사용하세요.
`let` 함수가 일반적으로 이에 사용됩니다:

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

다음은 동일한 내용을 더 짧게 표현한 버전입니다:

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## null 대신 기본값

값을 `null`로 확인하는 것은 해당 값이 `null`일 때 [기본값을 설정하는 것](functions.md#default-arguments)과 종종 함께 사용됩니다.

널 검사가 포함된 자바 코드:

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

코틀린에서 동일한 내용을 표현하려면 [엘비스 연산자 (널이 아닐 경우-그 외 단축 표기)](null-safety.md#elvis-operator)를 사용합니다:

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 값을 반환하거나 null을 반환하는 함수

자바에서는 리스트 요소와 작업할 때 주의해야 합니다. 요소를 사용하려고 시도하기 전에 항상 특정 인덱스에 요소가 존재하는지 확인해야 합니다:

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

코틀린 표준 라이브러리는 이름에 `null` 값을 반환할 가능성이 있는지 나타내는 함수를 자주 제공합니다.
이는 컬렉션 API에서 특히 흔합니다:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // The same code as in Java:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // Can throw IndexOutOfBoundsException if the collection is empty
    //numbers.get(5)     // Exception!

    // More abilities:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 집계 연산

가장 큰 요소를 가져오거나 요소가 없을 경우 `null`을 가져와야 할 때, 자바에서는 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용합니다:

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

코틀린에서는 [집계 연산](collection-aggregate.md)을 사용합니다:

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

[자바와 코틀린의 컬렉션](java-to-kotlin-collections-guide.md)에 대해 자세히 알아보세요.

## 타입을 안전하게 캐스팅하기

타입을 안전하게 캐스팅해야 할 때, 자바에서는 `instanceof` 연산자를 사용한 다음 제대로 동작했는지 확인합니다:

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```
{id="casting-types-java"}

코틀린에서 예외를 피하려면 실패 시 `null`을 반환하는 [안전 캐스트 연산자](typecasts.md#safe-nullable-cast-operator) `as?`를 사용하세요:

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
{kotlin-runnable="true" id="casting-types-kotlin"}

> 위 자바 예시에서 `getStringLength()` 함수는 기본 타입 `int`의 결과를 반환합니다.
> `null`을 반환하도록 만들려면 `_박싱된_ 타입` `Integer`를 사용할 수 있습니다.
> 하지만 이러한 함수가 음수 값을 반환하도록 하고 그 값을 확인하는 것이 더 자원 효율적입니다.
> 어차피 검사를 수행해야 하지만, 이렇게 하면 추가적인 박싱이 수행되지 않습니다.
>
{style="note"}

## 다음 단계는 무엇인가요?

*   다른 [코틀린 이디엄](idioms.md) 살펴보기.
*   [Java-Kotlin (J2K) 변환기](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 자바 코드를 코틀린으로 변환하는 방법 알아보기.
*   다른 마이그레이션 가이드 확인하기:
    *   [Java 및 Kotlin의 문자열](java-to-kotlin-idioms-strings.md)
    *   [Java 및 Kotlin의 컬렉션](java-to-kotlin-collections-guide.md)

좋아하는 이디엄이 있다면, 풀 리퀘스트를 보내 저희와 공유해 주세요!