---
title: "Kotlin 1.5.20의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스 날짜: 2021년 6월 24일](releases#release-details)_

Kotlin 1.5.20에는 1.5.0의 새로운 기능에서 발견된 문제에 대한 수정 사항이 있으며 다양한 도구 개선 사항도 포함되어 있습니다.

[릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)과 다음 비디오에서 변경 사항에 대한 개요를 확인할 수 있습니다.

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20은 JVM 플랫폼에서 다음과 같은 업데이트를 받습니다.
* [invokedynamic을 통한 문자열 연결](#string-concatenation-via-invokedynamic)
* [JSpecify nullness 어노테이션 지원](#support-for-jspecify-nullness-annotations)
* [Kotlin 및 Java 코드가 있는 모듈 내에서 Java의 Lombok에서 생성된 메서드 호출 지원](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### invokedynamic을 통한 문자열 연결

Kotlin 1.5.20은 문자열 연결을 JVM 9+ 대상에서 [동적 호출](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)(`invokedynamic`)로 컴파일하여 최신 Java 버전을 따라갑니다.
더 정확히 말하면 문자열 연결에 대해 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)를 사용합니다.

이전 버전에서 사용된 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-)를 통한 연결로 다시 전환하려면 컴파일러 옵션 `-Xstring-concat=inline`을 추가하십시오.

[Gradle](gradle-compiler-options), [Maven](maven#specify-compiler-options) 및 [명령줄 컴파일러](compiler-reference#compiler-options)에서 컴파일러 옵션을 추가하는 방법을 알아보세요.

### JSpecify nullness 어노테이션 지원

Kotlin 컴파일러는 Java에서 Kotlin으로 nullability 정보를 전달하기 위해 다양한 유형의 [nullability 어노테이션](java-interop#nullability-annotations)을 읽을 수 있습니다. 버전 1.5.20에서는 표준 통합 Java nullness 어노테이션 세트인 [JSpecify 프로젝트](https://jspecify.dev/)에 대한 지원이 도입되었습니다.

JSpecify를 사용하면 Kotlin이 Java와 null-safety 상호 작용을 유지하는 데 도움이 되도록 더 자세한 nullability 정보를 제공할 수 있습니다. 선언, 패키지 또는 모듈 범위에 대한 기본 nullability를 설정하고, parametric nullability를 지정하는 등의 작업을 수행할 수 있습니다. 자세한 내용은 [JSpecify 사용자 가이드](https://jspecify.dev/docs/user-guide)에서 확인할 수 있습니다.

다음은 Kotlin이 JSpecify 어노테이션을 처리할 수 있는 방법의 예입니다.

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

1.5.20에서는 JSpecify에서 제공하는 nullability 정보에 따른 모든 nullability 불일치가 경고로 보고됩니다. JSpecify로 작업할 때 엄격 모드(오류 보고 포함)를 활성화하려면 `-Xjspecify-annotations=strict` 및 `-Xtype-enhancement-improvements-strict-mode` 컴파일러 옵션을 사용하십시오. JSpecify 프로젝트는 활발히 개발 중입니다. 해당 API 및 구현은 언제든지 크게 변경될 수 있습니다.

[null-safety 및 플랫폼 유형에 대해 자세히 알아보세요](java-interop#null-safety-and-platform-types).

### Kotlin 및 Java 코드가 있는 모듈 내에서 Java의 Lombok에서 생성된 메서드 호출 지원

:::caution
Lombok 컴파일러 플러그인은 [실험적](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

:::

Kotlin 1.5.20에서는 실험적인 [Lombok 컴파일러 플러그인](lombok)이 도입되었습니다. 이 플러그인을 사용하면 Kotlin 및 Java 코드가 있는 모듈 내에서 Java의 [Lombok](https://projectlombok.org/) 선언을 생성하고 사용할 수 있습니다. Lombok 어노테이션은 Java 소스에서만 작동하며 Kotlin 코드에서 사용하는 경우 무시됩니다.

이 플러그인은 다음 어노테이션을 지원합니다.
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 및 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

이 플러그인에 대한 작업을 계속 진행하고 있습니다. 자세한 현재 상태를 확인하려면 [Lombok 컴파일러 플러그인의 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)를 방문하십시오.

현재 `@Builder` 어노테이션을 지원할 계획은 없습니다. 그러나 [`YouTrack의 @Builder`](https://youtrack.jetbrains.com/issue/KT-46959)에 투표하면 이를 고려할 수 있습니다.

[Lombok 컴파일러 플러그인을 구성하는 방법을 알아보세요](lombok#gradle).

## Kotlin/Native

Kotlin/Native 1.5.20은 새로운 기능과 도구 개선 사항에 대한 미리보기를 제공합니다.

* [생성된 Objective-C 헤더로의 KDoc 주석의 옵트인 내보내기](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [컴파일러 버그 수정](#compiler-bug-fixes)
* [하나의 배열 내에서 Array.copyInto()의 성능 개선](#improved-performance-of-array-copyinto-inside-one-array)

### 생성된 Objective-C 헤더로의 KDoc 주석의 옵트인 내보내기

:::caution
생성된 Objective-C 헤더로의 KDoc 주석 내보내기 기능은 [실험적](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

:::

이제 Kotlin/Native 컴파일러를 설정하여 Kotlin 코드에서 생성된 Objective-C 프레임워크로 [설명서 주석(KDoc)](kotlin-doc)을 내보내 프레임워크 소비자가 볼 수 있도록 할 수 있습니다.

예를 들어 KDoc이 포함된 다음 Kotlin 코드:

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

다음 Objective-C 헤더를 생성합니다.

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

이는 Swift에서도 잘 작동합니다.

KDoc 주석을 Objective-C 헤더로 내보내는 기능을 사용해 보려면 `-Xexport-kdoc` 컴파일러 옵션을 사용하십시오. 주석을 내보낼 Gradle 프로젝트의 `build.gradle(.kts)` 파일에 다음 줄을 추가하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</TabItem>
</Tabs>

이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-38600)을 사용하여 여러분의 피드백을 보내주시면 감사하겠습니다.

### 컴파일러 버그 수정

Kotlin/Native 컴파일러는 1.5.20에서 여러 버그 수정 사항을 받았습니다. 전체 목록은 [변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)에서 확인할 수 있습니다.

이전 버전에서 잘못된 UTF [서로게이트 페어](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)가 포함된 문자열 상수가 컴파일 중에 값을 잃는 호환성에 영향을 미치는 중요한 버그 수정 사항이 있습니다. 이제 이러한 값은 유지됩니다. 애플리케이션 개발자는 1.5.20으로 안전하게 업데이트할 수 있습니다. 아무것도 깨지지 않습니다. 그러나 1.5.20으로 컴파일된 라이브러리는 이전 컴파일러 버전과 호환되지 않습니다. 자세한 내용은 [이 YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-33175)를 참조하십시오.

### 하나의 배열 내에서 Array.copyInto()의 성능 개선

소스와 대상이 동일한 배열일 때 `Array.copyInto()`가 작동하는 방식을 개선했습니다. 이제 이러한 작업은 이 사용 사례에 대한 메모리 관리 최적화로 인해 최대 20배 더 빠르게 완료됩니다(복사되는 객체 수에 따라 다름).

## Kotlin/JS

1.5.20에서는 Kotlin/JS의 새로운 [IR 기반 백엔드](js-ir-compiler)로 프로젝트를 마이그레이션하는 데 도움이 되는 가이드가 게시됩니다.

### JS IR 백엔드에 대한 마이그레이션 가이드

새로운 [JS IR 백엔드에 대한 마이그레이션 가이드](js-ir-migration)는 마이그레이션 중에 발생할 수 있는 문제와 이에 대한 해결 방법을 식별합니다. 가이드에 포함되지 않은 문제가 있는 경우 [문제 추적기](http://kotl.in/issue)에 보고해 주세요.

## Gradle

Kotlin 1.5.20에서는 Gradle 환경을 개선할 수 있는 다음과 같은 기능이 도입되었습니다.

* [kapt에서 어노테이션 프로세서 클래스 로더에 대한 캐싱](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` 빌드 속성의 지원 중단](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt에서 어노테이션 프로세서 클래스 로더에 대한 캐싱

:::caution
kapt에서 어노테이션 프로세서 클래스 로더에 대한 캐싱은 [실험적](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-28901)에서 여러분의 피드백을 보내주시면 감사하겠습니다.

:::

이제 [kapt](kapt)에서 어노테이션 프로세서의 클래스 로더를 캐싱할 수 있는 새로운 실험적 기능이 있습니다.
이 기능은 연속적인 Gradle 실행에서 kapt의 속도를 높일 수 있습니다.

이 기능을 활성화하려면 `gradle.properties` 파일에서 다음 속성을 사용하십시오.

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

[kapt](kapt)에 대해 자세히 알아보세요.

### kotlin.parallel.tasks.in.project 빌드 속성의 지원 중단

이 릴리스에서는 Kotlin 병렬 컴파일이 [Gradle 병렬 실행 플래그 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)에 의해 제어됩니다.
이 플래그를 사용하면 Gradle이 작업을 동시에 실행하여 컴파일 작업 속도를 높이고 리소스를 보다 효율적으로 활용합니다.

더 이상 `kotlin.parallel.tasks.in.project` 속성을 사용할 필요가 없습니다. 이 속성은 더 이상 사용되지 않으며 다음 주요 릴리스에서 제거됩니다.

## 표준 라이브러리

Kotlin 1.5.20은 문자와 함께 작동하는 여러 함수의 플랫폼별 구현을 변경하고 그 결과 플랫폼 간에 통합을 제공합니다.
* [Kotlin/Native 및 Kotlin/JS에서 Char.digitToInt()의 모든 유니코드 숫자 지원](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js).
* [플랫폼 간의 Char.isLowerCase()/isUpperCase() 구현 통합](#unification-of-char-islowercase-isuppercase-implementations-across-platforms).

### Kotlin/Native 및 Kotlin/JS에서 Char.digitToInt()의 모든 유니코드 숫자 지원

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)는 문자가 나타내는 10진수 숫자의 숫자 값을 반환합니다. 1.5.20 이전에는 이 함수가 Kotlin/JVM에 대해서만 모든 유니코드 숫자 문자를 지원했습니다. Native 및 JS 플랫폼의 구현은 ASCII 숫자만 지원했습니다.

이제 Kotlin/Native 및 Kotlin/JS 모두에서 모든 유니코드 숫자 문자에서 `Char.digitToInt()`를 호출하여 숫자 표현을 얻을 수 있습니다.

```kotlin
fun main() {

    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)

}
```

### 플랫폼 간의 Char.isLowerCase()/isUpperCase() 구현 통합

[`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 및
[`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 함수는 문자 대소문자에 따라 부울 값을 반환합니다. Kotlin/JVM의 경우 구현은 `General_Category` 및 `Other_Uppercase`/`Other_Lowercase` [유니코드 속성](https://en.wikipedia.org/wiki/Unicode_character_property)을 모두 확인합니다.

1.5.20 이전에는 다른 플랫폼에 대한 구현이 다르게 작동하고 일반 카테고리만 고려했습니다.
1.5.20에서는 구현이 플랫폼 간에 통합되고 두 속성을 모두 사용하여 문자 대소문자를 결정합니다.

```kotlin
fun main() {

    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())

}
```