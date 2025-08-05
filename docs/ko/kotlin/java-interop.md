[//]: # (title: Kotlin에서 Java 호출하기)

Kotlin은 Java와의 상호 운용성을 염두에 두고 설계되었습니다. 기존 Java 코드는 Kotlin에서 자연스럽게 호출될 수 있으며, Kotlin 코드 역시 Java에서 상당히 원활하게 사용될 수 있습니다. 이 섹션에서는 Kotlin에서 Java 코드를 호출하는 것에 대한 몇 가지 세부 정보를 설명합니다.

거의 모든 Java 코드는 문제 없이 사용될 수 있습니다:

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for' 루프는 Java 컬렉션에서도 작동합니다:
    for (item in source) {
        list.add(item)
    }
    // 연산자 규칙도 작동합니다:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // get 및 set이 호출됩니다
    }
}
```

## 게터(Getters) 및 세터(Setters)

게터 및 세터에 대한 Java 규칙(이름이 `get`으로 시작하는 인자 없는 메서드와 이름이 `set`으로 시작하는 단일 인자 메서드)을 따르는 메서드는 Kotlin에서 프로퍼티로 표현됩니다. 이러한 프로퍼티는 _합성 프로퍼티(synthetic properties)_라고도 불립니다. `Boolean` 접근자 메서드(게터의 이름이 `is`로 시작하고 세터의 이름이 `set`으로 시작하는 경우)는 게터 메서드와 동일한 이름을 가진 프로퍼티로 표현됩니다.

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

위의 `calendar.firstDayOfWeek`는 합성 프로퍼티의 예시입니다.

Java 클래스에 세터만 있는 경우, Kotlin은 set-only 프로퍼티를 지원하지 않으므로 Kotlin에서는 프로퍼티로 보이지 않습니다.

## Java 합성 프로퍼티 참조

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하는 것을 권장합니다.
>
{style="warning"}

Kotlin 1.8.20부터 Java 합성 프로퍼티에 대한 참조를 생성할 수 있습니다. 다음 Java 코드를 고려하십시오:

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

Kotlin은 항상 `person.age`를 작성할 수 있도록 허용했으며, 여기서 `age`는 합성 프로퍼티입니다. 이제 `Person::age` 및 `person::age`에 대한 참조도 생성할 수 있습니다. `name`에도 동일하게 적용됩니다.

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Java 합성 프로퍼티에 대한 참조 호출:
        .sortedBy(Person::age)
         // Kotlin 프로퍼티 문법을 통해 Java getter 호출:
        .forEach { person -> println(person.name) }
```

### Java 합성 프로퍼티 참조를 활성화하는 방법 {initial-collapse-state="collapsed" collapsible="true"}

이 기능을 활성화하려면 `-language-version 2.1` 컴파일러 옵션을 설정하십시오. Gradle 프로젝트에서는 `build.gradle(.kts)`에 다음을 추가하여 설정할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</tab>
</tabs>

> Kotlin 1.9.0 이전에는 이 기능을 활성화하려면 `-language-version 1.9` 컴파일러 옵션을 설정해야 했습니다.
>
{style="note"}

## void를 반환하는 메서드

Java 메서드가 `void`를 반환하면 Kotlin에서 호출될 때 `Unit`을 반환합니다. 만약 누군가가 그 반환 값을 사용한다면, 값 자체가 미리 알려져 있기 때문에 (즉 `Unit`) Kotlin 컴파일러에 의해 호출 지점에서 할당될 것입니다.

## Kotlin에서 키워드인 Java 식별자 이스케이프

