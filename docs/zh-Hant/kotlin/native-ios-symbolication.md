[//]: # (title: 符號化 iOS 閃退報告)

除錯 iOS 應用程式的閃退有時需要分析閃退報告。
更多關於閃退報告的資訊可在 [Apple 文件](https://developer.apple.com/library/archive/technotes/tn2151/_index.html) 中找到。

閃退報告通常需要經過符號化才能變得易於閱讀：符號化將機器碼位址轉換為人類可讀的原始碼位置。
以下文件描述了使用 Kotlin 的 iOS 應用程式符號化閃退報告的一些具體細節。

## 為發佈版 Kotlin 二進位檔生成 .dSYM

為了符號化 Kotlin 程式碼中的位址（例如，對應於 Kotlin 程式碼的堆疊追蹤元素），需要用於 Kotlin 程式碼的 `.dSYM` 軟體包。

預設情況下，Kotlin/Native 編譯器會在 Darwin 平台上為發佈版（即優化過的）二進位檔生成 `.dSYM`。這可以使用 `-Xadd-light-debug=disable` 編譯器旗標來禁用。同時，此選項在其他平台上預設是禁用的。要啟用它，請使用 `-Xadd-light-debug=enable` 編譯器選項。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
</tabs>

在從 IntelliJ IDEA 或 AppCode 範本建立的專案中，這些 `.dSYM` 軟體包會被 Xcode 自動發現。

## 從位元碼重建時將框架設定為靜態

從位元碼重建 Kotlin 生成的框架會使原始的 `.dSYM` 失效。
如果在本地執行，請確保在符號化閃退報告時使用更新後的 `.dSYM`。

如果重建是在 App Store 端執行，那麼重建的 *動態* 框架的 `.dSYM` 似乎會被捨棄，並且無法從 App Store Connect 下載。
在這種情況下，可能需要將框架設定為靜態。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</tab>
</tabs>