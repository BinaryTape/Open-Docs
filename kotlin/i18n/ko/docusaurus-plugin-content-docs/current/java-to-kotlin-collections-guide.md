---
title: "Java 및 Kotlin의 컬렉션"
description: "Java 컬렉션에서 Kotlin 컬렉션으로 마이그레이션하는 방법을 알아봅니다. 이 가이드에서는 Kotlin 및 Java Lists, ArrayLists, Maps, Sets 등의 데이터 구조를 다룹니다."
---
_컬렉션_은 해결해야 하는 문제에 중요하며 일반적으로 사용되는 가변 개수의 항목(0개일 수도 있음) 그룹입니다.
이 가이드에서는 Java 및 Kotlin의 컬렉션 개념과 연산을 설명하고 비교합니다.
Java에서 Kotlin으로 마이그레이션하고 진정한 Kotlin 방식으로 코드를 작성하는 데 도움이 됩니다.

이 가이드의 첫 번째 부분에는 Java와 Kotlin에서 동일한 컬렉션에 대한 연산의 빠른 용어집이 있습니다.
[Java와 Kotlin에서 동일한 연산](#operations-that-are-the-same-in-java-and-kotlin)과
[Kotlin에만 존재하는 연산](#operations-that-don-t-exist-in-java-s-standard-library)으로 나뉩니다.
[변경 가능성](#mutability)부터 시작하는 가이드의 두 번째 부분에서는 특정 사례를 통해 몇 가지 차이점을 설명합니다.

컬렉션에 대한 소개는 [컬렉션 개요](collections-overview)를 참조하거나
Kotlin 개발 옹호자인 Sebastian Aigner의 [비디오](https://www.youtube.com/watch?v=F8jj7e-_jFA)를 시청하세요.

:::note
아래의 모든 예제에서는 Java 및 Kotlin 표준 라이브러리 API만 사용합니다.

:::

## Java와 Kotlin에서 동일한 연산

Kotlin에는 Java의 대응 항목과 똑같이 보이는 컬렉션에 대한 많은 연산이 있습니다.

### 목록, 집합, 큐 및 데크에 대한 연산

| 설명 | 공통 연산 | 추가 Kotlin 대안 |
|-------------|-----------|---------------------|
| 요소 또는 요소들 추가 | `add()`, `addAll()` | [`plusAssign`(`+=`) 연산자](collection-plus-minus) 사용: `collection += element`, `collection += anotherCollection`. |
| 컬렉션에 요소 또는 요소들이 포함되어 있는지 확인 | `contains()`, `containsAll()` | 연산자 형식으로 `contains()`를 호출하려면 [`in` 키워드](collection-elements#check-element-existence) 사용: `element in collection`. |
| 컬렉션이 비어 있는지 확인 | `isEmpty()` | 컬렉션이 비어 있지 않은지 확인하려면 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 사용. |
| 특정 조건에서 제거 | `removeIf()` | |
| 선택한 요소만 남김 | `retainAll()` | |
| 컬렉션에서 모든 요소 제거 | `clear()` | |
| 컬렉션에서 스트림 가져오기 | `stream()` | Kotlin에는 스트림을 처리하는 자체 방식이 있습니다. [시퀀스](#sequences) 및 [`map()`](collection-filtering) 및 [`filter()`](#filter-elements)와 같은 메서드. |
| 컬렉션에서 반복기 가져오기 | `iterator()` | |

### 맵에 대한 연산

| 설명 | 공통 연산 | 추가 Kotlin 대안 |
|-------------|-----------|---------------------|
| 요소 또는 요소들 추가 | `put()`, `putAll()`, `putIfAbsent()`| Kotlin에서 할당 `map[key] = value`는 `put(key, value)`와 동일하게 동작합니다. 또한 [`plusAssign`(`+=`) 연산자](collection-plus-minus)를 사용할 수 있습니다. `map += Pair(key, value)` 또는 `map += anotherMap`. |
| 요소 또는 요소들 교체 | `put()`, `replace()`, `replaceAll()` | `put()` 및 `replace()` 대신 인덱싱 연산자 `map[key] = value`를 사용하세요. |
| 요소 가져오기 | `get()` | 요소를 가져오려면 인덱싱 연산자 `map[index]`를 사용하세요. |
| 맵에 요소 또는 요소들이 포함되어 있는지 확인 | `containsKey()`, `containsValue()` | 연산자 형식으로 `contains()`를 호출하려면 [`in` 키워드](collection-elements#check-element-existence) 사용: `element in map`. |
| 맵이 비어 있는지 확인 |  `isEmpty()` | 맵이 비어 있지 않은지 확인하려면 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)를 사용하세요. |
| 요소 제거 | `remove(key)`, `remove(key, value)` | [`minusAssign`(`-=`) 연산자](collection-plus-minus) 사용: `map -= key`. |
| 맵에서 모든 요소 제거 | `clear()` | |
| 맵에서 스트림 가져오기 | 항목, 키 또는 값에 대한 `stream()` | |

### 목록에만 존재하는 연산

| 설명 | 공통 연산 | 추가 Kotlin 대안 |
|-------------|-----------|---------------------|
| 요소의 인덱스 가져오기 | `indexOf()` | |
| 요소의 마지막 인덱스 가져오기 | `lastIndexOf()` | |
| 요소 가져오기 | `get()` | 요소를 가져오려면 인덱싱 연산자 `list[index]`를 사용하세요. |
| 하위 목록 가져오기 | `subList()` | |
| 요소 또는 요소들 교체 | `set()`,  `replaceAll()` | `set()` 대신 인덱싱 연산자를 사용하세요. `list[index] = value`. |

## 약간 다른 연산

### 모든 컬렉션 유형에 대한 연산

| 설명 | Java | Kotlin |
|-------------|------|--------|
| 컬렉션의 크기 가져오기 | `size()` | `count()`, `size` |
| 중첩된 컬렉션 요소에 대한 플랫 액세스 가져오기 | `collectionOfCollections.forEach(flatCollection::addAll)` 또는 `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations#flatten) 또는 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 지정된 함수를 모든 요소에 적용 | `stream().map().collect()` | [`map()`](collection-filtering) |
| 제공된 연산을 컬렉션 요소에 순차적으로 적용하고 누적된 결과 반환 | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate#fold-and-reduce) |
| 분류기별로 요소를 그룹화하고 개수 세기 | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping) |
| 조건별로 필터링 | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 컬렉션 요소가 조건을 만족하는지 확인 | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering) |
| 요소 정렬 | `stream().sorted().collect()` | [`sorted()`](collection-ordering#natural-order) |
| 처음 N개 요소 가져오기 | `stream().limit(N).collect()` | [`take(N)`](collection-parts#take-and-drop) |
| 조건자가 있는 요소 가져오기 | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts#take-and-drop) |
| 처음 N개 요소 건너뛰기 | `stream().skip(N).collect()` | [`drop(N)`](collection-parts#take-and-drop) |
| 조건자가 있는 요소 건너뛰기 | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts#take-and-drop) |
| 컬렉션 요소 및 관련 특정 값에서 맵 빌드 | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations#associate) |

맵에서 위에 나열된 모든 연산을 수행하려면 먼저 맵의 `entrySet`를 가져와야 합니다.

### 목록에 대한 연산

| 설명 | Java | Kotlin |
|-------------|------|--------|
| 목록을 자연 순서로 정렬 | `sort(null)` | `sort()` |
| 목록을 내림차순으로 정렬 | `sort(comparator)` | `sortDescending()` |
| 목록에서 요소 제거 | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` 또는 [`collection -= element`](collection-plus-minus) |
| 목록의 모든 요소를 특정 값으로 채우기 | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 목록에서 고유한 요소 가져오기 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Java의 표준 라이브러리에 없는 연산

* [`zip()`, `unzip()`](collection-transformations) – 컬렉션 변환.
* [`aggregate()`](collection-grouping) – 조건별로 그룹화.
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts#take-and-drop) – 조건자별로 요소 가져오거나 삭제.
* [`slice()`, `chunked()`, `windowed()`](collection-parts) – 컬렉션 부분 검색.
* [더하기(`+`) 및 빼기(`-`) 연산자](collection-plus-minus) – 요소 추가 또는 제거.

`zip()`, `chunked()`, `windowed()` 및 기타 일부 연산에 대해 자세히 알아보려면 Sebastian Aigner의 Kotlin의 고급 컬렉션 연산에 대한 비디오를 시청하세요.

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 변경 가능성

Java에는 변경 가능한 컬렉션이 있습니다.

```java
// Java
// 이 목록은 변경 가능합니다!
public List<Customer> getCustomers() { ... }
```

부분적으로 변경 가능한 컬렉션:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // 런타임에 `UnsupportedOperationException`으로 실패
```

그리고 변경 불가능한 컬렉션:

```java
// Java
List<String> numbers = new LinkedList<>();
// 이 목록은 변경 불가능합니다!
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // 런타임에 `UnsupportedOperationException`으로 실패
```

IntelliJ IDEA에서 마지막 두 코드 조각을 작성하면 IDE에서 변경 불가능한 개체를 수정하려고 한다는 경고를 표시합니다.
이 코드는 컴파일되고 런타임에 `UnsupportedOperationException`으로 실패합니다.
유형을 보고 컬렉션이 변경 가능한지 여부를 알 수 없습니다.

Java와 달리 Kotlin에서는 필요에 따라 변경 가능한 컬렉션 또는 읽기 전용 컬렉션을 명시적으로 선언합니다.
읽기 전용 컬렉션을 수정하려고 하면 코드가 컴파일되지 않습니다.

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // 정상입니다.
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // 컴파일 오류 - 확인되지 않은 참조: add
```

[Kotlin 코딩 규칙](coding-conventions#immutability) 페이지에서 변경 불가능성에 대해 자세히 알아보세요.

## 공변성

Java에서는 하위 유형이 있는 컬렉션을 상위 유형의 컬렉션을 사용하는 함수에 전달할 수 없습니다.
예를 들어 `Rectangle`이 `Shape`을 확장하는 경우 `Rectangle` 요소의 컬렉션을 `Shape` 요소의 컬렉션을 사용하는 함수에 전달할 수 없습니다.
코드를 컴파일 가능하게 만들려면 `? extends Shape` 유형을 사용하여 함수가 `Shape`의 모든 상속자를 포함하는 컬렉션을 사용할 수 있도록 합니다.

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* List<Shape>만 사용하는 경우 아래와 같이 List<Rectangle>을 인수로 사용하여 이 함수를 호출할 때 코드가 컴파일되지 않습니다. */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```

Kotlin에서는 읽기 전용 컬렉션 유형이 [공변성](generics#variance)입니다.
이는 `Rectangle` 클래스가 `Shape` 클래스에서 상속되는 경우 `List<Rectangle>` 유형을 `List<Shape>` 유형이 필요한 모든 위치에서 사용할 수 있음을 의미합니다.
다시 말해, 컬렉션 유형은 요소 유형과 동일한 하위 유형 관계를 갖습니다.
맵은 값 유형에서는 공변성이지만 키 유형에서는 공변성이 아닙니다.
변경 가능한 컬렉션은 공변성이 아닙니다. 이로 인해 런타임 오류가 발생할 수 있습니다.

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

[컬렉션 유형](collections-overview#collection-types)에 대해 자세히 알아보세요.

## 범위 및 진행

Kotlin에서는 [범위](ranges)를 사용하여 간격을 만들 수 있습니다. 예를 들어 `Version(1, 11)..Version(1, 30)`에는 `1.11`부터 `1.30`까지의 모든 버전이 포함됩니다.
`in` 연산자를 사용하여 버전이 범위 내에 있는지 확인할 수 있습니다. `Version(0, 9) in versionRange`.

Java에서는 `Version`이 두 경계 모두에 맞는지 수동으로 확인해야 합니다.

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

Kotlin에서는 범위를 전체 개체로 작동합니다. 두 개의 변수를 만들고 `Version`과 비교할 필요가 없습니다.

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

버전이 최소 버전보다 크거나 같고(`>=`) 최대 버전보다 작음(`<`)과 같이 경계 중 하나를 제외해야 하는 경우 이러한 포함 범위는 도움이 되지 않습니다.

## 여러 기준에 의한 비교

Java에서 여러 기준으로 개체를 비교하려면 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-)
및 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)
[`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 인터페이스의 함수를 사용합니다.
예를 들어 이름과 나이로 사람들을 비교하려면 다음을 수행합니다.

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

Kotlin에서는 비교할 필드를 열거하기만 하면 됩니다.

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

## 시퀀스

Java에서는 다음과 같은 방식으로 숫자 시퀀스를 생성할 수 있습니다.

```java
// Java
int sum = IntStream.iterate(1, e `->` e + 3)
    .limit(10).sum();
System.out.println(sum); // 145 출력
```

Kotlin에서는 _[시퀀스](sequences)_를 사용합니다.
시퀀스의 다단계 처리는 가능한 경우 지연 방식으로 실행됩니다.
실제 계산은 전체 처리 체인의 결과가 요청된 경우에만 발생합니다.

```kotlin
fun main() {

    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // 145 출력

}
```

시퀀스는 일부 필터링 연산을 수행하는 데 필요한 단계 수를 줄일 수 있습니다.
`Iterable`과 `Sequence`의 차이점을 보여주는 [시퀀스 처리 예제](sequences#sequence-processing-example)를 참조하세요.

## 목록에서 요소 제거

Java에서 [`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))
함수는 제거할 요소의 인덱스를 허용합니다.

정수 요소를 제거할 때는 `remove()` 함수의 인수로 `Integer.valueOf()` 함수를 사용하세요.

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // 인덱스로 제거합니다.
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```

Kotlin에는 두 가지 유형의 요소 제거가 있습니다.
[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)을 사용한 인덱스별 제거와
[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)을 사용한 값별 제거.

```kotlin
fun main() {

    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]

}
```

## 맵 탐색

Java에서는 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer))를 통해 맵을 탐색할 수 있습니다.

```java
// Java
numbers.forEach((k,v) `->` System.out.println("Key = " + k + ", Value = " + v));
```

Kotlin에서는 `for` 루프 또는 Java의 `forEach`와 유사한 `forEach`를 사용하여 맵을 탐색합니다.

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// 또는
numbers.forEach { (k, v) `->` println("Key = $k, Value = $v") }
```

## 비어 있을 수 있는 컬렉션의 처음 및 마지막 항목 가져오기

Java에서는 컬렉션의 크기를 확인하고 인덱스를 사용하여 처음 및 마지막 항목을 안전하게 가져올 수 있습니다.

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```

[`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst())
및 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast())
[`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) 및
상속자에 대한 함수:

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```

Kotlin에는 특수
함수 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
및 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)이 있습니다.
[`Elvis 연산자`](null-safety#elvis-operator)를 사용하면 함수의 결과에 따라 추가 작업을 즉시 수행할 수 있습니다.
예를 들어 `firstOrNull()`:

```kotlin
// Kotlin
val emails = listOf<String>() // 비어 있을 수 있습니다.
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```

## 목록에서 집합 만들기

Java에서는
[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)에서
[`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)을 만들려면
[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) 함수를 사용할 수 있습니다.

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```

Kotlin에서는 함수 `toSet()`을 사용합니다.

```kotlin
fun main() {

    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)

}
```

## 요소 그룹화

Java에서는 [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)
함수 `groupingBy()`를 사용하여 요소를 그룹화할 수 있습니다.

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

Kotlin에서는 함수 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)를 사용합니다.

```kotlin
data class Request(
    val url: String,
    val responseCode: Int
)

fun main() {

    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))

}
```

## 요소 필터링

Java에서 컬렉션의 요소를 필터링하려면 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용해야 합니다.
Stream API에는 `intermediate` 및 `terminal` 연산이 있습니다. `filter()`는 스트림을 반환하는 중간 연산입니다.
컬렉션을 출력으로 받으려면 `collect()`와 같은 터미널 연산을 사용해야 합니다.
예를 들어 키가 `1`로 끝나고 값이 `10`보다 큰 쌍만 남기려면 다음을 수행합니다.

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry `->` entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```

Kotlin에서는 필터링이 컬렉션에 내장되어 있으며 `filter()`는 필터링된 것과 동일한 컬렉션 유형을 반환합니다.
따라서 작성해야 할 것은 `filter()`와 해당 조건자뿐입니다.

```kotlin
fun main() {

    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) `->` key.endsWith("1") && value > 10 }
    println(filteredNumbers)

}
```

[맵 필터링](map-operations#filter)에 대해 자세히 알아보세요.

### 유형별 요소 필터링

Java에서 유형별로 요소를 필터링하고 해당 요소에 대한 작업을 수행하려면
[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 연산자를 사용하여 해당 유형을 확인한 다음 유형 캐스트를 수행해야 합니다.

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
    numbers.stream().filter(it `->` it instanceof String)
        .forEach( it `->` System.out.println(((String) it).toUpperCase()));
}
```

Kotlin에서는 컬렉션에서 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)를 호출하기만 하면 유형 캐스트가 [스마트 캐스트](typecasts#smart-casts)에 의해 수행됩니다.

```kotlin
// Kotlin
fun main() {

    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }

}
```

### 조건자 테스트

일부 작업에서는 모든 요소, 요소 없음 또는 일부 요소가 조건을 충족하는지 확인해야 합니다.
Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)
함수 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate)),
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 및
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate))를 통해 이러한 모든 검사를 수행할 수 있습니다.

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it `->` it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it `->` it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it `->` it.endsWith("e"))); // false
}
```

Kotlin에서는 [확장 함수](extensions) `none()`, `any()` 및 `all()`을
모든 [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) 개체에 사용할 수 있습니다.

```kotlin
fun main() {

// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })

}
```

[조건자 테스트](collection-filtering#test-predicates)에 대해 자세히 알아보세요.

## 컬렉션 변환 연산

### 요소 압축

Java에서는 두 컬렉션에서 동일한 위치에 있는 요소로 쌍을 만들려면 해당 컬렉션을 동시에 반복합니다.

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

출력에 요소 쌍을 인쇄하는 것보다 더 복잡한 작업을 수행하려면
[Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java)를 사용할 수 있습니다.
위의 예에서 레코드는 `record AnimalDescription(String animal, String color) {}`가 됩니다.

Kotlin에서는 [`zip()`](collection-transformations#zip) 함수를 사용하여 동일한 작업을 수행합니다.

```kotlin
fun main() {

    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal `->` 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })

}
```

`zip()`은 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 개체의 목록을 반환합니다.

:::note
컬렉션의 크기가 다른 경우 `zip()`의 결과는 더 작은 크기가 됩니다.
더 큰 컬렉션의 마지막 요소는 결과에 포함되지 않습니다.

:::

### 요소 연결

Java에서는 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)를 사용하여 요소를 특징과 연결할 수 있습니다.

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number `->` number, String::length));
    System.out.println(wordAndLength);
}
```

Kotlin에서는 [`associate()`](collection-transformations#associate) 함수를 사용합니다.

```kotlin
fun main() {

    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

## 다음 단계

* [Kotlin Koans](koans)를 방문하세요. 연습 문제를 완료하여 Kotlin 구문을 배우세요. 각 연습 문제는 실패하는 단위 테스트로 생성되며 여러분의 임무는 이를 통과시키는 것입니다.
* 다른 [Kotlin 관용구](idioms)를 살펴보세요.
* [Java에서 Kotlin 변환기](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)를 사용하여 기존 Java 코드를 Kotlin으로 변환하는 방법을 알아보세요.
* [Kotlin의 컬렉션](collections-overview)을 알아보세요.

좋아하는 관용구가 있다면 풀 요청을 보내 공유해 주시기 바랍니다.