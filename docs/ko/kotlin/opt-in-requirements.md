---
title: "옵트인 요구 사항"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 표준 라이브러리는 특정 API 요소를 사용하는 데 명시적인 동의를 요구하고 제공하는 메커니즘을 제공합니다.
이 메커니즘을 통해 라이브러리 작성자는 API가 실험적 상태이고 향후 변경될 가능성이 있는 경우와 같이 옵트인을 요구하는 특정 조건에 대해 사용자에게 알릴 수 있습니다.

사용자를 보호하기 위해 컴파일러는 이러한 조건에 대해 경고하고 API를 사용하기 전에 옵트인을 요구합니다.

## API 옵트인

라이브러리 작성자가 라이브러리 API의 선언을 **[사용하려면 옵트인 필요](#require-opt-in-to-use-api)**로 표시하면
코드에서 사용하기 전에 명시적인 동의를 제공해야 합니다.
옵트인하는 방법에는 여러 가지가 있습니다. 상황에 가장 적합한 방법을 선택하는 것이 좋습니다.

### 로컬에서 옵트인

코드에서 특정 API 요소를 사용할 때 옵트인하려면 실험적 API 마커에 대한 참조와 함께 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)
어노테이션을 사용합니다. 예를 들어 옵트인이 필요한 `DateProvider` 클래스를 사용하려는 경우:

```kotlin
// 라이브러리 코드
@RequiresOptIn(message = "이 API는 실험적입니다. 예고 없이 향후 변경될 수 있습니다.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// 옵트인이 필요한 클래스
class DateProvider
```

코드에서 `DateProvider` 클래스를 사용하는 함수를 선언하기 전에 `MyDateTime` 어노테이션 클래스에 대한 참조와 함께 `@OptIn` 어노테이션을 추가합니다.

```kotlin
// 클라이언트 코드
@OptIn(MyDateTime::class)

// DateProvider 사용
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

이 방법을 사용하면 `getDate()` 함수가 코드의 다른 곳에서 호출되거나
다른 개발자가 사용하는 경우 옵트인이 필요하지 않습니다.

```kotlin
// 클라이언트 코드
@OptIn(MyDateTime::class)

// DateProvider 사용
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: 옵트인이 필요하지 않습니다.
    println(getDate()) 
}
```

옵트인 요구 사항은 전파되지 않으므로 다른 사람이 실험적 API를 모르게 사용할 수 있습니다. 이를 방지하려면
옵트인 요구 사항을 전파하는 것이 더 안전합니다.

#### 옵트인 요구 사항 전파

라이브러리와 같이 타사에서 사용하도록 설계된 코드에서 API를 사용하는 경우 해당 옵트인 요구 사항을
API에도 전파할 수 있습니다. 이렇게 하려면 라이브러리에서 사용하는 것과 동일한 **[옵트인 요구 사항 어노테이션](#create-opt-in-requirement-annotations)**으로
선언을 표시합니다.

예를 들어 `DateProvider` 클래스를 사용하는 함수를 선언하기 전에 `@MyDateTime` 어노테이션을 추가합니다.

```kotlin
// 클라이언트 코드
@MyDateTime
fun getDate(): Date {
    // OK: 함수에도 옵트인이 필요합니다.
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // 오류: getDate()에는 옵트인이 필요합니다.
}
```

이 예에서 볼 수 있듯이 어노테이션이 추가된 함수는 `@MyDateTime` API의 일부인 것으로 보입니다.
옵트인은 `getDate()` 함수의 사용자에게 옵트인 요구 사항을 전파합니다.

API 요소의 서명에 옵트인이 필요한 유형이 포함된 경우 서명 자체에도 옵트인이 필요합니다.
그렇지 않으면 API 요소에 옵트인이 필요하지 않지만 서명에 옵트인이 필요한 유형이 포함된 경우 사용하면 오류가 발생합니다.

```kotlin
// 클라이언트 코드
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: 함수에도 옵트인이 필요합니다.
    println(getDate())
}
```

마찬가지로 서명에 옵트인이 필요한 유형이 포함된 선언에 `@OptIn`을 적용하면 옵트인 요구 사항이
여전히 전파됩니다.

```kotlin
// 클라이언트 코드
@OptIn(MyDateTime::class)
// 서명에 DateProvider로 인해 옵트인이 전파됩니다.
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // 오류: getDate()에는 옵트인이 필요합니다.
}
```

옵트인 요구 사항을 전파할 때 API 요소가 안정화되어 더 이상
옵트인 요구 사항이 없는 경우에도 옵트인 요구 사항이 있는 다른 API 요소는 여전히 실험적입니다. 예를 들어
라이브러리 작성자가 `getDate()` 함수가 이제 안정화되었기 때문에 옵트인 요구 사항을 제거한다고 가정합니다.

```kotlin
// 라이브러리 코드
// 옵트인 요구 사항 없음
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

