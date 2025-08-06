[//]: # (title: Kotlin 1.5.20의 새로운 기능)

_[출시일: 2021년 6월 24일](releases.md#release-details)_

Kotlin 1.5.20에는 1.5.0의 새로운 기능에서 발견된 문제에 대한 수정 사항과 다양한 툴링 개선 사항이 포함되어 있습니다.

변경 사항에 대한 개요는 [릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)과 다음 비디오에서 확인할 수 있습니다:

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20은 JVM 플랫폼에서 다음 업데이트를 제공합니다:
* [invokedynamic을 통한 문자열 연결](#string-concatenation-via-invokedynamic)
* [JSpecify 널 가능성(nullness) 어노테이션 지원](#support-for-jspecify-nullness-annotations)
* [Kotlin 및 Java 코드가 있는 모듈 내에서 Java의 Lombok 생성 메서드 호출 지원](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### invokedynamic을 통한 문자열 연결

Kotlin 1.5.20은 JVM 9 이상 대상에서 문자열 연결을 [동적 호출](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)(`invokedynamic`)로 컴파일하여 최신 Java 버전과 보조를 맞춥니다.
더 정확히 말하면, 문자열 연결을 위해 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)를 사용합니다.

이전 버전에서 사용된 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-)를 통한 연결로 되돌아가려면, 컴파일러 옵션 `-Xstring-concat=inline`을 추가하세요.

[Gradle](gradle-compiler-options.md), [Maven](maven.md#specify-compiler-options), 및 [명령줄 컴파일러](compiler-reference.md#compiler-options)에서 컴파일러 옵션을 추가하는 방법을 알아보세요.

### JSpecify 널 가능성(nullness) 어노테이션 지원

Kotlin 컴파일러는 Java에서 Kotlin으로 널 가능성 정보를 전달하기 위해 다양한 종류의 [널 가능성 어노테이션](java-interop.md#nullability-annotations)을 읽을 수 있습니다. 버전 1.5.20은 Java 널 가능성 어노테이션의 표준 통합 세트를 포함하는 [JSpecify 프로젝트](https://jspecify.dev/)에 대한 지원을 도입합니다.

JSpecify를 사용하면 Kotlin이 Java와 널 안전성(null-safety)을 상호 운용하도록 돕기 위해 더 자세한 널 가능성 정보를 제공할 수 있습니다. 선언, 패키지 또는 모듈 범위에 대한 기본 널 가능성을 설정하고, 매개변수 널 가능성을 지정하는 등 더 많은 작업을 수행할 수 있습니다. 이에 대한 자세한 내용은 [JSpecify 사용자 가이드](https://jspecify.dev/docs/user-guide)에서 찾을 수 있습니다.

Kotlin이 JSpecify 어노테이션을 어떻게 처리하는지에 대한 예시입니다:

```java
// JavaClass.java
import org.jspecify.nullness.*;

@NullMarked
public class JavaClass {
  public String notNullableString() { return ""; }
  public @Nullable String nullableString() { return ""; }
}
```

```kotlin
// Test.kt
fun kotlinFun() = with(JavaClass()) {
  notNullableString().length // OK
  nullableString().length    // Warning: receiver nullability mismatch
}
```

1.5.20에서는 JSpecify에서 제공하는 널 가능성 정보에 따른 모든 널 가능성 불일치가 경고로 보고됩니다.
JSpecify와 함께 작업할 때 엄격 모드(오류 보고 포함)를 활성화하려면 `-Xjspecify-annotations=strict` 및 `-Xtype-enhancement-improvements-strict-mode` 컴파일러 옵션을 사용하세요.
JSpecify 프로젝트는 활발하게 개발 중이므로, API와 구현이 언제든지 크게 변경될 수 있다는 점에 유의하세요.

[널 안전성(null-safety) 및 플랫폼 타입(platform types)에 대해 자세히 알아보세요](java-interop.md#null-safety-and-platform-types).

### Kotlin 및 Java 코드가 있는 모듈 내에서 Java의 Lombok 생성 메서드 호출 지원

> Lombok 컴파일러 플러그인은 [실험적](components-stability.md)입니다.
> 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.5.20은 실험적인 [Lombok 컴파일러 플러그인](lombok.md)을 도입합니다. 이 플러그인을 사용하면 Kotlin 및 Java 코드가 있는 모듈 내에서 Java의 [Lombok](https://projectlombok.org/) 선언을 생성하고 사용할 수 있습니다. Lombok 어노테이션은 Java 소스에서만 작동하며, Kotlin 코드에서 사용하면 무시됩니다.

이 플러그인은 다음 어노테이션을 지원합니다:
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

저희는 이 플러그인에 대한 작업을 계속하고 있습니다. 자세한 현재 상태를 확인하려면 [Lombok 컴파일러 플러그인의 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)를 방문하세요.

현재 `@Builder` 어노테이션을 지원할 계획은 없습니다. 하지만 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46959)에서 `@Builder`에 투표하시면 이 기능을 고려할 수 있습니다.

[Lombok 컴파일러 플러그인을 구성하는 방법을 알아보세요](lombok.md#gradle).

## Kotlin/Native

Kotlin/Native 1.5.20은 새로운 기능의 미리 보기와 툴링 개선 사항을 제공합니다:

* [생성된 Objective-C 헤더로 KDoc 주석 옵트인(opt-in) 내보내기](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [컴파일러 버그 수정](#compiler-bug-fixes)
* [단일 배열 내에서 `Array.copyInto()`의 성능 향상](#improved-performance-of-array-copyinto-inside-one-array)

### 생성된 Objective-C 헤더로 KDoc 주석 옵트인(opt-in) 내보내기

> 생성된 Objective-C 헤더로 KDoc 주석을 내보내는 기능은 [실험적](components-stability.md)입니다.
> 언제든지 중단되거나 변경될 수 있습니다.
> 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

이제 Kotlin/Native 컴파일러가 Kotlin 코드의 [문서 주석(KDoc)](kotlin-doc.md)을 해당 코드로 생성된 Objective-C 프레임워크로 내보내도록 설정하여, 프레임워크 사용자에게 표시되도록 할 수 있습니다.

예를 들어, KDoc이 포함된 다음 Kotlin 코드:

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

는 다음 Objective-C 헤더를 생성합니다:

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

이 기능은 Swift에서도 잘 작동합니다.

Objective-C 헤더로 KDoc 주석을 내보내는 이 기능을 시험해 보려면 `-Xexport-kdoc` 컴파일러 옵션을 사용하세요.
주석을 내보내려는 Gradle 프로젝트의 `build.gradle(.kts)` 파일에 다음 줄을 추가하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</tab>
</tabs>

이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-38600)을 사용하여 피드백을 공유해주시면 매우 감사하겠습니다.

### 컴파일러 버그 수정

Kotlin/Native 컴파일러에 1.5.20에서 여러 버그 수정이 적용되었습니다. 전체 목록은 [변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)에서 찾을 수 있습니다.

호환성에 영향을 미치는 중요한 버그 수정이 있습니다. 이전 버전에서는 잘못된 UTF [서로게이트 쌍](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)을 포함하는 문자열 상수가 컴파일 중에 값을 잃었습니다. 이제 이러한 값은 보존됩니다. 애플리케이션 개발자는 1.5.20으로 안전하게 업데이트할 수 있으며, 아무것도 손상되지 않습니다. 하지만 1.5.20으로 컴파일된 라이브러리는 이전 컴파일러 버전과 호환되지 않습니다. 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-33175)를 참조하세요.

### 단일 배열 내에서 Array.copyInto()의 성능 향상

소스와 대상이 동일한 배열일 때 `Array.copyInto()`가 작동하는 방식을 개선했습니다. 이제 이러한 작업은 이 사용 사례에 대한 메모리 관리 최적화 덕분에 최대 20배 더 빠르게 완료됩니다(복사되는 객체의 수에 따라 다름).

## Kotlin/JS

1.5.20과 함께 Kotlin/JS를 위한 새로운 [IR 기반 백엔드](js-ir-compiler.md)로 프로젝트를 마이그레이션하는 데 도움이 되는 가이드를 게시합니다.

### JS IR 백엔드를 위한 마이그레이션 가이드

새로운 [JS IR 백엔드를 위한 마이그레이션 가이드](js-ir-migration.md)는 마이그레이션 중에 발생할 수 있는 문제를 식별하고 이에 대한 해결책을 제공합니다. 가이드에 포함되지 않은 문제가 발견되면 저희 [이슈 트래커](http://kotl.in/issue)로 보고해 주세요.

## Gradle

Kotlin 1.5.20은 Gradle 경험을 개선할 수 있는 다음 기능을 도입합니다:

* [kapt에서 어노테이션 프로세서 클래스로더 캐싱](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` 빌드 속성 사용 중단](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt에서 어노테이션 프로세서 클래스로더 캐싱

> kapt에서 어노테이션 프로세서 클래스로더 캐싱은 [실험적](components-stability.md)입니다.
> 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

이제 [kapt](kapt.md)에서 어노테이션 프로세서의 클래스로더를 캐시할 수 있도록 하는 새로운 실험적 기능이 있습니다. 이 기능은 연속적인 Gradle 실행에서 kapt의 속도를 높일 수 있습니다.

이 기능을 활성화하려면 `gradle.properties` 파일에 다음 속성을 사용하세요:

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

[kapt](kapt.md)에 대해 자세히 알아보세요.

### kotlin.parallel.tasks.in.project 빌드 속성 사용 중단

이 릴리스부터 Kotlin 병렬 컴파일은 [Gradle 병렬 실행 플래그 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)에 의해 제어됩니다. 이 플래그를 사용하면 Gradle이 작업을 동시에 실행하여 컴파일 작업 속도를 높이고 리소스를 더 효율적으로 활용합니다.

더 이상 `kotlin.parallel.tasks.in.project` 속성을 사용할 필요가 없습니다. 이 속성은 사용 중단되었으며 다음 주요 릴리스에서 제거될 예정입니다.

## 표준 라이브러리

Kotlin 1.5.20은 문자와 함께 작동하는 여러 함수의 플랫폼별 구현을 변경하여, 그 결과 플랫폼 전반에 걸쳐 통합을 가져옵니다:
* [Kotlin/Native 및 Kotlin/JS에서 `Char.digitToInt()`의 모든 유니코드 숫자 지원](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js).
* [플랫폼 전반에 걸쳐 `Char.isLowerCase()/isUpperCase()` 구현 통합](#unification-of-char-islowercase-isuppercase-implementations-across-platforms).

### Kotlin/Native 및 Kotlin/JS에서 Char.digitToInt()의 모든 유니코드 숫자 지원

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)는 문자가 나타내는 십진 숫자의 숫자 값을 반환합니다. 1.5.20 이전에는 이 함수는 Kotlin/JVM에서만 모든 유니코드 숫자 문자를 지원했으며, Native 및 JS 플랫폼의 구현은 ASCII 숫자만 지원했습니다.

이제부터 Kotlin/Native 및 Kotlin/JS 모두에서 모든 유니코드 숫자 문자에서 `Char.digitToInt()`를 호출하여 해당 숫자 표현을 얻을 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 플랫폼 전반에 걸쳐 Char.isLowerCase()/isUpperCase() 구현 통합

[`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 및 [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 함수는 문자의 대소문자에 따라 불리언(boolean) 값을 반환합니다. Kotlin/JVM의 경우 구현은 `General_Category`와 `Other_Uppercase`/`Other_Lowercase` [유니코드 속성](https://en.wikipedia.org/wiki/Unicode_character_property)을 모두 확인합니다.

1.5.20 이전에는 다른 플랫폼의 구현은 다르게 작동했으며 일반 범주만 고려했습니다.
1.5.20에서는 구현이 플랫폼 전반에 걸쳐 통합되었으며, 두 속성을 모두 사용하여 문자 대소문자를 결정합니다:

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}