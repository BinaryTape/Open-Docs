[//]: # (title: 옵트인 요구 사항)

Kotlin 표준 라이브러리는 특정 API 요소를 사용하기 위해 명시적인 동의를 요구하고 부여하는 메커니즘을 제공합니다. 이 메커니즘을 통해 라이브러리 작성자는 API가 실험적 상태에 있어 향후 변경될 가능성이 높은 경우와 같이, 옵트인(opt-in)이 필요한 특정 조건에 대해 사용자에게 알릴 수 있습니다.

사용자를 보호하기 위해 컴파일러는 이러한 조건에 대해 경고하고 API를 사용하기 전에 옵트인을 요구합니다.

## API 옵트인

라이브러리 작성자가 자신의 라이브러리 API에 있는 선언을 **[옵트인이 필요한](#require-opt-in-to-use-api)** 것으로 표시한 경우, 코드에서 해당 선언을 사용하기 전에 명시적인 동의를 부여해야 합니다. 옵트인하는 방법은 여러 가지가 있습니다. 상황에 가장 적합한 접근 방식을 선택하는 것이 좋습니다.

### 로컬 옵트인

코드에서 특정 API 요소를 사용할 때 옵트인하려면, [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 어노테이션과 실험적 API 마커에 대한 참조를 함께 사용하세요. 예를 들어, 옵트인이 필요한 `DateProvider` 클래스를 사용한다고 가정해 봅시다.

```kotlin
// 라이브러리 코드
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// 옵트인이 필요한 클래스
class DateProvider
```

코드에서 `DateProvider` 클래스를 사용하는 함수를 선언하기 전에, `MyDateTime` 어노테이션 클래스에 대한 참조와 함께 `@OptIn` 어노테이션을 추가하세요.

```kotlin
// 클라이언트 코드
@OptIn(MyDateTime::class)

// DateProvider 사용
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

이 접근 방식에서 중요한 점은, `getDate()` 함수가 코드의 다른 곳에서 호출되거나 다른 개발자가 사용하더라도 옵트인이 필요하지 않다는 것입니다.

```kotlin
// 클라이언트 코드
@OptIn(MyDateTime::class)

// DateProvider 사용
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: 옵트인이 필요하지 않음
    println(getDate())
}
```

옵트인 요구 사항이 전파되지 않으므로 다른 사람들이 실험적인 API를 알지 못하고 사용할 수 있습니다. 이를 방지하려면 옵트인 요구 사항을 전파하는 것이 더 안전합니다.

#### 옵트인 요구 사항 전파

라이브러리처럼 서드파티 사용을 목적으로 하는 코드에서 API를 사용하는 경우, 해당 API의 옵트인 요구 사항을 자신의 API에도 전파할 수 있습니다. 이렇게 하려면 라이브러리에서 사용하는 것과 동일한 **[옵트인 요구 사항 어노테이션](#create-opt-in-requirement-annotations)**으로 선언을 표시하세요.

예를 들어, `DateProvider` 클래스를 사용하는 함수를 선언하기 전에 `@MyDateTime` 어노테이션을 추가하세요.

```kotlin
// 클라이언트 코드
@MyDateTime
fun getDate(): Date {
    // OK: 함수에도 옵트인이 필요함
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // 에러: getDate()는 옵트인이 필요함
}
```

이 예제에서 볼 수 있듯이, 어노테이션이 적용된 함수는 `@MyDateTime` API의 일부처럼 보입니다. 옵트인은 `getDate()` 함수의 사용자에게 옵트인 요구 사항을 전파합니다.

API 요소의 시그니처에 옵트인이 필요한 타입이 포함되어 있다면, 시그니처 자체도 옵트인이 필요합니다. 그렇지 않으면, API 요소가 옵트인이 필요하지 않지만 시그니처에 옵트인이 필요한 타입이 포함되어 있다면, 사용 시 에러가 발생합니다.

```kotlin
// 클라이언트 코드
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: 함수에도 옵트인이 필요함
    println(getDate())
}
```

마찬가지로, 시그니처에 옵트인이 필요한 타입을 포함하는 선언에 `@OptIn`을 적용하더라도 옵트인 요구 사항은 여전히 전파됩니다.

```kotlin
// 클라이언트 코드
@OptIn(MyDateTime::class)
// 시그니처에 DateProvider가 포함되어 옵트인 전파됨
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // 에러: getDate()는 옵트인이 필요함
}
```

옵트인 요구 사항을 전파할 때, API 요소가 안정화되어 더 이상 옵트인 요구 사항이 없더라도, 여전히 옵트인 요구 사항을 가지고 있는 다른 API 요소는 실험적인 상태로 유지된다는 점을 이해하는 것이 중요합니다. 예를 들어, 라이브러리 작성자가 `getDate()` 함수가 이제 안정화되었기 때문에 옵트인 요구 사항을 제거했다고 가정해 봅시다.

```kotlin
// 라이브러리 코드
// 옵트인 요구 사항 없음
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

