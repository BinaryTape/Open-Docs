[//]: # (title: 支援 Gradle 外掛程式變體)

Gradle 7.0 為 Gradle 外掛程式作者引入了一項新功能 — [帶有變體的外掛程式](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。這項功能使得新增對最新 Gradle 功能的支援變得更容易，同時保持與舊版 Gradle 的相容性。了解更多關於 [Gradle 中的變體選擇](https://docs.gradle.org/current/userguide/variant_model.html)。

有了 Gradle 外掛程式變體，Kotlin 團隊可以為不同的 Gradle 版本提供不同的 Kotlin Gradle 外掛程式（KGP）變體。目標是在 `main` 變體中支援基本的 Kotlin 編譯，它對應於 Gradle 最早支援的版本。每個變體將包含對應發行版中的 Gradle 功能的實現。最新的變體將支援最新的 Gradle 功能集。透過這種方法，可以以有限的功能擴展對舊版 Gradle 版本的支援。

目前，Kotlin Gradle 外掛程式有以下變體：

| 變體名稱       | 對應的 Gradle 版本   |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5                           |
| `gradle86`     | 8.6-8.7                       |
| `gradle88`     | 8.8-8.10                      |
| `gradle811`    | 8.11-8.12                     |
| `gradle813`    | 8.13 及更高版本           |

在未來的 Kotlin 版本中，將會新增更多變體。

要檢查您的建置使用哪個變體，請啟用 [`--info` 日誌級別](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 並在輸出中尋找以 `Using Kotlin Gradle plugin` 開頭的字串，例如 `Using Kotlin Gradle plugin main variant`。

## 疑難排解

> 以下是 Gradle 中變體選擇的一些已知問題的解決方法：
> * [pluginManagement 中的 ResolutionStrategy 不適用於多變體外掛程式](https://github.com/gradle/gradle/issues/20545)
> * [當外掛程式作為 `buildSrc` 共同依賴項新增時，外掛程式變體會被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

### Gradle 無法在自訂設定中選擇 KGP 變體

這是一種預期情況，即 Gradle 無法在自訂設定中選擇 KGP 變體。
如果您使用自訂 Gradle 設定：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
</tabs>

並希望新增對 Kotlin Gradle 外掛程式的依賴項，例如：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%'
}
```

</tab>
</tabs>

您需要將以下屬性新增到您的 `customConfiguration` 中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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
            // 如果您想依賴特定的 KGP 變體：
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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
            // 如果您想依賴特定的 KGP 變體：
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

否則，您將收到類似以下的錯誤：

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

## 接下來是什麼？

了解更多關於 [Gradle 基礎知識和具體細節](https://docs.gradle.org/current/userguide/userguide.html)。