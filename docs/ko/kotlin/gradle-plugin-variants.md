[//]: # (title: Gradle 플러그인 Variants 지원)

Gradle 7.0은 Gradle 플러그인 개발자를 위한 새로운 기능인 [variants를 가진 플러그인](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)을 도입했습니다. 이 기능은 이전 Gradle 버전과의 호환성을 유지하면서 최신 Gradle 기능에 대한 지원을 더 쉽게 추가할 수 있도록 합니다. [Gradle의 Variant 선택](https://docs.gradle.org/current/userguide/variant_model.html)에 대해 자세히 알아보세요.

Gradle 플러그인 Variants를 통해 코틀린 팀은 서로 다른 Gradle 버전에 대해 다양한 Kotlin Gradle 플러그인(KGP) Variants를 제공할 수 있습니다. 목표는 가장 오래된 지원 Gradle 버전에 해당하는 `main` Variant에서 기본 코틀린 컴파일을 지원하는 것입니다. 각 Variant는 해당 릴리스의 Gradle 기능에 대한 구현을 포함합니다. 최신 Variant는 최신 Gradle 기능 세트를 지원합니다. 이 접근 방식을 통해 제한된 기능을 가진 이전 Gradle 버전에 대한 지원을 확장할 수 있습니다.

현재 Kotlin Gradle 플러그인에는 다음과 같은 Variants가 있습니다.

| Variant 이름   | 해당 Gradle 버전 |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5                           |
| `gradle86`     | 8.6-8.7                       |
| `gradle88`     | 8.8-8.10                      |
| `gradle811`    | 8.11-8.12                     |
| `gradle813`    | 8.13 이상                   |

향후 코틀린 릴리스에서는 더 많은 Variant가 추가될 예정입니다.

빌드가 어떤 Variant를 사용하는지 확인하려면 [`--info` 로그 레벨](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)을 활성화하고 출력에서 `Using Kotlin Gradle plugin`으로 시작하는 문자열(예: `Using Kotlin Gradle plugin main variant`)을 찾으세요.

## 문제 해결

> Gradle의 Variant 선택과 관련된 알려진 문제에 대한 해결 방법은 다음과 같습니다.
> * [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
> * [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

### Gradle이 사용자 지정 구성에서 KGP Variant를 선택할 수 없는 경우

Gradle이 사용자 지정 구성에서 KGP Variant를 선택할 수 없는 것은 예상되는 상황입니다.
사용자 지정 Gradle 구성을 사용하는 경우:

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
<tab title="그루비" group-key="groovy">

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
</tabs>

그리고 Kotlin Gradle 플러그인에 종속성을 추가하려면, 예를 들어:

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%")
}
```

</tab>
<tab title="그루비" group-key="groovy">

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%'
}
```

</tab>
</tabs>

`customConfiguration`에 다음 속성을 추가해야 합니다.

<tabs group="build-script">
<tab title="코틀린" group-key="kotlin">

```kotlin
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage.class, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category.class, Category.LIBRARY)
            )
            // 특정 KGP Variant에 종속되려면:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</tab>
<tab title="그루비" group-key="groovy">

```groovy
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category, Category.LIBRARY)
            )
            // 특정 KGP Variant에 종속되려면:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</tab>
</tabs>

그렇지 않으면 다음과 유사한 오류가 발생합니다.

```none
 > Could not resolve all files for configuration ':customConfiguration'.
      > Could not resolve org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0.
        Required by:
            project :
         > Cannot choose between the following variants of org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
             - gradle70RuntimeElements
             - runtimeElements
           All of them match the consumer attributes:
             - Variant 'gradle70RuntimeElements' capability org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
                 - Unmatched attributes:
```

## 다음 단계

[Gradle의 기본 사항 및 세부 사항](https://docs.gradle.org/current/userguide/userguide.html)에 대해 자세히 알아보세요.