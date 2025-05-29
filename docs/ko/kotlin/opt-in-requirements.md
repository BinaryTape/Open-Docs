[//]: # (title: 옵트인 요구 사항)

Kotlin 표준 라이브러리는 특정 API 요소를 사용하는 데 명시적인 동의를 요구하고 부여하는 메커니즘을 제공합니다. 이 메커니즘을 통해 라이브러리 작성자는 API가 실험적 상태에 있어 향후 변경될 가능성이 있는 경우와 같이, 옵트인이 필요한 특정 조건에 대해 사용자에게 알릴 수 있습니다.

사용자를 보호하기 위해 컴파일러는 이러한 조건에 대해 경고하고, API를 사용하기 전에 옵트인하도록 요구합니다.

## API 옵트인

라이브러리 작성자가 라이브러리 API의 선언을 **[옵트인을 요구하는](#require-opt-in-to-use-api)** 것으로 표시한 경우, 코드에서 해당 선언을 사용하려면 명시적인 동의를 부여해야 합니다. 옵트인하는 방법은 여러 가지가 있습니다. 상황에 가장 적합한 접근 방식을 선택하는 것을 권장합니다.

### 로컬에서 옵트인

코드에서 특정 API 요소를 사용할 때 해당 요소에 옵트인하려면, 실험적 API 마커에 대한 참조와 함께 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 어노테이션을 사용합니다. 예를 들어, 옵트인을 요구하는 `DateProvider` 클래스를 사용한다고 가정해 봅시다.

```kotlin
// Library code
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// A class requiring opt-in
class DateProvider
```

코드에서 `DateProvider` 클래스를 사용하는 함수를 선언하기 전에 `MyDateTime` 어노테이션 클래스에 대한 참조와 함께 `@OptIn` 어노테이션을 추가합니다.

```kotlin
// Client code
@OptIn(MyDateTime::class)

// Uses DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

이 접근 방식에서는 `getDate()` 함수가 코드의 다른 곳에서 호출되거나 다른 개발자에 의해 사용되는 경우, 옵트인이 필요하지 않다는 점에 유의해야 합니다.

```kotlin
// Client code
@OptIn(MyDateTime::class)

// Uses DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: No opt-in is required
    println(getDate()) 
}
```

옵트인 요구 사항은 전파되지 않으므로, 다른 사람들이 의도치 않게 실험적 API를 사용할 수 있습니다. 이를 방지하려면 옵트인 요구 사항을 전파하는 것이 더 안전합니다.

#### 옵트인 요구 사항 전파

라이브러리와 같이 서드파티 사용을 목적으로 하는 코드에서 API를 사용하는 경우, 해당 API의 옵트인 요구 사항을 자신의 API에도 전파할 수 있습니다. 이를 위해 라이브러리에서 사용한 것과 동일한 **[옵트인 요구 사항 어노테이션](#create-opt-in-requirement-annotations)**으로 선언을 표시합니다.

예를 들어, `DateProvider` 클래스를 사용하는 함수를 선언하기 전에 `@MyDateTime` 어노테이션을 추가합니다.

```kotlin
// Client code
@MyDateTime
fun getDate(): Date {
    // OK: the function requires opt-in as well
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in
}
```

이 예시에서 볼 수 있듯이, 어노테이션이 지정된 함수는 `@MyDateTime` API의 일부로 나타납니다. 옵트인은 `getDate()` 함수의 사용자에게 옵트인 요구 사항을 전파합니다.

API 요소의 시그니처에 옵트인이 필요한 타입이 포함되어 있으면, 시그니처 자체도 옵트인이 필요합니다. 그렇지 않으면, API 요소가 옵트인을 요구하지 않지만 시그니처에 옵트인이 필요한 타입이 포함되어 있으면, 이를 사용하면 오류가 발생합니다.

```kotlin
// Client code
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: the function requires opt-in as well
    println(getDate())
}
```

마찬가지로, 시그니처에 옵트인이 필요한 타입이 포함된 선언에 `@OptIn`을 적용하더라도 옵트인 요구 사항은 여전히 전파됩니다.

```kotlin
// Client code
@OptIn(MyDateTime::class)
// Propagates opt-in due to DateProvider in the signature
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in
}
```

옵트인 요구 사항을 전파할 때, API 요소가 안정화되어 더 이상 옵트인 요구 사항이 없어진 경우에도 다른 API 요소에 여전히 옵트인 요구 사항이 남아 있다면 실험적인 상태로 유지된다는 점을 이해하는 것이 중요합니다. 예를 들어, 라이브러리 작성자가 `getDate()` 함수가 이제 안정적이라고 판단하여 옵트인 요구 사항을 제거했다고 가정해 봅시다.

```kotlin
// Library code
// No opt-in requirement
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

옵트인 어노테이션을 제거하지 않고 `displayDate()` 함수를 사용하면, 옵트인이 더 이상 필요 없더라도 여전히 실험적인 상태로 남아 있습니다.

