---
title: "Kotlin에서 Java 호출하기"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin은 Java와의 상호 운용성을 염두에 두고 설계되었습니다. 기존 Java 코드는 자연스러운 방식으로 Kotlin에서 호출할 수 있으며, Kotlin 코드는 Java에서도 상당히 원활하게 사용할 수 있습니다.
이 섹션에서는 Kotlin에서 Java 코드를 호출하는 방법에 대한 몇 가지 세부 사항을 설명합니다.

거의 모든 Java 코드를 문제 없이 사용할 수 있습니다:

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for' 루프는 Java 컬렉션에서 작동합니다:
    for (item in source) {
        list.add(item)
    }
    // 연산자 규칙도 잘 작동합니다:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // get 및 set이 호출됩니다.
    }
}
```

## Getter 및 Setter

`get`으로 시작하는 이름의 인수가 없는 메서드와 `set`으로 시작하는 이름의 단일 인수 메서드와 같이 getter 및 setter에 대한 Java 규칙을 따르는 메서드는 Kotlin에서 속성으로 표시됩니다. 이러한 속성을 _합성 속성(synthetic properties)_이라고도 합니다.
`Boolean` 접근자 메서드(getter의 이름이 `is`로 시작하고 setter의 이름이 `set`으로 시작하는 경우)는 getter 메서드와 동일한 이름을 가진 속성으로 표시됩니다.

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) { // getFirstDayOfWeek() 호출
        calendar.firstDayOfWeek = Calendar.MONDAY // setFirstDayOfWeek() 호출
    }
    if (!calendar.isLenient) { // isLenient() 호출
        calendar.isLenient = true // setLenient() 호출
    }
}
```

위의 `calendar.firstDayOfWeek`는 합성 속성의 예입니다.

Java 클래스에 setter만 있는 경우 Kotlin은 set-only 속성을 지원하지 않으므로 Kotlin에서 속성으로 표시되지 않습니다.

## Java 합성 속성 참조

:::note
이 기능은 [Experimental](components-stability#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하는 것이 좋습니다.

Kotlin 1.8.20부터 Java 합성 속성에 대한 참조를 만들 수 있습니다. 다음 Java 코드를 고려하십시오.

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin에서는 항상 `person.age`를 작성할 수 있었으며, 여기서 `age`는 합성 속성입니다. 이제 `Person::age` 및 `person::age`에 대한 참조를 만들 수도 있습니다. `name`에도 동일하게 적용됩니다.

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Java 합성 속성에 대한 참조 호출:
        .sortedBy(Person::age)
         // Kotlin 속성 구문을 통해 Java getter 호출:
        .forEach { person `->` println(person.name) }
```

### Java 합성 속성 참조를 활성화하는 방법

이 기능을 활성화하려면 `-language-version 2.1` 컴파일러 옵션을 설정합니다. Gradle 프로젝트에서는 `build.gradle(.kts)`에 다음을 추가하여 설정할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
            )
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</TabItem>
</Tabs>

Kotlin 1.9.0 이전에는 이 기능을 활성화하려면 `-language-version 1.9` 컴파일러 옵션을 설정해야 했습니다.

:::

## void를 반환하는 메서드

Java 메서드가 `void`를 반환하면 Kotlin에서 호출할 때 `Unit`을 반환합니다.
만약 누군가가 해당 반환 값을 사용하는 경우, 값 자체가 미리 알려져 있기 때문에 (Unit인) Kotlin 컴파일러에 의해 호출 사이트에 할당됩니다.

## Kotlin에서 키워드인 Java 식스별자 이스케이프

일부 Kotlin 키워드는 Java에서 유효한 식별자입니다: `in`, `object`, `is` 등.
Java 라이브러리가 메서드에 Kotlin 키워드를 사용하는 경우 백틱(`) 문자로 이스케이프하여 메서드를 호출할 수 있습니다:

```kotlin
foo.`is`(bar)
```