일부 Kotlin 키워드는 Java에서 유효한 식별자입니다: `in`, `object`, `is` 등. Java 라이브러리가 Kotlin 키워드를 메서드에 사용하는 경우, 백틱(`) 문자로 이스케이프하여 메서드를 계속 호출할 수 있습니다:

```kotlin
foo.`is`(bar)
```

## 널 안정성 및 플랫폼 타입

Java의 모든 참조는 `null`일 수 있으며, 이로 인해 Java에서 오는 객체에 대해 Kotlin의 엄격한 널 안정성 요구 사항이 비현실적입니다. Java 선언의 타입은 Kotlin에서 특별한 방식으로 처리되며 *플랫폼 타입*이라고 불립니다. 이러한 타입에 대해서는 널 검사가 완화되어, 안전성 보장이 Java와 동일합니다 (자세한 내용은 [아래](#mapped-types) 참조).

다음 예시를 고려하십시오:

```kotlin
val list = ArrayList<String>() // non-null (생성자 결과)
list.add("Item")
val size = list.size // non-null (기본형 int)
val item = list[0] // 플랫폼 타입 추론됨 (일반 Java 객체)
```

플랫폼 타입 변수에 대해 메서드를 호출할 때, Kotlin은 컴파일 시점에 널 가능성 오류를 발생시키지 않지만, 널 포인터 예외 또는 널이 전파되는 것을 방지하기 위해 Kotlin이 생성하는 어설션(assertion) 때문에 런타임에 호출이 실패할 수 있습니다:

```kotlin
item.substring(1) // 허용됨, item == null이면 예외 발생
```

플랫폼 타입은 *표현 불가능(non-denotable)*하며, 언어에서 명시적으로 작성할 수 없음을 의미합니다. 플랫폼 값이 Kotlin 변수에 할당될 때, 타입 추론에 의존하거나 (`item`이 위 예시에서 그랬던 것처럼 변수가 추론된 플랫폼 타입을 가지게 됨), 기대하는 타입을 선택할 수 있습니다 (널 허용 및 널 불허 타입 모두 허용됨):

```kotlin
val nullable: String? = item // 허용됨, 항상 작동함
val notNull: String = item // 허용됨, 런타임에 실패할 수 있음
```

널 불허 타입을 선택하면 컴파일러가 할당 시 어설션을 발생시킵니다. 이는 Kotlin의 널 불허 변수가 널을 가지는 것을 방지합니다. 어설션은 플랫폼 값을 널 불허 값을 예상하는 Kotlin 함수에 전달할 때와 다른 경우에도 발생합니다. 전반적으로 컴파일러는 널이 프로그램 전체에 멀리 전파되는 것을 방지하기 위해 최선을 다하지만, 제네릭(generics) 때문에 때로는 이를 완전히 제거하는 것이 불가능할 수도 있습니다.

### 플랫폼 타입 표기법

위에서 언급했듯이, 플랫폼 타입은 프로그램에서 명시적으로 언급될 수 없으므로, 언어에 대한 문법이 없습니다. 그럼에도 불구하고, 컴파일러와 IDE는 때때로 이를 표시해야 하므로 (예: 오류 메시지 또는 매개변수 정보), 이에 대한 니모닉(mnemonic) 표기법이 있습니다:

* `T!`는 "`T` 또는 `T?`"를 의미합니다.
* `(Mutable)Collection<T>!`는 "Java 컬렉션 `T`가 가변(mutable)일 수도 있고 아닐 수도 있으며, 널 허용(nullable)일 수도 있고 아닐 수도 있다"를 의미합니다.
* `Array<(out) T>!`는 "Java 배열 `T` (또는 `T`의 서브타입), 널 허용일 수도 있고 아닐 수도 있다"를 의미합니다.

### 널 가능성 어노테이션

널 가능성 어노테이션이 있는 Java 타입은 플랫폼 타입이 아닌 실제 널 허용 또는 널 불허 Kotlin 타입으로 표현됩니다. 컴파일러는 다음을 포함하여 여러 종류의 널 가능성 어노테이션을 지원합니다:

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`org.jetbrains.annotations` 패키지의 `@Nullable` 및 `@NotNull`)
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` 및 `android.support.annotations`)
  * JSR-305 (`javax.annotation`, 자세한 내용은 아래 참조)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