옵트인 어노테이션을 제거하지 않고 `displayDate()` 함수를 사용하면
옵트인이 더 이상 필요하지 않더라도 여전히 실험적입니다.

```kotlin
// 클라이언트 코드

// 여전히 실험적입니다!
@MyDateTime 
fun displayDate() {
    // 안정적인 라이브러리 함수 사용
    println(getDate())
}
```

#### 여러 API 옵트인

여러 API를 옵트인하려면 해당 선언에 모든 옵트인 요구 사항 어노테이션으로 표시합니다. 예를 들어:

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

또는 `@OptIn`으로 다음과 같이 할 수도 있습니다.

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 파일에서 옵트인

파일의 모든 함수와 클래스에 대해 옵트인이 필요한 API를 사용하려면 파일 수준 어노테이션 `@file:OptIn`을
패키지 사양 및 가져오기 전에 파일 맨 위에 추가합니다.

 ```kotlin
 // 클라이언트 코드
 @file:OptIn(MyDateTime::class)
 ```

### 모듈에서 옵트인

:::note
`-opt-in` 컴파일러 옵션은 Kotlin 1.6.0부터 사용할 수 있습니다. 이전 Kotlin 버전의 경우 `-Xopt-in`을 사용하세요.

:::

옵트인이 필요한 API의 모든 사용 위치에 어노테이션을 추가하고 싶지 않은 경우 전체 모듈에 대해 옵트인할 수 있습니다.
모듈에서 API를 사용하도록 옵트인하려면 사용하는 API의 옵트인 요구 사항 어노테이션의 정규화된 이름을 지정하여 `-opt-in` 인수로 컴파일합니다. `-opt-in=org.mylibrary.OptInAnnotation`.
이 인수로 컴파일하면 모듈의 모든 선언에 `@OptIn(OptInAnnotation::class)` 어노테이션이 있는 것과 동일한 효과가 있습니다.

Gradle로 모듈을 빌드하는 경우 다음과 같이 인수를 추가할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</TabItem>
</Tabs>

Gradle 모듈이 멀티플랫폼 모듈인 경우 `optIn` 메서드를 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</TabItem>
</Tabs>

Maven의 경우 다음을 사용합니다.

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

모듈 수준에서 여러 API를 옵트인하려면 모듈에서 사용되는 각 옵트인 요구 사항 마커에 대해 설명된 인수 중 하나를 추가합니다.

### 클래스 또는 인터페이스에서 상속하도록 옵트인