```kotlin
// Client code

// Still experimental!
@MyDateTime 
fun displayDate() {
    // Uses a stable library function
    println(getDate())
}
```

#### 여러 API에 옵트인

여러 API에 옵트인하려면, 모든 옵트인 요구 사항 어노테이션으로 선언을 표시합니다. 예를 들면 다음과 같습니다.

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

또는 `@OptIn`을 사용하여 다음과 같이 할 수도 있습니다.

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 파일에서 옵트인

파일 내의 모든 함수와 클래스에 옵트인이 필요한 API를 사용하려면, 패키지 지정 및 임포트 이전에 파일 상단에 파일 레벨 어노테이션 `@file:OptIn`을 추가합니다.

 ```kotlin
 // Client code
 @file:OptIn(MyDateTime::class)
 ```

### 모듈에서 옵트인

> `-opt-in` 컴파일러 옵션은 Kotlin 1.6.0부터 사용할 수 있습니다. 이전 Kotlin 버전에서는 `-Xopt-in`을 사용하십시오.
> {style="note"}

옵트인이 필요한 API의 모든 사용법에 어노테이션을 달고 싶지 않다면, 모듈 전체에 대해 옵트인할 수 있습니다. 모듈에서 API 사용에 옵트인하려면, 사용하는 API의 옵트인 요구 사항 어노테이션의 정규화된 이름(Fully Qualified Name)을 지정하는 `-opt-in` 인수를 사용하여 컴파일합니다: `-opt-in=org.mylibrary.OptInAnnotation`. 이 인수로 컴파일하면 모듈의 모든 선언에 `@OptIn(OptInAnnotation::class)` 어노테이션이 있는 것과 동일한 효과를 가집니다.

Gradle로 모듈을 빌드하는 경우, 다음과 같이 인수를 추가할 수 있습니다.

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

Gradle 모듈이 멀티플랫폼 모듈인 경우, `optIn` 메서드를 사용합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</tab>
</tabs>

Maven의 경우, 다음을 사용합니다.

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

모듈 수준에서 여러 API에 옵트인하려면, 모듈에서 사용되는 각 옵트인 요구 사항 마커에 대해 설명된 인수 중 하나를 추가합니다.

### 클래스 또는 인터페이스 상속 시 옵트인