특정 타입의 널 가능성 어노테이션 정보에 따라 컴파일러가 널 가능성 불일치를 보고하는지 여부를 지정할 수 있습니다. 컴파일러 옵션 `-Xnullability-annotations=@<package-name>:<report-level>`을 사용하십시오. 인자에는 완전한 정규화된 널 가능성 어노테이션 패키지와 다음 보고 수준 중 하나를 지정하십시오:
* `ignore`: 널 가능성 불일치를 무시합니다.
* `warn`: 경고를 보고합니다.
* `strict`: 오류를 보고합니다.

지원되는 널 가능성 어노테션 전체 목록은 [Kotlin 컴파일러 소스 코드](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt)에서 확인할 수 있습니다.

### 타입 인자와 타입 매개변수 어노테이션

제네릭 타입의 타입 인자와 타입 매개변수에도 널 가능성 정보를 제공하기 위해 어노테이션을 달 수 있습니다.

> 이 섹션의 모든 예제는 `org.jetbrains.annotations` 패키지의 JetBrains 널 가능성 어노테이션을 사용합니다.
>
{style="note"}

#### 타입 인자

다음 Java 선언의 어노테이션을 고려하십시오:

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

이는 Kotlin에서 다음과 같은 시그니처를 초래합니다:

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

타입 인자에서 `@NotNull` 어노테이션이 누락되면 대신 플랫폼 타입을 얻게 됩니다:

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlin은 또한 기본 클래스와 인터페이스의 타입 인자에 대한 널 가능성 어노테이션을 고려합니다. 예를 들어, 아래에 제공된 시그니처를 가진 두 개의 Java 클래스가 있습니다:

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

