[//]: # (title: Kotlin에서 Java record 사용하기)

_Records_는 불변 데이터를 저장하기 위한 Java의 [클래스](https://openjdk.java.net/jeps/395)입니다. Records는 고정된 값의 집합인 _record 구성 요소(record components)_를 가집니다.
Java에서 간결한 구문을 제공하며 상용구 코드(boilerplate code)를 작성해야 하는 번거로움을 덜어줍니다:

```java
// Java
public record Person (String name, int age) {}
```

컴파일러는 다음 멤버를 포함하며 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html)를 상속하는 final 클래스를 자동으로 생성합니다:
* 각 record 구성 요소에 대한 private final 필드
* 모든 필드를 파라미터로 받는 public 생성자
* 구조적 동등성(structural equality)을 구현하는 메서드 집합: `equals()`, `hashCode()`, `toString()`
* 각 record 구성 요소를 읽기 위한 public 메서드

Records는 Kotlin의 [데이터 클래스](data-classes.md)와 매우 유사합니다.

## Kotlin 코드에서 Java record 사용하기

Java에서 선언된 구성 요소를 가진 record 클래스를 Kotlin에서 프로퍼티가 있는 클래스를 사용하는 것과 동일한 방식으로 사용할 수 있습니다.
Record 구성 요소에 접근하려면 [Kotlin 프로퍼티](properties.md)와 마찬가지로 이름을 사용하면 됩니다:

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlin에서 record 선언하기

Kotlin은 데이터 클래스에 대해서만 record 선언을 지원하며, 해당 데이터 클래스는 [요구 사항](#requirements)을 충족해야 합니다.

Kotlin에서 record 클래스를 선언하려면 `@JvmRecord` 어노테이션을 사용하세요:

> 기존 클래스에 `@JvmRecord`를 적용하는 것은 바이너리 호환이 되는 변경 사항이 아닙니다. 이는 클래스 프로퍼티 접근자(accessor)의 명명 규칙을 변경합니다.
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

이 JVM 전용 어노테이션은 다음 생성을 가능하게 합니다:

* 클래스 파일 내의 클래스 프로퍼티에 대응하는 record 구성 요소
* Java record 명명 규칙에 따라 이름이 지정된 프로퍼티 접근자 메서드

데이터 클래스는 `equals()`, `hashCode()`, 및 `toString()` 메서드 구현을 제공합니다.

### 요구 사항

`@JvmRecord` 어노테이션이 있는 데이터 클래스를 선언하려면 다음 요구 사항을 충족해야 합니다:

* 클래스는 JVM 16 바이트코드(또는 `-Xjvm-enable-preview` 컴파일러 옵션이 활성화된 경우 15)를 타겟으로 하는 모듈에 있어야 합니다.
* 모든 JVM record는 암시적으로 `java.lang.Record`를 상속하므로, 클래스는 다른 클래스(`Any` 포함)를 명시적으로 상속할 수 없습니다. 하지만 인터페이스는 구현할 수 있습니다.
* 클래스는 대응하는 기본 생성자 파라미터에서 초기화되는 항목을 제외하고 백킹 필드(backing field)가 있는 프로퍼티를 선언할 수 없습니다.
* 클래스는 백킹 필드가 있는 가변(mutable) 프로퍼티를 선언할 수 없습니다.
* 클래스는 로컬(local) 클래스일 수 없습니다.
* 클래스의 기본 생성자는 클래스 자체와 동일한 가시성(visibility)을 가져야 합니다.

### JVM record 활성화하기

JVM record는 생성된 JVM 바이트코드의 타겟 버전이 `16` 이상이어야 합니다.

이를 명시적으로 지정하려면 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 또는 [Maven](maven-compile-package.md#attributes-specific-to-jvm)에서 `jvmTarget` 컴파일러 옵션을 사용하세요.

## Kotlin에서 record 구성 요소에 어노테이션 달기

<primary-label ref="experimental-general"/>

Java에서 record 구성 요소의 [어노테이션](annotations.md)은 백킹 필드, getter, setter 및 생성자 파라미터로 자동으로 전파됩니다.
Kotlin에서는 [`all`](annotations.md#all-meta-target) 사용 지점 대상(use-site target)을 사용하여 이 동작을 복제할 수 있습니다.

> `all` 사용 지점 대상을 사용하려면 명시적으로 동의(opt-in)해야 합니다. `-Xannotation-target-all` 컴파일러 옵션을 사용하거나 `build.gradle.kts` 파일에 다음을 추가하세요.
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

예를 들어:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord`를 `@all:`과 함께 사용하면 Kotlin은 다음을 수행합니다:

* 어노테이션을 프로퍼티, 백킹 필, 생성자 파라미터, getter 및 setter로 전파합니다.
* 어노테이션이 Java의 `RECORD_COMPONENT`를 지원하는 경우, record 구성 요소에도 어노테이션을 적용합니다.

## 어노테이션을 record 구성 요소와 함께 작동하게 만들기

[어노테이션](annotations.md)을 Kotlin 프로퍼티**와** Java record 구성 요소 모두에 사용할 수 있게 하려면 어노테이션 선언에 다음 메타 어노테이션을 추가하세요:

* Kotlin의 경우: [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* Java record 구성 요소의 경우: [`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

예를 들어:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

이제 Kotlin 클래스와 프로퍼티는 물론, Java 클래스와 record 구성 요소에도 `@ExampleClass`를 적용할 수 있습니다.

## 추가 논의

기술적인 세부 사항과 논의에 대해서는 이 [JVM record를 위한 언어 제안(language proposal)](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)을 참조하세요.