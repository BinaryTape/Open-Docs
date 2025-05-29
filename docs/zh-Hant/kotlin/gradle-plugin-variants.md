[//]: # (title: 支援 Gradle 外掛程式變體)

Gradle 7.0 引入了一項針對 Gradle 外掛程式開發者的新功能 — [具備變體的外掛程式](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。此功能讓您更容易地新增對最新 Gradle 功能的支援，同時保持與舊版 Gradle 的相容性。深入瞭解 [Gradle 中的變體選擇](https://docs.gradle.org/current/userguide/variant_model.html)。

透過 Gradle 外掛程式變體，Kotlin 團隊可以為不同的 Gradle 版本發佈不同的 Kotlin Gradle 外掛程式 (KGP) 變體。目標是在 `main` 變體中支援基礎 Kotlin 編譯，這對應於最舊的受支援 Gradle 版本。每個變體都將包含對應發行版本中 Gradle 功能的實作。最新的變體將支援最新的 Gradle 功能集。透過這種方法，可以將對舊版 Gradle 的支援擴展到有限功能。

目前，Kotlin Gradle 外掛程式有以下變體：

| 變體名稱       | 對應的 Gradle 版本 |
|--------------|-------------------|
| `main`       | 7.6.0–7.6.3       |
| `gradle80`   | 8.0–8.0.2         |
| `gradle81`   | 8.1.1             |
| `gradle82`   | 8.2.1–8.4         |
| `gradle85`   | 8.5 and higher    |

在未來的 Kotlin 發行版本中，將新增更多變體。

若要檢查您的建置使用了哪個變體，請啟用 [`--info` 日誌級別](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 並在輸出中尋找以 `Using Kotlin Gradle plugin` 開頭的字串，例如 `Using Kotlin Gradle plugin main variant`。

## 疑難排解

> 以下是一些 Gradle 中變體選擇已知問題的權宜之計：
> * [pluginManagement 中的 ResolutionStrategy 不適用於多變體外掛程式](https://github.com/gradle/gradle/issues/20545)
> * [當外掛程式作為 `buildSrc` 通用依賴項新增時，外掛程式變體會被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

### Gradle 無法在自訂組態中選擇 KGP 變體

這是 Gradle 無法在自訂組態中選擇 KGP 變體的預期情況。
如果您使用自訂 Gradle 組態：

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

您需要將以下屬性新增到您的 `customConfiguration`：

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

否則，您將收到類似以下錯誤：

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

## 後續步驟？

深入瞭解 [Gradle 基礎知識與細節](https://docs.gradle.org/current/userguide/userguide.html)。