Kotlin 코드에서 `Base<String>`이 가정되는 곳에 `Derived` 인스턴스를 전달하면 경고가 발생합니다.

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // warning: nullability mismatch
}
```

`Derived`의 상위 바운드(upper bound)는 `Base<String?>`으로 설정되며, 이는 `Base<String>`과 다릅니다.

Kotlin의 [Java 제네릭](#java-generics-in-kotlin)에 대해 자세히 알아보십시오.

#### 타입 매개변수

기본적으로 Kotlin과 Java 모두에서 일반 타입 매개변수의 널 가능성은 정의되지 않습니다. Java에서는 널 가능성 어노테이션을 사용하여 이를 지정할 수 있습니다. `Base` 클래스의 타입 매개변수에 어노테이션을 달아 봅시다:

```java
public class Base<@NotNull T> {}
```

`Base`를 상속할 때 Kotlin은 널 불허 타입 인자 또는 타입 매개변수를 예상합니다. 따라서 다음 Kotlin 코드는 경고를 발생시킵니다:

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

상위 바운드 `K : Any`를 지정하여 이를 수정할 수 있습니다.

Kotlin은 또한 Java 타입 매개변수의 바운드에 대한 널 가능성 어노테이션을 지원합니다. `Base`에 바운드를 추가해 봅시다:

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlin은 이를 다음과 같이 번역합니다:

```kotlin
class BaseWithBound<T : Number> {}
```

따라서 널 허용 타입을 타입 인자 또는 타입 매개변수로 전달하면 경고가 발생합니다.

타입 인자 및 타입 매개변수 어노테이션은 Java 8 이상에서 작동합니다. 이 기능은 널 가능성 어노테이션이 `TYPE_USE` 타겟을 지원해야 합니다 (`org.jetbrains.annotations`는 버전 15 이상에서 이를 지원합니다).

> 널 가능성 어노테이션이 `TYPE_USE` 타겟 외에도 타입에 적용 가능한 다른 타겟을 지원하는 경우, `TYPE_USE`가 우선 순위를 가집니다. 예를 들어, `@Nullable`이 `TYPE_USE`와 `METHOD` 타겟을 모두 가지고 있다면, Java 메서드 시그니처 `@Nullable String[] f()`는 Kotlin에서 `fun f(): Array<String?>!`가 됩니다.
>
{style="note"}

### JSR-305 지원

[JSR-305](https://jcp.org/en/jsr/detail?id=305)에 정의된 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html) 어노테이션은 Java 타입의 널 가능성을 나타내는 데 지원됩니다.

`@Nonnull(when = ...)` 값이 `When.ALWAYS`인 경우 어노테이션된 타입은 널 불허로 처리됩니다. `When.MAYBE` 및 `When.NEVER`는 널 허용 타입을 나타내며, `When.UNKNOWN`은 타입을 [플랫폼 타입](#null-safety-and-platform-types)으로 강제합니다.

라이브러리는 JSR-305 어노테이션에 대해 컴파일될 수 있지만, 어노테이션 아티팩트(예: `jsr305.jar`)를 라이브러리 소비자를 위한 컴파일 종속성으로 만들 필요는 없습니다. Kotlin 컴파일러는 클래스패스에 어노테이션이 없어도 라이브러리에서 JSR-305 어노테이션을 읽을 수 있습니다.

[사용자 정의 널 가능성 한정자 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers.md)도 지원됩니다 (아래 참조).

#### 타입 한정자 별칭

어노테이션 타입이 [`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)과 JSR-305 `@Nonnull`(또는 `@CheckForNull`과 같은 다른 별칭)으로 모두 어노테이션된 경우, 해당 어노테이션 타입 자체는 정확한 널 가능성을 검색하는 데 사용되며 해당 널 가능성 어노테이션과 동일한 의미를 가집니다:

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 다른 타입 한정자 별칭에 대한 별칭
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // Kotlin에서 (strict 모드): `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // Kotlin에서 (strict 모드): `fun bar(x: List<String>!): String!`
}
```

#### 타입 한정자 기본값

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)를 사용하면 어노테이션이 적용될 때 어노테이션된 요소의 범위 내에서 기본 널 가능성을 정의하는 어노테이션을 도입할 수 있습니다.

이러한 어노테이션 타입 자체는 `@Nonnull`(또는 해당 별칭)과 하나 이상의 `ElementType` 값을 가진 `@TypeQualifierDefault(...)`로 어노테이션되어야 합니다:

* `ElementType.METHOD`: 메서드의 반환 타입용
* `ElementType.PARAMETER`: 값 매개변수용
* `ElementType.FIELD`: 필드용
* `ElementType.TYPE_USE`: 타입 인자, 타입 매개변수의 상위 바운드 및 와일드카드 타입을 포함한 모든 타입용

기본 널 가능성은 타입 자체에 널 가능성 어노테이션이 어노테이션되어 있지 않고, 기본값이 타입 사용법과 일치하는 `ElementType`를 가진 타입 한정자 기본값 어노테이션으로 어노테이션된 가장 안쪽의 둘러싸는 요소에 의해 결정될 때 사용됩니다.

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

    @NotNullApi // 인터페이스의 기본값 오버라이드
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // `@NullableApi`가 `TYPE_USE` 요소 타입을 가지고 있기 때문에 `List<String>` 타입 인수는 nullable로 간주됨:
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // 명시적으로 UNKNOWN으로 표시된 nullability 어노테이션이 있기 때문에 `x` 매개변수의 타입은 플랫폼 타입으로 유지됨:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

> 이 예시의 타입은 strict 모드가 활성화된 경우에만 적용됩니다. 그렇지 않으면 플랫폼 타입으로 유지됩니다.
> [`@UnderMigration` 어노테이션](#undermigration-annotation) 및 [컴파일러 구성](#compiler-configuration) 섹션을 참조하십시오.
>
{style="note"}

패키지 수준의 기본 널 가능성도 지원됩니다:

```java
// FILE: test/package-info.java
@NonNullApi // 'test' 패키지의 모든 타입을 기본적으로 non-nullable로 선언
package test;
```

#### @UnderMigration 어노테이션

`@UnderMigration` 어노테이션(`kotlin-annotations-jvm` 별도 아티팩트에서 제공됨)은 라이브러리 유지보수자가 널 가능성 타입 한정자에 대한 마이그레이션 상태를 정의하는 데 사용할 수 있습니다.

`@UnderMigration(status = ...)`의 상태 값은 컴파일러가 Kotlin에서 어노테이션된 타입의 부적절한 사용(예: `@MyNullable` 어노테이션이 달린 타입 값을 non-null로 사용)을 어떻게 처리하는지 지정합니다:

* `MigrationStatus.STRICT`: 어노테이션이 일반 널 가능성 어노테이션처럼 작동합니다. 즉, 부적절한 사용에 대해 오류를 보고하고 어노테이션된 선언의 타입이 Kotlin에서 보이는 방식에 영향을 줍니다.
* `MigrationStatus.WARN`: 부적절한 사용이 오류 대신 컴파일 경고로 보고되지만, 어노테이션된 선언의 타입은 플랫폼 타입으로 유지됩니다.
* `MigrationStatus.IGNORE`: 컴파일러가 널 가능성 어노테이션을 완전히 무시하도록 합니다.

라이브러리 유지보수자는 `@UnderMigration` 상태를 타입 한정자 별칭과 타입 한정자 기본값 모두에 추가할 수 있습니다:

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// 클래스 내 타입은 non-nullable이지만, `@NonNullApi`가 `@UnderMigration(status = MigrationStatus.WARN)`으로 어노테이션되어 있어 경고만 보고됨
@NonNullApi
public class Test {}
```