때로는 라이브러리 작성자가 API를 제공하면서도, 사용자가 API를 확장하기 전에 명시적으로 옵트인하도록 요구할 수 있습니다. 예를 들어, 라이브러리 API는 사용에는 안정적이지만, 향후 새로운 추상 함수가 추가될 수 있으므로 상속에는 불안정할 수 있습니다. 라이브러리 작성자는 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션으로 [열린](inheritance.md) 또는 [추상 클래스](classes.md#abstract-classes) 및 [비함수형 인터페이스](interfaces.md)를 표시하여 이를 강제할 수 있습니다.

이러한 API 요소를 사용하고 코드에서 확장하려면, `@SubclassOptInRequired` 어노테이션을 어노테이션 클래스에 대한 참조와 함께 사용합니다. 예를 들어, 옵트인이 필요한 `CoreLibraryApi` 인터페이스를 사용한다고 가정해 봅시다.

```kotlin
// Library code
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend
interface CoreLibraryApi 
```

코드에서 `CoreLibraryApi` 인터페이스를 상속하는 새 인터페이스를 만들기 전에, `UnstableApi` 어노테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired` 어노테이션을 추가합니다.

```kotlin
// Client code
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

이 접근 방식에서는 클래스에 `@SubclassOptInRequired` 어노테이션을 사용하는 경우, 옵트인 요구 사항이 [내부 또는 중첩 클래스](nested-classes.md)에는 전파되지 않는다는 점에 유의하십시오.

```kotlin
// Library code
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// Client code

// Opt-in is required
class NetworkFileSystem : FileSystem()

// Nested class
// No opt-in required
class TextFile : FileSystem.File()
```

또는 `@OptIn` 어노테이션을 사용하여 옵트인할 수 있습니다. 또한 실험적 마커 어노테이션을 사용하여 코드 내에서 클래스의 모든 사용에 대해 요구 사항을 추가로 전파할 수도 있습니다.

```kotlin
// Client code
// With @OptIn annotation
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// With annotation referencing annotation class
// Propagates the opt-in requirement further
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## API 사용 시 옵트인 요구

라이브러리 사용자가 API를 사용하기 전에 옵트인하도록 요구할 수 있습니다. 또한, 옵트인 요구 사항을 제거하기로 결정할 때까지 API 사용에 대한 특별한 조건에 대해 사용자에게 알릴 수 있습니다.

### 옵트인 요구 사항 어노테이션 생성

모듈의 API 사용에 옵트인을 요구하려면, **옵트인 요구 사항 어노테이션**으로 사용할 어노테이션 클래스를 생성합니다. 이 클래스는 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)으로 어노테이션이 지정되어야 합니다.

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

옵트인 요구 사항 어노테이션은 몇 가지 요구 사항을 충족해야 합니다. 다음을 가져야 합니다.

*   `BINARY` 또는 `RUNTIME` [리텐션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/).
*   `EXPRESSION`, `FILE`, `TYPE`, 또는 `TYPE_PARAMETER`를 [타겟](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)으로.
*   매개 변수 없음.

옵트인 요구 사항은 두 가지 심각도 [수준](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/) 중 하나를 가질 수 있습니다.

*   `RequiresOptIn.Level.ERROR`. 옵트인이 필수입니다. 그렇지 않으면, 표시된 API를 사용하는 코드는 컴파일되지 않습니다. 이것이 기본 수준입니다.
*   `RequiresOptIn.Level.WARNING`. 옵트인이 필수는 아니지만 권장됩니다. 옵트인 없이는 컴파일러가 경고를 발생시킵니다.

원하는 수준을 설정하려면 `@RequiresOptIn` 어노테이션의 `level` 매개 변수를 지정합니다.

또한, API 사용자에게 `message`를 제공할 수 있습니다. 컴파일러는 옵트인 없이 API를 사용하려는 사용자에게 이 메시지를 표시합니다.

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

옵트인이 필요한 여러 독립적인 기능을 게시하는 경우, 각 기능에 대한 어노테이션을 선언합니다. 이렇게 하면 클라이언트가 명시적으로 수락한 기능만 사용할 수 있으므로 API 사용이 더 안전해집니다. 또한, 기능에서 옵트인 요구 사항을 독립적으로 제거할 수 있어 API 유지 관리가 더 쉬워집니다.

### API 요소 표시

API 요소 사용에 옵트인을 요구하려면, 선언에 옵트인 요구 사항 어노테이션을 추가합니다.

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

일부 언어 요소에는 옵트인 요구 사항 어노테이션이 적용되지 않는다는 점에 유의하십시오.

*   프로퍼티의 백킹 필드나 게터가 아닌, 프로퍼티 자체에만 어노테이션을 지정할 수 있습니다.
*   로컬 변수나 값 매개 변수에는 어노테이션을 지정할 수 없습니다.

## API 확장에 옵트인 요구

API의 특정 부분을 사용하고 확장하는 방법에 대해 더 세분화된 제어를 원할 때가 있습니다. 예를 들어, 사용에는 안정적이지만 다음과 같은 경우입니다.

*   예상되는 새로운 추상 함수가 기본 구현 없이 추가될 수 있는 인터페이스 제품군이 있는 경우와 같이, 지속적인 발전으로 인해 **구현하기에 불안정한** 경우.
*   조정된 방식으로 작동해야 하는 개별 함수와 같이, **구현하기에 섬세하거나 취약한** 경우.
*   이전에 `null` 값을 고려하지 않았던 코드에서 입력 매개 변수 `T`가 null 허용 버전 `T?`로 변경되는 경우와 같이, **향후 하위 호환되지 않는 방식으로 계약이 약화될 수 있는** 경우.

이러한 경우, 사용자가 API를 추가로 확장하기 전에 API에 옵트인하도록 요구할 수 있습니다. 사용자는 API를 상속하거나 추상 함수를 구현하여 API를 확장할 수 있습니다. [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 사용하여 [열린](inheritance.md) 또는 [추상 클래스](classes.md#abstract-classes) 및 [비함수형 인터페이스](interfaces.md)에 대한 이 옵트인 요구 사항을 강제할 수 있습니다.

API 요소에 옵트인 요구 사항을 추가하려면, [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 어노테이션 클래스에 대한 참조와 함께 사용합니다.

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend
interface CoreLibraryApi 
```

옵트인을 요구하기 위해 `@SubclassOptInRequired` 어노테이션을 사용하는 경우, 요구 사항이 [내부 또는 중첩 클래스](nested-classes.md)에는 전파되지 않는다는 점에 유의하십시오.

API에서 `@SubclassOptInRequired` 어노테이션을 사용하는 방법에 대한 실제 예시는 `kotlinx.coroutines` 라이브러리의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 인터페이스를 확인하십시오.

## 사전 안정(pre-stable) API에 대한 옵트인 요구 사항

아직 안정적이지 않은 기능에 대해 옵트인 요구 사항을 사용하는 경우, 클라이언트 코드 손상을 방지하기 위해 API의 정식 출시(graduation)를 신중하게 처리해야 합니다.

사전 안정 API가 정식 출시되어 안정적인 상태로 릴리스되면, 선언에서 옵트인 요구 사항 어노테이션을 제거합니다. 그러면 클라이언트는 제한 없이 사용할 수 있습니다. 그러나 기존 클라이언트 코드가 호환되도록 어노테이션 클래스는 모듈에 남겨두어야 합니다.

API 사용자가 코드에서 모든 어노테이션을 제거하고 다시 컴파일하여 모듈을 업데이트하도록 권장하려면, 어노테이션을 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)로 표시하고 사용 중단 메시지에 설명을 제공하십시오.

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime