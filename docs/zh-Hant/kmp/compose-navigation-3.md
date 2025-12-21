[//]: # (title: Compose Multiplatform 中的 Navigation 3)
<primary-label ref="alpha"/>

[Android 的 Navigation 函式庫](https://developer.android.com/guide/navigation) 已升級至 Navigation 3，導入了重新設計的導航方法，此方法適用於 Compose 並考量了先前版本函式庫的回饋。從版本 1.10 開始，Compose Multiplatform 支援在所有支援的平台（Android、iOS、桌面版與網頁版）上的多平台專案中採用 Navigation 3。

## 主要變更

Navigation 3 不僅僅是函式庫的一個新版本 — 從許多方面來看，它完全是一個新的函式庫。若要深入了解此重新設計背後的理念，請參閱 [Android 開發者部落格文章](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)。

Navigation 3 的主要變更包括：

*   **使用者擁有的返回堆疊**。您不再操作單一函式庫的返回堆疊，而是建立並管理一個 `SnapshotStateList` 的狀態列表，UI 會直接觀察此列表。
*   **低階建構區塊**。由於與 Compose 更緊密的整合，此函式庫在實作您自己的導航元件與行為方面提供了更大的彈性。
*   **自適應佈局系統**。透過自適應設計，您可以同時顯示多個目標，並在佈局之間無縫切換。

若要深入了解 Navigation 3 的總體設計，請參閱 [Android 文件](https://developer.android.com/guide/navigation/navigation-3)。

## 依賴項設定

若要試用 Navigation 3 的多平台實作，請將以下依賴項加入您的版本目錄：

```text
[versions]
multiplatform-nav3-ui = "1.0.0-alpha05"

[libraries]
jetbrains-navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "multiplatform-nav3-ui" }
```

> 雖然 Navigation 3 以兩個 Artifact 形式發布，分別是 `navigation3:navigation3-ui` 和 `navigation3:navigation3-common`，但只有 `navigation-ui` 需要單獨的 Compose Multiplatform 實作。對 `navigation3-common` 的依賴項會自動傳遞加入。
> {style="note"}

對於使用 Material 3 Adaptive 和 ViewModel 函式庫的專案，也請加入以下導航支援 Artifact：
```text
[versions]
compose-multiplatform-adaptive = "1.3.0-alpha02"
compose-multiplatform-lifecycle = "2.10.0-alpha05"

[libraries]
jetbrains-material3-adaptiveNavigation3 = { module = "org.jetbrains.compose.material3.adaptive:adaptive-navigation3", version.ref = "compose-multiplatform-adaptive" }
jetbrains-lifecycle-viewmodelNavigation3 = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3", version.ref = "compose-multiplatform-lifecycle" }
```

最後，您可以試用由 JetBrains 工程師建立的[概念驗證函式庫](https://github.com/terrakok/navigation3-browser)。此函式庫將多平台 Navigation 3 與網頁上的瀏覽器歷史導航整合：

```text
[versions]
compose-multiplatform-navigation3-browser = "0.2.0"

[libraries]
navigation3-browser = { module = "com.github.terrakok:navigation3-browser", version.ref = "compose-multiplatform-navigation3-browser" }
```

基礎多平台 Navigation 3 函式庫預計將在版本 1.1.0 中支援瀏覽器歷史導航。

## 多平台支援

Navigation 3 與 Compose 緊密結合，讓 Android 導航實作能夠以最少的變更在共同的 Compose Multiplatform 程式碼中運作。為了支援網頁和 iOS 等非 JVM 平台，您唯一需要做的是實作[用於目標鍵的多型序列化](#polymorphic-serialization-for-destination-keys)。

您可以在 GitHub 上比較使用 Navigation 3 的僅限 Android 和多平台應用程式的廣泛範例：
*   [包含 Navigation 3 範例的原始 Android 儲存庫](https://github.com/android/nav3-recipes)
*   [包含大部分相同範例的 Compose Multiplatform 專案](https://github.com/terrakok/nav3-recipes)

### 用於目標鍵的多型序列化

在 Android 上，Navigation 3 依賴基於反射的序列化，這在您以 iOS 等非 JVM 平台為目標時不可用。為了考量到這一點，函式庫為 `rememberNavBackStack()` 函式提供了兩個重載版本：

*   [第一個重載版本](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(kotlin.Array)) 只接受一組 `NavKey` 引用，並且需要基於反射的序列化器。
*   [第二個重載版本](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(androidx.savedstate.serialization.SavedStateConfiguration,kotlin.Array)) 也接受一個 `SavedStateConfiguration` 參數，讓您可以提供一個 `SerializersModule` 並在所有平台上正確處理開放多型。

在 Navigation 3 的多平台範例中，多型序列化看起來[會是這樣](https://github.com/terrakok/nav3-recipes/blob/8ff455499877225b638d5fcd82b232834f819422/sharedUI/src/commonMain/kotlin/com/example/nav3recipes/basicdsl/BasicDslActivity.kt#L40)：

```kotlin
@Serializable
private data object RouteA : NavKey

@Serializable
private data class RouteB(val id: String) : NavKey

// Creates the required serializing configuration for open polymorphism
private val config = SavedStateConfiguration {
    serializersModule = SerializersModule {
        polymorphic(NavKey::class) {
            subclass(RouteA::class, RouteA.serializer())
            subclass(RouteB::class, RouteB.serializer())
        }
    }
}

@Composable
fun BasicDslActivity() {
    // Consumes the serializing configuration
    val backStack = rememberNavBackStack(config, RouteA)

    NavDisplay(
        backStack = backStack,
        //...
    )
}
```

## 後續步驟

Navigation 3 在 Android 開發者入口網站上有深入的介紹。儘管部分文件使用了 Android 特定的範例，但核心概念和導航原則在所有平台保持一致：

*   [Navigation 3 概述](https://developer.android.com/guide/navigation/navigation-3)，提供關於狀態管理、導航程式碼模組化以及動畫的建議。
*   [從 Navigation 2 遷移到 Navigation 3](https://developer.android.com/guide/navigation/navigation-3/migration-guide)。將 Navigation 3 視為一個新函式庫而非現有函式庫的新版本會更容易，所以與其說是遷移，不如說是重寫。但該指南指出了應採取的通用步驟。