> 널 가능성 어노테이션의 마이그레이션 상태는 해당 타입 한정자 별칭에 의해 상속되지 않지만, 기본 타입 한정자에서 사용될 때 적용됩니다.
>
{style="note"}

기본 타입 한정자가 타입 한정자 별칭을 사용하고 둘 다 `@UnderMigration`인 경우, 기본 타입 한정자의 상태가 사용됩니다.

#### 컴파일러 구성

JSR-305 검사는 다음 옵션(및 조합)과 함께 `-Xjsr305` 컴파일러 플래그를 추가하여 구성할 수 있습니다:

* `-Xjsr305={strict|warn|ignore}`: `@UnderMigration` 어노테이션이 없는 경우의 동작을 설정합니다. 사용자 정의 널 가능성 한정자, 특히 `@TypeQualifierDefault`는 이미 많은 잘 알려진 라이브러리에서 확산되어 있으며, 사용자는 JSR-305 지원을 포함하는 Kotlin 버전으로 업데이트할 때 원활하게 마이그레이션해야 할 수 있습니다. Kotlin 1.1.60부터 이 플래그는 `@UnderMigration` 어노테이션이 없는 경우에만 영향을 줍니다.

* `-Xjsr305=under-migration:{strict|warn|ignore}`: `@UnderMigration` 어노테이션의 동작을 오버라이드합니다. 사용자는 라이브러리의 마이그레이션 상태에 대해 다른 관점을 가질 수 있습니다. 공식 마이그레이션 상태가 `WARN`일 때 오류를 원하거나, 반대로 마이그레이션 완료 전까지 일부 오류 보고를 연기하고 싶을 수도 있습니다.

* `-Xjsr305=@<fq.name>:{strict|warn|ignore}`: 단일 어노테이션의 동작을 오버라이드합니다. 여기서 `<fq.name>`은 어노테이션의 완전 정규화된 클래스 이름입니다. 여러 어노테이션에 대해 여러 번 나타날 수 있습니다. 이는 특정 라이브러리의 마이그레이션 상태를 관리하는 데 유용합니다.

`strict`, `warn`, `ignore` 값은 `MigrationStatus`와 동일한 의미를 가지며, `strict` 모드만이 어노테이션된 선언의 타입이 Kotlin에서 보이는 방식에 영향을 줍니다.

> 참고: 내장 JSR-305 어노테이션인 [`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html),
>[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) 및
>[`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html)은 항상 활성화되어 있으며
>`-Xjsr305` 플래그를 사용한 컴파일러 구성과 관계없이 Kotlin에서 어노테이션된 선언의 타입에 영향을 줍니다.
>
{style="note"}

