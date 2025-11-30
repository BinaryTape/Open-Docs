[//]: # (title: Java와 Kotlin의 Null 허용성)

<web-summary>Java의 Null 허용 구성 요소를 Kotlin으로 마이그레이션하는 방법을 알아보세요. 이 가이드에서는 Kotlin의 Null 허용 타입 지원, Kotlin이 Java의 Null 허용 어노테이션을 처리하는 방식 등을 다룹니다.</web-summary>

_Null 허용성(Nullability)_ 은 변수가 `null` 값을 가질 수 있는 능력을 말합니다.
변수가 `null`을 포함할 때, 해당 변수를 역참조하려고 시도하면 `NullPointerException`이 발생합니다.
Null 포인터 예외가 발생할 가능성을 최소화하기 위해 코드를 작성하는 방법은 여러 가지가 있습니다.

이 가이드는 잠재적으로 Null 허용 변수를 다루는 Java와 Kotlin의 접근 방식 간의 차이점을 다룹니다.
이것은 Java에서 Kotlin으로 마이그레이션하고 Kotlin다운 스타일로 코드를 작성하는 데 도움이 될 것입니다.

이 가이드의 첫 번째 부분은 가장 중요한 차이점, 즉 Kotlin의 Null 허용 타입 지원과 Kotlin이 [Java 코드의 타입](#platform-types)을 처리하는 방식을 다룹니다. 두 번째 부분은
[함수 호출 결과 확인하기](#checking-the-result-of-a-function-call)부터 시작하여 특정 차이점을 설명하기 위한 몇 가지 구체적인 사례를 살펴봅니다.

[Kotlin의 Null 안전성에 대해 더 알아보기](null-safety.md).

## Null 허용 타입 지원

Kotlin과 Java의 타입 시스템 간의 가장 중요한 차이점은 Kotlin의 [Null 허용 타입](null-safety.md)에 대한 명시적 지원입니다.
이는 어떤 변수가 `null` 값을 가질 수 있는지를 나타내는 방법입니다.
변수가 `null`일 수 있다면, 해당 변수에 대해 메서드를 호출하는 것은 안전하지 않습니다. 왜냐하면 `NullPointerException`이 발생할 수 있기 때문입니다.
Kotlin은 컴파일 시 이러한 호출을 금지하여 많은 잠재적 예외를 방지합니다.
런타임 시 Null 허용 타입의 객체와 Null 비허용 타입의 객체는 동일하게 처리됩니다.
Null 허용 타입은 Null 비허용 타입을 위한 래퍼가 아닙니다. 모든 검사는 컴파일 시 수행됩니다.
이는 Kotlin에서 Null 허용 타입으로 작업하는 데 런타임 오버헤드가 거의 없음을 의미합니다.

> "거의"라고 말하는 이유는 [내장(intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) 검사가 _생성되지만_,
그 오버헤드가 미미하기 때문입니다.
>
{style="note"}

Java에서는 Null 검사를 작성하지 않으면 메서드가 `NullPointerException`을 던질 수 있습니다:

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

이 호출은 다음과 같은 출력을 가집니다:

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

Kotlin에서는 모든 일반 타입은 명시적으로 Null 허용으로 표시하지 않는 한 기본적으로 Null 비허용입니다.
`a`가 `null`이 아닐 것으로 예상한다면, `stringLength()` 함수를 다음과 같이 선언합니다:

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

매개변수 `a`는 `String` 타입을 가지며, Kotlin에서 이는 항상 `String` 인스턴스를 포함해야 하고 `null`을 포함할 수 없음을 의미합니다.
Kotlin에서 Null 허용 타입은 물음표 `?`로 표시됩니다. 예를 들어, `String?`과 같습니다.
컴파일러가 `stringLength()`의 모든 인수가 `null`이 아니어야 한다는 규칙을 적용하기 때문에 `a`가 `String`일 경우 런타임 시 `NullPointerException`이 발생하는 상황은 불가능합니다.

`null` 값을 `stringLength(a: String)` 함수에 전달하려고 시도하면 컴파일 타임 오류 "Null can not be a value of a non-null type String"이 발생합니다:

![Null 비허용 함수에 null 전달 오류](passing-null-to-function.png){width=700}

`null`을 포함한 모든 인수로 이 함수를 사용하려면, 인수 타입 `String?` 뒤에 물음표를 사용하고 함수 본문 내에서 인수의 값이 `null`이 아닌지 확인하세요:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

검사가 성공적으로 통과된 후, 컴파일러는 해당 변수를 컴파일러가 검사를 수행하는 범위 내에서 Null 비허용 타입 `String`인 것처럼 취급합니다.

이 검사를 수행하지 않으면 코드는 다음 메시지와 함께 컴파일에 실패합니다:
"Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions.md#nullable-receivers) of type String?".

더 짧게 작성할 수 있습니다. Null 검사와 메서드 호출을 단일 작업으로 결합할 수 있게 해주는 [안전 호출 연산자 `?.` (If-not-null 단축 표현)](idioms.md#if-not-null-shorthand)를 사용하세요:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 플랫폼 타입

Java에서는 변수가 `null`일 수 있는지 없는지를 나타내는 어노테이션을 사용할 수 있습니다.
이러한 어노테이션은 표준 라이브러리의 일부가 아니지만, 별도로 추가할 수 있습니다.
예를 들어, JetBrains 어노테이션 `@Nullable` 및 `@NotNull` ( `org.jetbrains.annotations` 패키지에서)
또는 [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`) 어노테이션, 또는 Eclipse 어노테이션 (`org.eclipse.jdt.annotation`)을 사용할 수 있습니다.
Kotlin은 [Kotlin 코드에서 Java 코드를 호출할 때](java-interop.md#nullability-annotations) 이러한 어노테이션을 인식하고 해당 어노테이션에 따라 타입을 처리합니다.

Java 코드에 이러한 어노테이션이 없다면, Kotlin은 Java 타입을 _플랫폼 타입_으로 취급합니다.
하지만 Kotlin은 이러한 타입에 대한 Null 허용성 정보가 없으므로, 컴파일러는 모든 작업을 허용합니다.
Null 검사를 수행할지 여부를 결정해야 합니다. 왜냐하면:

*   Java에서와 마찬가지로 `null`에 대해 작업을 수행하려고 하면 `NullPointerException`이 발생합니다.
*   컴파일러는 일반적으로 Null 비허용 타입의 값에 대해 Null-안전 작업을 수행할 때와 달리, 중복된 Null 검사를 강조 표시하지 않습니다.

[Null 안전성 및 플랫폼 타입과 관련하여 Kotlin에서 Java를 호출하는 방법](java-interop.md#null-safety-and-platform-types)에 대해 자세히 알아보세요.

## Definite Null 비허용 타입 지원

Kotlin에서 `@NotNull`을 인수로 포함하는 Java 메서드를 오버라이드하려면 Kotlin의 Definite Null 비허용 타입이 필요합니다.

예를 들어, Java의 다음 `load()` 메서드를 고려해 보세요:

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

Kotlin에서 `load()` 메서드를 성공적으로 오버라이드하려면, `T1`을 Definite Null 비허용(`T1 & Any`)으로 선언해야 합니다:

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

[Definite Null 비허용 제네릭 타입](generics.md#definitely-non-nullable-types)에 대해 자세히 알아보세요.

## 함수 호출 결과 확인하기

`null`을 확인해야 하는 가장 일반적인 상황 중 하나는 함수 호출에서 결과를 얻을 때입니다.

다음 예제에는 `Order`와 `Customer` 두 개의 클래스가 있습니다. `Order`는 `Customer` 인스턴스에 대한 참조를 가집니다.
`findOrder()` 함수는 `Order` 클래스의 인스턴스를 반환하거나, 주문을 찾을 수 없는 경우 `null`을 반환합니다.
목표는 검색된 주문의 고객 인스턴스를 처리하는 것입니다.

Java의 클래스는 다음과 같습니다:

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

Java에서는 함수를 호출하고 결과에 대해 `if-not-null` 검사를 수행하여 필요한 속성을 역참조합니다:

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

위 Java 코드를 Kotlin 코드로 직접 변환하면 다음과 같습니다:

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

표준 라이브러리의 [스코프 함수](scope-functions.md)와 함께 [안전 호출 연산자 `?.` (If-not-null 단축 표현)](idioms.md#if-not-null-shorthand)를 사용하세요.
`let` 함수가 일반적으로 사용됩니다:

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

다음은 동일한 코드의 더 짧은 버전입니다:

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## null 대신 기본값

`null` 검사는 Null 검사가 성공할 경우 [기본값 설정](functions.md#parameters-with-default-values)과 함께 자주 사용됩니다.

Null 검사가 포함된 Java 코드:

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

Kotlin에서 동일한 것을 표현하려면 [엘비스 연산자 (If-not-null-else 단축 표현)](null-safety.md#elvis-operator)를 사용하세요:

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 값을 반환하거나 null을 반환하는 함수

Java에서는 리스트 요소로 작업할 때 주의해야 합니다. 요소를 사용하기 전에 항상 인덱스에 요소가 존재하는지 확인해야 합니다:

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

Kotlin 표준 라이브러리는 Null 값을 반환할 수 있는지 여부를 이름으로 나타내는 함수를 자주 제공합니다.
이는 컬렉션 API에서 특히 일반적입니다:

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

가장 큰 요소를 얻거나 요소가 없을 경우 `null`을 얻어야 할 때, Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용합니다:

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

Kotlin에서는 [집계 연산](collection-aggregate.md)을 사용합니다:

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

[Java와 Kotlin의 컬렉션](java-to-kotlin-collections-guide.md)에 대해 자세히 알아보세요.

## 타입 안전하게 형변환하기

타입을 안전하게 형변환해야 할 때, Java에서는 `instanceof` 연산자를 사용하고 그 작동 여부를 확인합니다:

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

Kotlin에서 예외를 피하려면 실패 시 `null`을 반환하는 [안전 형변환 연산자](typecasts.md#unsafe-cast-operator) `as?`를 사용하세요:

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

> 위 Java 예제에서 `getStringLength()` 함수는 기본 타입 `int`의 결과를 반환합니다.
`null`을 반환하게 하려면 [_박싱된_ 타입](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`를 사용할 수 있습니다.
하지만, 그러한 함수가 음수 값을 반환하고 해당 값을 확인하는 것이 리소스 효율적입니다.
어쨌든 검사를 수행해야 하지만, 이 방식으로는 추가적인 박싱이 수행되지 않습니다.
>
{style="note"}

Java 코드를 Kotlin으로 마이그레이션할 때, 코드의 원래 의미를 보존하기 위해 초기에는 Null 허용 타입과 함께 일반 형변환 연산자 `as`를 사용할 수 있습니다. 하지만 더 안전하고 Kotlin스러운 접근 방식을 위해 안전 형변환 연산자 `as?`를 사용하도록 코드를 조정하는 것이 좋습니다. 예를 들어, 다음 Java 코드가 있다면:

```java
public class UserProfile {
    Object data;

    public static String getUsername(UserProfile profile) {
        if (profile == null) {
            return null;
        }
        return (String) profile.data;
    }
}
```

이를 `as` 연산자로 직접 마이그레이션하면 다음과 같습니다:

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? {
    if (profile == null) {
        return null
    }
    return profile.data as String?
}
```

여기서 `profile.data`는 `as String?`을 사용하여 Null 허용 문자열로 형변환됩니다.

한 단계 더 나아가 `as? String`을 사용하여 값을 안전하게 형변환하는 것을 권장합니다. 이 접근 방식은 `ClassCastException`을 던지는 대신 실패 시 `null`을 반환합니다:

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? =
  profile?.data as? String
```

이 버전은 [안전 호출 연산자](null-safety.md#safe-call-operator) `?.`로 `if` 표현식을 대체하여 형변환을 시도하기 전에 `data` 속성에 안전하게 접근합니다.

## 다음 단계

*   다른 [Kotlin 관용구](idioms.md)를 살펴보세요.
*   [Java-to-Kotlin (J2K) 변환기](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 알아보세요.
*   다른 마이그레이션 가이드를 확인하세요:
    *   [Java와 Kotlin의 문자열](java-to-kotlin-idioms-strings.md)
    *   [Java와 Kotlin의 컬렉션](java-to-kotlin-collections-guide.md)

좋아하는 관용구가 있다면, 풀 리퀘스트를 보내 저희와 공유해주세요!