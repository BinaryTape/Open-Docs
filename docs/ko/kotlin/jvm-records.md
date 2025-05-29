[//]: # (title: Kotlin에서 Java 레코드 사용하기)

_레코드_는 불변(immutable) 데이터를 저장하기 위한 Java [클래스](https://openjdk.java.net/jeps/395)입니다. 레코드는 고정된 값 집합인 _레코드 컴포넌트_를 가집니다.
Java에서는 간결한 구문을 가지며 상용구 코드를 작성할 필요가 없습니다:

```java
// Java
public record Person (String name, int age) {}
```

컴파일러는 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html)를 상속받는 final 클래스를 다음 멤버와 함께 자동으로 생성합니다:
*   각 레코드 컴포넌트에 대한 private final 필드
*   모든 필드에 대한 파라미터를 가진 public 생성자
*   구조적 동등성을 구현하기 위한 메서드 집합: `equals()`, `hashCode()`, `toString()`
*   각 레코드 컴포넌트를 읽기 위한 public 메서드

레코드는 Kotlin [데이터 클래스](data-classes.md)와 매우 유사합니다.

## Kotlin 코드에서 Java 레코드 사용하기

Java에서 선언된 컴포넌트를 가진 레코드 클래스는 Kotlin에서 프로퍼티를 가진 클래스를 사용하는 것과 동일한 방식으로 사용할 수 있습니다.
레코드 컴포넌트에 접근하려면 [Kotlin 프로퍼티](properties.md)에서 하는 것처럼 이름을 사용하세요:

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlin에서 레코드 선언하기

Kotlin은 데이터 클래스에 한해서만 레코드 선언을 지원하며, 해당 데이터 클래스는 [요구 사항](#requirements)을 충족해야 합니다.

Kotlin에서 레코드 클래스를 선언하려면 `@JvmRecord` 애너테이션을 사용하세요:

> `@JvmRecord`를 기존 클래스에 적용하는 것은 바이너리 호환 변경이 아닙니다. 이는 클래스 프로퍼티 접근자의 이름 규칙을 변경합니다.
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

이 JVM 전용 애너테이션은 다음을 생성하는 것을 가능하게 합니다:

*   클래스 파일에 클래스 프로퍼티에 해당하는 레코드 컴포넌트
*   Java 레코드 이름 규칙에 따라 이름이 지정된 프로퍼티 접근자 메서드

데이터 클래스는 `equals()`, `hashCode()`, `toString()` 메서드 구현을 제공합니다.

### 요구 사항

`@JvmRecord` 애너테이션을 사용하여 데이터 클래스를 선언하려면 다음 요구 사항을 충족해야 합니다:

*   클래스는 JVM 16 바이트코드를 대상으로 하는 모듈에 있어야 합니다 (또는 `-Xjvm-enable-preview` 컴파일러 옵션이 활성화된 경우 15).
*   모든 JVM 레코드는 암시적으로 `java.lang.Record`를 상속하기 때문에, 클래스는 다른 어떤 클래스도 ( `Any`를 포함하여) 명시적으로 상속할 수 없습니다. 하지만, 클래스는 인터페이스를 구현할 수 있습니다.
*   클래스는 백킹 필드를 가진 어떤 프로퍼티도 선언할 수 없습니다 – 해당 주 생성자 파라미터에서 초기화된 것을 제외하고는.
*   클래스는 백킹 필드를 가진 가변(mutable) 프로퍼티를 선언할 수 없습니다.
*   클래스는 로컬 클래스가 될 수 없습니다.
*   클래스의 주 생성자는 클래스 자체만큼 가시적이어야 합니다.

### JVM 레코드 활성화하기

JVM 레코드는 생성된 JVM 바이트코드의 `16` 타겟 버전 이상을 요구합니다.

명시적으로 지정하려면 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 또는 [Maven](maven.md#attributes-specific-to-jvm)에서 `jvmTarget` 컴파일러 옵션을 사용하세요.

## 추가 논의

더 자세한 기술적 세부 사항 및 논의를 위해 JVM 레코드에 대한 이 [언어 제안서](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)를 참조하세요.