예를 들어, 컴파일러 인수에 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn`를 추가하면 컴파일러는 `@org.library.MyNullable`로 어노테이션된 타입의 부적절한 사용에 대해 경고를 생성하고 다른 모든 JSR-305 어노테이션을 무시합니다.

기본 동작은 `-Xjsr305=warn`과 동일합니다. `strict` 값은 실험적인 것으로 간주되어야 합니다 (향후 더 많은 검사가 추가될 수 있습니다).

## 매핑된 타입

Kotlin은 일부 Java 타입을 특별하게 처리합니다. 이러한 타입은 Java에서 "있는 그대로" 로드되지 않고, 해당하는 Kotlin 타입으로 _매핑_됩니다. 매핑은 컴파일 시점에만 중요하며, 런타임 표현은 변경되지 않습니다. Java의 기본 타입은 해당 Kotlin 타입으로 매핑됩니다 ([플랫폼 타입](#null-safety-and-platform-types)을 염두에 두고):

| **Java 타입** | **Kotlin 타입**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |

일부 비기본(non-primitive) 내장 클래스도 매핑됩니다:

| **Java 타입** | **Kotlin 타입**  |
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

Java의 박싱된(boxed) 기본 타입은 널 허용 Kotlin 타입으로 매핑됩니다:

| **Java 타입**           | **Kotlin 타입**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

타입 매개변수로 사용되는 박싱된 기본 타입은 플랫폼 타입으로 매핑됩니다. 예를 들어, `List<java.lang.Integer>`는 Kotlin에서 `List<Int!>`가 됩니다.

컬렉션 타입은 Kotlin에서 읽기 전용 또는 가변일 수 있으므로, Java의 컬렉션은 다음과 같이 매핑됩니다 (이 표의 모든 Kotlin 타입은 `kotlin.collections` 패키지에 있습니다):

| **Java 타입** | **Kotlin 읽기 전용 타입**  | **Kotlin 가변 타입** | **로드된 플랫폼 타입** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Java의 배열은 [아래](#java-arrays)에서 언급된 대로 매핑됩니다:

| **Java 타입** | **Kotlin 타입**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |

> 이러한 Java 타입의 정적 멤버는 Kotlin 타입의 [컴패니언 객체(companion objects)](object-declarations.md#companion-objects)에서 직접 접근할 수 없습니다. 이를 호출하려면 `java.lang.Integer.toHexString(foo)`와 같이 Java 타입의 완전 정규화된 이름(full qualified names)을 사용하십시오.
>
{style="note"}

## Kotlin의 Java 제네릭

Kotlin의 제네릭은 Java의 제네릭과 약간 다릅니다 ([제네릭](generics.md) 참조). Java 타입을 Kotlin으로 임포트할 때 다음 변환이 수행됩니다:

* Java의 와일드카드는 타입 프로젝션(type projections)으로 변환됩니다:
  * `Foo<? extends Bar>`는 `Foo<out Bar!>!`가 됩니다.
  * `Foo<? super Bar>`는 `Foo<in Bar!>!`가 됩니다.

* Java의 로(raw) 타입은 스타 프로젝션(star projections)으로 변환됩니다:
  * `List`는 `List<*>!` (즉 `List<out Any?>!`)가 됩니다.

Java와 마찬가지로 Kotlin의 제네릭은 런타임에 유지되지 않습니다. 객체는 생성자에 전달된 실제 타입 인수에 대한 정보를 가지고 있지 않습니다. 예를 들어, `ArrayList<Integer>()`는 `ArrayList<Character>()`와 구별할 수 없습니다. 이로 인해 제네릭을 고려하는 `is` 검사를 수행하는 것이 불가능합니다. Kotlin은 스타 프로젝션된 제네릭 타입에 대해서만 `is` 검사를 허용합니다:

```kotlin
if (a is List<Int>) // 오류: 실제 Int 리스트인지 확인할 수 없음
// 하지만
if (a is List<*>) // OK: 리스트 내용에 대한 보장은 없음
```

## Java 배열

Kotlin의 배열은 Java와 달리 불변입니다. 이는 Kotlin이 `Array<String>`을 `Array<Any>`에 할당하는 것을 허용하지 않아 발생할 수 있는 런타임 실패를 방지합니다. 서브클래스 배열을 슈퍼클래스 배열로 Kotlin 메서드에 전달하는 것도 금지되지만, Java 메서드의 경우 `Array<(out) String>!` 형태의 [플랫폼 타입](#null-safety-and-platform-types)을 통해 허용됩니다.

배열은 Java 플랫폼에서 박싱/언박싱(boxing/unboxing) 연산의 비용을 피하기 위해 기본 데이터 타입과 함께 사용됩니다. Kotlin이 이러한 구현 세부 정보를 숨기기 때문에 Java 코드와 인터페이스하려면 해결 방법이 필요합니다. 이 경우를 처리하기 위해 모든 유형의 기본 배열(`IntArray`, `DoubleArray`, `CharArray` 등)에 대한 특수 클래스가 있습니다. 이들은 `Array` 클래스와 관련이 없으며 최대 성능을 위해 Java의 기본 배열로 컴파일됩니다.

정수형 배열(int array)을 인덱스로 받는 Java 메서드가 있다고 가정해 봅시다:

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

기본 값 배열을 전달하려면 Kotlin에서 다음을 수행할 수 있습니다:

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // int[]를 메서드에 전달
```

