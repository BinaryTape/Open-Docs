---
title: "Gradle 플러그인 variants 지원"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Gradle 7.0에서는 Gradle 플러그인 작성자를 위한 새로운 기능인 [variants를 사용하는 플러그인](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)이 도입되었습니다.
이 기능을 사용하면 이전 Gradle 버전과의 호환성을 유지하면서 최신 Gradle 기능에 대한 지원을 더 쉽게 추가할 수 있습니다.
[Gradle의 variant 선택](https://docs.gradle.org/current/userguide/variant_model.html)에 대해 자세히 알아보세요.

Gradle 플러그인 variants를 사용하면 Kotlin 팀은 다양한 Gradle 버전에 대해 다양한 Kotlin Gradle 플러그인(KGP) variants를 제공할 수 있습니다.
목표는 `main` variant에서 기본 Kotlin 컴파일을 지원하는 것이며, 이는 지원되는 가장 오래된 Gradle 버전에 해당합니다.
각 variant는 해당 릴리스의 Gradle 기능에 대한 구현을 갖습니다. 최신 variant는 최신 Gradle 기능 세트를 지원합니다.
이러한 접근 방식을 사용하면 제한된 기능으로 이전 Gradle 버전에 대한 지원을 확장할 수 있습니다.

현재 Kotlin Gradle 플러그인의 variants는 다음과 같습니다.

| Variant's name | Corresponding Gradle versions |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5 and higher                |

향후 Kotlin 릴리스에서는 더 많은 variants가 추가될 예정입니다.

빌드에서 사용하는 variant를 확인하려면
[`--info` 로그 수준](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)을 활성화하고 `Using Kotlin Gradle plugin`으로 시작하는 출력을 찾습니다(예: `Using Kotlin Gradle plugin main variant`).

## 문제 해결

:::note
다음은 Gradle에서 variant 선택과 관련된 몇 가지 알려진 문제에 대한 해결 방법입니다.
* [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
* [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)

:::

### Gradle에서 사용자 정의 구성에서 KGP variant를 선택할 수 없음

이는 Gradle에서 사용자 정의 구성에서 KGP variant를 선택할 수 없는 예상되는 상황입니다.
사용자 정의 Gradle 구성을 사용하는 경우:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</TabItem>
</Tabs>

Kotlin Gradle 플러그인에 대한 종속성을 추가하려는 경우(예:

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.20")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.20'
}
```

</TabItem>
</Tabs>

`customConfiguration`에 다음 속성을 추가해야 합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
            // If you want to depend on a specific KGP variant:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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
            // If you want to depend on a specific KGP variant:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</TabItem>
</Tabs>

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

[Gradle 기본 사항 및 세부 사항](https://docs.gradle.org/current/userguide/userguide.html)에 대해 자세히 알아보세요.