`displayDate()` 함수를 사용할 때 옵트인 어노테이션을 제거하지 않으면, 옵트인이 더 이상 필요하지 않더라도 함수는 실험적인 상태로 유지됩니다.

```kotlin
// 클라이언트 코드

// 여전히 실험적임!
@MyDateTime
fun displayDate() {
    // 안정적인 라이브러리 함수 사용
    println(getDate())
}
```

#### 여러 API에 옵트인

여러 API에 옵트인하려면, 모든 옵트인 요구 사항 어노테이션으로 선언을 표시하세요. 예를 들어:

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

또는 `@OptIn`을 사용하여 다음과 같이 할 수도 있습니다.

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 파일 단위 옵트인

파일의 모든 함수와 클래스에 대해 옵트인이 필요한 API를 사용하려면, 패키지 지정 및 임포트(`import`) 전에 파일 맨 위에 파일 수준 어노테이션인 `@file:OptIn`을 추가하세요.

 ```kotlin
 // 클라이언트 코드
 @file:OptIn(MyDateTime::class)
 ```

### 모듈 단위 옵트인

> `-opt-in` 컴파일러 옵션은 Kotlin 1.6.0부터 사용할 수 있습니다. 이전 Kotlin 버전에서는 `-Xopt-in`을 사용하세요.
> {style="note"}

옵트인이 필요한 API의 모든 사용에 어노테이션을 붙이고 싶지 않다면, 전체 모듈에 대해 해당 API에 옵트인할 수 있습니다. 모듈에서 API 사용에 옵트인하려면, 사용하는 API의 옵트인 요구 사항 어노테이션의 정규화된 이름(FQDN)을 지정하여 `-opt-in` 인자를 사용하여 컴파일하세요: `-opt-in=org.mylibrary.OptInAnnotation`. 이 인자를 사용하여 컴파일하면 모듈의 모든 선언에 `@OptIn(OptInAnnotation::class)` 어노테이션이 있는 것과 동일한 효과를 가집니다.

Gradle로 모듈을 빌드하는 경우, 다음과 같이 인자를 추가할 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

Gradle 모듈이 멀티플랫폼 모듈인 경우, `optIn` 메서드를 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

Maven의 경우, 다음을 사용하세요.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-opt-in=org.mylibrary.OptInAnnotation</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

모듈 수준에서 여러 API에 옵트인하려면, 모듈에서 사용되는 각 옵트인 요구 사항 마커에 대해 설명된 인자 중 하나를 추가하세요.

### 클래스 또는 인터페이스 상속 시 옵트인

