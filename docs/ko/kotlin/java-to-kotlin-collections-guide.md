[//]: # (title: Java 및 Kotlin의 컬렉션)

<web-summary>Java 컬렉션에서 Kotlin 컬렉션으로 마이그레이션하는 방법을 알아보세요. 이 가이드에서는 Kotlin 및 Java List, ArrayList, Map, Set 등과 같은 데이터 구조를 다룹니다.</web-summary>

_컬렉션_은 해결하려는 문제에 중요하고 일반적으로 조작되는 가변 개수(0개일 수도 있음)의 항목 그룹입니다.
이 가이드에서는 Java 및 Kotlin의 컬렉션 개념과 연산을 설명하고 비교합니다.
이를 통해 Java에서 Kotlin으로 마이그레이션하고 코드를 진정한 Kotlin 방식으로 작성하는 데 도움이 될 것입니다.

이 가이드의 첫 번째 부분에는 Java 및 Kotlin에서 동일한 컬렉션에 대한 연산의 간략한 용어집이 포함되어 있습니다.
[Java 및 Kotlin에서 동일한 연산](#operations-that-are-the-same-in-java-and-kotlin)과 [Java 표준 라이브러리에는 없는 연산](#operations-that-don-t-exist-in-java-s-standard-library)으로 나뉩니다.
가이드의 두 번째 부분은 [가변성](#mutability)부터 시작하여 특정 사례를 통해 몇 가지 차이점을 설명합니다.

컬렉션 소개는 [컬렉션 개요](collections-overview.md)를 참조하거나 Kotlin 개발자 옹호자인 Sebastian Aigner의 [비디오](https://www.youtube.com/watch?v=F8jj7e-_jFA)를 시청하세요.

> 아래의 모든 예시는 Java 및 Kotlin 표준 라이브러리 API만 사용합니다.
>
{style="note"}

## Java 및 Kotlin에서 동일한 연산

Kotlin에는 Java의 해당 연산과 동일하게 보이는 컬렉션 연산이 많이 있습니다.

### 리스트, 세트, 큐, 덱 연산

| 설명 | 공통 연산 | 더 많은 Kotlin 대안 |
|-------------|-----------|---------------------|
| 요소 또는 요소 추가 | `add()`, `addAll()` | [`plusAssign`(`+=`) 연산자](collection-plus-minus.md)를 사용합니다: `collection += element`, `collection += anotherCollection`. |
| 컬렉션에 요소 또는 요소가 포함되어 있는지 확인 | `contains()`, `containsAll()` | [`in` 키워드](collection-elements.md#check-element-existence)를 사용하여 `contains()`를 연산자 형식으로 호출합니다: `element in collection`. |
| 컬렉션이 비어 있는지 확인 | `isEmpty()` | [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)를 사용하여 컬렉션이 비어 있지 않은지 확인합니다. |
| 특정 조건에서 제거 | `removeIf()` | |
| 선택된 요소만 남김 | `retainAll()` | |
| 컬렉션에서 모든 요소 제거 | `clear()` | |
| 컬렉션에서 스트림 가져오기 | `stream()` | Kotlin에는 스트림을 처리하는 자체 방식이 있습니다: [시퀀스](#sequences)와 [`map()`](collection-filtering.md) 및 [`filter()`](#filter-elements)와 같은 메서드. |
| 컬렉션에서 이터레이터 가져오기 | `iterator()` | |

### 맵 연산

| 설명 | 공통 연산 | 더 많은 Kotlin 대안 |
|-------------|-----------|---------------------|
| 요소 또는 요소 추가 | `put()`, `putAll()`, `putIfAbsent()`| Kotlin에서 `map[key] = value` 할당은 `put(key, value)`와 동일하게 동작합니다. 또한 [`plusAssign`(`+=`) 연산자](collection-plus-minus.md)를 사용할 수 있습니다: `map += Pair(key, value)` 또는 `map += anotherMap`. |
| 요소 또는 요소 교체 | `put()`, `replace()`, `replaceAll()` | `put()` 및 `replace()` 대신 인덱싱 연산자 `map[key] = value`를 사용합니다. |
| 요소 가져오기 | `get()` | 인덱싱 연산자를 사용하여 요소를 가져옵니다: `map[index]`. |
| 맵에 요소 또는 요소가 포함되어 있는지 확인 | `containsKey()`, `containsValue()` | [`in` 키워드](collection-elements.md#check-element-existence)를 사용하여 `contains()`를 연산자 형식으로 호출합니다: `element in map`. |
| 맵이 비어 있는지 확인 | `isEmpty()` | [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)를 사용하여 맵이 비어 있지 않은지 확인합니다. |
| 요소 제거 | `remove(key)`, `remove(key, value)` | [`minusAssign`(`-=`) 연산자](collection-plus-minus.md)를 사용합니다: `map -= key`. |
| 맵에서 모든 요소 제거 | `clear()` | |
| 맵에서 스트림 가져오기 | 엔트리, 키 또는 값에 대한 stream() | |

### 리스트에만 있는 연산

| 설명 | 공통 연산 | 더 많은 Kotlin 대안 |
|-------------|-----------|---------------------|
| 요소의 인덱스 가져오기 | `indexOf()` | |
| 요소의 마지막 인덱스 가져오기 | `lastIndexOf()` | |
| 요소 가져오기 | `get()` | 인덱싱 연산자를 사용하여 요소를 가져옵니다: `list[index]`. |
| 서브리스트 가져오기 | `subList()` | |
| 요소 또는 요소 교체 | `set()`, `replaceAll()` | `set()` 대신 인덱싱 연산자를 사용합니다: `list[index] = value`. |

## 약간 다른 연산

### 모든 컬렉션 타입의 연산

| 설명 | Java | Kotlin |
|-------------|------|--------|
| 컬렉션 크기 가져오기 | `size()` | `count()`, `size` |
| 중첩 컬렉션 요소에 대한 평면 접근 | `collectionOfCollections.forEach(flatCollection::addAll)` or `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) or [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 주어진 함수를 모든 요소에 적용 | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| 제공된 연산을 컬렉션 요소에 순차적으로 적용하고 누적 결과 반환 | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| 분류자를 기준으로 요소를 그룹화하고 개수 세기 | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| 조건으로 필터링 | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 컬렉션 요소가 조건을 만족하는지 확인 | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| 요소 정렬 | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| 첫 N개 요소 가져오기 | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| 프레디케이트로 요소 가져오기 | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| 첫 N개 요소 건너뛰기 | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| 프레디케이트로 요소 건너뛰기 | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| 컬렉션 요소 및 관련 값으로 맵 구축 | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

위에 나열된 모든 연산을 맵에서 수행하려면 먼저 맵의 `entrySet`을 가져와야 합니다.

### 리스트 연산

| 설명 | Java | Kotlin |
|-------------|------|--------|
| 리스트를 자연 순서로 정렬 | `sort(null)` | `sort()` |
| 리스트를 내림차순으로 정렬 | `sort(comparator)` | `sortDescending()` |
| 리스트에서 요소 제거 | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` or [`collection -= element`](collection-plus-minus.md) |
| 리스트의 모든 요소를 특정 값으로 채우기 | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 리스트에서 고유 요소 가져오기 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Java 표준 라이브러리에는 없는 연산

*   [`zip()`, `unzip()`](collection-transformations.md) – 컬렉션 변환.
*   [`aggregate()`](collection-grouping.md) – 조건으로 그룹화.
*   [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – 프레디케이트로 요소 가져오거나 제거.
*   [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – 컬렉션 부분 검색.
*   [플러스(`+`) 및 마이너스(`-`) 연산자](collection-plus-minus.md) – 요소 추가 또는 제거.

`zip()`, `chunked()`, `windowed()` 및 기타 연산에 대해 자세히 알아보려면 Kotlin의 고급 컬렉션 연산에 대한 Sebastian Aigner의 비디오를 시청하세요:

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 가변성

Java에는 가변 컬렉션이 있습니다:

```java
// Java
// This list is mutable!
public List<Customer> getCustomers() { ... }
```
{id="mutability-java"}

부분적으로 가변적인 것:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="mutability-partly-java"}

그리고 불변적인 것:

```java
// Java
List<String> numbers = new LinkedList<>();
// This list is immutable!
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="immutable-java"}

IntelliJ IDEA에서 마지막 두 코드 조각을 작성하면, IDE는 불변 객체를 수정하려고 한다고 경고할 것입니다. 이 코드는 컴파일은 되지만 런타임에 `UnsupportedOperationException`과 함께 실패합니다. 컬렉션의 타입을 보아서는 가변적인지 알 수 없습니다.

Java와 달리 Kotlin에서는 필요에 따라 가변 또는 읽기 전용 컬렉션을 명시적으로 선언합니다. 읽기 전용 컬렉션을 수정하려고 하면 코드가 컴파일되지 않습니다:

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // This is OK
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // Compilation error - Unresolved reference: add
```
{id="mutability-kotlin"}

불변성에 대한 자세한 내용은 [Kotlin 코딩 규칙](coding-conventions.md#immutability) 페이지에서 읽어보세요.

## 공변성

Java에서는 후손 타입의 컬렉션을 선조 타입의 컬렉션을 받는 함수에 전달할 수 없습니다. 예를 들어, `Rectangle`이 `Shape`을 확장하는 경우, `Rectangle` 요소 컬렉션을 `Shape` 요소 컬렉션을 받는 함수에 전달할 수 없습니다. 코드를 컴파일 가능하게 하려면 함수가 `Shape`의 모든 상속자를 포함하는 컬렉션을 받을 수 있도록 `? extends Shape` 타입을 사용해야 합니다:

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* If using just List<Shape>, the code won't compile when calling
this function with the List<Rectangle> as the argument as below */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

Kotlin에서 읽기 전용 컬렉션 타입은 [공변성](generics.md#variance)을 가집니다. 이는 `Rectangle` 클래스가 `Shape` 클래스를 상속하는 경우, `List<Shape>` 타입이 필요한 모든 곳에 `List<Rectangle>` 타입을 사용할 수 있다는 의미입니다. 즉, 컬렉션 타입은 요소 타입과 동일한 서브타이핑 관계를 가집니다. 맵은 값 타입에 대해서는 공변적이지만 키 타입에 대해서는 그렇지 않습니다. 가변 컬렉션은 공변적이지 않습니다. 이는 런타임 오류로 이어질 수 있습니다.

```kotlin
// Kotlin
open class Shape(val name: String)

class Rectangle(private val rectangleName: String) : Shape(rectangleName)

fun doSthWithShapes(shapes: List<Shape>) {
    println("The shapes are: ${shapes.joinToString { it.name }}")
}

fun main() {
    val rectangles = listOf(Rectangle("rhombus"), Rectangle("parallelepiped"))
    doSthWithShapes(rectangles)
}
```
{kotlin-runnable="true" id="covariance-kotlin"}

[컬렉션 타입](collections-overview.md#collection-types)에 대해 여기에서 더 읽어보세요.

## 범위 및 진행

Kotlin에서는 [범위](ranges.md)를 사용하여 간격을 만들 수 있습니다. 예를 들어, `Version(1, 11)..Version(1, 30)`은 `1.11`부터 `1.30`까지의 모든 버전을 포함합니다. `in` 연산자를 사용하여 버전이 범위 내에 있는지 확인할 수 있습니다: `Version(0, 9) in versionRange`.

Java에서는 `Version`이 두 경계에 모두 맞는지 수동으로 확인해야 합니다:

```java
// Java
class Version implements Comparable<Version> {

    int major;
    int minor;

    Version(int major, int minor) {
        this.major = major;
        this.minor = minor;
    }

    @Override
    public int compareTo(Version o) {
        if (this.major != o.major) {
            return this.major - o.major;
        }
        return this.minor - o.minor;
    }
}

public void compareVersions() {
    var minVersion = new Version(1, 11);
    var maxVersion = new Version(1, 31);

   System.out.println(
           versionIsInRange(new Version(0, 9), minVersion, maxVersion));
   System.out.println(
           versionIsInRange(new Version(1, 20), minVersion, maxVersion));
}

public Boolean versionIsInRange(Version versionToCheck, Version minVersion, 
                                Version maxVersion) {
    return versionToCheck.compareTo(minVersion) >= 0 
            && versionToCheck.compareTo(maxVersion) <= 0;
}
```
{id="ranges-java"}

Kotlin에서는 범위를 하나의 전체 객체로 다룹니다. 두 개의 변수를 만들고 `Version`과 비교할 필요가 없습니다:

```kotlin
// Kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
    val versionRange = Version(1, 11)..Version(1, 30)

    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
}
```
{kotlin-runnable="true" id="ranges-kotlin"}

버전이 최소 버전보다 크거나 같고(`>=`) 최대 버전보다 작거나(`<`) 같은지 확인하는 것처럼 경계 중 하나를 제외해야 하는 경우, 이러한 포함 범위는 도움이 되지 않습니다.

## 여러 기준으로 비교

Java에서 여러 기준으로 객체를 비교하려면 [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 인터페이스의 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-) 및 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-) 함수를 사용할 수 있습니다. 예를 들어, 사람들을 이름과 나이로 비교하려면:

```java
class Person implements Comparable<Person> {
    String name;
    int age;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return this.name + " " + age;
    }
}

public void comparePersons() {
    var persons = List.of(new Person("Jack", 35), new Person("David", 30), 
            new Person("Jack", 25));
    System.out.println(persons.stream().sorted(Comparator
            .comparing(Person::getName)
            .thenComparingInt(Person::getAge)).collect(toList()));
}
```
{id="comparison-java"}

Kotlin에서는 비교하려는 필드를 열거하기만 하면 됩니다:

```kotlin
data class Person(
    val name: String,
    val age: Int
)

fun main() {
    val persons = listOf(Person("Jack", 35), Person("David", 30), 
        Person("Jack", 25))
    println(persons.sortedWith(compareBy(Person::name, Person::age)))
}
```
{kotlin-runnable="true" id="comparison-kotlin"}

## 시퀀스

Java에서는 다음과 같이 숫자 시퀀스를 생성할 수 있습니다:

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145
```
{id="sequences-java"}

Kotlin에서는 _[시퀀스](sequences.md)_를 사용합니다. 시퀀스의 다단계 처리는 가능할 때 지연 실행됩니다. 실제 계산은 전체 처리 체인의 결과가 요청될 때만 발생합니다.

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // Prints 145
//sampleEnd
}
```
{kotlin-runnable="true" id="sequences-kotlin"}

시퀀스는 일부 필터링 연산을 수행하는 데 필요한 단계 수를 줄일 수 있습니다. `Iterable`과 `Sequence`의 차이를 보여주는 [시퀀스 처리 예시](sequences.md#sequence-processing-example)를 참조하세요.

## 리스트에서 요소 제거

Java에서 [`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int)) 함수는 제거할 요소의 인덱스를 받습니다.

정수 요소를 제거할 때는 `remove()` 함수의 인수로 `Integer.valueOf()` 함수를 사용합니다:

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // This removes by index
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

Kotlin에는 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)를 사용한 인덱스 기반 요소 제거와 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)를 사용한 값 기반 요소 제거의 두 가지 유형이 있습니다.

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]
//sampleEnd
}
```
{kotlin-runnable="true" id="remove-elements-kotlin"}

## 맵 순회

Java에서는 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer))를 통해 맵을 순회할 수 있습니다:

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

Kotlin에서는 Java의 `forEach`와 유사하게 `for` 루프 또는 `forEach`를 사용하여 맵을 순회합니다:

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```
{id="traverse-map-kotlin"}

## 비어 있을 수 있는 컬렉션의 첫 번째 및 마지막 항목 가져오기

Java에서는 컬렉션의 크기를 확인하고 인덱스를 사용하여 첫 번째 및 마지막 항목을 안전하게 가져올 수 있습니다:

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```
{id="list-get-first-last-java"}

또한 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) 및 그 상속자를 위해 [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst()) 및 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast()) 함수를 사용할 수 있습니다:

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```
{id="deque-get-first-last-java"}

Kotlin에는 특별한 함수인 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)와 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)가 있습니다. [`엘비스 연산자`](null-safety.md#elvis-operator)를 사용하여 함수의 결과에 따라 즉시 추가 작업을 수행할 수 있습니다. 예를 들어, `firstOrNull()`:

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## 리스트에서 세트 생성

Java에서 [`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)로부터 [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)을 생성하려면 [`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) 함수를 사용할 수 있습니다:

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```
{id="list-to-set-java"}

Kotlin에서는 `toSet()` 함수를 사용합니다:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" id="list-to-set-kotlin"}

## 요소 그룹화

Java에서는 [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html) 함수의 `groupingBy()`를 사용하여 요소를 그룹화할 수 있습니다:

```java
// Java
public void analyzeLogs() {
    var requests = List.of(
        new Request("https://kotlinlang.org/docs/home.html", 200),
        new Request("https://kotlinlang.org/docs/home.html", 400),
        new Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    );
    var urlsAndRequests = requests.stream().collect(
            Collectors.groupingBy(Request::getUrl));
    System.out.println(urlsAndRequests);
}
```
{id="group-elements-java"}

Kotlin에서는 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 함수를 사용합니다:

```kotlin
data class Request(
    val url: String,
    val responseCode: Int
)

fun main() {
//sampleStart
    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))
//sampleEnd
}
```
{kotlin-runnable="true" id="group-elements-kotlin"}

## 요소 필터링

Java에서 컬렉션에서 요소를 필터링하려면 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용해야 합니다. Stream API에는 `intermediate` 및 `terminal` 연산이 있습니다. `filter()`는 스트림을 반환하는 중간 연산입니다. 출력으로 컬렉션을 받으려면 `collect()`와 같은 종단 연산을 사용해야 합니다. 예를 들어, 키가 `1`로 끝나고 값이 `10`보다 큰 쌍만 남기려면:

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry -> entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```
{id="filter-elements-java"}

Kotlin에서는 필터링이 컬렉션에 내장되어 있으며, `filter()`는 필터링된 것과 동일한 컬렉션 타입을 반환합니다. 따라서 `filter()`와 해당 프레디케이트만 작성하면 됩니다:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) -> key.endsWith("1") && value > 10 }
    println(filteredNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-elements-kotlin"}

[맵 필터링](map-operations.md#filter)에 대해 여기에서 더 알아보세요.

### 타입별 요소 필터링

Java에서 타입별로 요소를 필터링하고 작업을 수행하려면 [`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 연산자로 타입을 확인한 다음 타입 캐스트를 수행해야 합니다:

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("All String elements in upper case:");
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```
{id="filter-by-type-java"}

Kotlin에서는 컬렉션에 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)를 호출하기만 하면, [스마트 캐스트](typecasts.md#smart-casts)에 의해 타입 캐스트가 수행됩니다:

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-by-type-kotlin"}

### 프레디케이트 테스트

일부 작업에서는 모든, 없는, 또는 일부 요소가 조건을 만족하는지 확인해야 합니다. Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 함수인 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate)), [`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 및 [`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate))를 통해 이 모든 검사를 수행할 수 있습니다:

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it -> it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it -> it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it -> it.endsWith("e"))); // false
}
```
{id="test-predicates-java"}

Kotlin에서는 모든 [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) 객체에 [확장 함수](extensions.md)인 `none()`, `any()`, `all()`이 제공됩니다:

```kotlin
fun main() {
//sampleStart
// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })
//sampleEnd
}
```
{kotlin-runnable="true" id="test-predicates-kotlin"}

[프레디케이트 테스트](collection-filtering.md#test-predicates)에 대해 더 알아보세요.

## 컬렉션 변환 연산

### 요소 결합

Java에서는 두 컬렉션의 동일한 위치에 있는 요소를 동시에 반복하여 쌍을 만들 수 있습니다:

```java
// Java
public void zip() {
    var colors = List.of("red", "brown");
    var animals = List.of("fox", "bear", "wolf");

    for (int i = 0; i < Math.min(colors.size(), animals.size()); i++) {
        String animal = animals.get(i);
        System.out.println("The " + animal.substring(0, 1).toUpperCase()
               + animal.substring(1) + " is " + colors.get(i));
   }
}
```
{id="zip-elements-java"}

출력에 요소 쌍을 단순히 출력하는 것보다 더 복잡한 작업을 수행하려면 [레코드](https://blogs.oracle.com/javamagazine/post/records-come-to-java)를 사용할 수 있습니다. 위 예시에서 레코드는 `record AnimalDescription(String animal, String color) {}`가 됩니다.

Kotlin에서는 동일한 작업을 수행하기 위해 [`zip()`](collection-transformations.md#zip) 함수를 사용합니다:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal -> 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })
//sampleEnd
}
```
{kotlin-runnable="true" id="zip-elements-kotlin"}

`zip()`은 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 객체의 List를 반환합니다.

> 컬렉션의 크기가 다른 경우, `zip()`의 결과는 더 작은 크기가 됩니다. 더 큰 컬렉션의 마지막 요소는 결과에 포함되지 않습니다.
>
{style="note"}

### 요소 연결

Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용하여 요소와 특성을 연결할 수 있습니다:

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number -> number, String::length));
    System.out.println(wordAndLength);
}
```
{id="associate-elements-java"}

Kotlin에서는 [`associate()`](collection-transformations.md#associate) 함수를 사용합니다:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" id="associate-elements-kotlin"}

## 다음 단계는 무엇인가요?

*   [Kotlin Koans](koans.md)를 방문하세요 – Kotlin 구문을 배우기 위한 연습을 완료하세요. 각 연습은 실패하는 단위 테스트로 생성되며, 이를 통과시키는 것이 여러분의 임무입니다.
*   다른 [Kotlin 관용구](idioms.md)를 살펴보세요.
*   [Java-Kotlin 변환기](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 알아보세요.
*   [Kotlin의 컬렉션](collections-overview.md)을 알아보세요.

마음에 드는 관용구가 있다면, 풀 리퀘스트를 보내 공유해 주세요.