JVM 바이트코드로 컴파일할 때 컴파일러는 배열 접근을 최적화하여 오버헤드가 발생하지 않도록 합니다:

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // 실제 get() 및 set() 호출이 생성되지 않음
for (x in array) { // 이터레이터가 생성되지 않음
    print(x)
}
```

인덱스를 사용하여 탐색할 때도 오버헤드가 발생하지 않습니다:

```kotlin
for (i in array.indices) { // 이터레이터가 생성되지 않음
    array[i] += 2
}
```

마지막으로, `in` 검사도 오버헤드가 없습니다:

```kotlin
if (i in array.indices) { // (i >= 0 && i < array.size)와 동일
    print(array[i])
}
```

## Java 가변 인자(varargs)

Java 클래스는 때때로 가변 인자(varargs)를 사용하여 인덱스에 대한 메서드 선언을 사용합니다:

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

이 경우 `IntArray`를 전달하려면 스프레드 연산자 `*`를 사용해야 합니다:

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 연산자

Java는 연산자 문법을 사용하는 것이 합리적인 메서드를 표시하는 방법이 없으므로, Kotlin은 올바른 이름과 시그니처를 가진 모든 Java 메서드를 연산자 오버로드 및 기타 규칙(`invoke()` 등)으로 사용할 수 있도록 허용합니다. infix 호출 문법을 사용하여 Java 메서드를 호출하는 것은 허용되지 않습니다.

## 체크된 예외

Kotlin에서는 모든 [예외가 언체크드(unchecked)](exceptions.md)입니다. 즉, 컴파일러가 어떤 예외도 강제로 catch하도록 하지 않습니다. 따라서 체크된 예외를 선언하는 Java 메서드를 호출할 때 Kotlin은 아무것도 강제하지 않습니다:

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java에서는 여기서 IOException을 catch해야 함
    }
}
```

## 객체 메서드

Java 타입이 Kotlin으로 임포트될 때, `java.lang.Object` 타입의 모든 참조는 `Any`로 변환됩니다. `Any`는 플랫폼 독립적(platform-specific)이지 않으므로, `toString()`, `hashCode()`, `equals()`만 멤버로 선언합니다. 따라서 `java.lang.Object`의 다른 멤버를 사용 가능하게 하려면 Kotlin은 [확장 함수(extension functions)](extensions.md)를 사용합니다.

### wait()/notify()

`wait()` 및 `notify()` 메서드는 `Any` 타입의 참조에서 사용할 수 없습니다. 이들은 일반적으로 `java.util.concurrent` 사용을 권장하며 사용이 권장되지 않습니다. 이 메서드를 정말 호출해야 하는 경우 `java.lang.Object`로 캐스트(cast)할 수 있습니다:

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