## Null-safety 및 플랫폼 유형

Java의 모든 참조는 `null`일 수 있으므로 Java에서 오는 객체에 대한 Kotlin의 엄격한 null-safety 요구 사항은 비실용적입니다.
Java 선언의 유형은 Kotlin에서 특정 방식으로 처리되며 *플랫폼 유형(platform types)*이라고 합니다. Null 검사는 이러한 유형에 대해 완화되어 Java와 동일한 안전 보장을 제공합니다 (자세한 내용은 [아래](#mapped-types) 참조).

다음 예를 고려하십시오:

```kotlin
val list = ArrayList<String>() // non-null (생성자 결과)
list.add("Item")
val size = list.size // non-null (기본 int)
val item = list[0] // 플랫폼 유형 유추됨 (일반 Java 객체)
```

플랫폼 유형의 변수에 대해 메서드를 호출할 때 Kotlin은 컴파일 타임에 nullability 오류를 발생시키지 않지만, Kotlin이 null이 전파되는 것을 방지하기 위해 생성하는 null-pointer 예외 또는 어설션 때문에 런타임에 호출이 실패할 수 있습니다:

```kotlin
item.substring(1) // 허용됨, item == null이면 예외 발생
```

플랫폼 유형은 *표시할 수 없음(non-denotable)*, 즉 언어에서 명시적으로 작성할 수 없음을 의미합니다.
플랫폼 값이 Kotlin 변수에 할당되면 유형 유추를 사용할 수 있습니다 (변수는 위의 예에서 `item`이 가진 것처럼 유추된 플랫폼 유형을 가짐). 또는 예상되는 유형을 선택할 수 있습니다 (nullable 및 non-nullable 유형 모두 허용됨):

```kotlin
val nullable: String? = item // 허용됨, 항상 작동
val notNull: String = item // 허용됨, 런타임에 실패할 수 있음
```

Non-nullable 유형을 선택하면 컴파일러가 할당 시 어설션을 내보냅니다. 이렇게 하면 Kotlin의 non-nullable 변수가 null을 보유하지 못하게 됩니다. 어설션은 플랫폼 값을 non-null 값을 기대하는 Kotlin 함수에 전달할 때 및 기타 경우에도 내보내집니다.
전반적으로 컴파일러는 null이 프로그램을 통해 멀리 전파되는 것을 방지하기 위해 최선을 다하지만 제네릭 때문에 때로는 완전히 제거하는 것이 불가능합니다.

### 플랫폼 유형 표기법

위에서 언급했듯이 플랫폼 유형은 프로그램에서 명시적으로 언급할 수 없으므로 언어에 구문이 없습니다.
그럼에도 불구하고 컴파일러와 IDE는 때때로 이를 표시해야 합니다 (예: 오류 메시지 또는 매개변수 정보). 따라서 이를 위한 기억하기 쉬운 표기법이 있습니다:

* `T!`는 "`T` 또는 `T?`"를 의미합니다.
* `(Mutable)Collection<T>!`는 "`T`의 Java 컬렉션은 mutable이거나 그렇지 않을 수 있고, nullable이거나 그렇지 않을 수 있음"을 의미합니다.
* `Array<(out) T>!`는 "`T`(또는 `T`의 하위 유형)의 Java 배열, nullable이거나 그렇지 않을 수 있음"을 의미합니다.

### Nullability 주석

nullability 주석이 있는 Java 유형은 플랫폼 유형이 아닌 실제 nullable 또는 non-nullable Kotlin 유형으로 표현됩니다. 컴파일러는 다음을 포함한 여러 가지 nullability 주석 유형을 지원합니다:

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`org.jetbrains.annotations` 패키지의 `@Nullable` 및 `@NotNull`)
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` 및 `android.support.annotations`)
  * JSR-305 (`javax.annotation`, 자세한 내용은 아래 참조)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

특정 유형의 nullability 주석의 정보를 기반으로 컴파일러가 nullability 불일치를 보고하는지 여부를 지정할 수 있습니다. 컴파일러 옵션 `-Xnullability-annotations=@<package-name>:<report-level>`을 사용하십시오.
인수에서 정규화된 nullability 주석 패키지 및 다음 보고 수준 중 하나를 지정합니다:
* nullability 불일치를 무시하려면 `ignore`
* 경고를 보고하려면 `warn`
* 오류를 보고하려면 `strict`

지원되는 nullability 주석의 전체 목록은 다음에서 확인하십시오.
[Kotlin 컴파일러 소스 코드](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt).

### 유형 인수 및 유형 매개변수 주석 달기

제네릭 유형의 유형 인수 및 유형 매개변수에 주석을 달아 해당 유형에 대한 nullability 정보를 제공할 수도 있습니다.

:::note
이 섹션의 모든 예제에서는 `org.jetbrains.annotations` 패키지의 JetBrains nullability 주석을 사용합니다.

:::

#### 유형 인수

Java 선언에 대한 다음 주석을 고려하십시오:

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

Kotlin에서는 다음 서명이 생성됩니다:

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

`@NotNull` 주석이 유형 인수에서 누락되면 대신 플랫폼 유형이 생성됩니다:

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin은 기본 클래스 및 인터페이스의 유형 인수에 대한 nullability 주석도 고려합니다. 예를 들어, 아래에 제공된 서명이 있는 두 개의 Java 클래스가 있습니다.

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

Kotlin 코드에서 `Base<String>`이 가정되는 `Derived` 인스턴스를 전달하면 경고가 생성됩니다.

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // 경고: nullability 불일치
}
```

`Derived`의 상한은 `Base<String?>`로 설정되며, 이는 `Base<String>`과 다릅니다.

[Kotlin의 Java 제네릭](java-interop#java-generics-in-kotlin)에 대해 자세히 알아보세요.

#### 유형 매개변수

기본적으로 Kotlin과 Java 모두에서 일반 유형 매개변수의 nullability는 정의되지 않습니다. Java에서는 nullability 주석을 사용하여 지정할 수 있습니다. `Base` 클래스의 유형 매개변수에 주석을 달아 보겠습니다.

```java
public class Base<@NotNull T> {}
```

`Base`에서 상속할 때 Kotlin은 non-nullable 유형 인수 또는 유형 매개변수를 예상합니다.
따라서 다음 Kotlin 코드는 경고를 생성합니다.

```kotlin
class Derived<K> : Base<K> {} // 경고: K에 정의되지 않은 nullability가 있습니다.
```

상한 `K : Any`를 지정하여 수정할 수 있습니다.

Kotlin은 Java 유형 매개변수의 경계에 대한 nullability 주석도 지원합니다. `Base`에 경계를 추가해 보겠습니다.

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin은 다음과 같이 번역합니다.

```kotlin
class BaseWithBound<T : Number> {}
```

따라서 nullable 유형을 유형 인수 또는 유형 매개변수로 전달하면 경고가 생성됩니다.

유형 인수 및 유형 매개변수 주석 달기는 Java 8 타겟 이상에서 작동합니다. 이 기능에는 nullability 주석이 `TYPE_USE` 타겟을 지원해야 합니다 (`org.jetbrains.annotations`는 버전 15 이상에서 이를 지원합니다).

:::note
nullability 주석이 `TYPE_USE` 타겟 외에 유형에 적용 가능한 다른 타겟을 지원하는 경우
`TYPE_USE`가 우선합니다. 예를 들어 `@Nullable`에 `TYPE_USE` 및 `METHOD` 타겟이 모두 있는 경우 Java 메서드
서명 `@Nullable String[] f()`는 Kotlin에서 `fun f(): Array<String?>!`이 됩니다.

:::

### JSR-305 지원

[JSR-305](https://jcp.org/en/jsr/detail?id=305)에 정의된 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 주석은 Java 유형의 nullability를 나타내는 데 지원됩니다.

`@Nonnull(when = ...)` 값이 `When.ALWAYS`이면 주석이 달린 유형은 non-nullable로 처리됩니다. `When.MAYBE` 및
`When.NEVER`는 nullable 유형을 나타냅니다. `When.UNKNOWN`은 유형을 [플랫폼 유형](#null-safety-and-platform-types)으로 강제합니다.

라이브러리는 JSR-305 주석에 대해 컴파일할 수 있지만 주석 아티팩트(예: `jsr305.jar`)를 만들 필요는 없습니다.
라이브러리 소비자에게 컴파일 종속성입니다. Kotlin 컴파일러는 클래스 경로에 주석이 없어도 라이브러리에서 JSR-305 주석을 읽을 수 있습니다.

[사용자 지정 nullability 한정자 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers)
도 지원됩니다 (아래 참조).

#### 유형 한정자 별칭

주석 유형에 다음이 모두 주석으로 달린 경우
[`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)
및 JSR-305 `@Nonnull` (또는 `@CheckForNull`과 같은 다른 별칭), 그러면 주석 유형 자체가 사용됩니다.
정확한 nullability를 검색하고 해당 nullability 주석과 동일한 의미를 가집니다.

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 다른 유형 한정자 별칭에 대한 별칭
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // Kotlin (strict 모드): `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // Kotlin (strict 모드): `fun bar(x: List<String>!): String!`
}
```

#### 유형 한정자 기본값

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)
주석을 달 때 주석이 달린 범위 내에서 기본 nullability를 정의하는 주석을 도입할 수 있습니다.
요소.

이러한 주석 유형 자체는 `@Nonnull`(또는 별칭)과 `@TypeQualifierDefault(...)`로 모두 주석이 달린 것이어야 합니다.
하나 이상의 `ElementType` 값을 사용합니다.

* 메서드의 반환 유형에 대한 `ElementType.METHOD`
* 값 매개변수에 대한 `ElementType.PARAMETER`
* 필드에 대한 `ElementType.FIELD`
* 유형 인수, 유형 매개변수의 상한 및 와일드카드 유형을 포함한 모든 유형에 대한 `ElementType.TYPE_USE`

유형 자체가 nullability 주석으로 주석이 달리지 않은 경우 기본 nullability가 사용되고 기본값은
유형 사용과 일치하는 `ElementType`가 있는 유형 한정자 기본 주석으로 주석이 달린 가장 안쪽의 둘러싸는 요소에 의해 결정됩니다.

```java
@Nonnull
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
public @interface NonNullApi {
}

@Nonnull(when = When.MAYBE)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE_USE})
public @interface NullableApi {
}

@NullableApi
interface A {
    String foo(String x); // fun foo(x: String?): String?

    @NotNullApi // 인터페이스에서 기본값 오버라이드
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // List<String> 유형 인수는 `@NullableApi` 때문에 nullable로 간주됩니다.
    // `TYPE_USE` 요소 유형을 가짐:
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // `x` 매개변수의 유형은 명시적이기 때문에 플랫폼으로 유지됩니다.
    // 알 수 없음으로 표시된 nullability 주석:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

:::note
이 예제의 유형은 strict 모드가 활성화된 경우에만 적용됩니다. 그렇지 않으면 플랫폼 유형이 유지됩니다.
[`@UnderMigration` 주석](#undermigration-annotation) 및 [컴파일러 구성](#compiler-configuration) 섹션을 참조하십시오.

:::

패키지 수준 기본 nullability도 지원됩니다.

```java
// FILE: test/package-info.java
@NonNullApi // 패키지 'test'의 모든 유형을 기본적으로 non-nullable로 선언
package test;
```

#### @UnderMigration 주석

라이브러리 유지 관리자는 `@UnderMigration` 주석 (별도의 아티팩트 `kotlin-annotations-jvm`에 제공됨)을 사용하여 nullability 유형 한정자의 마이그레이션 상태를 정의할 수 있습니다.

`@UnderMigration(status = ...)`의 상태 값은 컴파일러가 Kotlin에서 주석이 달린 유형의 부적절한 사용을 처리하는 방법을 지정합니다 (예: `@MyNullable`로 주석이 달린 유형 값을 non-null로 사용).

* `MigrationStatus.STRICT`는 주석이 달린 선언의 유형에 영향을 미치고 Kotlin에서 보이는 대로 영향을 미치고 부적절한 사용에 대한 오류를 보고하는 등 모든 일반 nullability 주석으로 주석을 작동하게 만듭니다.
* `MigrationStatus.WARN`: 부적절한 사용은 오류 대신 컴파일 경고로 보고되지만 주석이 달린 선언의 유형은 플랫폼으로 유지됩니다.
* `MigrationStatus.IGNORE`는 컴파일러가 nullability 주석을 완전히 무시하게 만듭니다.

라이브러리 유지 관리자는 유형 한정자 별칭과 유형 한정자 기본값 모두에 `@UnderMigration` 상태를 추가할 수 있습니다.

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// 클래스의 유형은 non-nullable이지만 경고만 보고됩니다.
// `@NonNullApi`에 `@UnderMigration(status = MigrationStatus.WARN)` 주석이 달려 있기 때문입니다.
@NonNullApi
public class Test {}
```

:::note
nullability 주석의 마이그레이션 상태는 유형 한정자 별칭에 의해 상속되지 않지만 기본 유형 한정자의 사용에 적용됩니다.

:::

기본 유형 한정자가 유형 한정자 별칭을 사용하고 둘 다 `@UnderMigration`인 경우
기본 유형 한정자의 상태가 사용됩니다.

#### 컴파일러 구성

JSR-305 검사는 다음 옵션 (및 해당 조합)으로 `-Xjsr305` 컴파일러 플래그를 추가하여 구성할 수 있습니다.

* non-`@UnderMigration` 주석에 대한 동작을 설정하려면 `-Xjsr305=\{strict|warn|ignore\}`
특히 사용자 지정 nullability 한정자
`@TypeQualifierDefault`는 이미 많은 잘 알려진 라이브러리 간에 확산되었으며 사용자는 다음을 포함하는 Kotlin 버전으로 업데이트할 때 원활하게 마이그레이션해야 할 수 있습니다.
JSR-305 지원. Kotlin 1.1.60부터 이 플래그는 non-`@UnderMigration` 주석에만 영향을 미칩니다.

* `@UnderMigration` 주석에 대한 동작을 재정의하려면 `-Xjsr305=under-migration:\{strict|warn|ignore\}`
사용자는 라이브러리에 대한 마이그레이션 상태에 대해 다른 관점을 가질 수 있습니다.
공식 마이그레이션 상태가 `WARN`인 동안 오류가 발생하기를 원하거나 그 반대의 경우도 있습니다.
일부가 마이그레이션을 완료할 때까지 오류 보고를 연기하기를 원할 수 있습니다.

* 단일 주석에 대한 동작을 재정의하려면 `-Xjsr305=@<fq.name>:\{strict|warn|ignore\}` 여기서 `<fq.name>`
주석의 정규화된 클래스 이름입니다. 서로 다른 주석에 대해 여러 번 나타날 수 있습니다. 이는
특정 라이브러리의 마이그레이션 상태를 관리합니다.

`strict`, `warn` 및 `ignore` 값은 `MigrationStatus`와 동일한 의미를 가지며
`strict` 모드만 Kotlin에서 볼 때 주석이 달린 선언의 유형에 영향을 미칩니다.

:::note
참고: 내장 JSR-305 주석 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html),
[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 및
[`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html)은 항상 활성화되고
`-Xjsr305` 플래그를 사용한 컴파일러 구성에 관계없이 Kotlin의 주석이 달린 선언의 유형에 영향을 미칩니다.

:::

예를 들어, 컴파일러 인수에 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn`를 추가하면 컴파일러가 다음으로 주석이 달린 유형의 부적절한 사용에 대한 경고를 생성합니다.
`@org.library.MyNullable` 및 다른 모든 JSR-305 주석을 무시합니다.

기본 동작은 `-Xjsr305=warn`과 동일합니다.
`strict` 값은 실험적인 것으로 간주해야 합니다 (향후 더 많은 검사가 추가될 수 있습니다).

## 매핑된 유형

Kotlin은 일부 Java 유형을 구체적으로 처리합니다. 이러한 유형은 Java에서 "있는 그대로" 로드되지 않고 해당 Kotlin 유형에 _매핑_됩니다.
매핑은 컴파일 타임에만 중요하며 런타임 표현은 변경되지 않습니다.
 Java의 기본 유형은 해당 Kotlin 유형에 매핑됩니다 ([플랫폼 유형](#null-safety-and-platform-types)을 염두에 두고):

| **Java 유형** | **Kotlin 유형**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |

일부 비기본 제공 클래스도 매핑됩니다.

| **Java 유형** | **Kotlin 유형**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.annotation.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |

Java의 래핑된 기본 유형은 nullable Kotlin 유형에 매핑됩니다.

| **Java 유형**           | **Kotlin 유형**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

유형 매개변수로 사용되는 래핑된 기본 유형은 플랫폼 유형에 매핑됩니다.
예를 들어 `List<java.lang.Integer>`는 Kotlin에서 `List<Int!>`가 됩니다.

컬렉션 유형은 Kotlin에서 읽기 전용이거나 mutable일 수 있으므로 Java의 컬렉션은 다음과 같이 매핑됩니다.
(이 표의 모든 Kotlin 유형은 `kotlin.collections` 패키지에 있습니다).

| **Java 유형** | **Kotlin 읽기 전용 유형**  | **Kotlin mutable 유형** | **로드된 플랫폼 유형** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Java의 배열은 [아래](java-interop#java-arrays)에 언급된 대로 매핑됩니다.

| **Java 유형** | **Kotlin 유형**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |
:::note
이러한 Java 유형의 static 멤버는 Kotlin 유형의 [동반 객체](object-declarations#companion-objects)에서 직접 액세스할 수 없습니다.
이를 호출하려면 Java 유형의 정규화된 전체 이름을 사용하십시오 (예: `java.lang.Integer.toHexString(foo)`).

:::

## Kotlin의 Java 제네릭

Kotlin의 제네릭은 Java의 제네릭과 약간 다릅니다 ([제네릭](generics) 참조).
Java 유형을 Kotlin으로 가져올 때 다음 변환이 수행됩니다.

* Java의 와일드카드는 유형 프로젝션으로 변환됩니다.
  * `Foo<? extends Bar>`는 `Foo<out Bar!>!`가 됩니다.
  * `Foo<? super Bar>`는 `Foo<in Bar!>!`가 됩니다.

* Java의 원시 유형은 별표 프로젝션으로 변환됩니다.
  * `List`는 `List<*>!` 즉 `List<out Any?>!`가 됩니다.

Java와 마찬가지로 Kotlin의 제네릭은 런타임에 유지되지 않습니다. 객체는 생성자에 전달된 실제 유형 인수에 대한 정보를 전달하지 않습니다.
예를 들어 `ArrayList<Integer>()`는 `ArrayList<Character>()`와 구별할 수 없습니다.
이로 인해 제네릭을 고려하는 `is`-검사를 수행할 수 없습니다.
Kotlin은 별표 프로젝션된 제네릭 유형에 대해서만 `is`-검사를 허용합니다.

```kotlin
if (a is List<Int>) // 오류: 실제로 Int 목록인지 확인할 수 없습니다.
// 그러나
if (a is List<*>) // OK: 목록 내용에 대한 보장이 없습니다.
```

## Java 배열

Kotlin의 배열은 Java와 달리 불변입니다. 즉, Kotlin은 `Array<String>`을 `Array<Any>`에 할당할 수 없으므로 가능한 런타임 오류를 방지합니다. 하위 클래스의 배열을 Kotlin 메서드에 수퍼클래스의 배열로 전달하는 것도 금지되어 있지만, Java 메서드의 경우 `Array<(out) String>!` 형식의 [플랫폼 유형](#null-safety-and-platform-types)을 통해 허용됩니다.

배열은 Java 플랫폼에서 기본 데이터 유형과 함께 사용하여 boxing/unboxing 작업 비용을 방지합니다.
Kotlin은 이러한 구현 세부 정보를 숨기므로 Java 코드와 인터페이스하려면 해결 방법이 필요합니다.
이 경우를 처리하기 위해 모든 유형의 기본 배열 (`IntArray`, `DoubleArray`, `CharArray` 등)에 대한 특수 클래스가 있습니다.
이러한 클래스는 `Array` 클래스와 관련이 없으며 최대 성능을 위해 Java의 기본 배열로 컴파일됩니다.

인덱스의 int 배열을 허용하는 Java 메서드가 있다고 가정합니다.

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

기본 값의 배열을 전달하려면 Kotlin에서 다음을 수행할 수 있습니다.

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // int[]를 메서드에 전달합니다.
```

JVM 바이트 코드로 컴파일할 때 컴파일러는 오버헤드가 발생하지 않도록 배열에 대한 액세스를 최적화합니다.

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // get() 및 set()에 대한 실제 호출이 생성되지 않습니다.
for (x in array) { // 반복기가 생성되지 않습니다.
    print(x)
}
```

인덱스로 탐색하는 경우에도 오버헤드가 발생하지 않습니다.

```kotlin
for (i in array.indices) { // 반복기가 생성되지 않습니다.
    array[i] += 2
}
```

마지막으로 `in`-검사에도 오버헤드가 없습니다.

```kotlin
if (i in array.indices) { // (i >= 0 && i < array.size)와 동일합니다.
    print(array[i])
}
```

## Java varargs

Java 클래스는 때때로 가변 길이 인수(varargs)가 있는 인덱스에 대한 메서드 선언을 사용합니다.

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

이 경우 스프레드 연산자 `*`를 사용하여 `IntArray`를 전달해야 합니다.

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 연산자

Java에는 연산자 구문을 사용하는 것이 합리적인 메서드를 표시하는 방법이 없으므로 Kotlin에서는 올바른 이름과 서명이 있는 모든 Java 메서드를 연산자 오버로드 및 기타 규칙 (`invoke()` 등)로 사용할 수 있습니다.
infix 호출 구문을 사용하여 Java 메서드를 호출하는 것은 허용되지 않습니다.

## 확인된 예외

Kotlin에서는 모든 [예외가 확인되지 않았습니다](exceptions). 즉, 컴파일러가 예외를 catch하도록 강제하지 않습니다.
따라서 확인된 예외를 선언하는 Java 메서드를 호출할 때 Kotlin은 아무 것도 수행하도록 강제하지 않습니다.

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java는 여기에서 IOException을 catch하도록 요구합니다.
    }
}
```

## 객체 메서드

Java 유형을 Kotlin으로 가져올 때 `java.lang.Object` 유형의 모든 참조는 `Any`로 바뀝니다.
`Any`는 플랫폼 특정적이지 않으므로 `toString()`, `hashCode()` 및 `equals()`만 멤버로 선언하므로 `java.lang.Object`의 다른 멤버를 사용할 수 있도록 Kotlin은 [확장 함수](extensions)를 사용합니다.

### wait()/notify()

`wait()` 및 `notify()` 메서드는 `Any` 유형의 참조에서 사용할 수 없습니다. 이러한 메서드의 사용은 일반적으로
`java.util.concurrent`를 선호합니다. 이러한 메서드를 실제로 호출해야 하는 경우 `java.lang.Object`로 캐