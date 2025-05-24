---
title: "Kotlin에서 Java records 사용하기"
---
_레코드(Records)_ 는 불변 데이터를 저장하기 위한 Java의 [클래스](https://openjdk.java.net/jeps/395)입니다. 레코드는 고정된 값 집합인 _레코드 컴포넌트(record components)_ 를 전달합니다.
Java에서 간결한 구문을 가지며 상용구 코드 작성을 줄여줍니다.

```java
// Java
public record Person (String name, int age) {}
```

컴파일러는 다음 멤버와 함께 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html)에서 상속된 final 클래스를 자동으로 생성합니다.
* 각 레코드 컴포넌트에 대한 private final 필드
* 모든 필드에 대한 매개변수를 사용하는 public 생성자
* 구조적 동등성을 구현하기 위한 메서드 집합: `equals()`, `hashCode()`, `toString()`
* 각 레코드 컴포넌트를 읽기 위한 public 메서드

레코드는 Kotlin의 [데이터 클래스](data-classes)와 매우 유사합니다.

## Kotlin 코드에서 Java 레코드 사용

Java에서 선언된 컴포넌트가 있는 레코드 클래스는 Kotlin에서 속성이 있는 클래스를 사용하는 것과 같은 방식으로 사용할 수 있습니다.
레코드 컴포넌트에 접근하려면 [Kotlin 속성](properties)과 마찬가지로 해당 이름을 사용하십시오.

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlin에서 레코드 선언

Kotlin은 데이터 클래스에 대해서만 레코드 선언을 지원하며, 데이터 클래스는 [요구 사항](#requirements)을 충족해야 합니다.

Kotlin에서 레코드 클래스를 선언하려면 `@JvmRecord` 어노테이션을 사용하십시오.

:::note
`@JvmRecord`를 기존 클래스에 적용하는 것은 바이너리 호환성이 깨지는 변경입니다. 클래스 속성 접근자의 명명 규칙을 변경합니다.

:::

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

이 JVM 특정 어노테이션을 사용하면 다음을 생성할 수 있습니다.

* 클래스 파일의 클래스 속성에 해당하는 레코드 컴포넌트
* Java 레코드 명명 규칙에 따라 이름이 지정된 속성 접근자 메서드

데이터 클래스는 `equals()`, `hashCode()`, `toString()` 메서드 구현을 제공합니다.

### 요구 사항

`@JvmRecord` 어노테이션으로 데이터 클래스를 선언하려면 다음 요구 사항을 충족해야 합니다.

* 클래스는 생성된 JVM 바이트코드의 대상이 JVM 16(또는 `-Xjvm-enable-preview` 컴파일러 옵션을 활성화한 경우 15)인 모듈에 있어야 합니다.
* 클래스는 모든 JVM 레코드가 암시적으로 `java.lang.Record`를 상속하므로 다른 클래스( `Any` 포함)를 명시적으로 상속할 수 없습니다. 그러나 클래스는 인터페이스를 구현할 수 있습니다.
* 클래스는 해당 기본 생성자 매개변수에서 초기화된 속성을 제외하고 backing field가 있는 속성을 선언할 수 없습니다.
* 클래스는 backing field가 있는 변경 가능한 속성을 선언할 수 없습니다.
* 클래스는 로컬 클래스일 수 없습니다.
* 클래스의 기본 생성자는 클래스 자체만큼 표시되어야 합니다.

### JVM 레코드 활성화

JVM 레코드는 생성된 JVM 바이트코드의 `16` 대상 버전 이상이 필요합니다.

명시적으로 지정하려면 [Gradle](gradle-compiler-options#attributes-specific-to-jvm) 또는 [Maven](maven#attributes-specific-to-jvm)에서 `jvmTarget` 컴파일러 옵션을 사용하십시오.

## 추가 논의

추가 기술 세부 정보 및 논의는 [JVM 레코드에 대한 언어 제안](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records)을 참조하십시오.