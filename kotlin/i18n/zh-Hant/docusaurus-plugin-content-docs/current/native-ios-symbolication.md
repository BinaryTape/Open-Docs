---
title: "為 iOS 崩潰報告進行符號化 (Symbolicating)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

偵錯 iOS 應用程式崩潰有時需要分析崩潰報告。
有關崩潰報告的更多資訊，請參閱 [Apple 文件](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)。

崩潰報告通常需要符號化 (symbolication) 才能正確閱讀：
符號化將機器碼位址轉換為人類可讀的原始碼位置。
以下文件描述了使用 Kotlin 符號化 iOS 應用程式崩潰報告的一些具體細節。

## 為發布 Kotlin 二進位檔產生 .dSYM

為了符號化 Kotlin 程式碼中的位址（例如，對應於 Kotlin 程式碼的堆疊追蹤元素），需要 Kotlin 程式碼的 `.dSYM` 捆綁包 (bundle)。

預設情況下，Kotlin/Native 編譯器會在 Darwin 平台上為發布（即優化）二進位檔產生 `.dSYM`。可以使用 `-Xadd-light-debug=disable` 編譯器標誌 (compiler flag) 禁用此功能。同時，預設情況下，此選項對於其他平台是禁用的。要啟用它，請使用 `-Xadd-light-debug=enable` 編譯器選項。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
</Tabs>

在從 IntelliJ IDEA 或 AppCode 模板建立的專案中，這些 `.dSYM` 捆綁包然後會被 Xcode 自動發現。

## 從位元碼重建時，使框架 (framework) 靜態化

從位元碼重建 Kotlin 產生的框架會使原始 `.dSYM` 無效。
如果是在本地執行重建，請確保在符號化崩潰報告時使用更新後的 `.dSYM`。

如果重建是在 App Store 端執行，則重建後的 *動態 (dynamic)* 框架的 `.dSYM` 似乎會被丟棄，且無法從 App Store Connect 下載。
在這種情況下，可能需要使框架成為靜態框架 (static framework)。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</TabItem>
</Tabs>