때로는 라이브러리 작성자가 API를 제공하지만, 사용자가 확장하기 전에 명시적으로 옵트인하도록 요구하고 싶을 때가 있습니다. 예를 들어, 라이브러리 API는 사용에는 안정적일 수 있지만, 새로운 추상 함수가 나중에 추가될 수 있으므로 상속에는 안정적이지 않을 수 있습니다. 라이브러리 작성자는 [오픈(open)](inheritance.md) 또는 [추상 클래스](classes.md#abstract-classes) 및 [비함수형 인터페이스](interfaces.md)에 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 표시하여 이를 강제할 수 있습니다.

이러한 API 요소를 사용하고 코드에서 확장하려면, `@SubclassOptInRequired` 어노테이션과 어노테이션 클래스에 대한 참조를 함께 사용하세요. 예를 들어, 옵트인이 필요한 `CoreLibraryApi` 인터페이스를 사용한다고 가정해 봅시다.

```kotlin
// 라이브러리 코드
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 확장에 옵트인이 필요한 인터페이스
interface CoreLibraryApi
```

코드에서 `CoreLibraryApi` 인터페이스를 상속하는 새 인터페이스를 만들기 전에, `UnstableApi` 어노테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired` 어노테이션을 추가하세요.

```kotlin
// 클라이언트 코드
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

클래스에 `@SubclassOptInRequired` 어노테이션을 사용할 때, 옵트인 요구 사항은 어떤 [내부 또는 중첩 클래스](nested-classes.md)에도 전파되지 않는다는 점에 유의하세요.

```kotlin
// 라이브러리 코드
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// 클라이언트 코드

// 옵트인이 필요함
class NetworkFileSystem : FileSystem()

// 중첩 클래스
// 옵트인 필요 없음
class TextFile : FileSystem.File()
```

또는 `@OptIn` 어노테이션을 사용하여 옵트인할 수 있습니다. 또한 실험적 마커 어노테이션을 사용하여 코드에서 해당 클래스의 모든 사용에 요구 사항을 더 멀리 전파할 수도 있습니다.

```kotlin
// 클라이언트 코드
// @OptIn 어노테이션 사용
@OptIn(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// 어노테이션 클래스를 참조하는 어노테이션 사용
// 옵트인 요구 사항을 더 전파함
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## API 사용에 옵트인 요구

라이브러리 사용자가 API를 사용하기 전에 옵트인하도록 요구할 수 있습니다. 또한, 옵트인 요구 사항을 제거하기로 결정할 때까지 API 사용에 대한 특별한 조건을 사용자에게 알릴 수 있습니다.

### 옵트인 요구 사항 어노테이션 생성

모듈의 API 사용에 옵트인을 요구하려면, **옵트인 요구 사항 어노테이션**으로 사용할 어노테이션 클래스를 생성하세요. 이 클래스는 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)으로 어노테이션이 지정되어야 합니다.

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

옵트인 요구 사항 어노테이션은 몇 가지 요구 사항을 충족해야 합니다. 다음을 포함해야 합니다.

*   `BINARY` 또는 `RUNTIME` [보존 정책(retention)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/).
*   `EXPRESSION`, `FILE`, `TYPE`, 또는 `TYPE_PARAMETER`를 [대상(target)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)으로 합니다.
*   파라미터가 없어야 합니다.

옵트인 요구 사항은 다음 두 가지 심각도 [수준(level)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/) 중 하나를 가질 수 있습니다.

*   `RequiresOptIn.Level.ERROR`. 옵트인이 필수적입니다. 그렇지 않으면 표시된 API를 사용하는 코드가 컴파일되지 않습니다. 이것이 기본 수준입니다.
*   `RequiresOptIn.Level.WARNING`. 옵트인이 필수적이지는 않지만 권장됩니다. 옵트인 없이는 컴파일러가 경고를 발생시킵니다.

원하는 수준을 설정하려면 `@RequiresOptIn` 어노테이션의 `level` 파라미터를 지정하세요.

또한, API 사용자에게 `message`를 제공할 수 있습니다. 컴파일러는 옵트인 없이 API를 사용하려는 사용자에게 이 메시지를 보여줍니다.

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

옵트인이 필요한 여러 독립적인 기능을 배포한다면, 각각에 대해 어노테이션을 선언하세요. 이렇게 하면 클라이언트가 명시적으로 수락한 기능만 사용할 수 있으므로 API 사용이 더 안전해집니다. 또한, 기능에서 옵트인 요구 사항을 독립적으로 제거할 수 있으므로 API 유지 관리가 더 쉬워집니다.

### API 요소 표시

API 요소를 사용하기 위해 옵트인을 요구하려면, 해당 선언에 옵트인 요구 사항 어노테이션을 붙이세요.

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

일부 언어 요소에는 옵트인 요구 사항 어노테이션을 적용할 수 없습니다.

*   프로퍼티의 백킹 필드나 게터가 아닌, 프로퍼티 자체에만 어노테이션을 붙일 수 있습니다.
*   로컬 변수나 값 파라미터에는 어노테이션을 붙일 수 없습니다.

## API 확장 시 옵트인 요구

때로는 API의 어떤 특정 부분을 사용하고 확장할 수 있는지에 대해 더 세분화된 제어를 원할 때가 있습니다. 예를 들어, 사용하기에는 안정적이지만 다음과 같은 API가 있을 수 있습니다.

*   지속적인 발전으로 인해 **구현하기에는 불안정합니다**. 예를 들어, 기본 구현 없이 새로운 추상 함수를 추가할 것으로 예상되는 인터페이스 계열이 있을 때입니다.
*   조율된 방식으로 동작해야 하는 개별 함수와 같이 **구현하기에 섬세하거나 취약합니다**.
*   외부 구현에 대해 하위 호환성을 손상하는 방식으로 **미래에 계약이 약화될 수 있습니다**. 예를 들어, 코드가 이전에 `null` 값을 고려하지 않았던 입력 파라미터 `T`를 널러블 버전 `T?`로 변경하는 경우입니다.

이러한 경우, 사용자가 API를 더 확장하기 전에 API에 옵트인하도록 요구할 수 있습니다. 사용자는 API를 상속하거나 추상 함수를 구현함으로써 API를 확장할 수 있습니다. [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 사용하여 [오픈(open)](inheritance.md) 또는 [추상 클래스](classes.md#abstract-classes) 및 [비함수형 인터페이스](interfaces.md)에 대한 옵트인 요구 사항을 강제할 수 있습니다.

API 요소에 옵트인 요구 사항을 추가하려면, [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션과 어노테이션 클래스에 대한 참조를 함께 사용하세요.

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 확장에 옵트인이 필요한 인터페이스
interface CoreLibraryApi
```

`@SubclassOptInRequired` 어노테이션을 사용하여 옵트인을 요구하도록 할 때, 요구 사항은 어떤 [내부 또는 중첩 클래스](nested-classes.md)에도 전파되지 않는다는 점에 유의하세요.

API에서 `@SubclassOptInRequired` 어노테이션을 사용하는 방법에 대한 실제 예시는 `kotlinx.coroutines` 라이브러리의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 인터페이스를 확인해 보세요.

## 안정화 전(Pre-stable) API의 옵트인 요구 사항

아직 안정적이지 않은 기능에 옵트인 요구 사항을 사용하는 경우, 클라이언트 코드 손상을 피하기 위해 API 졸업을 신중하게 처리해야 합니다.

안정화 전 API가 졸업하여 안정적인 상태로 릴리스되면, 선언에서 옵트인 요구 사항 어노테이션을 제거하세요. 그러면 클라이언트가 제한 없이 사용할 수 있습니다. 그러나 기존 클라이언트 코드가 호환되도록 어노테이션 클래스는 모듈에 남겨두어야 합니다.

API 사용자가 코드에서 모든 어노테이션을 제거하고 다시 컴파일하여 모듈을 업데이트하도록 권장하려면, 어노테이션을 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)로 표시하고 Deprecation 메시지에 설명을 제공하세요.

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime