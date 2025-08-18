[//]: # (title: Kotlin에서 자바 레코드 사용하기)

_레코드(Records)_는 불변 데이터를 저장하기 위한 자바의 [클래스](https://openjdk.java.net/jeps/395)입니다. 레코드는 _레코드 컴포넌트(records components)_라는 고정된 값 집합을 가집니다.
레코드는 자바에서 간결한 문법을 제공하여 상용구 코드(boilerplate code)를 작성할 필요가 없습니다.

```java
// Java
public record Person (String name, int age) {}
```

컴파일러는 자동으로 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html)를 상속받는 최종(final) 클래스를 다음 멤버와 함께 생성합니다:
*   각 레코드 컴포넌트에 대한 private final 필드
*   모든 필드에 대한 매개변수를 가진 public 생성자
*   구조적 동일성(structural equality)을 구현하는 메서드 집합: `equals()`, `hashCode()`, `toString()`
*   각 레코드 컴포넌트를 읽기 위한 public 메서드

레코드는 코틀린 [데이터 클래스](data-classes.md)와 매우 유사합니다.

## 코틀린 코드에서 자바 레코드 사용하기

자바에서 선언된 컴포넌트를 가진 레코드 클래스는 코틀린에서 프로퍼티를 가진 클래스를 사용하는 것과 동일한 방식으로 사용할 수 있습니다.
레코드 컴포넌트에 접근하려면 [코틀린 프로퍼티](properties.md)처럼 해당 이름을 사용하면 됩니다.

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 코틀린에서 레코드 선언하기

코틀린은 데이터 클래스에 대해서만 레코드 선언을 지원하며, 데이터 클래스는 [요구 사항](#requirements)을 충족해야 합니다.

코틀린에서 레코드 클래스를 선언하려면 `@JvmRecord` 어노테이션을 사용합니다.

> `@JvmRecord`를 기존 클래스에 적용하는 것은 바이너리 호환 변경(binary compatible change)이 아닙니다. 이 어노테이션은 클래스 프로퍼티 접근자(accessors)의 명명 규칙을 변경합니다.
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

이 JVM 특정 어노테이션은 다음을 생성할 수 있도록 합니다.

*   클래스 파일의 클래스 프로퍼티에 해당하는 레코드 컴포넌트
*   자바 레코드 명명 규칙에 따라 이름이 지정된 프로퍼티 접근자 메서드

데이터 클래스는 `equals()`, `hashCode()`, `toString()` 메서드 구현을 제공합니다.

### 요구 사항

`@JvmRecord` 어노테이션과 함께 데이터 클래스를 선언하려면 다음 요구 사항을 충족해야 합니다.

*   클래스는 JVM 16 바이트코드(또는 `-Xjvm-enable-preview` 컴파일러 옵션이 활성화된 경우 15)를 대상으로 하는 모듈에 있어야 합니다.
*   모든 JVM 레코드가 암시적으로 `java.lang.Record`를 상속하기 때문에 클래스는 명시적으로 다른 클래스(`Any` 포함)를 상속할 수 없습니다. 하지만 클래스는 인터페이스를 구현할 수 있습니다.
*   클래스는 해당 주 생성자 매개변수에서 초기화된 경우를 제외하고 배킹 필드(backing fields)를 가진 프로퍼티를 선언할 수 없습니다.
*   클래스는 배킹 필드를 가진 가변(mutable) 프로퍼티를 선언할 수 없습니다.
*   클래스는 로컬 클래스(local class)일 수 없습니다.
*   클래스의 주 생성자는 클래스 자체만큼 가시적이어야 합니다.

### JVM 레코드 활성화하기

JVM 레코드는 생성된 JVM 바이트코드의 `16` 이상 대상 버전을 요구합니다.

명시적으로 지정하려면 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 또는 [Maven](maven.md#attributes-specific-to-jvm)에서 `jvmTarget` 컴파일러 옵션을 사용하세요.

## 코틀린에서 레코드 컴포넌트 어노테이션 지정하기

<primary-label ref="experimental-general"/>

자바에서 레코드 컴포넌트에 대한 [어노테이션](annotations.md)은 배킹 필드, getter, setter 및 생성자 매개변수로 자동으로 전파됩니다.
코틀린에서는 [`all`](annotations.md#all-meta-target) 사용-사이트 대상(use-site target)을 사용하여 이 동작을 재현할 수 있습니다.

> `all` 사용-사이트 대상을 사용하려면 옵트인(opt in)해야 합니다. `-Xannotation-target-all` 컴파일러 옵션을 사용하거나 `build.gradle.kts` 파일에 다음 내용을 추가하세요.
>
> ```kotlin
> kotlin {
>     compilerOptions {
>         freeCompilerArgs.add("-Xannotation-target-all")
>     }
> }
> ```
>
{style="warning"}

예시:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord`와 `@all:`을 함께 사용할 때 코틀린은 다음을 수행합니다.

*   어노테이션을 프로퍼티, 배킹 필드, 생성자 매개변수, getter 및 setter에 전파합니다.
*   어노테이션이 자바의 `RECORD_COMPONENT`를 지원하는 경우, 레코드 컴포넌트에도 어노테이션을 적용합니다.

## 어노테이션이 레코드 컴포넌트와 작동하도록 만들기

[어노테이션](annotations.md)을 코틀린 프로퍼티 **및** 자바 레코드 컴포넌트 모두에 사용할 수 있도록 하려면 어노테이션 선언에 다음 메타 어노테이션(meta-annotations)을 추가하세요.

*   코틀린의 경우: [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
*   자바 레코드 컴포넌트의 경우: [`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

예시:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

이제 `@ExampleClass`를 코틀린 클래스 및 프로퍼티뿐만 아니라 자바 클래스 및 레코드 컴포넌트에도 적용할 수 있습니다.

## 추가 논의

더 자세한 기술적 세부 사항 및 논의는 [JVM 레코드에 대한 이 언어 제안](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)을 참조하세요.