때로는 라이브러리 작성자가 API를 제공하지만 사용자가 명시적으로 옵트인하기 전에 확장하도록 요구하고 싶어합니다.
예를 들어 라이브러리 API는 사용하기에는 안정적이지만 향후
새로운 추상 함수로 확장될 수 있으므로 상속에는 안정적이지 않을 수 있습니다. 라이브러리 작성자는 [open](inheritance) 또는 [추상 클래스](classes#abstract-classes) 및 [비기능적 인터페이스](interfaces)를
[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션으로 표시하여 이를 적용할 수 있습니다.

이러한 API 요소를 사용하고 코드에서 확장하도록 옵트인하려면 어노테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired` 어노테이션을 사용합니다. 예를 들어
옵트인이 필요한 `CoreLibraryApi` 인터페이스를 사용하려는 경우:

```kotlin
// 라이브러리 코드
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "이 라이브러리의 인터페이스는 실험적입니다."
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 확장에 옵트인이 필요한 인터페이스
interface CoreLibraryApi 
```

코드에서 `CoreLibraryApi` 인터페이스에서 상속하는 새 인터페이스를 만들기 전에 `UnstableApi`
어노테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired` 어노테이션을 추가합니다.

```kotlin
// 클라이언트 코드
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

클래스에서 `@SubclassOptInRequired` 어노테이션을 사용하는 경우 옵트인 요구 사항은
[내부 또는 중첩 클래스](nested-classes)로 전파되지 않습니다.

```kotlin
// 라이브러리 코드
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// 클라이언트 코드

// 옵트인이 필요합니다.
class NetworkFileSystem : FileSystem()

// 중첩 클래스
// 옵트인이 필요하지 않습니다.
class TextFile : FileSystem.File()
```

또는 `@OptIn` 어노테이션을 사용하여 옵트인할 수 있습니다. 실험적 마커 어노테이션을 사용하여
코드에서 클래스의 모든 용도로 요구 사항을 추가로 전파할 수도 있습니다.

```kotlin
// 클라이언트 코드
// @OptIn 어노테이션 사용
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// 어노테이션 클래스를 참조하는 어노테이션 사용
// 옵트인 요구 사항을 추가로 전파합니다.
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## API 사용에 옵트인 필요

라이브러리 사용자가 API를 사용하기 전에 옵트인하도록 요구할 수 있습니다. 또한 옵트인 요구 사항을 제거하기로 결정할 때까지
API 사용에 대한 특별한 조건에 대해 사용자에게 알릴 수 있습니다.

### 옵트인 요구 사항 어노테이션 만들기

모듈 API를 사용하는 데 옵트인이 필요하도록 하려면 **옵트인 요구 사항 어노테이션**으로 사용할 어노테이션 클래스를 만듭니다.
이 클래스에는 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 어노테이션이 있어야 합니다.

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

옵트인 요구 사항 어노테이션은 몇 가지 요구 사항을 충족해야 합니다. 다음과 같아야 합니다.

* `BINARY` 또는 `RUNTIME` [유지](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/).
* [대상](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)으로 `EXPRESSION`, `FILE`, `TYPE` 또는 `TYPE_PARAMETER`.
* 매개변수가 없습니다.

옵트인 요구 사항은 두 가지 심각도 [수준](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/) 중 하나를 가질 수 있습니다.

* `RequiresOptIn.Level.ERROR`. 옵트인은 필수입니다. 그렇지 않으면 표시된 API를 사용하는 코드가 컴파일되지 않습니다. 이것이 기본 수준입니다.
* `RequiresOptIn.Level.WARNING`. 옵트인은 필수가 아니지만 권장됩니다. 없으면 컴파일러에서 경고를 발생시킵니다.

원하는 수준을 설정하려면 `@RequiresOptIn` 어노테이션의 `level` 매개변수를 지정합니다.

또한 API 사용자에게 `message`를 제공할 수 있습니다. 컴파일러는 옵트인하지 않고 API를 사용하려는 사용자에게 이 메시지를 표시합니다.

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "이 API는 실험적입니다. 향후 호환되지 않게 변경될 수 있습니다.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

옵트인이 필요한 여러 독립적인 기능을 게시하는 경우 각 기능에 대해 어노테이션을 선언합니다.
이렇게 하면 클라이언트가 명시적으로 수락하는 기능만 사용할 수 있으므로 API를 더 안전하게 사용할 수 있습니다.
이는 또한 기능에서 옵트인 요구 사항을 독립적으로 제거할 수 있음을 의미하므로 API를 더 쉽게
유지 관리할 수 있습니다.

### API 요소 표시

API 요소를 사용하는 데 옵트인이 필요하도록 하려면 옵트인 요구 사항 어노테이션으로 해당 선언에 어노테이션을 추가합니다.

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

일부 언어 요소의 경우 옵트인 요구 사항 어노테이션이 적용되지 않습니다.

* 속성의 백업 필드 또는 getter에 어노테이션을 추가할 수 없으며 속성 자체에만 어노테이션을 추가할 수 있습니다.
* 로컬 변수 또는 값 매개변수에 어노테이션을 추가할 수 없습니다.

## API 확장에 옵트인 필요

특정 API 부분을 사용하고
확장할 수 있는 부분에 대해 더 세밀하게 제어하고 싶을 때가 있을 수 있습니다. 예를 들어 사용하기에는 안정적인 API가 있지만:

* 기본 구현이 없는 새로운 추상 함수를 추가할 것으로 예상되는 인터페이스 패밀리가 있는 경우와 같이 진행 중인 진화로 인해 **구현하기에 불안정**합니다.
* 조정된 방식으로 동작해야 하는 개별 함수와 같이 **구현하기에 섬세하거나 취약**합니다.
* 코드에서 이전에는 `null` 값을 고려하지 않았던 경우 입력 매개변수 `T`를 nullable 버전 `T?`로 변경하는 것과 같이 외부 구현에 대해 **향후 계약이 약화될 수 있습니다**.

이러한 경우 사용자가 더 이상 확장하기 전에 API를 옵트인하도록 요구할 수 있습니다. 사용자는 API에서 상속하거나 추상 함수를 구현하여 API를 확장할 수 있습니다. [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 사용하면
[open](inheritance) 또는 [추상 클래스](classes#abstract-classes) 및 [비기능적 인터페이스](interfaces)에 대해 이 옵트인 요구 사항을 적용할 수 있습니다.

API 요소에 옵트인 요구 사항을 추가하려면 어노테이션 클래스에 대한 참조와 함께 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 사용합니다.

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "이 라이브러리의 인터페이스는 실험적입니다."
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 확장에 옵트인이 필요한 인터페이스
interface CoreLibraryApi 
```

`@SubclassOptInRequired` 어노테이션을 사용하여 옵트인을 요구하는 경우 요구 사항은
[내부 또는 중첩 클래스](nested-classes)로 전파되지 않습니다.

API에서 `@SubclassOptInRequired` 어노테이션을 사용하는 방법에 대한 실제 예는 `kotlinx.coroutines` 라이브러리의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
인터페이스를 확인하세요.

## 사전 안정 API에 대한 옵트인 요구 사항

아직 안정적이지 않은 기능에 대한 옵트인 요구 사항을 사용하는 경우 클라이언트 코드를 손상시키지 않도록 API 졸업을 신중하게 처리하세요.

사전 안정 API가 졸업되어 안정적인 상태로 릴리스되면 선언에서 옵트인 요구 사항 어노테이션을 제거합니다.
그러면 클라이언트가 제한 없이 사용할 수 있습니다. 그러나 기존 클라이언트 코드의 호환성을 유지하기 위해 어노테이션 클래스를
모듈에 남겨두어야 합니다.

API 사용자가 코드에서 어노테이션을 제거하고 다시 컴파일하여 모듈을 업데이트하도록 권장하려면 어노테이션을
[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)로 표시하고 더 이상 사용되지 않는다는 메시지에 설명을 제공하세요.

```kotlin
@Deprecated("이 옵트인 요구 사항은 더 이상 사용되지 않습니다. 코드에서 해당 사용법을 제거하세요.")
@RequiresOptIn
annotation class ExperimentalDateTime
```