객체의 Java 클래스를 가져오려면 [클래스 참조(class reference)](reflection.md#class-references)에 있는 `java` 확장 프로퍼티를 사용하십시오:

```kotlin
val fooClass = foo::class.java
```

위 코드는 [바인딩된 클래스 참조(bound class reference)](reflection.md#bound-class-references)를 사용합니다. `javaClass` 확장 프로퍼티를 사용할 수도 있습니다:

```kotlin
val fooClass = foo.javaClass
```

이러한 목적으로 `ClassName.javaClass`를 사용하지 마십시오. 이는 `ClassName`의 컴패니언 객체 클래스를 참조하며, 이는 `ClassName.Companion::class.java`와 동일하고 `ClassName::class.java`와는 다릅니다.

각 기본 타입에 대해 두 개의 다른 Java 클래스가 있으며, Kotlin은 둘 다를 가져오는 방법을 제공합니다. 예를 들어, `Int::class.java`는 기본 타입 자체를 나타내는 클래스 인스턴스를 반환하며, 이는 Java의 `Integer.TYPE`에 해당합니다. 해당 래퍼(wrapper) 타입의 클래스를 얻으려면 `Int::class.javaObjectType`을 사용하십시오. 이는 Java의 `Integer.class`와 동일합니다.

기타 지원되는 경우로는 Kotlin 프로퍼티에 대한 Java 게터/세터 메서드 또는 backing 필드, Java 필드에 대한 `KProperty`, `KFunction`에 대한 Java 메서드 또는 생성자, 그리고 그 반대의 경우도 포함됩니다.

## SAM 변환

Kotlin은 Java 및 [Kotlin 인터페이스](fun-interfaces.md) 모두에 대한 SAM(Single Abstract Method) 변환을 지원합니다. Java에 대한 이 지원은 Kotlin 함수 리터럴이 단일 비-기본(non-default) 메서드를 가진 Java 인터페이스 구현으로 자동 변환될 수 있음을 의미합니다. 단, 인터페이스 메서드의 매개변수 타입이 Kotlin 함수의 매개변수 타입과 일치해야 합니다.

이를 사용하여 SAM 인터페이스의 인스턴스를 생성할 수 있습니다:

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...그리고 메서드 호출에서:

```kotlin
val executor = ThreadPoolExecutor()
// Java 시그니처: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

Java 클래스에 함수형 인터페이스를 인자로 받는 메서드가 여러 개 있는 경우, 람다를 특정 SAM 타입으로 변환하는 어댑터 함수를 사용하여 호출해야 하는 메서드를 선택할 수 있습니다. 이러한 어댑터 함수는 필요할 때 컴파일러에 의해 생성됩니다:

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM 변환은 인터페이스에만 작동하며, 추상 클래스에는 작동하지 않습니다. 설령 추상 클래스에 단 하나의 추상 메서드만 있더라도 마찬가지입니다.
>
{style="note"}

## Kotlin에서 JNI 사용하기

네이티브(C 또는 C++) 코드로 구현된 함수를 선언하려면 `external` 한정자로 표시해야 합니다:

```kotlin
external fun foo(x: Int): Double
```

나머지 절차는 Java에서와 정확히 동일하게 작동합니다.

프로퍼티 게터와 세터를 `external`로 표시할 수도 있습니다:

```kotlin
var myProperty: String
    external get
    external set
```

내부적으로 이것은 `getMyProperty`와 `setMyProperty` 두 함수를 생성하며, 둘 다 `external`로 표시됩니다.

## Lombok으로 생성된 선언을 Kotlin에서 사용하기

Java의 Lombok으로 생성된 선언을 Kotlin 코드에서 사용할 수 있습니다. 동일한 Java/Kotlin 혼합 모듈에서 이러한 선언을 생성하고 사용해야 하는 경우, [Lombok 컴파일러 플러그인 페이지](lombok.md)에서 이를 수행하는 방법을 배울 수 있습니다. 다른 모듈에서 이러한 선언을 호출하는 경우, 해당 모듈을 컴파일하기 위해 이 플러그인을 사용할 필요는 없습니다.